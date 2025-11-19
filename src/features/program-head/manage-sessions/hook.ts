/**
 * Hook for managing class sessions.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetchSessions, updateSession, deleteSession } from './service';
import type { ClassSessionUpdate } from '@/types/classSession';
import { useMemo } from 'react';
import type { SessionFilters } from './types';

export function useManageSessions(userId: string | undefined, filters?: SessionFilters) {
  const queryClient = useQueryClient();

  const sessionsQuery = useQuery({
    queryKey: ['class-sessions', userId],
    queryFn: () => fetchSessions(userId!),
    enabled: !!userId,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, update }: { id: string; update: ClassSessionUpdate }) =>
      updateSession(id, update),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['class-sessions'] });
      toast.success('Session updated successfully');
    },
    onError: (error) => {
      console.error('Error updating session:', error);
      toast.error('Failed to update session');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ sessionId, userId }: { sessionId: string; userId: string }) =>
      deleteSession(sessionId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['class-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['timetable'] });
      toast.success('Session deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting session:', error);
      toast.error('Failed to delete session');
    },
  });

  const filteredSessions = useMemo(() => {
    if (!sessionsQuery.data || !filters) return sessionsQuery.data || [];

    return sessionsQuery.data.filter((session) => {
      if (filters.courseId && session.course?.id !== filters.courseId) return false;
      if (filters.classGroupId && session.group?.id !== filters.classGroupId) return false;
      if (filters.instructorId && session.instructor?.id !== filters.instructorId) return false;
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        const courseName = session.course?.name?.toLowerCase() || '';
        const courseCode = session.course?.code?.toLowerCase() || '';
        const groupName = session.group?.name?.toLowerCase() || '';
        const groupCode = session.group?.code?.toLowerCase() || '';
        
        if (
          !courseName.includes(term) &&
          !courseCode.includes(term) &&
          !groupName.includes(term) &&
          !groupCode.includes(term)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [sessionsQuery.data, filters]);

  const handleUpdate = (id: string, update: ClassSessionUpdate) => {
    updateMutation.mutate({ id, update });
  };

  const handleDelete = (id: string) => {
    if (!userId) {
      toast.error('User ID is required to delete a session');
      return;
    }
    deleteMutation.mutate({ sessionId: id, userId });
  };

  return {
    sessions: filteredSessions,
    allSessions: sessionsQuery.data || [],
    isLoading: sessionsQuery.isLoading,
    error: sessionsQuery.error,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    handleUpdate,
    handleDelete,
    refetch: sessionsQuery.refetch,
  };
}
