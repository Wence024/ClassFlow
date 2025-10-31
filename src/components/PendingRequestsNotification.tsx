import { Bell, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../features/auth/hooks/useAuth';
import { Popover, PopoverTrigger, PopoverContent } from './ui';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useEffect } from 'react';

/**
 * Notification dropdown for Program Heads to view the status of their reviewed resource requests.
 * Shows a bell icon with badge count and dropdown list of approved/rejected requests.
 *
 * @returns The RequestStatusNotification component.
 */
export default function RequestStatusNotification() {
  const { user, isProgramHead } = useAuth();
  const queryClient = useQueryClient();

  // Only show for program heads
  if (!isProgramHead()) {
    return null;
  }

  // Fetch reviewed requests (approved or rejected) that haven't been dismissed
  const { data: reviewedRequests = [] } = useQuery({
    queryKey: ['my_reviewed_requests', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('resource_requests')
        .select('*')
        .eq('requester_id', user.id)
        .in('status', ['approved', 'rejected'])
        .eq('dismissed', false)
        .order('reviewed_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const hasNotifications = reviewedRequests.length > 0;

  // Fetch enriched details for each reviewed request
  const { data: enrichedRequests = [] } = useQuery({
    queryKey: ['my_enriched_reviewed_requests', reviewedRequests.map((r) => r.id)],
    queryFn: async () => {
      const enriched = await Promise.all(
        reviewedRequests.map(async (req: any) => {
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
          return { 
            ...req, 
            resource_name: resourceName,
            rejection_message: req.rejection_message as string | null
          };
        })
      );
      return enriched;
    },
    enabled: reviewedRequests.length > 0,
  });

  const handleDismiss = async (requestId: string) => {
    // Optimistically remove from UI
    queryClient.setQueryData(
      ['my_reviewed_requests', user?.id],
      (old: any[]) => old?.filter((req) => req.id !== requestId) || []
    );
    
    try {
      // Mark as dismissed in the database
      const { error } = await supabase
        .from('resource_requests')
        .update({ dismissed: true } as any)
        .eq('id', requestId);
      
      if (error) throw error;
      
      // Refetch to ensure consistency
      await queryClient.invalidateQueries({ queryKey: ['my_reviewed_requests', user?.id] });
      await queryClient.invalidateQueries({ queryKey: ['my_enriched_reviewed_requests'] });
    } catch (error) {
      console.error('Error dismissing notification:', error);
      // Revert optimistic update on error
      await queryClient.invalidateQueries({ queryKey: ['my_reviewed_requests', user?.id] });
    }
  };

  // Real-time subscription for reviewed request updates
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('my-reviewed-requests-realtime')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'resource_requests',
          filter: `requester_id=eq.${user.id}`,
        },
        (payload) => {
          // Only update if status changed to approved or rejected
          if (payload.new.status === 'approved' || payload.new.status === 'rejected') {
            queryClient.invalidateQueries({ queryKey: ['my_reviewed_requests', user.id] });
            queryClient.invalidateQueries({ queryKey: ['my_enriched_reviewed_requests'] });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  // Calculate badge color based on statuses
  const approvedCount = reviewedRequests.filter(r => r.status === 'approved').length;
  const rejectedCount = reviewedRequests.filter(r => r.status === 'rejected').length;
  const badgeColor = rejectedCount > 0 ? 'bg-red-500' : 'bg-green-500';

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
          <Bell className="w-5 h-5" />
          {hasNotifications && (
            <span className={`absolute -top-1 -right-1 ${badgeColor} text-white text-xs rounded-full w-5 h-5 flex items-center justify-center`}>
              {reviewedRequests.length}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="p-3 border-b">
          <h3 className="font-semibold">Request Updates</h3>
          <p className="text-sm text-gray-600">
            {approvedCount > 0 && `${approvedCount} approved`}
            {approvedCount > 0 && rejectedCount > 0 && ', '}
            {rejectedCount > 0 && `${rejectedCount} rejected`}
          </p>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {enrichedRequests.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No reviewed requests</div>
          ) : (
            enrichedRequests.map((request) => (
              <div key={request.id} className="p-3 border-b last:border-b-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {request.status === 'approved' ? (
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                      )}
                      <div className="font-medium text-sm capitalize">
                        {request.resource_type} Request
                      </div>
                    </div>
                    <div className="text-xs text-gray-700 font-medium truncate mt-1">
                      {request.resource_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      Reviewed: {new Date(request.reviewed_at || '').toLocaleDateString()}
                    </div>
                    <div className={`text-xs mt-1 font-medium ${
                      request.status === 'approved' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {request.status === 'approved' ? 'Approved' : 'Rejected'}
                    </div>
                    {request.status === 'rejected' && request.rejection_message && (
                      <div className="text-xs mt-2 p-2 bg-red-50 border border-red-200 rounded">
                        <span className="font-medium text-red-700">Reason: </span>
                        <span className="text-gray-700">{request.rejection_message}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDismiss(request.id)}
                    className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
