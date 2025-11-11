import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import * as service from '../services/resourceRequestService';
import type { ResourceRequest, ResourceRequestInsert, ResourceRequestUpdate } from '../types/resourceRequest';

/**
 * A hook for managing resource requests initiated by the current user.
 *
 * @returns An object with the user's requests, loading state, and mutation functions.
 */
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

  const dismissMutation = useMutation({
    mutationFn: (id: string) => service.dismissRequest(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    requests: (listQuery.data as ResourceRequest[]) || [],
    isLoading: listQuery.isLoading,
    error: listQuery.error as Error | null,
    createRequest: createMutation.mutateAsync,
    updateRequest: updateMutation.mutateAsync,
    dismissRequest: dismissMutation.mutateAsync,
  };
}

/**
 * A hook for managing resource requests targeted at a specific department.
 *
 * @param departmentId - The ID of the department to fetch requests for.
 * @returns An object with the department's requests, loading state, and update mutation.
 */
export function useDepartmentRequests(departmentId?: string) {
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ['resource_requests', 'dept', departmentId], [departmentId]);

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

  const dismissMutation = useMutation({
    mutationFn: (id: string) => service.dismissRequest(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    requests: (listQuery.data as ResourceRequest[]) || [],
    isLoading: listQuery.isLoading,
    error: listQuery.error as Error | null,
    updateRequest: updateMutation.mutateAsync,
    dismissRequest: dismissMutation.mutateAsync,
  };
}

/**
 * A hook for managing the current user's pending resource requests.
 *
 * @returns An object with the user's pending requests and cancellation mutation.
 */
export function useMyPendingRequests() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['my_pending_requests', user?.id];

  const listQuery = useQuery({
    queryKey,
    queryFn: () => (user ? service.getMyRequests() : Promise.resolve([])),
    enabled: !!user,
    select: (data) => data.filter((r) => r.status === 'pending'),
  });

  const cancelMutation = useMutation({
    mutationFn: async (requestId: string) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      return service.cancelRequest(requestId, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ['classSessions'] });
      queryClient.invalidateQueries({ queryKey: ['allClassSessions'] });
      queryClient.invalidateQueries({ queryKey: ['timetable_assignments'] });
      queryClient.invalidateQueries({ queryKey: ['hydratedTimetable'] });
      queryClient.invalidateQueries({ queryKey: ['my_reviewed_requests'] });
    },
  });

  return {
    pendingRequests: (listQuery.data as ResourceRequest[]) || [],
    isLoading: listQuery.isLoading,
    error: listQuery.error as Error | null,
    cancelRequest: cancelMutation.mutateAsync,
    isCancelling: cancelMutation.isPending,
  };
}
