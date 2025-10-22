import { Clock } from 'lucide-react';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useMyPendingRequests } from '../features/resourceRequests/hooks/useResourceRequests';
import { Popover, PopoverTrigger, PopoverContent, Button } from './ui';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { useEffect } from 'react';

/**
 * Notification dropdown for Program Heads to view and cancel their own pending resource requests.
 * Shows a clock icon with badge count and dropdown list of pending requests.
 *
 * @returns The PendingRequestsNotification component.
 */
export default function PendingRequestsNotification() {
  const { user, isProgramHead } = useAuth();
  const { pendingRequests, cancelRequest, isCancelling } = useMyPendingRequests();
  const queryClient = useQueryClient();

  // Only show for program heads
  if (!isProgramHead()) {
    return null;
  }

  const hasNotifications = pendingRequests.length > 0;

  // Fetch enriched details for each pending request
  const { data: enrichedRequests = [] } = useQuery({
    queryKey: ['my_enriched_requests', pendingRequests.map((r) => r.id)],
    queryFn: async () => {
      const enriched = await Promise.all(
        pendingRequests.map(async (req) => {
          let resourceName = 'Unknown';
          if (req.resource_type === 'instructor') {
            const { data } = await supabase
              .from('instructors')
              .select('first_name, last_name')
              .eq('id', req.resource_id)
              .single();
            if (data) resourceName = `${data.first_name} ${data.last_name}`;
          } else if (req.resource_type === 'classroom') {
            const { data } = await supabase
              .from('classrooms')
              .select('name')
              .eq('id', req.resource_id)
              .single();
            if (data) resourceName = data.name;
          }
          return { ...req, resource_name: resourceName };
        })
      );
      return enriched;
    },
    enabled: pendingRequests.length > 0,
  });

  const handleCancel = async (requestId: string) => {
    try {
      await cancelRequest(requestId);
      
      // Invalidate department request queries so bell icon updates
      queryClient.invalidateQueries({ queryKey: ['resource_requests', 'dept'] });
      queryClient.invalidateQueries({ queryKey: ['hydratedTimetable'] });
      
      toast.success('Request cancelled successfully');
    } catch (error) {
      console.error('Error cancelling request:', error);
      toast.error('Failed to cancel request');
    }
  };

  // Real-time subscription for pending request updates
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('my-pending-requests-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'resource_requests',
          filter: `requester_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['my_pending_requests', user.id] });
          queryClient.invalidateQueries({ queryKey: ['my_enriched_requests'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
          <Clock className="w-5 h-5" />
          {hasNotifications && (
            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {pendingRequests.length}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="p-3 border-b">
          <h3 className="font-semibold">My Pending Requests</h3>
          <p className="text-sm text-gray-600">
            {pendingRequests.length} pending request{pendingRequests.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {enrichedRequests.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No pending requests</div>
          ) : (
            enrichedRequests.map((request) => (
              <div key={request.id} className="p-3 border-b last:border-b-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm capitalize">
                      {request.resource_type} Request
                    </div>
                    <div className="text-xs text-gray-700 font-medium truncate">
                      {request.resource_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(request.requested_at || '').toLocaleDateString()}
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      Awaiting approval
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button
                      size="sm"
                      variant="destructive"
                      className="text-xs px-2 py-1 h-6"
                      onClick={() => handleCancel(request.id)}
                      disabled={isCancelling}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
