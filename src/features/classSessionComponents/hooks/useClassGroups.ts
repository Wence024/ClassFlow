import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../auth/useAuth';
import * as classGroupsService from '../services/classGroupsService';
import type { ClassGroup, ClassGroupInsert, ClassGroupUpdate } from '../types/classGroup';

export function useClassGroups() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['classGroups', user?.id];

  const {
    data: classGroups = [],
    isLoading,
    isFetching,
    error,
  } = useQuery<ClassGroup[]>({
    queryKey,
    queryFn: () => (user ? classGroupsService.getClassGroups(user.id) : Promise.resolve([])),
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: (data: ClassGroupInsert) =>
      classGroupsService.addClassGroup({ ...data, user_id: user!.id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ClassGroupUpdate }) =>
      classGroupsService.updateClassGroup(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => classGroupsService.removeClassGroup(id, user!.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const loading =
    isLoading ||
    isFetching ||
    addMutation.isPending ||
    updateMutation.isPending ||
    removeMutation.isPending;

  return {
    classGroups,
    loading,
    error: error ? (error as Error).message : null,
    addClassGroup: addMutation.mutateAsync,
    updateClassGroup: (id: string, data: ClassGroupUpdate) =>
      updateMutation.mutateAsync({ id, data }),
    removeClassGroup: removeMutation.mutateAsync,
  };
}
