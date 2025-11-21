/**
 * Hook for managing class sessions (CRUD operations).
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '@/features/shared/auth/hooks/useAuth';
import * as service from './service';  // Use service layer
import type { ClassSessionInsert, ClassSessionUpdate, CrossDepartmentInfo } from './types';

/**
 * Hook providing class session management capabilities.
 */
export function useManageClassSessions() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['classSessions', user?.id];

  // Fetch sessions for user
  const {
    data: sessions = [],
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => (user ? service.getClassSessions(user.id) : Promise.resolve([])),
    enabled: !!user,
  });

  // Create session
  const createMutation = useMutation({
    mutationFn: (data: ClassSessionInsert) => {
      if (!user || !user.program_id) {
        throw new Error('Cannot create class session: User is not assigned to a program.');
      }
      return service.createClassSession(data, user.program_id, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Class session created successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to create class session', { description: error.message });
    },
  });

  // Update session
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ClassSessionUpdate }) =>
      service.updateClassSession(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Class session updated successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to update class session', { description: error.message });
    },
  });

  // Delete session
  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      if (!user?.id) {
        throw new Error('Cannot delete class session: User not authenticated.');
      }
      return service.deleteClassSession(id, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Class session deleted successfully');
    },
    onError: (error: Error) => {
      if (error.message.includes('foreign key') || error.message.includes('violates')) {
        toast.error('Cannot delete class session', {
          description: 'This class session is being used in timetable assignments.',
        });
      } else {
        toast.error('Failed to delete class session', { description: error.message });
      }
    },
  });

  /**
   * Checks if selected resources require cross-department approval.
   *
   * @param instructorId
   * @param classroomId
   */
  const checkCrossDepartment = async (
    instructorId?: string,
    classroomId?: string
  ): Promise<CrossDepartmentInfo | null> => {
    if (!user?.program_id) return null;
    if (!instructorId && !classroomId) return null;
    try {
      // Use service layer function
      return await service.checkCrossDepartmentResources(instructorId, classroomId);
    } catch (error) {
      console.error('Error checking cross-department resources:', error);
      return null;
    }
  };

  return {
    sessions,
    isLoading: isLoading || isFetching,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    error: error ? (error as Error).message : null,
    createSession: createMutation.mutateAsync,
    updateSession: (id: string, data: ClassSessionUpdate) => updateMutation.mutateAsync({ id, data }),
    deleteSession: deleteMutation.mutateAsync,  // For consistency
    removeClassSession: deleteMutation.mutateAsync,  // For test compatibility
    checkCrossDepartment,
  };
}
