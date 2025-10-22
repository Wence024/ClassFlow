import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import * as service from '../services/resourceRequestService';
import type { ResourceRequest, ResourceRequestInsert, ResourceRequestUpdate } from '../types/resourceRequest';
import { supabase } from '../../../lib/supabase';

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

  return {
    requests: (listQuery.data as ResourceRequest[]) || [],
    isLoading: listQuery.isLoading,
    error: listQuery.error as Error | null,
    createRequest: createMutation.mutateAsync,
    updateRequest: updateMutation.mutateAsync,
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

  // Real-time subscription for department requests
  useEffect(() => {
    if (!departmentId) return;
    
    const channel = supabase
      .channel('dept_resource_requests')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'resource_requests',
          filter: `target_department_id=eq.${departmentId}`
        },
        () => queryClient.invalidateQueries({ queryKey })
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [departmentId, queryClient, queryKey]);

  return {
    requests: (listQuery.data as ResourceRequest[]) || [],
    isLoading: listQuery.isLoading,
    error: listQuery.error as Error | null,
    updateRequest: updateMutation.mutateAsync,
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
      const { supabase } = await import('../../../lib/supabase');
      
      // Get the request to find the class_session_id
      const { data: request, error: reqError } = await supabase
        .from('resource_requests')
        .select('resource_id')
        .eq('id', requestId)
        .single();
      
      if (reqError) throw reqError;
      
      // Delete timetable assignment first (by class_session_id)
      const { error: assignError } = await supabase
        .from('timetable_assignments')
        .delete()
        .eq('class_session_id', request.resource_id);
      
      if (assignError) console.error('Error deleting assignment:', assignError);
      
      // Delete class session
      const { error: sessionError } = await supabase
        .from('class_sessions')
        .delete()
        .eq('id', request.resource_id);
      
      if (sessionError) throw sessionError;
      
      // Delete the request itself
      const { error: delError } = await supabase
        .from('resource_requests')
        .delete()
        .eq('id', requestId);
      
      if (delError) throw delError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ['classSessions'] });
      queryClient.invalidateQueries({ queryKey: ['allClassSessions'] });
      queryClient.invalidateQueries({ queryKey: ['timetable_assignments'] });
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
