import React, { createContext, useContext } from 'react';
import type { ClassSession } from '../types/classSessions';
import { usePersistentState } from '../hooks/usePersistentState';
import { type TimetableContextType } from './types';

const groups = ['Group 1', 'Group 2', 'Group 3', 'Group 4'];
const TIMETABLE_KEY = 'timetable';

const defaultTimetable: (ClassSession | null)[][] = Array.from({ length: groups.length }, () =>
  Array(16).fill(null)
);

const TimetableContext = createContext<TimetableContextType | undefined>(undefined);

export const TimetableProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timetable, setTimetable] = usePersistentState<(ClassSession | null)[][]>(
    TIMETABLE_KEY,
    defaultTimetable
  );

  return (
    <TimetableContext.Provider value={{ timetable, setTimetable }}>
      {children}
    </TimetableContext.Provider>
  );
};

export function useTimetable() {
  const ctx = useContext(TimetableContext);
  if (!ctx) throw new Error('useTimetable must be used within a TimetableProvider');
  return ctx;
}
