// src/features/scheduleLessons/context/TimetableProvider.tsx

import React, { useMemo } from 'react';
import type { ClassSession } from '../../types';
import * as timetableService from '../../services/timetableService';
import { TimetableContext } from './TimetableContext';
import checkConflicts from '../../utils/checkConflicts';
import { useClassGroups } from '../../hooks/useComponents';
import { useAuth } from '../../../auth/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const NUMBER_OF_PERIODS = 16;

export const TimetableProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { classGroups } = useClassGroups();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch assignments
  const {
    data: assignments = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['timetableAssignments', user?.id],
    queryFn: () => (user ? timetableService.getTimetableAssignments(user.id) : Promise.resolve([])),
    enabled: !!user && classGroups.length > 0,
  });

  // Build timetable grid from assignments
  const timetable = useMemo(() => {
    const grid = new Map<string, (ClassSession | null)[]>();
    if (!classGroups.length) return grid;
    for (const group of classGroups) {
      grid.set(group.id, Array(NUMBER_OF_PERIODS).fill(null));
    }
    if (!assignments.length) return grid;
    // Note: This is async in your original, but for react-query, you should hydrate sessions elsewhere or prefetch.
    // Here, we just map session ids for now.
    for (const assignment of assignments) {
      const row = grid.get(assignment.class_group_id);
      if (row) row[assignment.period_index] = { id: assignment.class_session_id } as ClassSession;
    }
    return grid;
  }, [assignments, classGroups]);

  // Mutations
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
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['timetableAssignments', user?.id] }),
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
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['timetableAssignments', user?.id] }),
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
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['timetableAssignments', user?.id] }),
  });

  // Provider methods
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
