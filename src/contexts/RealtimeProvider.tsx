import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from './__supabaseClient__';
import { useAuth } from '../features/auth/hooks/useAuth';

/**
 * Centralized real-time subscription provider.
 * Subscribes to all critical database changes and invalidates React Query cache.
 * This ensures immediate UI updates across the application without scattered subscriptions.
 */
export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;

    // Subscribe to resource_requests changes
    const resourceRequestsChannel = supabase
      .channel('global_resource_requests')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'resource_requests' },
        (payload) => {
          console.log('[Realtime] resource_requests changed:', payload.eventType);

          // Only invalidate reviewed requests for INSERT/UPDATE events (not DELETE)
          // DELETE events are handled by component-level optimistic updates
          if (payload.eventType !== 'DELETE') {
            queryClient.invalidateQueries({ queryKey: ['resource_requests'], exact: false });
            queryClient.invalidateQueries({ queryKey: ['my_pending_requests'], exact: false });
            queryClient.invalidateQueries({ queryKey: ['my_reviewed_requests'], exact: false });
          }
        }
      )
      .subscribe();

    // Subscribe to request_notifications changes
    const notificationsChannel = supabase
      .channel('global_request_notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'request_notifications' },
        () => {
          console.log('[Realtime] New request notification');
          queryClient.invalidateQueries({ queryKey: ['request-notifications'], exact: false });
        }
      )
      .subscribe();

    // Subscribe to timetable_assignments changes (for approval/rejection updates)
    const timetableChannel = supabase
      .channel('global_timetable_assignments')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'timetable_assignments' },
        () => {
          console.log('[Realtime] timetable_assignments changed');
          queryClient.invalidateQueries({ queryKey: ['timetable_assignments'], exact: false });
          queryClient.invalidateQueries({ queryKey: ['hydratedTimetable'], exact: false });
        }
      )
      .subscribe();

    // Subscribe to class_sessions changes (for cancellations)
    const classSessionsChannel = supabase
      .channel('global_class_sessions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'class_sessions' },
        () => {
          console.log('[Realtime] class_sessions changed');
          queryClient.invalidateQueries({ queryKey: ['classSessions'], exact: false });
          queryClient.invalidateQueries({ queryKey: ['allClassSessions'], exact: false });
        }
      )
      .subscribe();

    console.log('[Realtime] All channels subscribed for user:', user.id);

    return () => {
      console.log('[Realtime] Cleaning up all channels');
      supabase.removeChannel(resourceRequestsChannel);
      supabase.removeChannel(notificationsChannel);
      supabase.removeChannel(timetableChannel);
      supabase.removeChannel(classSessionsChannel);
    };
  }, [user, queryClient]);

  return <>{children}</>;
}
