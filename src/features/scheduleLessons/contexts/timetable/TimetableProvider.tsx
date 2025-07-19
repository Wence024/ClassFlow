import React, { useState, useEffect } from 'react';
import type { ClassSession } from '../../types/scheduleLessons';
import * as timetableService from '../../services/timetableService';
import { TimetableContext } from './TimetableContext';
import * as timetableLogic from '../../utils/timetableLogic';
import { useClassGroups } from '../../hooks/useComponents';

const NUMBER_OF_PERIODS = 16;

export const TimetableProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { classGroups } = useClassGroups();
  // Use a Map for the timetable state: Map<groupId, sessions[]>
  const [timetable, setTimetable] = useState<Map<string, (ClassSession | null)[]>>(() =>
    new Map(timetableService.getTimetable())
  );

  // Synchronize timetable rows with classGroups from ComponentsContext
  useEffect(() => {
    setTimetable((currentMap) => {
      const newMap = new Map<string, (ClassSession | null)[]>();
      let hasChanged = false;

      // Copy existing, valid groups to the new map
      for (const group of classGroups) {
        if (currentMap.has(group.id)) {
          newMap.set(group.id, currentMap.get(group.id)!);
        } else {
          newMap.set(group.id, Array(NUMBER_OF_PERIODS).fill(null));
          hasChanged = true;
        }
      }

      // Check if any groups were removed by comparing sizes.
      // This is the most common and cheapest check.
      if (currentMap.size !== newMap.size) {
        hasChanged = true;
      }

      return hasChanged ? newMap : currentMap;
    });
  }, [classGroups]);

  // Persist timetable to localStorage on every change
  useEffect(() => {
    // Convert Map to array for JSON serialization
    timetableService.setTimetable(Array.from(timetable.entries()));
  }, [timetable]);

  const assignSession = (
    groupId: string,
    periodIndex: number,
    session: ClassSession
  ): string => {
    const result = timetableLogic.assignSessionToTimetable(timetable, groupId, periodIndex, session);

    if (result.error) {
      return result.error;
    }

    setTimetable(result.updatedTimetable);
    return '';
  };

  const removeSession = (groupId: string, periodIndex: number) => {
    const updatedTimetable = timetableLogic.removeSessionFromTimetable(timetable, groupId, periodIndex);
    setTimetable(updatedTimetable);
  };

  const moveSession = (
    from: { groupId: string; periodIndex: number },
    to: { groupId: string; periodIndex: number }
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
        groups: classGroups, // Pass the full group objects
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
