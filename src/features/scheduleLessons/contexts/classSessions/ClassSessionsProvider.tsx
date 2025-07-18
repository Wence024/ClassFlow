// Context for managing class sessions state and CRUD operations.
// All data logic is delegated to the classSessionsService for maintainability.
//
// TODO: Add conflict detection when adding/updating sessions (e.g., overlapping timeslots).
// TODO: Support multi-user (sync with backend, not just localStorage).
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ClassSession } from '../../types/scheduleLessons';
import * as classSessionsService from '../../services/classSessionsService';
import { ClassSessionsContext } from './ClassSessionsContext';

export interface ClassSessionsContextType {
  classSessions: ClassSession[];
  addClassSession: (sessionData: Omit<ClassSession, 'id'>) => void;
  updateClassSession: (id: string, sessionData: Omit<ClassSession, 'id'>) => void;
  removeClassSession: (id: string) => void;
}

export const ClassSessionsProvider = ({ children }: { children: ReactNode }) => {
  // State is initialized from localStorage via the service.
  const [classSessions, setClassSessions] = useState<ClassSession[]>(() =>
    classSessionsService.getClassSessions()
  );

  // Persist state to localStorage on every change.
  useEffect(() => {
    classSessionsService.setClassSessions(classSessions);
  }, [classSessions]);

  // Add session (delegates to service for ID and persistence)
  const addClassSession = (sessionData: Omit<ClassSession, 'id'>) => {
    // TODO: Check for conflicts before adding.
    const newSession = classSessionsService.addClassSession(sessionData);
    setClassSessions((prev) => [...prev, newSession]);
  };

  // Update session
  const updateClassSession = (id: string, sessionData: Omit<ClassSession, 'id'>) => {
    // TODO: Check for conflicts before updating.
    const updatedSession: ClassSession = { id, ...sessionData };
    const updatedList = classSessionsService.updateClassSession(updatedSession);
    setClassSessions(updatedList);
  };

  // Remove session
  const removeClassSession = (id: string) => {
    const updatedList = classSessionsService.removeClassSession(id);
    setClassSessions(updatedList);
  };

  return (
    <ClassSessionsContext.Provider
      value={{
        classSessions,
        addClassSession,
        updateClassSession,
        removeClassSession,
      }}
    >
      {children}
    </ClassSessionsContext.Provider>
  );
};
