import { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../auth/useAuth';
import { useClassGroups } from '../../classComponents/hooks/';
import * as timetableService from '../services/timetableService';
import checkConflicts from '../utils/checkConflicts';
import { buildTimetableGrid } from '../utils/timetableLogic';
import { supabase } from '../../../lib/supabase';
import { useScheduleConfig } from '../../scheduleConfig/useScheduleConfig'; // Import the new hook
import type { ClassSession } from '../../classes/classSession';
import type { HydratedTimetableAssignment } from '../types/timetable';

export function useTimetable() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { classGroups } = useClassGroups();
  const queryKey = useMemo(() => ['hydratedTimetable', user?.id], [user?.id]);
  const [channelId] = useState(() => Math.random().toString(36).slice(2));
  const { settings } = useScheduleConfig();

  // Define a default to prevent crashes while settings are loading
  const totalPeriods = settings ? settings.periods_per_day * settings.class_days_per_week : 8;

  const {
    data: assignments = [],
    isFetching,
    error: errorAssignments,
  } = useQuery<HydratedTimetableAssignment[]>({
    queryKey,
    queryFn: () => (user ? timetableService.getTimetableAssignments(user.id) : Promise.resolve([])),
    enabled: !!user && classGroups.length > 0,
  });

  const timetable = useMemo(
    // Pass the dynamic totalPeriods to our logic function
    () => buildTimetableGrid(assignments, classGroups, totalPeriods),
    [assignments, classGroups, totalPeriods]
  );

  // --- Real-time Subscription Logic (CORRECTED) ---
  useEffect(() => {
    if (!user) return;

    // Use the unique channelId to ensure no conflicts between tabs/clients.
    const channel = supabase
      .channel(`timetable-realtime-${channelId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'timetable_assignments',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Real-time change received!', payload);
          queryClient.invalidateQueries({ queryKey });
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Successfully subscribed to channel: timetable-realtime-${channelId}`);
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('Real-time channel error:', err);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
    // The dependency array is now stable.
  }, [user, queryClient, queryKey, channelId]);

  // ... (The rest of the file - mutations, returned object, etc. - is unchanged) ...
  const moveClassSessionMutation = useMutation({
    mutationFn: (variables: {
      from: { class_group_id: string; period_index: number };
      to: { class_group_id: string; period_index: number };
      classSession: ClassSession;
    }) => {
      if (!user) throw new Error('User not authenticated');
      return timetableService.moveClassSessionInTimetable(user.id, variables.from, variables.to, {
        user_id: user.id,
        class_group_id: variables.to.class_group_id,
        period_index: variables.to.period_index,
        class_session_id: variables.classSession.id,
      });
    },
    onMutate: async (movedItem) => {
      await queryClient.cancelQueries({ queryKey });
      const previousAssignments = queryClient.getQueryData<HydratedTimetableAssignment[]>(queryKey);

      queryClient.setQueryData<HydratedTimetableAssignment[]>(queryKey, (old) => {
        if (!old) return [];
        const assignmentToMove = old.find(
          (a) =>
            a.class_group_id === movedItem.from.class_group_id &&
            a.period_index === movedItem.from.period_index
        );
        if (!assignmentToMove) return old;
        const newAssignment = {
          ...assignmentToMove,
          class_group_id: movedItem.to.class_group_id,
          period_index: movedItem.to.period_index,
        };
        return [
          ...old.filter(
            (a) =>
              !(
                a.class_group_id === movedItem.from.class_group_id &&
                a.period_index === movedItem.from.period_index
              )
          ),
          newAssignment,
        ];
      });
      return { previousAssignments };
    },
    onError: (_err, _movedItem, context) => {
      queryClient.setQueryData(queryKey, context?.previousAssignments);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const removeClassSessionMutation = useMutation({
    mutationFn: (variables: { class_group_id: string; period_index: number }) => {
      if (!user) throw new Error('User not authenticated');
      return timetableService.removeClassSessionFromTimetable(
        user.id,
        variables.class_group_id,
        variables.period_index
      );
    },
    onMutate: async (removedItem) => {
      await queryClient.cancelQueries({ queryKey });
      const previousAssignments = queryClient.getQueryData<HydratedTimetableAssignment[]>(queryKey);

      queryClient.setQueryData<HydratedTimetableAssignment[]>(queryKey, (old) =>
        old
          ? old.filter(
              (a) =>
                !(
                  a.class_group_id === removedItem.class_group_id &&
                  a.period_index === removedItem.period_index
                )
            )
          : []
      );
      return { previousAssignments };
    },
    onError: (_err, _removedItem, context) => {
      queryClient.setQueryData(queryKey, context?.previousAssignments);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const assignClassSessionMutation = useMutation({
    mutationFn: (variables: {
      class_group_id: string;
      period_index: number;
      classSession: ClassSession;
    }) => {
      if (!user) throw new Error('User not authenticated');
      return timetableService.assignClassSessionToTimetable({
        user_id: user.id,
        class_group_id: variables.class_group_id,
        period_index: variables.period_index,
        class_session_id: variables.classSession.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const assignClassSession = async (
    class_group_id: string,
    period_index: number,
    classSession: ClassSession
  ): Promise<string> => {
    const conflict = checkConflicts(timetable, classSession, class_group_id, period_index);
    if (conflict) return conflict;
    try {
      await assignClassSessionMutation.mutateAsync({
        class_group_id,
        period_index,
        classSession: classSession,
      });
      return '';
    } catch {
      return 'Failed to assign class.';
    }
  };

  const removeClassSession = async (class_group_id: string, period_index: number): Promise<void> => {
    try {
      await removeClassSessionMutation.mutateAsync({ class_group_id, period_index });
    } catch {
      console.error('Failed to remove class.');
    }
  };

  const moveClassSession = async (
    from: { class_group_id: string; period_index: number },
    to: { class_group_id: string; period_index: number },
    classSession: ClassSession
  ): Promise<string> => {
    const conflict = checkConflicts(timetable, classSession, to.class_group_id, to.period_index, from);
    if (conflict) return conflict;
    try {
      await moveClassSessionMutation.mutateAsync({ from, to, classSession: classSession });
      return '';
    } catch {
      return 'Failed to move class.';
    }
  };

  const loading =
    isFetching ||
    assignClassSessionMutation.isPending ||
    removeClassSessionMutation.isPending ||
    moveClassSessionMutation.isPending;

  return {
    groups: classGroups,
    timetable,
    assignClassSession,
    removeClassSession,
    moveClassSession,
    loading,
    error: errorAssignments,
  };
}
