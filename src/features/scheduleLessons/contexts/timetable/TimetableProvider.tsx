import React, { useState, useEffect } from 'react';
import type { ClassSession } from '../../types/scheduleLessons';
import * as timetableService from '../../services/timetableService';
import { TimetableContext } from './TimetableContext';

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
   * Returns a detailed message if a conflict is found, otherwise an empty string.
   */
  const hasConflicts = (
    currentTimetable: (ClassSession | null)[][],
    sessionToCheck: ClassSession,
    targetPeriodIndex: number
  ): string => {
    for (const group of currentTimetable) {
      const existingSession = group[targetPeriodIndex];
      if (existingSession) {
        if (existingSession.instructor.id === sessionToCheck.instructor.id) {
          return `Instructor conflict: ${existingSession.instructor.name} is already scheduled at this time.`;
        }
        if (existingSession.classroom.id === sessionToCheck.classroom.id) {
          return `Classroom conflict: ${existingSession.classroom.name} is already in use at this time.`;
        }
      }
    }
    return '';
  };

  // Assign a session to a cell
  const assignSession = (
    groupIndex: number,
    periodIndex: number,
    session: ClassSession
  ): string => {
    let conflictMsg = '';
    setTimetable((prev) => {
      if (prev[groupIndex][periodIndex]) {
        conflictMsg = 'This slot is already occupied.';
        return prev;
      }
      const conflict = hasConflicts(prev, session, periodIndex);
      if (conflict) {
        conflictMsg = conflict;
        return prev;
      }
      const updated = prev.map((row) => [...row]);
      updated[groupIndex][periodIndex] = session;
      return updated;
    });
    return conflictMsg;
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
  ): string => {
    let conflictMsg = '';
    setTimetable((prev) => {
      const sessionToMove = prev[from.groupIndex][from.periodIndex];
      if (!sessionToMove) {
        conflictMsg = 'No session to move.';
        return prev;
      }
      if (prev[to.groupIndex][to.periodIndex]) {
        conflictMsg = 'This slot is already occupied.';
        return prev;
      }
      const tempTimetable = prev.map((row) => [...row]);
      tempTimetable[from.groupIndex][from.periodIndex] = null;
      const conflict = hasConflicts(tempTimetable, sessionToMove, to.periodIndex);
      if (conflict) {
        conflictMsg = conflict;
        return prev;
      }
      const updated = prev.map((row) => [...row]);
      updated[from.groupIndex][from.periodIndex] = null;
      updated[to.groupIndex][to.periodIndex] = sessionToMove;
      return updated;
    });
    return conflictMsg;
  };

  return (
    <TimetableContext.Provider
      value={{ timetable, groups, assignSession, removeSession, moveSession }}
    >
      {children}
    </TimetableContext.Provider>
  );
};
