import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { ClassSession } from '../types/classSessions';
import { apiClassSessions } from '../api/classSessions';
import { type ClassSessionsContextType } from './types';

// Context type
const ClassSessionsContext = createContext<ClassSessionsContextType>(undefined);

export const ClassSessionsProvider = ({ children }: { children: ReactNode }) => {
  const [classSessions, setClassSessions] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSessions() {
      setLoading(true);
      setError(null);
      try {
        const data = await apiClassSessions.list();
        setClassSessions(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch class sessions');
      } finally {
        setLoading(false);
      }
    }
    fetchSessions();
  }, []);

  // Optionally, you can wrap setClassSessions to also call the API for CRUD

  return (
    <ClassSessionsContext.Provider value={{ classSessions, setClassSessions, loading, error }}>
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
