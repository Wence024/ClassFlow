import { useState, useCallback, useEffect, useMemo } from 'react';
import { useTimetable } from './useTimetable';
import { useScheduleConfig } from '../../scheduleConfig/hooks/useScheduleConfig';
import { toast } from 'sonner';
import checkTimetableConflicts from '../utils/checkConflicts';
import type { DragSource } from '../types/DragSource';
import type { ClassSession } from '../../classSessions/types/classSession';
import { usePrograms } from '../../programs/hooks/usePrograms';
import { useAuth } from '../../auth/hooks/useAuth';
import type { TimetableViewMode } from '../types/timetable';

const DRAG_DATA_KEY = 'application/json';

/**
 * A consolidated hook to manage the entire lifecycle of drag-and-drop (D&D)
 * operations for the timetable. It handles UI state, visual feedback,
 * event handling, and data mutations.
 *
 * @param allClassSessions - All class sessions visible to the user (not just their own).
 * @param viewMode - The current timetable view mode for view-specific validation.
 * @returns An object containing all necessary state and handlers for D&D functionality.
 */
export const useTimetableDnd = (allClassSessions: ClassSession[], viewMode: TimetableViewMode = 'class-group') => {
  // --- Core Hooks ---
  const { user } = useAuth();
  const { timetable, assignClassSession, removeClassSession, moveClassSession } = useTimetable(viewMode);
  const { settings } = useScheduleConfig();
  const { listQuery } = usePrograms();
  const programs = useMemo(() => listQuery.data || [], [listQuery.data]);

  // --- D&D State ---
  const [activeDragSource, setActiveDragSource] = useState<DragSource | null>(null);
  const [activeDraggedSession, setActiveDraggedSession] = useState<ClassSession | null>(null);
  const [dragOverCell, setDragOverCell] = useState<{ groupId: string; periodIndex: number } | null>(
    null
  );

  // --- State Cleanup ---

  const cleanupDragState = useCallback(() => {
    setActiveDragSource(null);
    setActiveDraggedSession(null);
    setDragOverCell(null);
  }, []);

  // Global listeners to ensure state is always cleaned up.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If the user presses Escape during a drag, clean up the state.
      if (e.key === 'Escape') {
        cleanupDragState();
      }
    };

    // The 'dragend' event fires when a drag operation concludes (e.g., drop or cancel).
    document.addEventListener('dragend', cleanupDragState);
    // The 'keydown' listener provides a fallback for cancellation via the Escape key.
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('dragend', cleanupDragState);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [cleanupDragState]);

  // --- Visual Feedback Logic ---

  /**
   * Validates if a drag-and-drop action is compliant with the current view mode rules.
   *
   * @param viewMode - The current timetable view mode.
   * @param source - The drag source.
   * @param draggedSession - The session being dragged.
   * @param targetGroupId - The ID of the target row.
   * @returns `true` if the move is allowed, `false` otherwise.
   */
  const isViewModeCompliant = (
    viewMode: TimetableViewMode,
    source: DragSource,
    draggedSession: ClassSession,
    targetGroupId: string
  ): boolean => {
    if (source.from === 'timetable') {
      switch (viewMode) {
        case 'class-group':
          return source.class_group_id === targetGroupId;
        case 'classroom':
          return draggedSession.classroom.id === targetGroupId;
        case 'instructor':
          return draggedSession.instructor.id === targetGroupId;
      }
    } else if (source.from === 'drawer') {
      switch (viewMode) {
        case 'class-group':
          return draggedSession.group.id === targetGroupId;
        case 'classroom':
          return draggedSession.classroom.id === targetGroupId;
        case 'instructor':
          return draggedSession.instructor.id === targetGroupId;
      }
    }
    return false; // Should not be reached
  };

  /**
   * Checks if a specific timetable slot is available for dropping a class session.
   *
   * @param groupId The ID of the target class group.
   * @param periodIndex The index of the target period.
   * @returns True if the slot is available for the current drag operation, false otherwise.
   */
  const isSlotAvailable = useCallback(
    (groupId: string, periodIndex: number): boolean => {
      if (!activeDraggedSession || !settings || !activeDragSource) {
        return false;
      }

      // This prevents the slot from even appearing available (green) if the user is not the owner.
      if (
        activeDragSource.from === 'timetable' &&
        activeDraggedSession.program_id !== user?.program_id
      ) {
        return false;
      }

      if (!isViewModeCompliant(viewMode, activeDragSource, activeDraggedSession, groupId)) {
        return false;
      }

      const isMovingSession = activeDragSource.from === 'timetable';
      const conflictMessage = checkTimetableConflicts(
        timetable,
        activeDraggedSession,
        settings,
        groupId,
        periodIndex,
        programs,
        viewMode,
        isMovingSession
      );

      return conflictMessage === '';
    },
    [activeDraggedSession, settings, timetable, activeDragSource, user, programs, viewMode]
  );

  // --- Event Handlers ---

  const getResourceMismatchError = (
    viewMode: TimetableViewMode,
    session: ClassSession,
    source: DragSource,
    targetId: string
  ): string => {
    if (source.from !== 'timetable') return '';

    switch (viewMode) {
      case 'classroom':
        if (session.classroom.id !== targetId) {
          return `Cannot move this session to a different classroom. This session is assigned to "${session.classroom.name}". To reassign the classroom, please go to Manage Classes page.`;
        }
        break;
      case 'instructor':
        if (session.instructor.id !== targetId) {
          const instructorName = `${session.instructor.first_name} ${session.instructor.last_name}`;
          return `Cannot move this session to a different instructor. This session is assigned to "${instructorName}". To reassign the instructor, please go to Manage Classes page.`;
        }
        break;
      case 'class-group':
        if (source.class_group_id !== targetId) {
          return `Cannot move this session to a different class group. This session belongs to "${session.group.name}".`;
        }
        break;
    }
    return '';
  };

  const executeDropMutation = useCallback(async (
    source: DragSource,
    session: ClassSession,
    dbTargetGroupId: string,
    targetPeriodIndex: number
  ) => {
    if (source.from === 'drawer') {
      return assignClassSession(dbTargetGroupId, targetPeriodIndex, session);
    } else if (source.from === 'timetable') {
      const isSameCell = viewMode === 'class-group'
        ? (source.class_group_id === dbTargetGroupId && source.period_index === targetPeriodIndex)
        : (source.period_index === targetPeriodIndex);

      if (isSameCell) return ''; // Abort silently

      return moveClassSession(
        { class_group_id: source.class_group_id, period_index: source.period_index },
        { class_group_id: dbTargetGroupId, period_index: targetPeriodIndex },
        session
      );
    }
    return 'Invalid drag source';
  }, [assignClassSession, moveClassSession, viewMode]);

  /**
   * Initiates a drag operation for a class session.
   * 
   * Sets up the drag state and attaches the drag source data to the event.
   * 
   * @param e - The drag event object.
   * @param source - The drag source containing session and location information.
   */
  const handleDragStart = useCallback(
    (e: React.DragEvent, source: DragSource) => {
      const session = allClassSessions.find((cs) => cs.id === source.class_session_id) || null;
      e.dataTransfer.setData(DRAG_DATA_KEY, JSON.stringify(source));
      e.dataTransfer.effectAllowed = 'move';

      console.debug('[TimetableDnd] dragStart', {
        source,
        foundSession: !!session,
        classSessionsCount: allClassSessions.length,
      });

      setActiveDragSource(source);
      setActiveDraggedSession(session);
    },
    [allClassSessions]
  );

  /**
   * Handles the drag over event to enable drop zones.
   * 
   * @param e - The drag event object.
   */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  /**
   * Handles the drag enter event to update visual feedback.
   * 
   * @param e - The drag event object.
   * @param groupId - The ID of the entered class group.
   * @param periodIndex - The index of the entered period.
   */
  const handleDragEnter = useCallback(
    (e: React.DragEvent, groupId: string, periodIndex: number) => {
      e.stopPropagation();
      setDragOverCell({ groupId, periodIndex });
    },
    []
  );

  /**
   * Handles the drag leave event to clear visual feedback.
   * 
   * @param e - The drag event object.
   */
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    const currentTarget = e.currentTarget as HTMLElement;
    const related = e.relatedTarget as Node | null;
    if (!related || !currentTarget.contains(related)) {
      setDragOverCell(null);
    }
  }, []);

  /**
   * Handles the drop event from the drag and drop functionality.
   *
   * @param e - The drag event object.
   * @param targetClassGroupId - The ID of the target row (group/classroom/instructor depending on view).
   * @param targetPeriodIndex - The index of the target period.
   * @returns {void}
   */
  const handleDropToGrid = useCallback(
    async (e: React.DragEvent, targetClassGroupId: string, targetPeriodIndex: number) => {
      e.preventDefault();
      e.stopPropagation();

      const rawData = e.dataTransfer.getData(DRAG_DATA_KEY);
      if (!rawData) {
        cleanupDragState();
        return;
      }

      let source: DragSource;
      try {
        source = JSON.parse(rawData);
      } catch (err) {
        console.error('[TimetableDnd] Failed to parse drag data', err);
        toast('Error', { description: 'Invalid drag data' });
        cleanupDragState();
        return;
      }

      const classSessionToDrop = allClassSessions.find((cs) => cs.id === source.class_session_id);

      if (!classSessionToDrop) {
        toast('Error', { description: 'Could not find the class session to drop.' });
        cleanupDragState();
        return;
      }

      if (source.from === 'timetable' && classSessionToDrop.program_id !== user?.program_id) {
        toast('Error', { description: 'You can only move sessions that belong to your own program.' });
        cleanupDragState();
        return;
      }

      const resourceMismatchError = getResourceMismatchError(viewMode, classSessionToDrop, source, targetClassGroupId);
      if (resourceMismatchError) {
        toast('Move Restricted', { description: resourceMismatchError });
        cleanupDragState();
        return;
      }

      const dbTargetGroupId = viewMode === 'class-group' ? targetClassGroupId : classSessionToDrop.group.id;

      try {
        const error = await executeDropMutation(source, classSessionToDrop, dbTargetGroupId, targetPeriodIndex);
        if (error) {
          toast('Error', { description: error });
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        toast('Error', { description: errorMsg });
      } finally {
        cleanupDragState();
      }
    },
    [allClassSessions, cleanupDragState, user, viewMode, executeDropMutation]
  );

  /**
   * Handles dropping a class session back to the drawer (unassign).
   * 
   * Shows a confirmation dialog before removing cross-department sessions.
   * 
   * @param e - The drag event object.
   * @param onConfirm - Callback to show confirmation dialog.
   * @returns {Promise<void>}
   */
  const handleDropToDrawer = useCallback(
    async (e: React.DragEvent, onConfirm?: (callback: () => void) => void) => {
      e.preventDefault();
      const source: DragSource = JSON.parse(e.dataTransfer.getData(DRAG_DATA_KEY));

      console.debug('[TimetableDnd] dropToDrawer', { source });

      if (source.from === 'timetable') {
        const session = allClassSessions.find((cs) => cs.id === source.class_session_id);
        
        // Check if this is a cross-department session with a pending or confirmed status
        if (session && onConfirm) {
          const hasCrossDeptResource = 
            (session.instructor.department_id && session.instructor.department_id !== user?.program_id) ||
            (session.classroom.preferred_department_id && session.classroom.preferred_department_id !== user?.program_id);

          if (hasCrossDeptResource) {
            // Show confirmation dialog
            onConfirm(async () => {
              await removeClassSession(source.class_group_id, source.period_index);
              
              // Cancel any active resource requests for this session
              const { supabase } = await import('../../../lib/supabase');
              await supabase
                .from('resource_requests')
                .delete()
                .eq('class_session_id', session.id)
                .in('status', ['pending', 'approved']);
              
              toast('Session removed and department head notified');
            });
            cleanupDragState();
            return;
          }
        }
        
        // Normal removal without confirmation
        await removeClassSession(source.class_group_id, source.period_index);
      }

      cleanupDragState();
    },
    [removeClassSession, cleanupDragState, allClassSessions, user]
  );

  return {
    // State
    activeDraggedSession,
    dragOverCell,
    // Visual Feedback
    isSlotAvailable,
    // Event Handlers
    handleDragStart,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDropToGrid,
    handleDropToDrawer,
  };
};