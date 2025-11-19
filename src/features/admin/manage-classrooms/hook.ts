/**
 * Business logic for managing classrooms.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { Classroom, ClassroomInsert, ClassroomUpdate } from '@/types/classroom';
import {
  fetchAllClassrooms,
  createClassroom,
  modifyClassroom,
  deleteClassroom,
} from './service';

/**
 * Hook for managing classrooms with CRUD operations.
 * Admin-only functionality.
 */
export function useManageClassrooms() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const queryKey = ['allClassrooms'];

  // Fetch all classrooms
  const {
    data: allClassrooms = [],
    isLoading,
    error,
  } = useQuery<Classroom[]>({
    queryKey,
    queryFn: fetchAllClassrooms,
    enabled: !!user,
  });

  // Prioritize classrooms: user's department first, then others
  const prioritizedClassrooms = useMemo(() => {
    if (!user?.department_id) return allClassrooms;

    const preferred = allClassrooms.filter(
      (c) => c.preferred_department_id === user.department_id
    );
    const other = allClassrooms.filter((c) => c.preferred_department_id !== user.department_id);

    return [...preferred, ...other];
  }, [allClassrooms, user?.department_id]);

  // Create classroom mutation
  const addMutation = useMutation({
    mutationFn: (data: ClassroomInsert) => createClassroom(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Classroom created successfully!');
    },
    onError: (error: Error) => {
      toast.error('Failed to create classroom', {
        description: error.message,
      });
    },
  });

  // Update classroom mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ClassroomUpdate }) =>
      modifyClassroom(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Classroom updated successfully!');
    },
    onError: (error: Error) => {
      toast.error('Failed to update classroom', {
        description: error.message,
      });
    },
  });

  // Delete classroom mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteClassroom(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Classroom removed successfully.');
    },
    onError: (error: Error) => {
      if (
        error.message.includes('foreign key') ||
        error.message.includes('violates') ||
        error.message.includes('used in')
      ) {
        toast.error('Cannot delete classroom', {
          description: 'This classroom is being used in class sessions and cannot be deleted.',
        });
      } else {
        toast.error('Failed to delete classroom', {
          description: error.message,
        });
      }
    },
  });

  /**
   * Validates if a classroom can be deleted.
   */
  const canDeleteClassroom = (classroomId: string, classSessions: any[]): boolean => {
    return !classSessions.some((session) => session.classroom?.id === classroomId);
  };

  /**
   * Finds the index where "other" classrooms begin (for visual separator).
   */
  const getFirstOtherIndex = (classrooms: Classroom[]): number => {
    if (!user?.department_id) return -1;
    return classrooms.findIndex((c) => c.preferred_department_id !== user.department_id);
  };

  return {
    classrooms: prioritizedClassrooms,
    isLoading,
    error: error ? (error as Error).message : null,

    // Mutation states
    isSubmitting: addMutation.isPending || updateMutation.isPending,
    isRemoving: deleteMutation.isPending,

    // CRUD operations
    addClassroom: (data: ClassroomInsert) => addMutation.mutateAsync(data),
    updateClassroom: (id: string, data: ClassroomUpdate) =>
      updateMutation.mutateAsync({ id, data }),
    removeClassroom: (id: string) => deleteMutation.mutateAsync(id),

    // Helpers
    canDeleteClassroom,
    getFirstOtherIndex,

    // User info
    user,
  };
}
