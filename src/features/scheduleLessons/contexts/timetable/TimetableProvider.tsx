// src/features/scheduleLessons/context/TimetableProvider.tsx

import React, { useMemo } from 'react';
import type { ClassSession } from '../../types';
import * as timetableService from '../../services/timetableService';
import { TimetableContext } from './TimetableContext';
import checkConflicts from '../../utils/checkConflicts';
import { useClassGroups } from '../../hooks/useComponents';
import { useAuth } from '../../../auth/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// We no longer need the separate classSessionsService import here
// import * as classSessionsService from '../../services/classSessionsService';

const NUMBER_OF_PERIODS = 16;

export const TimetableProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { classGroups } = useClassGroups();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch assignments WITH the full session data included. This is now ONE query.
  const {
    data: assignments = [],
    isLoading: loadingAssignments,
    isFetching: fetchingAssignments,
    error: errorAssignments,
  } = useQuery({
    // The query key can be simplified as it no longer fetches just "assignments"
    queryKey: ['hydratedTimetable', user?.id],
    // The query function is now the updated service call
    queryFn: () => (user ? timetableService.getTimetableAssignments(user.id) : Promise.resolve([])),
    enabled: !!user && classGroups.length > 0,
  });

  // REMOVED: The separate query for class sessions is no longer needed.
  /*
  const {
    data: classSessions = [],
    isLoading: loadingSessions,
    isFetching: fetchingSessions,
    error: errorSessions,
  } = useRQ({
    queryKey: ['classSessions', user?.id],
    queryFn: () => (user ? classSessionsService.getClassSessions(user.id) : Promise.resolve([])),
    enabled: !!user,
  });
  */

  // Build timetable grid. The logic is now much simpler.
  const timetable = useMemo(() => {
    const grid = new Map<string, (ClassSession | null)[]>();
    if (!classGroups.length) return grid;

    for (const group of classGroups) {
      grid.set(group.id, Array(NUMBER_OF_PERIODS).fill(null));
    }
    // No need to check for a separate classSessions array
    if (!assignments.length) return grid;

    for (const assignment of assignments) {
      const row = grid.get(assignment.class_group_id);
      // The full session object is directly on the assignment!
      const session = assignment.class_session || null;
      if (row && session) {
        row[assignment.period_index] = session;
      }
    }
    return grid;
    // The dependency array is simpler
  }, [assignments, classGroups]);

  // --- Mutations remain unchanged ---
  const assignSessionMutation = useMutation({
    mutationFn: async ({
      class_group_id,
      period_index,
      session,
    }: {
      class_group_id: string;
      period_index: number;
      session: ClassSession;
    }) => {
      if (!user) throw new Error('User not authenticated');
      await timetableService.assignSessionToTimetable({
        user_id: user.id,
        class_group_id,
        period_index,
        class_session_id: session.id,
      });
    },
    // Invalidate the new, consolidated query key
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hydratedTimetable', user?.id] }),
  });

  const removeSessionMutation = useMutation({
    mutationFn: async ({
      class_group_id,
      period_index,
    }: {
      class_group_id: string;
      period_index: number;
    }) => {
      if (!user) throw new Error('User not authenticated');
      await timetableService.removeSessionFromTimetable(user.id, class_group_id, period_index);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hydratedTimetable', user?.id] }),
  });

  const moveSessionMutation = useMutation({
    mutationFn: async ({
      from,
      to,
      session,
    }: {
      from: { class_group_id: string; period_index: number };
      to: { class_group_id: string; period_index: number };
      session: ClassSession;
    }) => {
      if (!user) throw new Error('User not authenticated');
      await timetableService.moveSessionInTimetable(user.id, from, to, {
        user_id: user.id,
        class_group_id: to.class_group_id,
        period_index: to.period_index,
        class_session_id: session.id,
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hydratedTimetable', user?.id] }),
  });

  // --- Provider methods (assignSession, removeSession, moveSession) remain unchanged ---
  const assignSession = async (
    class_group_id: string,
    period_index: number,
    session: ClassSession
  ): Promise<string> => {
    if (!user) return 'User not authenticated';
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
    if (!user) return;
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
    if (!user) return 'User not authenticated';
    const conflict = checkConflicts(timetable, session, to.class_group_id, to.period_index, from);
    if (conflict) return conflict;
    try {
      await moveSessionMutation.mutateAsync({ from, to, session });
      return '';
    } catch {
      return 'Failed to move session.';
    }
  };

  // The loading/error states are now derived from a single query.
  const loading =
    fetchingAssignments ||
    assignSessionMutation.isPending ||
    removeSessionMutation.isPending ||
    moveSessionMutation.isPending;
  const error = errorAssignments;

  return (
    <TimetableContext.Provider
      value={{
        groups: classGroups,
        timetable,
        assignSession,
        removeSession,
        moveSession,
        loading,
        error,
      }}
    >
      {children}
    </TimetableContext.Provider>
  );
};
