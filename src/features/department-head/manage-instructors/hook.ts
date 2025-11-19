/**
 * Business logic for managing instructors.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { Instructor, InstructorInsert, InstructorUpdate } from '@/types/instructor';
import {
  fetchInstructors,
  createInstructor,
  modifyInstructor,
  deleteInstructor,
} from './service';

/**
 * Hook for managing instructors with CRUD operations.
 */
export function useManageInstructors() {
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const departmentId = user?.department_id || null;
  const queryKey = ['instructors', user?.id];

  // Fetch instructors
  const {
    data: instructors = [],
    isLoading,
    error,
  } = useQuery<Instructor[]>({
    queryKey,
    queryFn: () =>
      fetchInstructors({
        role: user?.role || '',
        departmentId,
      }),
    enabled: !!user,
  });

  // Create instructor mutation
  const addMutation = useMutation({
    mutationFn: (data: InstructorInsert) => createInstructor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Instructor added successfully!');
    },
    onError: (error: Error) => {
      toast.error('Failed to add instructor', {
        description: error.message,
      });
    },
  });

  // Update instructor mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: InstructorUpdate }) =>
      modifyInstructor(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey });
      
      // Check if department was changed (for admins)
      const instructor = instructors.find((i) => i.id === variables.id);
      const departmentChanged = 
        isAdmin() && 
        instructor?.department_id !== variables.data.department_id;

      if (departmentChanged) {
        toast.success('Instructor updated and reassigned to new department!');
      } else {
        toast.success('Instructor updated successfully!');
      }
    },
    onError: (error: Error) => {
      toast.error('Failed to update instructor', {
        description: error.message,
      });
    },
  });

  // Delete instructor mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteInstructor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Instructor removed successfully.');
    },
    onError: (error: Error) => {
      if (
        error.message.includes('foreign key') ||
        error.message.includes('violates') ||
        error.message.includes('assigned to')
      ) {
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

  /**
   * Validates if an instructor can be deleted.
   */
  const canDeleteInstructor = (instructorId: string, classSessions: any[]): boolean => {
    return !classSessions.some((session) => session.instructor?.id === instructorId);
  };

  return {
    instructors,
    isLoading,
    error: error ? (error as Error).message : null,
    
    // Mutation states
    isSubmitting: addMutation.isPending || updateMutation.isPending,
    isRemoving: deleteMutation.isPending,

    // CRUD operations
    addInstructor: (data: InstructorInsert) => addMutation.mutateAsync(data),
    updateInstructor: (id: string, data: InstructorUpdate) =>
      updateMutation.mutateAsync({ id, data }),
    removeInstructor: (id: string) => deleteMutation.mutateAsync(id),
    
    // Helper
    canDeleteInstructor,
    
    // User info
    user,
    isAdmin: isAdmin(),
    departmentId,
  };
}
