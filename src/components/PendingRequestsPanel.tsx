import { Clock, X } from 'lucide-react';
import { useAuth } from '../features/auth/hooks/useAuth';
import { Popover, PopoverTrigger, PopoverContent, Button } from './ui';
import { useMyPendingRequests } from '../features/resourceRequests/hooks/useResourceRequests';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { useState } from 'react';

/**
 * Notification dropdown for Program Heads to view and cancel their pending resource requests.
 * Shows a clock icon with badge count and dropdown list of pending requests.
 *
 * @returns The PendingRequestsPanel component.
 */
export default function PendingRequestsPanel() {
  const { isProgramHead } = useAuth();
  const { pendingRequests, cancelRequest, isCancelling } = useMyPendingRequests();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const hasPendingRequests = pendingRequests.length > 0;

  // Fetch enriched details for each pending request
  const { data: enrichedRequests = [] } = useQuery({
    queryKey: ['my_enriched_pending_requests', pendingRequests.map((r) => r.id)],
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
    enabled: pendingRequests.length > 0 && isProgramHead(),
  });

  const handleCancel = async (requestId: string) => {
    setCancellingId(requestId);
    try {
      await cancelRequest(requestId);
      toast.success('Request cancelled successfully');
    } catch (error) {
      console.error('Error cancelling request:', error);
      toast.error('Failed to cancel request');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
          <Clock className="w-5 h-5" />
          {hasPendingRequests && (
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
            {pendingRequests.length} awaiting department head review
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
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <div className="font-medium text-sm capitalize">
                        {request.resource_type} Request
                      </div>
                    </div>
                    <div className="text-xs text-gray-700 font-medium truncate mt-1">
                      {request.resource_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      Requested: {new Date(request.requested_at || '').toLocaleDateString()}
                    </div>
                    <div className="text-xs mt-1 text-blue-600 font-medium">Awaiting approval</div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCancel(request.id)}
                    disabled={cancellingId === request.id || isCancelling}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
