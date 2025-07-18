import React, { useState, useEffect } from 'react';
import type { ClassSession } from '../../types/scheduleLessons';
import * as timetableService from '../../services/timetableService';
import { TimetableContext } from './TimetableContext';
import * as timetableLogic from '../../utils/timetableLogic';
import { useClassGroups } from '../../hooks/useComponents';

const NUMBER_OF_PERIODS = 16;

export const TimetableProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { classGroups } = useClassGroups();
  const [timetable, setTimetable] = useState<timetableLogic.TimetableGrid>(() =>
    timetableService.getTimetable()
  );

  // Synchronize timetable rows with classGroups from ComponentsContext
  useEffect(() => {
    setTimetable((currentTimetable) => {
      const currentRows = currentTimetable.length;
      const targetRows = classGroups.length;

      if (currentRows === targetRows) {
        return currentTimetable; // No change needed
      }

      const periods = currentTimetable[0]?.length || NUMBER_OF_PERIODS;

      if (targetRows > currentRows) {
        // Add new rows if groups were added
        const newRows = Array(targetRows - currentRows)
          .fill(null)
          .map(() => Array(periods).fill(null));
        return [...currentTimetable, ...newRows];
      } else {
        // Remove rows from the end if groups were removed
        return currentTimetable.slice(0, targetRows);
      }
    });
  }, [classGroups.length]);

  // Persist timetable to localStorage on every change
  useEffect(() => {
    timetableService.setTimetable(timetable);
  }, [timetable]);

  const assignSession = (
    groupIndex: number,
    periodIndex: number,
    session: ClassSession
  ): string => {
    const result = timetableLogic.assignSessionToTimetable(timetable, groupIndex, periodIndex, session);

    if (result.error) {
      return result.error;
    }

    setTimetable(result.updatedTimetable);
    return '';
  };

  const removeSession = (groupIndex: number, periodIndex: number) => {
    const updatedTimetable = timetableLogic.removeSessionFromTimetable(timetable, groupIndex, periodIndex);
    setTimetable(updatedTimetable);
  };

  const moveSession = (
    from: { groupIndex: number; periodIndex: number },
    to: { groupIndex: number; periodIndex: number }
  ): string => {
    const result = timetableLogic.moveSessionInTimetable(timetable, from, to);

    if (result.error) {
      return result.error;
    }

    setTimetable(result.updatedTimetable);
    return '';
  };

  return (
    <TimetableContext.Provider
      value={{
        groups: classGroups.map((g) => g.name),
        timetable,
        assignSession,
        removeSession,
        moveSession,
      }}
    >
      {children}
    </TimetableContext.Provider>
  );
};

// TODO: Refrain from modifying classGroup data or else the codebase won't run because of Timetable reading "undefined".