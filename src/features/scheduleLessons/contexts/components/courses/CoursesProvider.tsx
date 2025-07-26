import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Course, CourseInsert, CourseUpdate } from '../../../types/course';
import * as coursesService from '../../../services/coursesService';
import { CoursesContext } from './CoursesContext';
import { useAuth } from '../../../../auth/hooks/useAuth';

/**
 * Defines the shape of the context provided by CoursesProvider.
 * @property courses - An array of course objects for the current user.
 * @property loading - A boolean indicating if an operation is in progress.
 * @property error - A string containing an error message if an operation failed, otherwise null.
 * @property addCourse - Function to add a new course.
 * @property updateCourse - Function to update an existing course.
 * @property removeCourse - Function to remove a course.
 */
export interface CoursesContextType {
  courses: Course[];
  loading: boolean;
  error: string | null;
  addCourse: (data: CourseInsert) => Promise<void>;
  updateCourse: (id: string, data: CourseUpdate) => Promise<void>;
  removeCourse: (id: string) => Promise<void>;
}

/**
 * Provides course-related state and CRUD operations to its children.
 * It handles fetching data from the `coursesService`, manages loading and error states,
 * and exposes functions to add, update, and remove courses.
 *
 * @param {object} props - The component props.
 * @param {ReactNode} props.children - The child components that will consume the context.
 */
export const CoursesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Fetches courses from the service when the user is authenticated.
     * Clears existing courses if the user logs out.
     */
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

  /**
   * Adds a new course to the database and updates the local state.
   * It constructs the full `CourseInsert` object with the current user's ID.
   * @param data - The course data to be added, excluding `id` and `user_id`.
   * @returns A promise that resolves when the operation is complete.
   */
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

  /**
   * Updates an existing course in the database and updates the local state.
   * @param id - The ID of the course to update.
   * @param data - An object containing the course fields to update.
   * @returns A promise that resolves when the operation is complete.
   */
  const updateCourse = async (id: string, data: CourseUpdate) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      // The service call is simpler as RLS handles security on the backend.
      const updated = await coursesService.updateCourse(id, data);
      setCourses((prev: Course[]) => prev.map((c) => (c.id === id ? updated : c)));
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Removes a course from the database and updates the local state.
   * @param id - The ID of the course to remove.
   * @returns A promise that resolves when the operation is complete.
   */
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
