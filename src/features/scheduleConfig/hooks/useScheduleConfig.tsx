import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../auth/hooks/useAuth';
import * as scheduleConfigService from '../services/scheduleConfigService';
import type { ScheduleConfigUpdate, ScheduleConfig } from '../types/scheduleConfig';

/**
 * React hook for managing schedule configuration settings.
 * Provides functionality to fetch and update schedule settings for the authenticated user.
 *
 * @returns An object containing the schedule settings, an update function, loading and updating states, and any error.
 */
export function useScheduleConfig() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['scheduleConfig', user?.id];

  const {
    data: settings,
    isLoading,
    error,
  } = useQuery<ScheduleConfig | null>({
    queryKey,
    queryFn: () => (user ? scheduleConfigService.getScheduleConfig() : null),
    enabled: !!user,
  });

  const updateMutation = useMutation({
    mutationFn: (updatedSettings: ScheduleConfigUpdate) => {
      if (!user) throw new Error('User not authenticated');

      // Use upsert function which handles both create and update
      return scheduleConfigService.upsertScheduleConfig(updatedSettings);
    },
    onSuccess: (updatedData) => {
      queryClient.setQueryData(queryKey, updatedData);
    },
  });

  return {
    settings,
    updateSettings: updateMutation.mutateAsync,
    isLoading,
    isUpdating: updateMutation.isPending,
    error,
  };
}
