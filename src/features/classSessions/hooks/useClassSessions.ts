// src/features/scheduleLessons/hooks/useClassSessions.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../auth/hooks/useAuth';
import * as classSessionsService from '../services/classSessionsService';
import type { ClassSession, ClassSessionInsert, ClassSessionUpdate } from '../types/classSession';

export function useClassSessions() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['classSessions', user?.id];

  const {
    data: classSessions = [],
    isLoading,
    isFetching,
    error,
  } = useQuery<ClassSession[]>({
    queryKey,
    queryFn: () => (user ? classSessionsService.getClassSessions(user.id) : Promise.resolve([])),
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: (data: ClassSessionInsert) =>
      classSessionsService.addClassSession({ ...data, user_id: user!.id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ClassSessionUpdate }) =>
      classSessionsService.updateClassSession(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => classSessionsService.removeClassSession(id, user!.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const loading =
    isLoading ||
    isFetching ||
    addMutation.isPending ||
    updateMutation.isPending ||
    removeMutation.isPending;

  return {
    classSessions,
    loading,
    error: error ? (error as Error).message : null,
    addClassSession: addMutation.mutateAsync,
    updateClassSession: (id: string, data: ClassSessionUpdate) =>
      updateMutation.mutateAsync({ id, data }),
    removeClassSession: removeMutation.mutateAsync,
  };
}
