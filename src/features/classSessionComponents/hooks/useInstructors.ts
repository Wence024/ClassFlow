import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../auth/hooks/useAuth';
import * as instructorsService from '../services/instructorsService';
import type { Instructor, InstructorInsert, InstructorUpdate } from '../types/instructor';

/**
 * Custom hook to manage instructors data.
 *
 * This hook abstracts the logic for fetching, adding, updating, and removing instructors
 * for the currently authenticated user. It uses React Query for server state management.
 *
 * @returns An object containing the instructors data, loading and error states, and mutation functions.
 */
export function useInstructors() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['instructors', user?.id];

  const {
    data: instructors = [],
    isLoading,
    isFetching,
    error,
  } = useQuery<Instructor[]>({
    queryKey,
    queryFn: () => (user ? instructorsService.getInstructors(user.id) : Promise.resolve([])),
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: (data: InstructorInsert) =>
      instructorsService.addInstructor({ ...data, user_id: user!.id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: InstructorUpdate }) =>
      instructorsService.updateInstructor(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => instructorsService.removeInstructor(id, user!.id),
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
    /** The cached array of instructors for the current user. Defaults to an empty array. */
    instructors,
    /** A boolean indicating if any data fetching or mutation is in progress. */
    loading,
    /** An error message string if the query fails, otherwise null. */
    error: error ? (error as Error).message : null,
    /** An async function to add a new instructor. */
    addInstructor: addMutation.mutateAsync,
    /** An async function to update an instructor. */
    updateInstructor: (id: string, data: InstructorUpdate) =>
      updateMutation.mutateAsync({ id, data }),
    /** An async function to remove an instructor. */
    removeInstructor: removeMutation.mutateAsync,
  };
}
