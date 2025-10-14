import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import * as classroomsService from '../services/classroomsService';
import type { Classroom, ClassroomInsert, ClassroomUpdate } from '../types/classroom';

/**
 * Custom hook to manage classrooms data.
 *
 * This hook abstracts the logic for fetching, adding, updating, and removing classrooms.
 * It fetches all classrooms and prioritizes them based on the user's department preference.
 * Uses React Query for server state management.
 *
 * @returns An object containing the prioritized classrooms data, granular loading and error states, and mutation functions.
 */
export function useClassrooms() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['allClassrooms'];

  const {
    data: allClassrooms = [],
    isLoading: isListLoading,
    isFetching,
    error,
  } = useQuery<Classroom[]>({
    queryKey,
    queryFn: () => classroomsService.getAllClassrooms(),
    enabled: !!user,
  });

  const prioritizedClassrooms = useMemo(() => {
    if (!user?.department_id) return allClassrooms;

    const preferred = allClassrooms.filter(
      (c) => c.preferred_department_id === user.department_id
    );
    const other = allClassrooms.filter(
      (c) => c.preferred_department_id !== user.department_id
    );

    return [...preferred, ...other];
  }, [allClassrooms, user?.department_id]);

  const addMutation = useMutation({
    mutationFn: (data: ClassroomInsert) => classroomsService.addClassroom(data),
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

  return {
    /** The prioritized array of classrooms (preferred first, then others). */
    classrooms: prioritizedClassrooms,

    /** A boolean indicating if the list of classrooms is currently being fetched. */
    isLoading: isListLoading || isFetching,

    /** A boolean indicating if a create or update operation is in progress. */
    isSubmitting: addMutation.isPending || updateMutation.isPending,

    /** A boolean indicating if a delete operation is in progress. */
    isRemoving: removeMutation.isPending,

    /** An error message string if the query fails, otherwise null. */
    error: error ? (error as Error).message : null,

    /** An async function to add a new classroom. */
    addClassroom: addMutation.mutateAsync,

    /**
     * An async function to update a classroom.
     *
     * @param id - The ID of the classroom to update.
     * @param data - The data to update the classroom with.
     * @returns A Promise that resolves when the update is complete.
     */
    updateClassroom: (id: string, data: ClassroomUpdate) =>
      updateMutation.mutateAsync({ id, data }),

    /** An async function to remove a classroom. */
    removeClassroom: removeMutation.mutateAsync,
  };
}
