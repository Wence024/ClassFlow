import { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../auth/hooks/useAuth';
import { useClassGroups } from '../../classSessionComponents/hooks/';
import * as timetableService from '../services/timetableService';
import checkTimetableConflicts from '../utils/checkConflicts';
import { buildTimetableGrid, type TimetableGrid } from '../utils/timetableLogic';
import { supabase } from '../../../lib/supabase';
import { useScheduleConfig } from '../../scheduleConfig/hooks/useScheduleConfig';
import type { ClassSession } from '../../classSessions/types/classSession';
import type { HydratedTimetableAssignment } from '../types/timetable';
import { useActiveSemester } from '../../scheduleConfig/hooks/useActiveSemester';

/**
 * A comprehensive hook for managing the state and logic of the entire timetable.
 *
 * This hook is the central point for the timetabling feature. It is responsible for:
 * - Fetching the user's schedule configuration and class groups.
 * - Fetching all timetable assignments from the server.
 * - Transforming the flat assignment data into a UI-friendly grid structure.
 * - Setting up a real-time subscription via Supabase to listen for database changes.
 * - Providing mutation functions (`assign`, `remove`, `move`) that perform conflict checks
 *   before interacting with the server.
 * - Handling optimistic updates for a smooth UI experience during mutations.
 *
 * @returns An object containing the timetable grid, class groups, loading/error states,
 *          and functions to manipulate the timetable.
 */
export function useTimetable() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { classGroups } = useClassGroups();
  const { settings } = useScheduleConfig();
  const { data: activeSemester } = useActiveSemester(); // 2. Get the active semester

  // The queryKey is now dependent on the semester, not the user
  const queryKey = useMemo(() => ['hydratedTimetable', activeSemester?.id], [activeSemester?.id]);

  // A random, unique ID for the Supabase real-time channel to prevent conflicts between browser tabs.
  // eslint-disable-next-line sonarjs/pseudo-random
  const [channelId] = useState(() => Math.random().toString(36).slice(2));

  // Calculate total periods from settings, with a fallback to prevent crashes during initial load.
  const totalPeriods = settings ? settings.periods_per_day * settings.class_days_per_week : 0;

  // --- DATA FETCHING ---
  const {
    data: assignments = [],
    isFetching,
    error: errorAssignments,
  } = useQuery<HydratedTimetableAssignment[]>({
    queryKey,
    // The queryFn now passes the semester_id to the service
    queryFn: () =>
      activeSemester
        ? timetableService.getTimetableAssignments(activeSemester.id)
        : Promise.resolve([]),
    // The enabled check now depends on the activeSemester
    enabled: !!user && classGroups.length > 0 && !!settings && !!activeSemester,
  });

  // Memoize the timetable grid so it's only rebuilt when its source data changes.
  const timetable: TimetableGrid = useMemo(
    () => buildTimetableGrid(assignments, classGroups, totalPeriods),
    [assignments, classGroups, totalPeriods]
  );

  // --- REAL-TIME SUBSCRIPTION ---
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`timetable-realtime-${channelId}`)
      .on<HydratedTimetableAssignment>(
        'postgres_changes',
        {
          event: '*', // Listen for INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'timetable_assignments',
          filter: `user_id=eq.${user.id}`, // Only listen for changes owned by the current user.
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
  }, [user, queryClient, queryKey, channelId]);

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
      return timetableService.removeClassSessionFromTimetable(
        user.id,
        variables.class_group_id,
        variables.period_index
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

      return timetableService.moveClassSessionInTimetable(user.id, variables.from, variables.to, {
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
        const assignmentToMove = old.find(
          (a) =>
            a.class_group_id === movedItem.from.class_group_id &&
            a.period_index === movedItem.from.period_index
        );
        if (!assignmentToMove) return old;
        const newAssignment = {
          ...assignmentToMove,
          class_group_id: movedItem.to.class_group_id,
          period_index: movedItem.to.period_index,
        };
        return [
          ...old.filter(
            (a) =>
              !(
                a.class_group_id === movedItem.from.class_group_id &&
                a.period_index === movedItem.from.period_index
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
  const assignClassSession = async (
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
      period_index
    );
    if (conflict) return conflict;
    await assignClassSessionMutation.mutateAsync({ class_group_id, period_index, classSession });
    return '';
  };

  /**
   * Removes a class session from the timetable.
   *
   * @param class_group_id - The ID of the class group.
   * @param period_index - The index of the period.
   * @returns A promise that resolves when the operation is complete.
   */
  const removeClassSession = async (
    class_group_id: string,
    period_index: number
  ): Promise<void> => {
    await removeClassSessionMutation.mutateAsync({ class_group_id, period_index });
  };

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
  const moveClassSession = async (
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
      to.period_index
    );
    if (conflict) return conflict;
    await moveClassSessionMutation.mutateAsync({ from, to, classSession });
    return '';
  };

  /** A consolidated loading state that is true if settings are missing or any data is being fetched. */
  const loading = isFetching || !settings;

  return {
    groups: classGroups,
    timetable,
    assignClassSession,
    removeClassSession,
    moveClassSession,
    loading,
    error: errorAssignments,
  };
}
