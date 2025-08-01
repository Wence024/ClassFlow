import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../auth/hooks/useAuth';
import * as scheduleConfigService from '../services/scheduleConfigService';
import type { ScheduleConfigUpdate } from '../types/scheduleConfig';

export function useScheduleConfig() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['schdeduleConfig', user?.id];

  const {
    data: settings,
    isLoading,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => (user ? scheduleConfigService.getScheduleConfig(user.id) : null),
    enabled: !!user,
  });

  const updateMutation = useMutation({
    mutationFn: (updatedSettings: ScheduleConfigUpdate) => {
      if (!user) throw new Error('User not authenticated');
      return scheduleConfigService.updateScheduleConfig(user.id, updatedSettings);
    },
    onSuccess: (updatedData) => {
      // Update the cache immediately with the new data
      queryClient.setQueryData(queryKey, updatedData);
      // Optionally, invalidate other queries that depend on this data
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
