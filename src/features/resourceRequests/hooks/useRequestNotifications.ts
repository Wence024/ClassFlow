import { useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../auth/hooks/useAuth';
import * as service from '../services/notificationsService';
import type { RequestNotification } from '../services/notificationsService';
import { supabase } from '../../../lib/supabase';

/**
 * Hook for cross-department request notifications.
 * - Lists unread dept notifications.
 * - Subscribes to realtime inserts.
 * - Provides markRead mutation.
 *
 * @returns An object with notifications data, loading state, and mutation functions.
 */
export function useRequestNotifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ['request-notifications', user?.department_id || null], [user?.department_id]);

  const listQuery = useQuery({
    queryKey,
    queryFn: () => (user ? service.getUnreadForDepartment() : Promise.resolve([])),
    enabled: !!user,
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => service.markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel('request_notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'request_notifications' },
        () => queryClient.refetchQueries({ queryKey })
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient, queryKey]);

  return {
    notifications: (listQuery.data as RequestNotification[]) || [],
    isLoading: listQuery.isLoading,
    error: (listQuery.error as Error) || null,
    markRead: markReadMutation.mutateAsync,
  };
}
