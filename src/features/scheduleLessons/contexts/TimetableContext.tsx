import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ClassSession } from '../types/classSessions';
import * as timetableService from '../services/timetableService';

const groups = ['Group 1', 'Group 2', 'Group 3', 'Group 4'];

type TimetableContextType = {
  timetable: (ClassSession | null)[][];
  setTimetable: React.Dispatch<React.SetStateAction<(ClassSession | null)[][]>>;
};

const TimetableContext = createContext<TimetableContextType | undefined>(undefined);

export const TimetableProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timetable, setTimetable] = useState<(ClassSession | null)[][]>(() =>
    timetableService.getTimetable()
  );
  useEffect(() => {
    timetableService.setTimetable(timetable);
  }, [timetable]);
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
