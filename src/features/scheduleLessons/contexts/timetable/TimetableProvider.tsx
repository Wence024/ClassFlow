import React, { useState, useEffect, useRef } from 'react';
import type { ClassSession } from '../../types/';
import * as timetableService from '../../services/timetableService';
import { TimetableContext } from './TimetableContext';
import checkConflicts, { type TimetableGrid } from '../../utils/checkConflicts';
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
    // Use checkConflicts for client-side conflict detection
    const conflict = checkConflicts(timetable as TimetableGrid, session, groupId, periodIndex);
    if (conflict) return conflict;
    // ...existing code for updating state or backend...
    // For legacy/local-only: update state
    const newTimetable = new Map(timetable);
    const row = newTimetable.get(groupId)
      ? [...newTimetable.get(groupId)!]
      : Array(NUMBER_OF_PERIODS).fill(null);
    row[periodIndex] = session;
    newTimetable.set(groupId, row);
    setTimetable(newTimetable);
    return '';
  };

  const removeSession = (groupId: string, periodIndex: number) => {
    // Remove session from timetable
    const newTimetable = new Map(timetable);
    const row = newTimetable.get(groupId)
      ? [...newTimetable.get(groupId)!]
      : Array(NUMBER_OF_PERIODS).fill(null);
    row[periodIndex] = null;
    newTimetable.set(groupId, row);
    setTimetable(newTimetable);
  };

  const moveSession = (
    from: { groupId: string; periodIndex: number },
    to: { groupId: string; periodIndex: number },
    session: ClassSession
  ): string => {
    // Use checkConflicts for client-side conflict detection
    const conflict = checkConflicts(
      timetable as TimetableGrid,
      session,
      to.groupId,
      to.periodIndex,
      from
    );
    if (conflict) return conflict;
    // ...existing code for updating state or backend...
    // Remove from old cell, assign to new cell
    const newTimetable = new Map(timetable);
    const fromRow = newTimetable.get(from.groupId)
      ? [...newTimetable.get(from.groupId)!]
      : Array(NUMBER_OF_PERIODS).fill(null);
    fromRow[from.periodIndex] = null;
    newTimetable.set(from.groupId, fromRow);
    const toRow = newTimetable.get(to.groupId)
      ? [...newTimetable.get(to.groupId)!]
      : Array(NUMBER_OF_PERIODS).fill(null);
    toRow[to.periodIndex] = session;
    newTimetable.set(to.groupId, toRow);
    setTimetable(newTimetable);
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
