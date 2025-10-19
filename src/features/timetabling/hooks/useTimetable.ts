import { useEffect, useMemo, useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../auth/hooks/useAuth';
import * as timetableService from '../services/timetableService';
import checkTimetableConflicts from '../utils/checkConflicts';
import { buildTimetableGrid, type TimetableGrid, type TimetableRowResource } from '../utils/timetableLogic';
import { supabase } from '../../../lib/supabase';
import { useScheduleConfig } from '../../scheduleConfig/hooks/useScheduleConfig';
import type { ClassSession } from '../../classSessions/types/classSession';
import type { HydratedTimetableAssignment, TimetableViewMode } from '../types/timetable';
import { useActiveSemester } from '../../scheduleConfig/hooks/useActiveSemester';
import * as classGroupsService from '../../classSessionComponents/services/classGroupsService';
import * as classroomsService from '../../classSessionComponents/services/classroomsService';
import * as instructorsService from '../../classSessionComponents/services/instructorsService';
import type { ClassGroup, Classroom, Instructor } from '../../classSessionComponents/types';
import { usePrograms } from '../../programs/hooks/usePrograms';

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
    mutationFn: (variables: {
      class_group_id: string;
      period_index: number;
      classSession: ClassSession;
    }) => {
      if (!user) throw new Error('User not authenticated');
      if (!activeSemester) throw new Error('Active semester not loaded'); // Safety check

      return timetableService.assignClassSessionToTimetable({
        user_id: user.id,
        class_group_id: variables.class_group_id,
        period_index: variables.period_index,
        class_session_id: variables.classSession.id,
        semester_id: activeSemester.id, // <-- THE FIX IS HERE
      });
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
    mutationFn: (variables: {
      from: { class_group_id: string; period_index: number };
      to: { class_group_id: string; period_index: number };
      classSession: ClassSession;
    }) => {
      if (!user) throw new Error('User not authenticated');
      if (!activeSemester) throw new Error('Active semester not loaded'); // Safety check

      return timetableService.moveClassSessionInTimetable(variables.from, variables.to, {
        user_id: user.id,
        class_group_id: variables.to.class_group_id,
        period_index: variables.to.period_index,
        class_session_id: variables.classSession.id,
        semester_id: activeSemester.id,
      });
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
   * Assigns a class session after performing a conflict check. Returns an error message string on failure.
   *
   * @param class_group_id - The ID of the class group.
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
      const conflict = checkTimetableConflicts(
        timetable,
        classSession,
        settings,
        class_group_id,
        period_index,
        programs
      );
      if (conflict) return conflict;
      await assignClassSessionMutation.mutateAsync({ class_group_id, period_index, classSession });
      return '';
    },
    [settings, timetable, programs, assignClassSessionMutation]
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
   *
   * @param from - The source location of the class session.
   * @param from.class_group_id - The ID of the class group in the source location.
   * @param from.period_index - The index of the period in the source location.
   * @param to - The destination location of the class session.
   * @param to.class_group_id - The ID of the class group in the destination location.
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
      if (!settings) return 'Schedule settings are not loaded yet.';
      const conflict = checkTimetableConflicts(
        timetable,
        classSession,
        settings,
        to.class_group_id,
        to.period_index,
        programs
      );
      if (conflict) return conflict;
      await moveClassSessionMutation.mutateAsync({ from, to, classSession });
      return '';
    },
    [settings, timetable, programs, moveClassSessionMutation]
  );

  /** A consolidated loading state that is true if settings are missing or any data is being fetched. */
  const loading = isFetching || !settings;

  return {
    groups: allClassGroups,
    resources, // Export current resources for multi-view support
    timetable,
    assignClassSession,
    removeClassSession,
    moveClassSession,
    loading,
    error: errorAssignments,
  };
}
