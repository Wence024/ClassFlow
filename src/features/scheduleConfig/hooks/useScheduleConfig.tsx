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
      // The user check is still good for authorization context.
      if (!user) throw new Error('User not authenticated');

      // Add a guard to ensure the settings object (and its ID) has been loaded.
      if (!settings?.id) {
        throw new Error('Schedule configuration has not been loaded yet.');
      }

      // Call the updated service function with the correct parameters.
      return scheduleConfigService.updateScheduleConfig(settings.id, updatedSettings);
    },
    onSuccess: (updatedData) => {
      // Optimistically update the cache with the new data from the server.
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
