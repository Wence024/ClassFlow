import React, { useState, useEffect } from 'react';
import type { ClassSession } from '../../types/scheduleLessons';
import * as timetableService from '../../services/timetableService';
import { TimetableContext } from './TimetableContext';
import * as timetableLogic from '../../utils/timetableLogic';

const groups = ['Group 1', 'Group 2', 'Group 3', 'Group 4'];

export const TimetableProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timetable, setTimetable] = useState<timetableLogic.TimetableGrid>(() =>
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
  ): string => {
    const result = timetableLogic.assignSessionToTimetable(
      timetable,
      groupIndex,
      periodIndex,
      session
    );

    if (result.error) {
      return result.error;
    }

    setTimetable(result.updatedTimetable);
    return ''; // Success
  };

  // Remove a session from a cell
  const removeSession = (groupIndex: number, periodIndex: number) => {
    const updatedTimetable = timetableLogic.removeSessionFromTimetable(
      timetable,
      groupIndex,
      periodIndex
    );
    setTimetable(updatedTimetable);
  };

  // Move a session from one cell to another
  const moveSession = (
    from: { groupIndex: number; periodIndex: number },
    to: { groupIndex: number; periodIndex: number }
  ): string => {
    const result = timetableLogic.moveSessionInTimetable(timetable, from, to);

    if (result.error) {
      return result.error;
    }

    setTimetable(result.updatedTimetable);
    return ''; // Success
  };

  return (
    <TimetableContext.Provider
      value={{ timetable, groups, assignSession, removeSession, moveSession }}
    >
      {children}
    </TimetableContext.Provider>
  );
};
