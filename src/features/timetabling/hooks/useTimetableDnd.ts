import { useState, useCallback, useEffect } from 'react';
import { useTimetable } from './useTimetable';
import { useClassSessions } from '../../classSessions/hooks/useClassSessions';
import { useScheduleConfig } from '../../scheduleConfig/hooks/useScheduleConfig';
import { toast } from 'sonner';
import checkTimetableConflicts from '../utils/checkConflicts';
import type { DragSource } from '../types/DragSource';
import type { ClassSession } from '../../classSessions/types/classSession';
import { usePrograms } from '../../programs/hooks/usePrograms';
import { useAuth } from '../../auth/hooks/useAuth';

const DRAG_DATA_KEY = 'application/json';

/**
 * A consolidated hook to manage the entire lifecycle of drag-and-drop (D&D)
 * operations for the timetable. It handles UI state, visual feedback,
 * event handling, and data mutations.
 *
 * @returns An object containing all necessary state and handlers for D&D functionality.
 */
export const useTimetableDnd = () => {
  // --- Core Hooks ---
  const { user } = useAuth();
  const { timetable, assignClassSession, removeClassSession, moveClassSession } = useTimetable();
  const { classSessions } = useClassSessions();
  const { settings } = useScheduleConfig();
  const { programs } = usePrograms();

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

  const isSlotAvailable = useCallback(
    (groupId: string, periodIndex: number): boolean => {
      if (!activeDraggedSession || !settings) return false;

      // This prevents the slot from even appearing available (green) if the user is not the owner.
      if (
        activeDragSource?.from === 'timetable' &&
        activeDraggedSession.program_id !== user?.program_id
      ) {
        return false;
      }

      // Disallow moving a session to a different group row when dragging from the grid
      if (activeDragSource?.from === 'timetable' && activeDragSource.class_group_id !== groupId) {
        return false;
      }

      const conflictMessage = checkTimetableConflicts(
        timetable,
        activeDraggedSession,
        settings,
        groupId,
        periodIndex,
        programs
      );

      return conflictMessage === '';
    },
    [activeDraggedSession, settings, timetable, activeDragSource, user, programs]
  );

  // --- Event Handlers ---

  const handleDragStart = useCallback(
    (e: React.DragEvent, source: DragSource) => {
      const session = classSessions.find((cs) => cs.id === source.class_session_id) || null;
      e.dataTransfer.setData(DRAG_DATA_KEY, JSON.stringify(source));
      e.dataTransfer.effectAllowed = 'move';

      setActiveDragSource(source);
      setActiveDraggedSession(session);
    },
    [classSessions]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDragEnter = useCallback(
    (e: React.DragEvent, groupId: string, periodIndex: number) => {
      e.stopPropagation();
      setDragOverCell({ groupId, periodIndex });
    },
    []
  );

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
   * @param targetClassGroupId - The ID of the target class group.
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
      const classSessionToDrop = classSessions.find((cs) => cs.id === source.class_session_id);

      if (!classSessionToDrop) {
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

      let error = '';
      if (source.from === 'drawer') {
        // Assign the class session to the target location
        error = await assignClassSession(targetClassGroupId, targetPeriodIndex, classSessionToDrop);
      } else if (source.from === 'timetable') {
        // Move the class session to the target location
        const isSameCell =
          source.class_group_id === targetClassGroupId && source.period_index === targetPeriodIndex;

        // Abort silently if the source and target are the same
        if (isSameCell) {
          cleanupDragState();
          return; // Abort silently
        }
        error = await moveClassSession(
          { class_group_id: source.class_group_id, period_index: source.period_index },
          { class_group_id: targetClassGroupId, period_index: targetPeriodIndex },
          classSessionToDrop
        );
      }

      if (error) {
        // Show notification if there was an error
        toast('Error', { description: error });
      }

      // Clean up the drag state
      cleanupDragState();
    },
    [classSessions, assignClassSession, moveClassSession, cleanupDragState, user]
  );

  const handleDropToDrawer = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      const source: DragSource = JSON.parse(e.dataTransfer.getData(DRAG_DATA_KEY));

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
