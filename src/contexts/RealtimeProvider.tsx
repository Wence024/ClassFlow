import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
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
        () => {
          console.log('[Realtime] resource_requests changed');
          queryClient.refetchQueries({ queryKey: ['resource_requests'] });
          queryClient.refetchQueries({ queryKey: ['my_pending_requests'] });
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
          queryClient.refetchQueries({ queryKey: ['request-notifications'] });
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
          queryClient.refetchQueries({ queryKey: ['timetable_assignments'] });
          queryClient.refetchQueries({ queryKey: ['hydratedTimetable'] });
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
          queryClient.refetchQueries({ queryKey: ['classSessions'] });
          queryClient.refetchQueries({ queryKey: ['allClassSessions'] });
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
