import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../auth/hooks/useAuth';
import * as coursesService from '../services/coursesService';
import type { Course, CourseInsert, CourseUpdate } from '../types/course';

/**
 * Custom hook to manage courses data.
 *
 * This hook abstracts the logic for fetching, adding, updating, and removing courses
 * for the currently authenticated user. It uses React Query for server state management.
 *
 * @returns An object containing the courses data, loading and error states, and mutation functions.
 */
export function useCourses() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['courses', user?.id];

  const {
    data: courses = [],
    isLoading,
    isFetching,
    error,
  } = useQuery<Course[]>({
    queryKey,
    queryFn: () => (user ? coursesService.getCourses(user.id) : Promise.resolve([])),
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: (data: CourseInsert) => coursesService.addCourse({ ...data, user_id: user!.id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CourseUpdate }) =>
      coursesService.updateCourse(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => coursesService.removeCourse(id, user!.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  /** A consolidated loading state that is true if any query or mutation is in progress. */
  const loading =
    isLoading ||
    isFetching ||
    addMutation.isPending ||
    updateMutation.isPending ||
    removeMutation.isPending;

  return {
    /** The cached array of courses for the current user. Defaults to an empty array. */
    courses,
    /** A boolean indicating if any data fetching or mutation is in progress. */
    loading,
    /** An error message string if the query fails, otherwise null. */
    error: error ? (error as Error).message : null,
    /** An async function to add a new course. */
    addCourse: addMutation.mutateAsync,
    /** An async function to update a course. */
    updateCourse: (id: string, data: CourseUpdate) => updateMutation.mutateAsync({ id, data }),
    /** An async function to remove a course. */
    removeCourse: removeMutation.mutateAsync,
  };
}
