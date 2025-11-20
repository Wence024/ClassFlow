import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../shared/auth/hooks/useAuth';
import * as classroomsService from '@/lib/services/classroomService';
import type { Classroom } from '@/types/classroom';

/**
 * Custom hook to fetch ALL classrooms for class session selection workflows.
 *
 * Unlike `useClassrooms()`, this hook fetches all classrooms regardless of the user's department.
 * This is intended for class session authoring and timetabling where users may need to select
 * classrooms from other departments (with appropriate conflict/request handling).
 *
 * Each classroom includes a `preferred_department_name` field for display and prioritization in selectors.
 *
 * @returns React Query result with all classrooms including department information.
 */
export function useAllClassrooms() {
  const { user } = useAuth();
  const queryKey = ['allClassrooms'];

  const {
    data: classrooms = [],
    isLoading,
    isFetching,
    error,
  } = useQuery<Classroom[]>({
    queryKey,
    queryFn: () => classroomsService.getAllClassrooms(),
    enabled: !!user,
  });

  return {
    /** The array of all classrooms with preferred_department_name included. */
    classrooms,

    /** A boolean indicating if the list is currently being fetched. */
    isLoading: isLoading || isFetching,

    /** An error message string if the query fails, otherwise null. */
    error: error ? (error as Error).message : null,
  };
}
