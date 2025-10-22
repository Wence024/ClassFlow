import { Bell } from 'lucide-react';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useDepartmentRequests } from '../features/resourceRequests/hooks/useResourceRequests';
import { Popover, PopoverTrigger, PopoverContent, Button } from './ui';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import type { ResourceRequest } from '../features/resourceRequests/types/resourceRequest';

/**
 * Notification dropdown for department heads and admins to review resource requests.
 * Shows a bell icon with badge count and dropdown list of pending requests.
 *
 * @returns The RequestNotifications component.
 */
export default function RequestNotifications() {
  const { isDepartmentHead, isAdmin, departmentId, user } = useAuth();
  const { requests, updateRequest } = useDepartmentRequests(departmentId || undefined);
  const queryClient = useQueryClient();
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  // Only show for department heads and admins
  if (!isDepartmentHead() && !isAdmin()) {
    return null;
  }

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const hasNotifications = pendingRequests.length > 0;

  // Fetch enriched details for each pending request
  const { data: enrichedRequests = [] } = useQuery<(ResourceRequest & { resource_name: string; class_session_id: string })[]>({
    queryKey: ['enriched_requests', pendingRequests.map((r) => r.id)],
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
          return { ...req, resource_name: resourceName, class_session_id: (req as any).class_session_id };
        })
      );
      return enriched;
    },
    enabled: pendingRequests.length > 0,
  });

  const handleApprove = async (requestId: string, classSessionId: string) => {
    setApprovingId(requestId);
    try {
      // Update timetable assignment status to 'confirmed'
      const { error: assignError } = await supabase
        .from('timetable_assignments')
        .update({ status: 'confirmed' } as any)
        .eq('class_session_id', classSessionId);

      if (assignError) throw assignError;

      // Update request status
      await updateRequest({
        id: requestId,
        update: {
          status: 'approved',
          reviewed_by: user?.id || null,
          reviewed_at: new Date().toISOString(),
        },
      });

      // Delete the notification after successful approval
      const { error: notifError } = await supabase
        .from('request_notifications')
        .delete()
        .eq('request_id', requestId);
      
      if (notifError) console.warn('Failed to delete notification:', notifError);

      // Invalidate all affected queries for real-time updates
      await queryClient.refetchQueries({ queryKey: ['hydratedTimetable'] });
      await queryClient.refetchQueries({ queryKey: ['timetable_assignments'] });
      await queryClient.refetchQueries({ queryKey: ['allClassSessions'] });
      await queryClient.refetchQueries({ queryKey: ['resource_requests'] });

      toast.success('Request approved successfully');
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Failed to approve request');
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (requestId: string, classSessionId: string) => {
    setRejectingId(requestId);
    try {
      // Delete timetable assignment
      const { error: assignError } = await supabase
        .from('timetable_assignments')
        .delete()
        .eq('class_session_id', classSessionId);

      if (assignError) console.error('Error deleting assignment:', assignError);

      // Delete class session
      const { error: sessionError } = await supabase
        .from('class_sessions')
        .delete()
        .eq('id', classSessionId);

      if (sessionError) throw sessionError;

      // Update request status
      await updateRequest({
        id: requestId,
        update: {
          status: 'rejected',
          reviewed_by: user?.id || null,
          reviewed_at: new Date().toISOString(),
        },
      });

      // Delete the notification after successful rejection
      const { error: notifError } = await supabase
        .from('request_notifications')
        .delete()
        .eq('request_id', requestId);
      
      if (notifError) console.warn('Failed to delete notification:', notifError);

      // Invalidate all affected queries for real-time updates
      await queryClient.refetchQueries({ queryKey: ['hydratedTimetable'] });
      await queryClient.refetchQueries({ queryKey: ['timetable_assignments'] });
      await queryClient.refetchQueries({ queryKey: ['allClassSessions'] });
      await queryClient.refetchQueries({ queryKey: ['resource_requests'] });

      toast.success('Request rejected successfully');
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject request');
    } finally {
      setRejectingId(null);
    }
  };

  // Real-time subscription for notification updates
  useEffect(() => {
    if (!departmentId) return;

    const channel = supabase
      .channel('request-notifications-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'request_notifications',
          filter: `target_department_id=eq.${departmentId}`,
        },
        () => {
          // Invalidate queries when notifications change
          queryClient.invalidateQueries({ queryKey: ['resource_requests', 'dept', departmentId] });
          queryClient.invalidateQueries({ queryKey: ['enriched_requests'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [departmentId, queryClient]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
          <Bell className="w-5 h-5" />
          {hasNotifications && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {pendingRequests.length}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
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
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="text-xs px-2 py-1 h-6"
                      onClick={() => handleApprove(request.id, request.class_session_id)}
                      disabled={approvingId === request.id || rejectingId === request.id}
                    >
                      {approvingId === request.id ? 'Approving...' : 'Approve'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="text-xs px-2 py-1 h-6"
                      onClick={() => handleReject(request.id, request.class_session_id)}
                      disabled={approvingId === request.id || rejectingId === request.id}
                    >
                      {rejectingId === request.id ? 'Rejecting...' : 'Reject'}
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