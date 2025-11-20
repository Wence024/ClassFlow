/**
 * Hook for managing pending resource requests view.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetchMyRequests, dismissRequest, cancelMyRequest } from './service';
import type { ResourceRequest } from '@/types/resourceRequest';

/**
 *
 * @param userId
 */
export function useViewPendingRequests(userId?: string) {
  const queryClient = useQueryClient();

  const requestsQuery = useQuery({
    queryKey: ['my-resource-requests'],
    queryFn: fetchMyRequests,
    enabled: !!userId,
  });

  const dismissMutation = useMutation({
    mutationFn: dismissRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-resource-requests'] });
      toast.success('Request dismissed');
    },
    onError: (error) => {
      console.error('Error dismissing request:', error);
      toast.error('Failed to dismiss request');
    },
  });

  const cancelMutation = useMutation({
    mutationFn: ({ requestId, requesterId }: { requestId: string; requesterId: string }) =>
      cancelMyRequest(requestId, requesterId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-resource-requests'] });
      queryClient.invalidateQueries({ queryKey: ['timetable'] });
      toast.success('Request cancelled successfully');
    },
    onError: (error) => {
      console.error('Error cancelling request:', error);
      toast.error('Failed to cancel request');
    },
  });

  const handleDismiss = (requestId: string) => {
    dismissMutation.mutate(requestId);
  };

  const handleCancel = (request: ResourceRequest) => {
    if (!userId) {
      toast.error('User ID is required to cancel a request');
      return;
    }
    cancelMutation.mutate({ requestId: request.id, requesterId: userId });
  };

  return {
    requests: requestsQuery.data || [],
    isLoading: requestsQuery.isLoading,
    error: requestsQuery.error,
    isDismissing: dismissMutation.isPending,
    isCancelling: cancelMutation.isPending,
    handleDismiss,
    handleCancel,
    refetch: requestsQuery.refetch,
  };
}
