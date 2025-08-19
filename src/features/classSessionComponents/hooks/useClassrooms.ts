import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../auth/hooks/useAuth';
import * as classroomsService from '../services/classroomsService';
import type { Classroom, ClassroomInsert, ClassroomUpdate } from '../types/classroom';

/**
 * Custom hook to manage classrooms data.
 *
 * This hook abstracts the logic for fetching, adding, updating, and removing classrooms
 * for the currently authenticated user. It uses React Query for server state management.
 *
 * @returns An object containing the classrooms data, loading and error states, and mutation functions.
 */
export function useClassrooms() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['classrooms', user?.id];

  const {
    data: classrooms = [],
    isLoading,
    isFetching,
    error,
  } = useQuery<Classroom[]>({
    queryKey,
    queryFn: () => (user ? classroomsService.getClassrooms(user.id) : Promise.resolve([])),
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: (data: ClassroomInsert) =>
      classroomsService.addClassroom({ ...data, user_id: user!.id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ClassroomUpdate }) =>
      classroomsService.updateClassroom(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => classroomsService.removeClassroom(id, user!.id),
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
    /** The cached array of classrooms for the current user. Defaults to an empty array. */
    classrooms,
    /** A boolean indicating if any data fetching or mutation is in progress. */
    loading,
    /** An error message string if the query fails, otherwise null. */
    error: error ? (error as Error).message : null,
    /** An async function to add a new classroom. */
    addClassroom: addMutation.mutateAsync,
    /** An async function to update a classroom. */
    updateClassroom: (id: string, data: ClassroomUpdate) =>
      updateMutation.mutateAsync({ id, data }),
    /** An async function to remove a classroom. */
    removeClassroom: removeMutation.mutateAsync,
  };
}
