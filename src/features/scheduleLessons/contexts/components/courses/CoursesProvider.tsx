import type { ReactNode } from 'react';
import type { Course, CourseInsert, CourseUpdate } from '../../../types/course';
import * as coursesService from '../../../services/coursesService';
import { CoursesContext } from './CoursesContext';
import { useAuth } from '../../../../auth/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface CoursesContextType {
  courses: Course[];
  loading: boolean;
  error: string | null;
  addCourse: (data: CourseInsert) => Promise<Course>;
  updateCourse: (id: string, data: CourseUpdate) => Promise<Course>;
  removeCourse: (id: string) => Promise<void>;
}

export const CoursesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: courses = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['courses', user?.id],
    queryFn: () => (user ? coursesService.getCourses(user.id) : Promise.resolve([])),
    enabled: !!user,
  });

  const addCourseMutation = useMutation({
    mutationFn: (data: CourseInsert) => coursesService.addCourse({ ...data, user_id: user!.id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['courses', user?.id] }),
  });
  const updateCourseMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CourseUpdate }) =>
      coursesService.updateCourse(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['courses', user?.id] }),
  });
  const removeCourseMutation = useMutation({
    mutationFn: (id: string) => coursesService.removeCourse(id, user!.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['courses', user?.id] }),
  });

  const addCourse = (data: CourseInsert) => addCourseMutation.mutateAsync(data);
  const updateCourse = (id: string, data: CourseUpdate) =>
    updateCourseMutation.mutateAsync({ id, data });
  const removeCourse = (id: string) => removeCourseMutation.mutateAsync(id);

  return (
    <CoursesContext.Provider
      value={{
        courses,
        loading,
        error: error ? (error as Error).message : null,
        addCourse,
        updateCourse,
        removeCourse,
      }}
    >
      {children}
    </CoursesContext.Provider>
  );
};
