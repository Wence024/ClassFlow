import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ClassSession } from '../../types/scheduleLessons';
import * as classSessionsService from '../../services/classSessionsService';

interface ClassSessionsContextType {
  classSessions: ClassSession[];
  addClassSession: (sessionData: Omit<ClassSession, 'id'>) => void;
  updateClassSession: (id: string, sessionData: Omit<ClassSession, 'id'>) => void;
  removeClassSession: (id: string) => void;
}

export const ClassSessionsContext = createContext<ClassSessionsContextType | undefined>(undefined);

export const ClassSessionsProvider = ({ children }: { children: ReactNode }) => {
  const [classSessions, setClassSessions] = useState<ClassSession[]>(() =>
    classSessionsService.getClassSessions()
  );

  useEffect(() => {
    classSessionsService.setClassSessions(classSessions);
  }, [classSessions]);

  // Add session
  const addClassSession = (sessionData: Omit<ClassSession, 'id'>) => {
    const newSession = classSessionsService.addClassSession(sessionData);
    setClassSessions((prev) => [...prev, newSession]);
  };

  // Update session
  const updateClassSession = (id: string, sessionData: Omit<ClassSession, 'id'>) => {
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
