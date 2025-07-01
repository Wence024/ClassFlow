import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ClassSession } from '../types/classSessions';
import { usePersistentState } from '../hooks/usePersistentState';

// Context type
const ClassSessionsContext = createContext<{ 
  classSessions: ClassSession[]; 
  setClassSessions: React.Dispatch<React.SetStateAction<ClassSession[]>> 
} | undefined>(undefined);

export const ClassSessionsProvider = ({ children }: { children: ReactNode }) => {
  const [classSessions, setClassSessions] = usePersistentState<ClassSession[]>('classSessions', []);
  useEffect(() => {
    localStorage.setItem('classSessions', JSON.stringify(classSessions));
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

// TODO: bug: Changes in the components of class session are not immediately reflected in the class session page. 