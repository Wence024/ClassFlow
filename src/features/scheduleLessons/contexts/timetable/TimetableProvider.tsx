import React, { useState, useEffect } from 'react';
import type { ClassSession } from '../../types/scheduleLessons';
import * as timetableService from '../../services/timetableService';
import { TimetableContext, type TimetableContextType } from './TimetableContext';

const groups = ['Group 1', 'Group 2', 'Group 3', 'Group 4'];

export const TimetableProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timetable, setTimetable] = useState<(ClassSession | null)[][]>(() =>
    timetableService.getTimetable()
  );

  useEffect(() => {
    timetableService.setTimetable(timetable);
  }, [timetable]);

  // Assign a session to a cell
  const assignSession = (
    groupIndex: number,
    periodIndex: number,
    session: ClassSession
  ): boolean => {
    let success = false;
    setTimetable((prev) => {
      // Prevent assigning to an already occupied cell
      if (prev[groupIndex][periodIndex]) {
        return prev;
      }
      const updated = prev.map((row) => [...row]);
      updated[groupIndex][periodIndex] = session;
      success = true;
      return updated;
    });
    return success;
  };

  // Remove a session from a cell
  const removeSession = (groupIndex: number, periodIndex: number) => {
    setTimetable((prev) => {
      const updated = prev.map((row) => [...row]);
      updated[groupIndex][periodIndex] = null;
      return updated;
    });
  };

  // Move a session from one cell to another
  const moveSession = (
    from: { groupIndex: number; periodIndex: number },
    to: { groupIndex: number; periodIndex: number }
  ) => {
    setTimetable((prev) => {
      // Prevent moving to an occupied cell or if source is empty
      if (prev[to.groupIndex][to.periodIndex] || !prev[from.groupIndex][from.periodIndex]) {
        return prev;
      }
      const sessionToMove = prev[from.groupIndex][from.periodIndex];
      const updated = prev.map((row) => [...row]);
      updated[from.groupIndex][from.periodIndex] = null;
      updated[to.groupIndex][to.periodIndex] = sessionToMove;
      return updated;
    });
  };

  return (
    <TimetableContext.Provider
      value={{ timetable, groups, assignSession, removeSession, moveSession }}
    >
      {children}
    </TimetableContext.Provider>
  );
};
