import React, { useState, useEffect, useRef } from 'react';
import type { ClassSession } from '../../types/scheduleLessons';
import * as timetableService from '../../services/timetableService';
import { TimetableContext } from './TimetableContext';
import * as timetableLogic from '../../utils/timetableLogic';
import { useClassGroups } from '../../hooks/useComponents';

const NUMBER_OF_PERIODS = 16;

/**
 * This provider synchronizes the timetable grid with the master list of class groups.
 * If a class group is deleted, its corresponding row and all scheduled sessions within it are safely removed from the timetable.
 */
export const TimetableProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { classGroups } = useClassGroups();
  const [timetable, setTimetable] = useState<Map<string, (ClassSession | null)[]>>(new Map());
  const isInitialized = useRef(false);

  // Effect for initial load and migration from localStorage
  useEffect(() => {
    // Only run once classGroups are available and we haven't initialized.
    if (classGroups.length > 0 && !isInitialized.current) {
      const initialData = timetableService.getTimetable(classGroups);
      setTimetable(new Map(initialData));
      isInitialized.current = true;
    }
  }, [classGroups]);

  // Synchronize timetable rows with classGroups from ComponentsContext
  useEffect(() => {
    // Do not run this synchronization logic until after the initial load.
    if (!isInitialized.current) return;

    setTimetable((currentMap) => {
      const newMap = new Map<string, (ClassSession | null)[]>();
      let hasChanged = false;

      // Copy existing, valid groups to the new map
      for (const group of classGroups) {
        const existingRow = currentMap.get(group.id);
        if (existingRow) {
          newMap.set(group.id, existingRow);
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
    // Do not run this persistence logic until after the initial load.
    if (!isInitialized.current) return;

    // Convert Map to array for JSON serialization
    timetableService.setTimetable(Array.from(timetable.entries()));
  }, [timetable]);

  const assignSession = (groupId: string, periodIndex: number, session: ClassSession): string => {
    const result = timetableLogic.assignSessionToTimetable(
      timetable,
      groupId,
      periodIndex,
      session
    );

    if (result.error) {
      return result.error;
    }

    setTimetable(result.updatedTimetable);
    return '';
  };

  const removeSession = (groupId: string, periodIndex: number) => {
    const updatedTimetable = timetableLogic.removeSessionFromTimetable(
      timetable,
      groupId,
      periodIndex
    );
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
