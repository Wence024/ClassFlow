/**
 * Business logic hook for Create Class Session use case.
 * 
 * This hook encapsulates all the business logic for creating class sessions,
 * including validation, cross-department checks, and state management.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '@/features/auth/hooks/useAuth';
import * as service from './service';
import type { CreateClassSessionFormData, CrossDepartmentInfo } from './types';

/**
 * Hook for managing class session creation workflow.
 */
export function useCreateClassSession() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateClassSessionFormData) => {
      if (!user?.program_id) {
        throw new Error('Cannot create class session: User is not assigned to a program.');
      }
      // Add user context to the session data
      const sessionData = { 
        ...data, 
        user_id: user.id, 
        program_id: user.program_id 
      };
      return service.createClassSession(sessionData);
    },
    onSuccess: () => {
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['classSessions'] });
      toast.success('Class session created successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to create class session', {
        description: error.message,
      });
    },
  });

  /**
   * Checks if the selected resources require cross-department approval.
   */
  const checkCrossDepartment = async (
    instructorId: string,
    classroomId: string | null
  ): Promise<CrossDepartmentInfo | null> => {
    try {
      return await service.checkCrossDepartmentResources(
        instructorId,
        classroomId
      );
    } catch (error) {
      console.error('Error checking cross-department resources:', error);
      return null;
    }
  };

  return {
    createClassSession: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    checkCrossDepartment,
  };
}
