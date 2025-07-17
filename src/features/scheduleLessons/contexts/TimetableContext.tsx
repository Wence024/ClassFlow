import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ClassSession } from '../types/scheduleLessons';
import * as timetableService from '../services/timetableService';

const groups = ['Group 1', 'Group 2', 'Group 3', 'Group 4'];

type TimetableContextType = {
  timetable: (ClassSession | null)[][];
  assignSession: (groupIndex: number, periodIndex: number, session: ClassSession) => void;
  removeSession: (groupIndex: number, periodIndex: number) => void;
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

  // Assign a session to a cell
  const assignSession = (groupIndex: number, periodIndex: number, session: ClassSession) => {
    setTimetable((prev) => {
      const updated = prev.map((row) => [...row]);
      if (updated[groupIndex][periodIndex]) return prev;
      updated[groupIndex][periodIndex] = session;
      return updated;
    });
  };

  // Remove a session from a cell
  const removeSession = (groupIndex: number, periodIndex: number) => {
    setTimetable((prev) => {
      const updated = prev.map((row) => [...row]);
      updated[groupIndex][periodIndex] = null;
      return updated;
    });
  };

  return (
    <TimetableContext.Provider value={{ timetable, assignSession, removeSession, setTimetable }}>
      {children}
    </TimetableContext.Provider>
  );
};

export function useTimetable() {
  const ctx = useContext(TimetableContext);
  if (!ctx) throw new Error('useTimetable must be used within a TimetableProvider');
  return ctx;
}
