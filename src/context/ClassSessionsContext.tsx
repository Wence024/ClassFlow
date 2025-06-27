import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { courses, classGroups, classrooms, instructors, ClassSession } from './ClassSessionsData';

// Types
export type Course = { id: number; name: string };
export type ClassGroup = { id: number; name: string };
export type Classroom = { id: number; name: string };
export type Instructor = { id: number; name: string };

// Preset data
export const courses: Course[] = [
  { id: 1, name: 'Math 101' },
  { id: 2, name: 'Physics 101' },
  { id: 3, name: 'Chemistry 101' },
];
export const classGroups: ClassGroup[] = [
  { id: 1, name: 'Group 1' },
  { id: 2, name: 'Group 2' },
  { id: 3, name: 'Group 3' },
];
export const classrooms: Classroom[] = [
  { id: 1, name: 'Room A' },
  { id: 2, name: 'Room B' },
  { id: 3, name: 'Room C' },
];
export const instructors: Instructor[] = [
  { id: 1, name: 'Prof. A' },
  { id: 2, name: 'Prof. B' },
  { id: 3, name: 'Prof. C' },
];

// Context type
const ClassSessionsContext = createContext<{ classSessions: ClassSession[]; setClassSessions: React.Dispatch<React.SetStateAction<ClassSession[]>> } | undefined>(undefined);

export const ClassSessionsProvider = ({ children }: { children: ReactNode }) => {
  const [classSessions, setClassSessions] = useState<ClassSession[]>(() => {
    const stored = localStorage.getItem('classSessions');
    return stored ? JSON.parse(stored) : [];
  });
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