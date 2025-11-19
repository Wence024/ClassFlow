import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '../../shared/auth/hooks/useAuth';
import * as coursesService from '../services/coursesService';
import type { Course, CourseInsert, CourseUpdate } from '../types/course';

/**
 * Custom hook to manage courses data.
 *
 * This hook abstracts the logic for fetching, adding, updating, and removing courses
 * for the currently authenticated user. It uses React Query for server state management.
 *
 * @returns An object containing the courses data, granular loading and error states, and mutation functions.
 */
export function useCourses() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['courses', user?.program_id];

  const {
    data: courses = [],
    isLoading: isListLoading,
    isFetching,
    error,
  } = useQuery<Course[]>({
    queryKey,
    queryFn: () =>
      user?.program_id ? coursesService.getCoursesByProgram(user.program_id) : Promise.resolve([]),
    enabled: !!user?.program_id,
  });

  const addMutation = useMutation({
    mutationFn: (data: CourseInsert) => coursesService.addCourse(data),
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
    onError: (error: Error) => {
      if (error.message.includes('foreign key') || error.message.includes('violates')) {
        toast.error('Cannot delete course', {
          description: 'This course is being used in class sessions and cannot be deleted.',
        });
      } else {
        toast.error('Failed to delete course', {
          description: error.message,
        });
      }
    },
  });

  return {
    /** The cached array of courses for the current user. */
    courses,

    /** A boolean indicating if the list of courses is currently being fetched. */
    isLoading: isListLoading || isFetching,

    /** A boolean indicating if a create or update operation is in progress. */
    isSubmitting: addMutation.isPending || updateMutation.isPending,

    /** A boolean indicating if a delete operation is in progress. */
    isRemoving: removeMutation.isPending,

    /** An error message string if the query fails, otherwise null. */
    error: error ? (error as Error).message : null,

    /** An async function to add a new course. */
    addCourse: addMutation.mutateAsync,

    /**
     * An async function to update a course.
     *
     * @param id The ID of the course to update.
     * @param data The data to update the course with.
     * @returns A Promise that resolves when the update is complete.
     */
    updateCourse: (id: string, data: CourseUpdate) => updateMutation.mutateAsync({ id, data }),

    /** An async function to remove a course. */
    removeCourse: removeMutation.mutateAsync,
  };
}
