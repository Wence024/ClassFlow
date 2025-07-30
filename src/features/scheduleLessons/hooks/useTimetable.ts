import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../auth/hooks/useAuth';
import { useClassGroups } from './useClassGroups';
import * as timetableService from '../services/timetableService';
import checkConflicts from '../utils/checkConflicts';
import type { ClassSession, HydratedTimetableAssignment } from '../types';

const NUMBER_OF_PERIODS = 16;

export function useTimetable() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { classGroups } = useClassGroups();
  const queryKey = ['hydratedTimetable', user?.id];

  const {
    data: assignments = [],
    isFetching, // *** CORRECTED: Use isFetching for all data fetches, not isLoading
    error: errorAssignments,
  } = useQuery<HydratedTimetableAssignment[]>({
    queryKey,
    queryFn: () => (user ? timetableService.getTimetableAssignments(user.id) : Promise.resolve([])),
    enabled: !!user && classGroups.length > 0,
  });

  const timetable = useMemo(() => {
    const grid = new Map<string, (ClassSession | null)[]>();
    if (!classGroups.length) return grid;

    classGroups.forEach((group) => {
      grid.set(group.id, Array(NUMBER_OF_PERIODS).fill(null));
    });

    assignments.forEach((assignment) => {
      const row = grid.get(assignment.class_group_id);
      if (row && assignment.class_session) {
        row[assignment.period_index] = assignment.class_session;
      }
    });

    return grid;
  }, [assignments, classGroups]);

  // --- OPTIMISTIC MUTATIONS ---

  const moveSessionMutation = useMutation({
    mutationFn: (variables: {
      from: { class_group_id: string; period_index: number };
      to: { class_group_id: string; period_index: number };
      session: ClassSession;
    }) => {
      if (!user) throw new Error('User not authenticated');
      return timetableService.moveSessionInTimetable(user.id, variables.from, variables.to, {
        user_id: user.id,
        class_group_id: variables.to.class_group_id,
        period_index: variables.to.period_index,
        class_session_id: variables.session.id,
      });
    },
    // *** ADDED: Optimistic update logic for moving a session
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
    onError: (err, movedItem, context) => {
      queryClient.setQueryData(queryKey, context?.previousAssignments);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const removeSessionMutation = useMutation({
    mutationFn: (variables: { class_group_id: string; period_index: number }) => {
      if (!user) throw new Error('User not authenticated');
      return timetableService.removeSessionFromTimetable(
        user.id,
        variables.class_group_id,
        variables.period_index
      );
    },
    // *** ADDED: Optimistic update logic for removing a session
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
    onError: (err, removedItem, context) => {
      queryClient.setQueryData(queryKey, context?.previousAssignments);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const assignSessionMutation = useMutation({
    mutationFn: (variables: {
      class_group_id: string;
      period_index: number;
      session: ClassSession;
    }) => {
      if (!user) throw new Error('User not authenticated');
      return timetableService.assignSessionToTimetable({
        user_id: user.id,
        class_group_id: variables.class_group_id,
        period_index: variables.period_index,
        class_session_id: variables.session.id,
      });
    },
    // While optimistic assignment is possible, simple invalidation is often sufficient and safer.
    // For instant feedback, the logic is similar to the others.
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // --- Provider Methods ---
  const assignSession = async (
    class_group_id: string,
    period_index: number,
    session: ClassSession
  ): Promise<string> => {
    const conflict = checkConflicts(timetable, session, class_group_id, period_index);
    if (conflict) return conflict;
    try {
      await assignSessionMutation.mutateAsync({ class_group_id, period_index, session });
      return '';
    } catch {
      return 'Failed to assign session.';
    }
  };

  const removeSession = async (class_group_id: string, period_index: number): Promise<void> => {
    try {
      await removeSessionMutation.mutateAsync({ class_group_id, period_index });
    } catch {
      console.error('Failed to remove session.');
    }
  };

  const moveSession = async (
    from: { class_group_id: string; period_index: number },
    to: { class_group_id: string; period_index: number },
    session: ClassSession
  ): Promise<string> => {
    const conflict = checkConflicts(timetable, session, to.class_group_id, to.period_index, from);
    if (conflict) return conflict;
    try {
      await moveSessionMutation.mutateAsync({ from, to, session });
      return '';
    } catch {
      return 'Failed to move session.';
    }
  };

  // *** CORRECTED: loading state now correctly reflects all fetching and mutating states.
  const loading =
    isFetching ||
    assignSessionMutation.isPending ||
    removeSessionMutation.isPending ||
    moveSessionMutation.isPending;

  return {
    groups: classGroups,
    timetable,
    assignSession,
    removeSession,
    moveSession,
    loading,
    error: errorAssignments,
  };
}