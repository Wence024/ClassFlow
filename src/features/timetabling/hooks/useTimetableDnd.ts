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
   * Checks if a specific timetable slot is available for dropping a class session.
   *
   * @param groupId The ID of the target class group.
   * @param periodIndex The index of the target period.
   * @returns True if the slot is available for the current drag operation, false otherwise.
   */
  const isSlotAvailable = useCallback(
    (groupId: string, periodIndex: number): boolean => {
      if (!activeDraggedSession || !settings) {
        console.warn('[TimetableDnd] isSlotAvailable: abort', {
          reason: !settings ? 'no-settings' : 'no-activeDraggedSession',
          groupId,
          periodIndex,
          activeDragSource,
          userProgramId: user?.program_id,
        });
        return false;
      }

      // This prevents the slot from even appearing available (green) if the user is not the owner.
      if (
        activeDragSource?.from === 'timetable' &&
        activeDraggedSession.program_id !== user?.program_id
      ) {
        return false;
      }

  // View-specific validation for moving sessions:
  // - Class-group view: Only allow moving within the same group row
  // - Classroom view: Only allow moving within the same classroom row
  // - Instructor view: Only allow moving within the same instructor row
  if (activeDragSource?.from === 'timetable') {
    switch (viewMode) {
      case 'class-group':
        if (activeDragSource.class_group_id !== groupId) {
          return false;
        }
        break;
      case 'classroom':
        if (activeDraggedSession.classroom.id !== groupId) {
          return false;
        }
        break;
      case 'instructor':
        if (activeDraggedSession.instructor.id !== groupId) {
          return false;
        }
        break;
    }
  }

  // View-specific validation for drawer-to-timetable assignments:
  // - Class-group view: Only allow assigning to the session's own class group row
  // - Classroom view: Only allow assigning to the session's assigned classroom row
  // - Instructor view: Only allow assigning to the session's assigned instructor row
  if (activeDragSource?.from === 'drawer') {
    switch (viewMode) {
      case 'class-group':
        if (activeDraggedSession.group.id !== groupId) {
          return false;
        }
        break;
      case 'classroom':
        if (activeDraggedSession.classroom.id !== groupId) {
          return false;
        }
        break;
      case 'instructor':
        if (activeDraggedSession.instructor.id !== groupId) {
          return false;
        }
        break;
    }
  }

      const isMovingSession = activeDragSource?.from === 'timetable';
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

      // Parse the source data from the data transfer
      const source: DragSource = JSON.parse(e.dataTransfer.getData(DRAG_DATA_KEY));

      // Find the class session to drop
      const classSessionToDrop = allClassSessions.find((cs) => cs.id === source.class_session_id);

      if (!classSessionToDrop) {
        console.error('[TimetableDnd] dropToGrid: class session not found', {
          source,
          userId: user?.id,
          userProgramId: user?.program_id,
          classSessionsCount: allClassSessions.length,
        });
        // Show notification if the class session could not be found
        toast('Error', { description: 'Could not find the class session to drop.' });
        cleanupDragState();
        return;
      }

      // Add final client-side safeguard before mutation
      if (source.from === 'timetable' && classSessionToDrop.program_id !== user?.program_id) {
        toast('Error', {
          description: 'You can only move sessions that belong to your own program.',
        });
        cleanupDragState();
        return;
      }

      // TEMPORARY VALIDATION - Remove when implementing direct resource reassignment via timetable
      // Future enhancement: Allow users to change classroom/instructor assignments by dragging to different rows
      // For now, enforce that moves can only happen within the same resource row
      if (source.from === 'timetable') {
        let resourceMismatchError = '';
        
        switch (viewMode) {
          case 'classroom':
            if (classSessionToDrop.classroom.id !== targetClassGroupId) {
              resourceMismatchError = `Cannot move this session to a different classroom. This session is assigned to "${classSessionToDrop.classroom.name}". To reassign the classroom, please go to Manage Classes page.`;
            }
            break;
          case 'instructor':
            if (classSessionToDrop.instructor.id !== targetClassGroupId) {
              const instructorName = `${classSessionToDrop.instructor.first_name} ${classSessionToDrop.instructor.last_name}`;
              resourceMismatchError = `Cannot move this session to a different instructor. This session is assigned to "${instructorName}". To reassign the instructor, please go to Manage Classes page.`;
            }
            break;
          case 'class-group':
            if (source.class_group_id !== targetClassGroupId) {
              resourceMismatchError = `Cannot move this session to a different class group. This session belongs to "${classSessionToDrop.group.name}".`;
            }
            break;
        }
        
        if (resourceMismatchError) {
          toast('Move Restricted', { 
            description: resourceMismatchError
          });
          cleanupDragState();
          return;
        }
      }

      // In non-class-group views, the targetClassGroupId is the UI row ID (classroom/instructor),
      // but the DB needs the actual class_group_id from the session
      const dbTargetGroupId = viewMode === 'class-group' 
        ? targetClassGroupId 
        : classSessionToDrop.group.id;

      console.debug('[TimetableDnd] dropToGrid', {
        viewMode,
        uiTargetRowId: targetClassGroupId,
        dbTargetGroupId,
        targetPeriodIndex,
        source,
        sessionId: classSessionToDrop.id,
      });

      try {
        let error = '';
        if (source.from === 'drawer') {
          // Assign the class session to the target location
          error = await assignClassSession(dbTargetGroupId, targetPeriodIndex, classSessionToDrop);
        } else if (source.from === 'timetable') {
          // For non-class-group views, only compare period since we're within the same row
          const isSameCell = viewMode === 'class-group'
            ? (source.class_group_id === targetClassGroupId && source.period_index === targetPeriodIndex)
            : (source.period_index === targetPeriodIndex);

          // Abort silently if the source and target are the same
          if (isSameCell) {
            cleanupDragState();
            return;
          }
          
          error = await moveClassSession(
            { class_group_id: source.class_group_id, period_index: source.period_index },
            { class_group_id: dbTargetGroupId, period_index: targetPeriodIndex },
            classSessionToDrop
          );
        }

        if (error) {
          console.error('[TimetableDnd] dropToGrid: mutation error', {
            error,
            source,
            targetClassGroupId,
            targetPeriodIndex,
            viewMode,
          });
          toast('Error', { description: error });
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error('[TimetableDnd] dropToGrid: uncaught error', {
          error: errorMsg,
          source,
          targetClassGroupId,
          targetPeriodIndex,
          viewMode,
        });
        toast('Error', { description: errorMsg });
      } finally {
        // Always clean up the drag state
        cleanupDragState();
      }
    },
    [allClassSessions, assignClassSession, moveClassSession, cleanupDragState, user, viewMode]
  );

  /**
   * Handles dropping a class session back to the drawer (unassign).
   * 
   * Removes the session from the timetable if it was dragged from the grid.
   * 
   * @param e - The drag event object.
   * @returns {Promise<void>}
   */
  const handleDropToDrawer = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      const source: DragSource = JSON.parse(e.dataTransfer.getData(DRAG_DATA_KEY));

      console.debug('[TimetableDnd] dropToDrawer', { source });

      if (source.from === 'timetable') {
        await removeClassSession(source.class_group_id, source.period_index);
      }

      cleanupDragState();
    },
    [removeClassSession, cleanupDragState]
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