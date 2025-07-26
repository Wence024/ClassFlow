import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Course, CourseInsert, CourseUpdate } from '../../../types/course';
import * as coursesService from '../../../services/coursesService';
import { CoursesContext } from './CoursesContext';
import { useAuth } from '../../../../auth/hooks/useAuth';

export interface CoursesContextType {
  courses: Course[];
  loading: boolean;
  error: string | null;
  addCourse: (data: CourseInsert) => Promise<void>;
  updateCourse: (id: string, data: CourseUpdate) => Promise<void>;
  removeCourse: (id: string) => Promise<void>;
}

export const CoursesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setCourses([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    coursesService
      .getCourses(user.id)
      .then((data) => setCourses(data))
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [user]);

  const addCourse = async (data: CourseInsert) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const newCourse = await coursesService.addCourse({ ...data, user_id: user.id });
      setCourses((prev: Course[]) => [...prev, newCourse]);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const updateCourse = async (id: string, data: CourseUpdate) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const updated = await coursesService.updateCourse(id, { ...data, user_id: user.id });
      setCourses((prev: Course[]) => prev.map((c) => (c.id === id ? updated : c)));
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const removeCourse = async (id: string) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      await coursesService.removeCourse(id, user.id);
      setCourses((prev: Course[]) => prev.filter((c) => c.id !== id));
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CoursesContext.Provider
      value={{ courses, loading, error, addCourse, updateCourse, removeCourse }}
    >
      {children}
    </CoursesContext.Provider>
  );
};
