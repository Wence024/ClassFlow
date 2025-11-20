import { useEffect, useMemo, useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../shared/auth/hooks/useAuth';
import * as timetableService from '../services/timetableService';
import checkTimetableConflicts from '../utils/checkConflicts';
import {
  buildTimetableGrid,
  type TimetableGrid,
  type TimetableRowResource,
} from '../utils/timetableLogic';
import { supabase } from '../../../lib/supabase';
import { useScheduleConfig } from '../../scheduleConfig/hooks/useScheduleConfig';
import type { ClassSession } from '../../classSessions/types/classSession';
import type { HydratedTimetableAssignment, TimetableViewMode } from '../types/timetable';
import { useActiveSemester } from '../../scheduleConfig/hooks/useActiveSemester';
import * as classGroupsService from '@/lib/services/classGroupService';
import * as classroomsService from '@/lib/services/classroomService';
import * as instructorsService from '@/lib/services/instructorService';
import type { ClassGroup, Classroom, Instructor } from '../../classSessionComponents/types';
import { usePrograms } from '../../programs/hooks/usePrograms';
import { Semester } from '../../scheduleConfig/types/semesters';

const getTargetRowIdForCheck = (
  viewMode: TimetableViewMode,
  classSession: ClassSession,
  toClassGroupId: string
) => {
  switch (viewMode) {
    case 'classroom':
      return classSession.classroom.id;
    case 'instructor':
      return classSession.instructor.id;
    case 'class-group':
    default:
      return toClassGroupId;
  }
};

const handleCrossDepartmentMove = async (
  classSession: ClassSession,
  from: { class_group_id: string; period_index: number },
  to: { class_group_id: string; period_index: number },
  activeSemester: Semester
) => {
  const { data, error } = await supabase.rpc(
    'handle_cross_dept_session_move' as never,
    {
      _class_session_id: classSession.id,
      _old_period_index: from.period_index,
      _old_class_group_id: from.class_group_id,
      _new_period_index: to.period_index,
      _new_class_group_id: to.class_group_id,
      _semester_id: activeSemester.id,
    } as never
  );

  if (error) {
    console.error('Failed to move cross-department session (RPC error):', error);
    throw new Error(`Failed to create move approval request: ${error.message}`);
  }

  const result = data as { success: boolean; error?: string } | null;
  if (!result || !result.success) {
    const errorMsg = result?.error || 'Unknown error during move approval';
    console.error('Move approval function returned failure:', errorMsg);
    throw new Error(errorMsg);
  }

  console.log('Cross-department move request created:', result);
  // Single, clear toast message (removed duplicate toast from mutation)
};

/**
 * A comprehensive hook for managing the state and logic of the entire timetable.
 *
 * This hook is the central point for the timetabling feature. It is responsible for:
 * - Fetching the user's schedule configuration and resources (class groups, classrooms, instructors).
 * - Fetching all timetable assignments from the server.
 * - Transforming the flat assignment data into a UI-friendly grid structure based on view mode.
 * - Setting up a real-time subscription via Supabase to listen for database changes.
 * - Providing mutation functions (`assign`, `remove`, `move`) that perform conflict checks
 *   before interacting with the server.
 * - Handling optimistic updates for a smooth UI experience during mutations.
 *
 * @param viewMode - The current timetable view mode (class-group, classroom, or instructor).
 * @returns An object containing the timetable grid, resources, loading/error states,
 *          and functions to manipulate the timetable.
 */
export function useTimetable(viewMode: TimetableViewMode = 'class-group') {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { settings } = useScheduleConfig();
  const { data: activeSemester } = useActiveSemester(); // 2. Get the active semester
  const { listQuery } = usePrograms();
  const programs = useMemo(() => listQuery.data || [], [listQuery.data]);

  // The queryKey is now dependent on the semester, not the user
  const queryKey = useMemo(() => ['hydratedTimetable', activeSemester?.id], [activeSemester?.id]);

  // A random, unique ID for the Supabase real-time channel to prevent conflicts between browser tabs.
  // eslint-disable-next-line sonarjs/pseudo-random
  const [channelId] = useState(() => Math.random().toString(36).slice(2));

  // Calculate total periods from settings, with a fallback to prevent crashes during initial load.
  const totalPeriods = settings ? settings.periods_per_day * settings.class_days_per_week : 0;

  // --- DATA FETCHING ---
  const { data: allClassGroups = [] } = useQuery<ClassGroup[]>({
    queryKey: ['allClassGroups'],
    queryFn: classGroupsService.getAllClassGroups,
    enabled: !!user,
  });

  const { data: allClassrooms = [] } = useQuery<Classroom[]>({
    queryKey: ['allClassrooms'],
    queryFn: classroomsService.getAllClassrooms,
    enabled: !!user && viewMode === 'classroom',
  });

  const { data: allInstructors = [] } = useQuery<Instructor[]>({
    queryKey: ['allInstructors'],
    queryFn: () => instructorsService.getInstructors({ role: user?.role }),
    enabled: !!user && viewMode === 'instructor',
  });

  const {
    data: assignments = [],
    isFetching,
    error: errorAssignments,
  } = useQuery<HydratedTimetableAssignment[]>({
    queryKey,
    queryFn: () =>
      activeSemester
        ? timetableService.getTimetableAssignments(activeSemester.id)
        : Promise.resolve([]),
    // IMPORTANT: Update the enabled check to use the new `allClassGroups`
    enabled: !!user && allClassGroups.length > 0 && !!settings && !!activeSemester,
  });

  // Determine which resources to use based on view mode
  const resources: TimetableRowResource[] = useMemo(() => {
    switch (viewMode) {
      case 'classroom':
        return allClassrooms;
      case 'instructor':
        return allInstructors;
      case 'class-group':
      default:
        return allClassGroups;
    }
  }, [viewMode, allClassGroups, allClassrooms, allInstructors]);

  // Memoize the timetable grid so it's only rebuilt when its source data changes.
  const timetable: TimetableGrid = useMemo(
    () => buildTimetableGrid(assignments, viewMode, resources, totalPeriods),
    [assignments, viewMode, resources, totalPeriods]
  );

  // --- REAL-TIME SUBSCRIPTION ---
  useEffect(() => {
    if (!user || !activeSemester) return;

    const channel = supabase
      .channel(`timetable-realtime-${channelId}`)
      .on<HydratedTimetableAssignment>(
        'postgres_changes',
        {
          event: '*', // Listen for INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'timetable_assignments',
          filter: `semester_id=eq.${activeSemester.id}`, // Listen for all changes in the active semester
        },
        () => {
          // When a change is detected, invalidate the query to trigger a refetch.
          queryClient.invalidateQueries({ queryKey });
        }
      )
      .subscribe();

    // Clean up the subscription when the component unmounts.
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, activeSemester, queryClient, queryKey, channelId]);

  // --- MUTATIONS ---

  /** Mutation for adding a new class session assignment. */
  const assignClassSessionMutation = useMutation({
    mutationFn: async (variables: {
      class_group_id: string;
      period_index: number;
      classSession: ClassSession;
      requiresApproval?: boolean;
    }) => {
      if (!user) throw new Error('User not authenticated');
      if (!activeSemester) throw new Error('Active semester not loaded');

      const status = variables.requiresApproval ? 'pending' : 'confirmed';

      return timetableService.assignClassSessionToTimetable(
        {
          user_id: user.id,
          class_group_id: variables.class_group_id,
          period_index: variables.period_index,
          class_session_id: variables.classSession.id,
          semester_id: activeSemester.id,
        },
        status
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  /** Mutation for removing a class session assignment from the timetable. */
  const removeClassSessionMutation = useMutation({
    mutationFn: (variables: { class_group_id: string; period_index: number }) => {
      if (!user) throw new Error('User not authenticated');
      if (!activeSemester) throw new Error('Active semester not loaded');
      return timetableService.removeClassSessionFromTimetable(
        variables.class_group_id,
        variables.period_index,
        activeSemester.id
      );
    },
    // Optimistic update: remove the item from the cache immediately.
    onMutate: async (removedItem) => {
      await queryClient.cancelQueries({ queryKey });
      const previousAssignments = queryClient.getQueryData<HydratedTimetableAssignment[]>(queryKey);
      queryClient.setQueryData<HydratedTimetableAssignment[]>(queryKey, (old) =>
        old
          ? old.filter(
              (a) =>
                !(
                  a.class_group_id === removedItem.class_group_id &&
                  a.period_index === removedItem.period_index
                )
            )
          : []
      );
      return { previousAssignments };
    },
    onError: (_err, _removedItem, context) => {
      // Rollback on error
      queryClient.setQueryData(queryKey, context?.previousAssignments);
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey });
    },
  });

  /** Mutation for moving an existing class session assignment. */
  const moveClassSessionMutation = useMutation({
    mutationFn: async (variables: {
      from: { class_group_id: string; period_index: number };
      to: { class_group_id: string; period_index: number };
      classSession: ClassSession;
      requiresApproval?: boolean;
    }) => {
      if (!user) throw new Error('User not authenticated');
      if (!activeSemester) throw new Error('Active semester not loaded');

      const status = variables.requiresApproval ? 'pending' : 'confirmed';

      return timetableService.moveClassSessionInTimetable(
        variables.from,
        variables.to,
        {
          user_id: user.id,
          class_group_id: variables.to.class_group_id,
          period_index: variables.to.period_index,
          class_session_id: variables.classSession.id,
          semester_id: activeSemester.id,
        },
        status
      );
    },
    // Optimistic update: move the item in the cache immediately.
    onMutate: async (movedItem) => {
      await queryClient.cancelQueries({ queryKey });
      const previousAssignments = queryClient.getQueryData<HydratedTimetableAssignment[]>(queryKey);
      queryClient.setQueryData<HydratedTimetableAssignment[]>(queryKey, (old) => {
        if (!old) return [];
        // Find the specific assignment to move by matching BOTH position AND class_session.id
        // This is critical for merged sessions to avoid moving the wrong assignment
        const assignmentToMove = old.find(
          (a) =>
            a.class_group_id === movedItem.from.class_group_id &&
            a.period_index === movedItem.from.period_index &&
            a.class_session?.id === movedItem.classSession.id
        );
        if (!assignmentToMove) {
          console.warn('[useTimetable] Assignment to move not found in cache', {
            from: movedItem.from,
            classSessionId: movedItem.classSession.id,
          });
          return old;
        }
        const newAssignment = {
          ...assignmentToMove,
          class_group_id: movedItem.to.class_group_id,
          period_index: movedItem.to.period_index,
        };
        // Filter out the old assignment using all three criteria to ensure precision
        return [
          ...old.filter(
            (a) =>
              !(
                a.class_group_id === movedItem.from.class_group_id &&
                a.period_index === movedItem.from.period_index &&
                a.class_session?.id === movedItem.classSession.id
              )
          ),
          newAssignment,
        ];
      });
      return { previousAssignments };
    },
    onError: (_err, _movedItem, context) => {
      // Rollback on error
      queryClient.setQueryData(queryKey, context?.previousAssignments);
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // --- PUBLIC API ---

  /**
   * Checks if a class session uses cross-department resources.
   */
  const usesCrossDepartmentResource = useCallback(
    (classSession: ClassSession): boolean => {
      if (!user?.program_id) return false;

      const userProgram = programs.find((p) => p.id === user.program_id);
      if (!userProgram?.department_id) return false;

      const instructorDeptId = classSession.instructor.department_id;
      const classroomDeptId = classSession.classroom.preferred_department_id;

      return (
        (instructorDeptId != null && instructorDeptId !== userProgram.department_id) ||
        (classroomDeptId != null && classroomDeptId !== userProgram.department_id)
      );
    },
    [user, programs]
  );

  /**
   * Creates a resource request for a class session that uses cross-department resources.
   */
  const createResourceRequestForSession = useCallback(
    async (classSession: ClassSession) => {
      if (!user?.program_id || !activeSemester) return;

      const userProgram = programs.find((p) => p.id === user.program_id);
      if (!userProgram?.department_id) return;

      const instructorDeptId = classSession.instructor.department_id;
      const classroomDeptId = classSession.classroom.preferred_department_id;

      const crossDeptInstructor =
        instructorDeptId && instructorDeptId !== userProgram.department_id;
      const crossDeptClassroom = classroomDeptId && classroomDeptId !== userProgram.department_id;

      if (!crossDeptInstructor && !crossDeptClassroom) return;

      // Import the resource request service dynamically
      const { createRequest } = await import(
        '@/lib/services/resourceRequestService'
      );

      // Create request for cross-department instructor
      if (crossDeptInstructor) {
        await createRequest({
          resource_type: 'instructor',
          resource_id: classSession.instructor.id,
          requesting_program_id: user.program_id,
          target_department_id: instructorDeptId,
          requester_id: user.id,
          class_session_id: classSession.id,
          notes: `Request to use instructor ${classSession.instructor.first_name} ${classSession.instructor.last_name}`,
        });
      }

      // Create request for cross-department classroom
      if (crossDeptClassroom) {
        await createRequest({
          resource_type: 'classroom',
          resource_id: classSession.classroom.id,
          requesting_program_id: user.program_id,
          target_department_id: classroomDeptId,
          requester_id: user.id,
          class_session_id: classSession.id,
          notes: `Request to use classroom ${classSession.classroom.name}`,
        });
      }
    },
    [user, programs, activeSemester]
  );

  /**
   * Assigns a class session after performing a conflict check. Returns an error message string on failure.
   *
   * @param class_group_id - The ID of the class group (DB column value).
   * @param period_index - The index of the period.
   * @param classSession - The class session to be assigned.
   * @returns - An error message string on failure.
   */
  const assignClassSession = useCallback(
    async (
      class_group_id: string,
      period_index: number,
      classSession: ClassSession
    ): Promise<string> => {
      if (!settings) return 'Schedule settings are not loaded yet.';
      console.debug('[useTimetable] assignClassSession check', {
        viewMode,
        targetId: class_group_id,
        periodIndex: period_index,
        sessionId: classSession.id,
      });
      const conflict = checkTimetableConflicts(
        timetable,
        classSession,
        settings,
        class_group_id,
        period_index,
        programs,
        viewMode
      );
      if (conflict) {
        console.error('[useTimetable] assignClassSession conflict', {
          conflict,
          viewMode,
          targetId: class_group_id,
          periodIndex: period_index,
          sessionId: classSession.id,
        });
        return conflict;
      }

      const requiresApproval = usesCrossDepartmentResource(classSession);

      try {
        await assignClassSessionMutation.mutateAsync({
          class_group_id,
          period_index,
          classSession,
          requiresApproval,
        });

        if (requiresApproval) {
          await createResourceRequestForSession(classSession);
        }

        return '';
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error('[useTimetable] assignClassSession mutation error', {
          error: errorMsg,
          viewMode,
          class_group_id,
          period_index,
          sessionId: classSession.id,
        });
        return errorMsg;
      }
    },
    [
      settings,
      timetable,
      programs,
      assignClassSessionMutation,
      viewMode,
      usesCrossDepartmentResource,
      createResourceRequestForSession,
    ]
  );

  /**
   * Removes a class session from the timetable.
   *
   * @param class_group_id - The ID of the class group.
   * @param period_index - The index of the period.
   * @returns A promise that resolves when the operation is complete.
   */
  const removeClassSession = useCallback(
    async (class_group_id: string, period_index: number): Promise<void> => {
      await removeClassSessionMutation.mutateAsync({ class_group_id, period_index });
    },
    [removeClassSessionMutation]
  );

  /**
   * Moves a class session after performing a conflict check. Returns an error message string on failure.
   * If the session uses cross-department resources and is currently confirmed, it will require re-approval.
   *
   * @param from - The source location of the class session.
   * @param from.class_group_id - The ID of the class group in the source location.
   * @param from.period_index - The index of the period in the source location.
   * @param to - The destination location of the class session.
   * @param to.class_group_id - The ID of the class group in the destination location (DB value).
   * @param to.period_index - The index of the period in the destination location.
   * @param classSession - The class session to be moved.
   * @returns - An error message string on failure.
   */
  const moveClassSession = useCallback(
    async (
      from: { class_group_id: string; period_index: number },
      to: { class_group_id: string; period_index: number },
      classSession: ClassSession
    ): Promise<string> => {
      if (!settings || !activeSemester) return 'Schedule settings are not loaded yet.';

      const targetRowIdForCheck = getTargetRowIdForCheck(viewMode, classSession, to.class_group_id);

      console.debug('[useTimetable] moveClassSession check', {
        viewMode,
        from,
        to,
        targetRowIdForCheck,
        dbTargetGroupId: to.class_group_id,
        sessionId: classSession.id,
      });

      const conflict = checkTimetableConflicts(
        timetable,
        classSession,
        settings,
        targetRowIdForCheck,
        to.period_index,
        programs,
        viewMode,
        true
      );
      if (conflict) {
        console.error('[useTimetable] moveClassSession conflict', {
          conflict,
          viewMode,
          from,
          to,
          targetRowIdForCheck,
          sessionId: classSession.id,
        });
        return conflict;
      }

      const isCrossDept = usesCrossDepartmentResource(classSession);
      const currentAssignment = assignments.find(
        (a) =>
          a.class_session.id === classSession.id &&
          a.class_group_id === from.class_group_id &&
          a.period_index === from.period_index
      );
      const isCurrentlyConfirmed = currentAssignment?.status === 'confirmed';
      const requiresApproval = isCrossDept && isCurrentlyConfirmed;

      try {
        if (requiresApproval) {
          await handleCrossDepartmentMove(classSession, from, to, activeSemester);
        } else {
          await moveClassSessionMutation.mutateAsync({
            from,
            to,
            classSession,
            requiresApproval: false,
          });
        }

        return '';
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error('[useTimetable] moveClassSession mutation error', {
          error: errorMsg,
          viewMode,
          from,
          to,
          sessionId: classSession.id,
        });
        return errorMsg;
      }
    },
    [
      settings,
      timetable,
      programs,
      moveClassSessionMutation,
      viewMode,
      usesCrossDepartmentResource,
      assignments,
      activeSemester,
    ]
  );

  /** A consolidated loading state that is true if settings are missing or any data is being fetched. */
  const loading = isFetching || !settings;

  /** Set of class session IDs that have pending timetable assignments. */
  const pendingSessionIds = useMemo(() => {
    const pending = new Set<string>();
    assignments.forEach((assignment) => {
      if (assignment.status === 'pending') {
        pending.add(assignment.class_session.id);
      }
    });
    return pending;
  }, [assignments]);

  return {
    groups: allClassGroups,
    resources, // Export current resources for multi-view support
    timetable,
    assignments, // Expose raw assignments for drawer logic
    assignClassSession,
    removeClassSession,
    moveClassSession,
    loading,
    error: errorAssignments,
    pendingSessionIds,
  };
}
