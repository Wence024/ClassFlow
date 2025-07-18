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

  /**
   * Checks for conflicts for a given session at a specific time period.
   * A conflict exists if the same instructor or classroom is already booked
   * in the same time slot (period).
   * @param currentTimetable The current timetable state.
   * @param sessionToCheck The session to check for.
   * @param targetPeriodIndex The period index to check within.
   * @returns `true` if a conflict is found, otherwise `false`.
   */
  const hasConflicts = (
    currentTimetable: (ClassSession | null)[][],
    sessionToCheck: ClassSession,
    targetPeriodIndex: number
  ): boolean => {
    for (const group of currentTimetable) {
      const existingSession = group[targetPeriodIndex];
      if (existingSession) {
        // Check for instructor or classroom conflict in the same period
        if (
          existingSession.instructor.id === sessionToCheck.instructor.id ||
          existingSession.classroom.id === sessionToCheck.classroom.id
        ) {
          return true;
        }
      }
    }
    return false;
  };

  // Assign a session to a cell
  const assignSession = (
    groupIndex: number,
    periodIndex: number,
    session: ClassSession
  ): boolean => {
    let success = false;
    setTimetable((prev) => {
      // Prevent assigning to an already occupied cell or if conflict
      if (prev[groupIndex][periodIndex] || hasConflicts(prev, session, periodIndex)) {
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
  ): boolean => {
    let success = false;
    setTimetable((prev) => {
      const sessionToMove = prev[from.groupIndex][from.periodIndex];
      // Prevent moving to an occupied cell or if source is empty
      if (!sessionToMove || prev[to.groupIndex][to.periodIndex]) {
        return prev;
      }
      // Temporarily remove the session from its original spot to check for conflicts accurately
      const tempTimetable = prev.map((row) => [...row]);
      tempTimetable[from.groupIndex][from.periodIndex] = null;
      // Check for conflicts at the new location
      if (hasConflicts(tempTimetable, sessionToMove, to.periodIndex)) {
        return prev;
      }
      const updated = prev.map((row) => [...row]);
      updated[from.groupIndex][from.periodIndex] = null;
      updated[to.groupIndex][to.periodIndex] = sessionToMove;
      success = true;
      return updated;
    });
    return success;
  };

  return (
    <TimetableContext.Provider
      value={{ timetable, groups, assignSession, removeSession, moveSession }}
    >
      {children}
    </TimetableContext.Provider>
  );
};
