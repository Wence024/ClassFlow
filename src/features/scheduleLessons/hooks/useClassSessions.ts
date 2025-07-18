import { useContext } from 'react';
import { ClassSessionsContext } from '../contexts/classSessions/ClassSessionsProvider';

export function useClassSessions() {
  const ctx = useContext(ClassSessionsContext);
  if (!ctx) throw new Error('useClassSessions must be used within a ClassSessionsProvider');
  return ctx;
}
