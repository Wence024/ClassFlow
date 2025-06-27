import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Course } from '../types/classSessions';
import { courses as initialCourses } from './ClassSessionsData';

const CourseContext = createContext<{
  courses: Course[];
  addCourse: (course: Omit<Course, 'id'>) => void;
  editCourse: (id: number, course: Omit<Course, 'id'>) => void;
  deleteCourse: (id: number) => void;
} | undefined>(undefined);

export const CourseProvider = ({ children }: { children: ReactNode }) => {
  const [courses, setCourses] = useState<Course[]>(() => {
    const stored = localStorage.getItem('courses');
    return stored ? JSON.parse(stored) : initialCourses;
  });
  useEffect(() => {
    localStorage.setItem('courses', JSON.stringify(courses));
  }, [courses]);

  const addCourse = (course: Omit<Course, 'id'>) => {
    setCourses(prev => [...prev, { ...course, id: Date.now() }]);
  };
  const editCourse = (id: number, course: Omit<Course, 'id'>) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, ...course } : c));
  };
  const deleteCourse = (id: number) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  return (
    <CourseContext.Provider value={{ courses, addCourse, editCourse, deleteCourse }}>
      {children}
    </CourseContext.Provider>
  );
};

export function useCourses() {
  const ctx = useContext(CourseContext);
  if (!ctx) throw new Error('useCourses must be used within a CourseProvider');
  return ctx;
} 