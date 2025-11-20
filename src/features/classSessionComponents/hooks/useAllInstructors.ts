import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../shared/auth/hooks/useAuth';
import * as instructorsService from '@/lib/services/instructorService';
import type { Instructor } from '@/types/instructor';

/**
 * Custom hook to fetch ALL instructors for class session selection workflows.
 *
 * Unlike `useInstructors()`, this hook fetches all instructors regardless of the user's department.
 * This is intended for class session authoring and timetabling where users may need to select
 * instructors from other departments (with appropriate conflict/request handling).
 *
 * Each instructor includes a `department_name` field for display and prioritization in selectors.
 *
 * @returns React Query result with all instructors including department information.
 */
export function useAllInstructors() {
  const { user } = useAuth();
  const queryKey = ['allInstructors'];

  const {
    data: instructors = [],
    isLoading,
    isFetching,
    error,
  } = useQuery<Instructor[]>({
    queryKey,
    queryFn: () => instructorsService.getAllInstructors(),
    enabled: !!user,
  });

  return {
    /** The array of all instructors with department_name included. */
    instructors,

    /** A boolean indicating if the list is currently being fetched. */
    isLoading: isLoading || isFetching,

    /** An error message string if the query fails, otherwise null. */
    error: error ? (error as Error).message : null,
  };
}
