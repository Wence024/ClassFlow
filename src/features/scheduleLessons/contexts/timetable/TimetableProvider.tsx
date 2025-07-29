// src/features/scheduleLessons/context/TimetableProvider.tsx

import React, { useState, useEffect } from 'react';
import type { ClassSession } from '../../types';
import * as timetableService from '../../services/timetableService';
import { TimetableContext } from './TimetableContext';
import checkConflicts from '../../utils/checkConflicts';
import { useClassGroups } from '../../hooks/useComponents';
import { useAuth } from '../../../auth/hooks/useAuth';
import { getClassSession } from '../../services/classSessionsService';

const NUMBER_OF_PERIODS = 16;

export const TimetableProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { classGroups } = useClassGroups();
  const [timetable, setTimetable] = useState<Map<string, (ClassSession | null)[]>>(new Map());
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadTimetable = async () => {
      if (!user || !classGroups.length) return;
      setLoading(true);
      setError(null);
      try {
        const assignments = await timetableService.getTimetableAssignments(user.id);

        const grid = new Map<string, (ClassSession | null)[]>();
        for (const group of classGroups) {
          grid.set(group.id, Array(NUMBER_OF_PERIODS).fill(null));
        }

        for (const assignment of assignments) {
          const session = await getClassSession(assignment.class_session_id);
          const row = grid.get(assignment.class_group_id);
          if (row) row[assignment.period_index] = session;
        }

        setTimetable(grid);
      } catch (err) {
        console.error('Failed to load timetable:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadTimetable();
  }, [user, classGroups]);

  const assignSession = async (
    class_group_id: string,
    period_index: number,
    session: ClassSession
  ): Promise<string> => {
    if (!user) return 'User not authenticated';

    const conflict = checkConflicts(timetable, session, class_group_id, period_index);
    if (conflict) return conflict;

    setLoading(true);
    try {
      await timetableService.assignSessionToTimetable({
        user_id: user.id,
        class_group_id,
        period_index,
        class_session_id: session.id,
      });

      const newTimetable = new Map(timetable);
      const row = [...(newTimetable.get(class_group_id) ?? Array(NUMBER_OF_PERIODS).fill(null))];
      row[period_index] = session;
      newTimetable.set(class_group_id, row);
      setTimetable(newTimetable);
      return '';
    } catch (err) {
      console.error(err);
      return 'Failed to assign session.';
    } finally {
      setLoading(false);
    }
  };

  const removeSession = async (class_group_id: string, period_index: number): Promise<void> => {
    if (!user) return;
    setLoading(true);
    try {
      await timetableService.removeSessionFromTimetable(user.id, class_group_id, period_index);

      const newTimetable = new Map(timetable);
      const row = [...(newTimetable.get(class_group_id) ?? Array(NUMBER_OF_PERIODS).fill(null))];
      row[period_index] = null;
      newTimetable.set(class_group_id, row);
      setTimetable(newTimetable);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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

    setLoading(true);
    try {
      await timetableService.moveSessionInTimetable(user.id, from, to, {
        user_id: user.id,
        class_group_id: to.class_group_id,
        period_index: to.period_index,
        class_session_id: session.id,
      });

      const newTimetable = new Map(timetable);

      const fromRow = [...(newTimetable.get(from.class_group_id) ?? Array(NUMBER_OF_PERIODS).fill(null))];
      fromRow[from.period_index] = null;
      newTimetable.set(from.class_group_id, fromRow);

      const toRow = [...(newTimetable.get(to.class_group_id) ?? Array(NUMBER_OF_PERIODS).fill(null))];
      toRow[to.period_index] = session;
      newTimetable.set(to.class_group_id, toRow);

      setTimetable(newTimetable);
      return '';
    } catch (err) {
      console.error(err);
      return 'Failed to move session.';
    } finally {
      setLoading(false);
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
