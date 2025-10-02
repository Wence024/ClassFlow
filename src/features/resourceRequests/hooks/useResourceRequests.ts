import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../auth/hooks/useAuth';
import * as service from '../services/resourceRequestService';
import type { ResourceRequestInsert, ResourceRequestUpdate } from '../types/resourceRequest';

export function useResourceRequests() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['resource_requests', user?.id];

  const listQuery = useQuery({
    queryKey,
    queryFn: () => (user ? service.getMyRequests() : Promise.resolve([])),
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: (payload: ResourceRequestInsert) => service.createRequest(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, update }: { id: string; update: ResourceRequestUpdate }) =>
      service.updateRequest(id, update),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    requests: (listQuery.data as any) || [],
    isLoading: listQuery.isLoading,
    error: listQuery.error as Error | null,
    createRequest: createMutation.mutateAsync,
    updateRequest: updateMutation.mutateAsync,
  };
}

export function useDepartmentRequests(departmentId?: string) {
  const queryClient = useQueryClient();
  const queryKey = ['resource_requests', 'dept', departmentId];

  const listQuery = useQuery({
    queryKey,
    queryFn: () => (departmentId ? service.getRequestsForDepartment(departmentId) : Promise.resolve([])),
    enabled: !!departmentId,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, update }: { id: string; update: ResourceRequestUpdate }) =>
      service.updateRequest(id, update),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    requests: (listQuery.data as any) || [],
    isLoading: listQuery.isLoading,
    error: listQuery.error as Error | null,
    updateRequest: updateMutation.mutateAsync,
  };
}
