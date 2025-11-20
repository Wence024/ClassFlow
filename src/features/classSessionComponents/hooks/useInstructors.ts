import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '../../shared/auth/hooks/useAuth';
import * as instructorsService from '@/lib/services/instructorService';
import type { Instructor, InstructorInsert, InstructorUpdate } from '@/types/instructor';

/**
 * Custom hook to manage instructors data.
 *
 * This hook abstracts the logic for fetching, adding, updating, and removing instructors
 * for the currently authenticated user. It uses React Query for server state management.
 *
 * @returns An object containing the instructors data, granular loading and error states, and mutation functions.
 */
export function useInstructors() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['instructors', user?.id];

  const {
    data: instructors = [],
    isLoading: isListLoading,
    isFetching,
    error,
  } = useQuery<Instructor[]>({
    queryKey,
    queryFn: () =>
      user
        ? instructorsService.getInstructors({
            role: user.role,
            department_id: (user as { department_id?: string | null })?.department_id || null,
          })
        : Promise.resolve([]),
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: (data: InstructorInsert) => instructorsService.addInstructor(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: InstructorUpdate }) =>
      instructorsService.updateInstructor(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => instructorsService.removeInstructor(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    onError: (error: Error) => {
      if (error.message.includes('foreign key') || error.message.includes('violates')) {
        toast.error('Cannot delete instructor', {
          description: 'This instructor is assigned to class sessions and cannot be deleted.',
        });
      } else {
        toast.error('Failed to delete instructor', {
          description: error.message,
        });
      }
    },
  });

  return {
    /** The cached array of instructors for the current user. */
    instructors,

    /** A boolean indicating if the list of instructors is currently being fetched. */
    isLoading: isListLoading || isFetching,

    /** A boolean indicating if a create or update operation is in progress. */
    isSubmitting: addMutation.isPending || updateMutation.isPending,

    /** A boolean indicating if a delete operation is in progress. */
    isRemoving: removeMutation.isPending,

    /** An error message string if the query fails, otherwise null. */
    error: error ? (error as Error).message : null,

    /** An async function to add a new instructor. */
    addInstructor: addMutation.mutateAsync,

    /**
     * An async function to update an instructor.
     *
     * @param id - The ID of the instructor to update.
     * @param data - The data to update the instructor with.
     * @returns A Promise that resolves when the update is complete.
     */
    updateInstructor: (id: string, data: InstructorUpdate) =>
      updateMutation.mutateAsync({ id, data }),

    /** An async function to remove an instructor. */
    removeInstructor: removeMutation.mutateAsync,
  };
}

