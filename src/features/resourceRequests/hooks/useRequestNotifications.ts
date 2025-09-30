import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../auth/hooks/useAuth';
import * as service from '../services/notificationsService';

/**
 * Hook for cross-department request notifications.
 * - Lists unread dept notifications
 * - Subscribes to realtime inserts
 * - Provides markRead
 */
export function useRequestNotifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['request-notifications', (user as any)?.department_id || null];

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
    const channel = (window as any).supabase
      ?.channel('request_notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'request_notifications' },
        () => queryClient.invalidateQueries({ queryKey })
      )
      .subscribe();
    return () => {
      channel?.unsubscribe?.();
    };
  }, [user, queryClient]);

  return {
    notifications: (listQuery.data as any) || [],
    isLoading: listQuery.isLoading,
    error: (listQuery.error as Error) || null,
    markRead: markReadMutation.mutateAsync,
  };
}


