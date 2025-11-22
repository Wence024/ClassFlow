/**
 * Business logic hook for Schedule Class Session use case.
 * 
 * This hook encapsulates all the business logic for scheduling class sessions
 * on the timetable, including conflict detection, drag-and-drop, and state management.
 */

import { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '@/features/shared/auth/hooks/useAuth';
import { useActiveSemester } from '@/features/admin/schedule-config/hooks/useActiveSemester';
import * as timetableService from '@/lib/services/timetableService';
import type {
  AssignSessionParams,
  MoveSessionParams,
  RemoveSessionParams,
  TimetableDragState,
  TimetableViewMode,
} from './types';
import type { ClassSession } from '@/types/classSession';

/**
 * Hook for managing timetable scheduling workflow.
 *
 * @param _viewMode - The view mode for the timetable (default is 'class-group').
 * @returns An object containing the state and functions for scheduling class sessions.
 */
export function useScheduleClassSession(_viewMode: TimetableViewMode = 'class-group') {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const activeSemesterQuery = useActiveSemester();
  const activeSemester = activeSemesterQuery.data;
  
  const [dragState, setDragState] = useState<TimetableDragState>({
    draggedSession: null,
    dragSource: null,
    hoveredCell: null,
  });

  // Fetch timetable assignments
  const { data: assignments = [], isLoading: isLoadingAssignments } = useQuery({
    queryKey: ['timetableAssignments', activeSemester?.id],
    queryFn: () => timetableService.getTimetableAssignments(activeSemester!.id),
    enabled: !!activeSemester,
  });

  // Mutation for assigning a session
  const assignMutation = useMutation({
    mutationFn: (params: AssignSessionParams) => {
      if (!user?.id || !activeSemester?.id) {
        throw new Error('User or semester not available');
      }
      return timetableService.assignClassSessionToTimetable({
        class_session_id: params.classSessionId,
        class_group_id: params.classGroupId,
        period_index: params.periodIndex,
        user_id: user.id,
        semester_id: activeSemester.id,
      }, params.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetableAssignments'] });
      toast.success('Session scheduled successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to schedule session', {
        description: error.message,
      });
    },
  });

  // Mutation for moving a session
  const moveMutation = useMutation({
    mutationFn: (params: MoveSessionParams) => {
      if (!user?.id || !activeSemester?.id) {
        throw new Error('User or semester not available');
      }
      const fromCell = {
        class_group_id: params.fromClassGroupId,
        period_index: params.fromPeriodIndex,
        semester_id: activeSemester.id,
      };

      const toCell = {
        class_group_id: params.toClassGroupId,
        period_index: params.toPeriodIndex,
        semester_id: activeSemester.id,
      };

      return timetableService.moveClassSession(
        fromCell,
        toCell,
        params.classSessionId,
        user.id
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetableAssignments'] });
      toast.success('Session moved successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to move session', {
        description: error.message,
      });
    },
  });

  // Mutation for removing a session
  const removeMutation = useMutation({
    mutationFn: (params: RemoveSessionParams) => {
      if (!activeSemester?.id) {
        throw new Error('Semester not available');
      }
      return timetableService.removeClassSessionFromTimetable(
        params.classGroupId,
        params.periodIndex,
        activeSemester.id
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetableAssignments'] });
      toast.success('Session removed from timetable');
    },
    onError: (error: Error) => {
      toast.error('Failed to remove session', {
        description: error.message,
      });
    },
  });

  /**
   * Handles drag start event.
   *
   * @param session - The class session being dragged.
   * @param source - The source location of the drag operation.
   */
  const handleDragStart = useCallback((session: ClassSession, source: TimetableDragState['dragSource']) => {
    setDragState({
      draggedSession: session,
      dragSource: source,
      hoveredCell: null,
    });
  }, []);

  /**
   * Handles drag end event.
   */
  const handleDragEnd = useCallback(() => {
    setDragState({
      draggedSession: null,
      dragSource: null,
      hoveredCell: null,
    });
  }, []);

  return {
    // State
    assignments,
    dragState,
    isLoading: isLoadingAssignments,
    
    // Mutations
    assignSession: assignMutation.mutateAsync,
    moveSession: moveMutation.mutateAsync,
    removeSession: removeMutation.mutateAsync,
    
    // Loading states
    isAssigning: assignMutation.isPending,
    isMoving: moveMutation.isPending,
    isRemoving: removeMutation.isPending,
    
    // Helpers
    handleDragStart,
    handleDragEnd,
    
    // Context
    activeSemester,
  };
}
