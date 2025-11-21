import { Bell, X, MapPin } from 'lucide-react';
import { useAuth } from '../features/shared/auth/hooks/useAuth';
import { useDepartmentRequests } from '@/features/shared/resource-management';
import { Popover, PopoverTrigger, PopoverContent, Button } from './ui';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RejectionDialog from './dialogs/RejectionDialog';
import { getRequestWithDetails } from '@/lib/services/resourceRequestService';
import { Tables } from '../lib/supabase.types';

type ResourceRequest = Tables<'resource_requests'> & {
  dismissed?: boolean;
  rejection_message?: string | null;
};

interface EnrichedRequest extends ResourceRequest {
  resource_name?: string;
  requester_name?: string;
  program_name?: string;
  period_index?: number;
  class_group_id?: string;
}

/**
 * Notification dropdown for department heads and admins to review resource requests.
 * Shows a bell icon with badge count and dropdown list of pending requests.
 *
 * @returns The RequestNotifications component.
 */
export default function RequestNotifications() {
  const { isDepartmentHead, isAdmin, departmentId, user } = useAuth();
  const { requests, dismissRequest } = useDepartmentRequests(departmentId || undefined);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [dismissingId, setDismissingId] = useState<string | null>(null);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [selectedRequestForRejection, setSelectedRequestForRejection] = useState<{
    id: string;
    classSessionId: string;
    resourceName: string;
  } | null>(null);

  // Always compute role/permission after all hooks.
  const allowed = isDepartmentHead() || isAdmin();
  const safeRequests = requests || [];
  const pendingRequests = allowed
    ? safeRequests.filter((r) => r.status === 'pending' && !r.dismissed)
    : [];
  const hasNotifications = allowed && pendingRequests.length > 0;

  // Declare useQuery after all other hooks, always called.
  const { data: enrichedRequests = [] } = useQuery<EnrichedRequest[]>({
    queryKey: ['enriched_requests', pendingRequests.map((r) => r.id)],
    queryFn: async () => {
      const enriched = await Promise.all(
        pendingRequests.map((req) => getRequestWithDetails(req.id))
      );
      return enriched;
    },
    enabled: allowed && pendingRequests.length > 0,
  });

  if (!allowed) return null;

  const handleApprove = async (requestId: string) => {
    setApprovingId(requestId);
    try {
      // Import the new approveRequest function
      const { approveRequest } = await import(
        '@/lib/services/resourceRequestService'
      );

      // Use the atomic approval function (trigger will cleanup notifications)
      await approveRequest(requestId, user?.id || '');

      // Invalidate affected queries (RealtimeProvider handles resource_requests)
      await queryClient.invalidateQueries({ queryKey: ['hydratedTimetable'] });
      await queryClient.invalidateQueries({ queryKey: ['timetable_assignments'] });
      await queryClient.invalidateQueries({ queryKey: ['allClassSessions'] });

      toast.success('Request approved and timetable updated');
    } catch (error) {
      console.error('Error approving request:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to approve request: ${errorMessage}`);
    } finally {
      setApprovingId(null);
    }
  };

  const handleRejectClick = (requestId: string, classSessionId: string, resourceName: string) => {
    setSelectedRequestForRejection({ id: requestId, classSessionId, resourceName });
    setRejectionDialogOpen(true);
  };

  const handleRejectConfirm = async (message: string) => {
    if (!selectedRequestForRejection) return;

    setRejectingId(selectedRequestForRejection.id);
    try {
      const { rejectRequest } = await import(
        '@/lib/services/resourceRequestService'
      );

      // Reject request (trigger will cleanup notifications)
      await rejectRequest(selectedRequestForRejection.id, user?.id || '', message);

      // Invalidate affected queries (RealtimeProvider handles resource_requests)
      await queryClient.invalidateQueries({ queryKey: ['hydratedTimetable'] });
      await queryClient.invalidateQueries({ queryKey: ['timetable_assignments'] });
      await queryClient.invalidateQueries({ queryKey: ['allClassSessions'] });

      toast.success('Request rejected successfully');
      setRejectionDialogOpen(false);
      setSelectedRequestForRejection(null);
    } catch (error) {
      console.error('Error rejecting request:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to reject request: ${errorMessage}`);
    } finally {
      setRejectingId(null);
    }
  };

  const handleDismiss = async (requestId: string) => {
    setDismissingId(requestId);

    // Use stable query key with filtering
    const currentQueryKey = ['enriched_requests', pendingRequests.map((r) => r.id)];

    queryClient.setQueryData(
      currentQueryKey,
      (old: EnrichedRequest[] | undefined) => old?.filter((req) => req.id !== requestId) || []
    );

    try {
      await dismissRequest(requestId);

      // Wait for propagation
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Invalidate department requests with exact match
      await queryClient.invalidateQueries({
        queryKey: ['resource_requests', 'dept', departmentId],
        exact: true,
      });

      toast.success('Request dismissed');
    } catch (error) {
      console.error('Error dismissing request:', error);
      toast.error('Failed to dismiss request');

      // Revert optimistic update
      await queryClient.invalidateQueries({
        queryKey: currentQueryKey,
        exact: true,
      });
    } finally {
      setDismissingId(null);
    }
  };

  const handleSeeInTimetable = (
    _classSessionId: string,
    periodIndex?: number,
    classGroupId?: string
  ) => {
    if (periodIndex !== undefined && classGroupId) {
      // Navigate to timetable with highlight parameters
      navigate(`/scheduler?highlightPeriod=${periodIndex}&highlightGroup=${classGroupId}`);
      toast.info('Highlighted session in timetable');
    } else {
      toast.error('Timetable position not available');
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button 
          data-cy="resource-requests-bell"
          className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Bell className="w-5 h-5" />
          {hasNotifications && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {pendingRequests.length}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0" data-cy="resource-requests-popover">
        <div className="p-3 border-b">
          <h3 className="font-semibold">Resource Requests</h3>
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
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm capitalize">
                        {request.resource_type} Request
                      </div>
                      <div className="text-xs text-gray-700 font-medium truncate">
                        {request.resource_name || 'Unknown Resource'}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Requested by:{' '}
                        <span className="font-medium text-gray-700">
                          {request.requester_name || 'Unknown User'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Program:{' '}
                        <span className="font-medium text-gray-700">
                          {request.program_name || 'Unknown Program'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(request.requested_at || '').toLocaleDateString()}
                      </div>
                    </div>
                    <Button
                      data-cy={`dismiss-request-button-${request.id}`}
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => handleDismiss(request.id)}
                      disabled={
                        approvingId === request.id ||
                        rejectingId === request.id ||
                        dismissingId === request.id
                      }
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-1 flex-wrap">
                    <Button
                      data-cy={`approve-request-button-${request.id}`}
                      size="sm"
                      variant="secondary"
                      className="text-xs px-2 py-1 h-7"
                      onClick={() => handleApprove(request.id)}
                      disabled={
                        approvingId === request.id ||
                        rejectingId === request.id ||
                        dismissingId === request.id
                      }
                    >
                      {approvingId === request.id ? 'Approving...' : 'Approve'}
                    </Button>
                    <Button
                      data-cy={`reject-request-button-${request.id}`}
                      size="sm"
                      variant="destructive"
                      className="text-xs px-2 py-1 h-7"
                      onClick={() =>
                        handleRejectClick(
                          request.id,
                          request.class_session_id,
                          request.resource_name || 'Resource'
                        )
                      }
                      disabled={
                        approvingId === request.id ||
                        rejectingId === request.id ||
                        dismissingId === request.id
                      }
                    >
                      {rejectingId === request.id ? 'Rejecting...' : 'Reject'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs px-2 py-1 h-7 flex items-center gap-1"
                      onClick={() =>
                        handleSeeInTimetable(
                          request.class_session_id,
                          request.period_index,
                          request.class_group_id
                        )
                      }
                      disabled={
                        approvingId === request.id ||
                        rejectingId === request.id ||
                        dismissingId === request.id
                      }
                    >
                      <MapPin className="h-3 w-3" />
                      See in Timetable
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
      <RejectionDialog
        open={rejectionDialogOpen}
        onOpenChange={setRejectionDialogOpen}
        onConfirm={handleRejectConfirm}
        isLoading={rejectingId !== null}
        resourceName={selectedRequestForRejection?.resourceName}
      />
    </Popover>
  );
}
