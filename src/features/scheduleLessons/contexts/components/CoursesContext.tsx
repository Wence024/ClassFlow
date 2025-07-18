import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Course } from '../../types/scheduleLessons';
import * as coursesService from '../../services/coursesService';

// Context for managing courses state and CRUD operations.
// TODO: Support multi-user (sync with backend, not just localStorage).
// TODO: Add aggregation/stats for courses.
export interface CoursesContextType {
  courses: Course[];
  addCourse: (data: Omit<Course, 'id'>) => void;
  updateCourse: (id: string, data: Omit<Course, 'id'>) => void;
  removeCourse: (id: string) => void;
}

export const CoursesContext = createContext<CoursesContextType | undefined>(undefined);

export const CoursesProvider = ({ children }: { children: ReactNode }) => {
  const [courses, setCourses] = useState<Course[]>(() => coursesService.getCourses());

  useEffect(() => {
    coursesService.setCourses(courses);
  }, [courses]);

  const addCourse = (data: Omit<Course, 'id'>) => {
    const newCourse = coursesService.addCourse(data);
    setCourses((prev) => [...prev, newCourse]);
  };
  const updateCourse = (id: string, data: Omit<Course, 'id'>) => {
    const updatedCourse = { id, ...data };
    const updatedList = coursesService.updateCourse(updatedCourse);
    setCourses(updatedList);
  };
  const removeCourse = (id: string) => {
    const updatedList = coursesService.removeCourse(id);
    setCourses(updatedList);
  };

  return (
    <CoursesContext.Provider value={{ courses, addCourse, updateCourse, removeCourse }}>
      {children}
    </CoursesContext.Provider>
  );
};
