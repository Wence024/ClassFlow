import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ClassSession } from '../types/classSessions';
import * as classSessionsService from '../services/classSessionsService';

// Context type
const ClassSessionsContext = createContext<
  | {
      classSessions: ClassSession[];
      setClassSessions: React.Dispatch<React.SetStateAction<ClassSession[]>>;
    }
  | undefined
>(undefined);

export const ClassSessionsProvider = ({ children }: { children: ReactNode }) => {
  const [classSessions, setClassSessions] = useState<ClassSession[]>(() =>
    classSessionsService.getClassSessions()
  );
  useEffect(() => {
    classSessionsService.setClassSessions(classSessions);
  }, [classSessions]);
  return (
    <ClassSessionsContext.Provider value={{ classSessions, setClassSessions }}>
      {children}
    </ClassSessionsContext.Provider>
  );
};

export function useClassSessions() {
  const ctx = useContext(ClassSessionsContext);
  if (!ctx) throw new Error('useClassSessions must be used within a ClassSessionsProvider');
  return ctx;
}
