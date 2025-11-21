import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../shared/auth/hooks/useAuth';
import * as coursesService from '@/lib/services/courseService';
import type { Course } from '@/types/course';

/**
 * Custom hook to fetch ALL courses across all programs.
 * Used for cross-program workflows like class session authoring.
 * Includes program metadata for prioritization and display.
 *
 * @returns An object containing all courses data and loading/error states.
 */
export function useAllCourses() {
  const { user } = useAuth();
  const queryKey = ['allCourses'];

  const {
    data: courses = [],
    isLoading,
    isFetching,
    error,
  } = useQuery<Course[]>({
    queryKey,
    queryFn: () => coursesService.getAllCourses(),
    enabled: !!user,
  });

  return {
    /** All courses across all programs with program metadata. */
    courses,

    /** A boolean indicating if courses are currently being fetched. */
    isLoading: isLoading || isFetching,

    /** An error message string if the query fails, otherwise null. */
    error: error ? (error as Error).message : null,
  };
}
