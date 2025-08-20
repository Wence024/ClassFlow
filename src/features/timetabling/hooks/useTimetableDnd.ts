import { useCallback } from 'react';
import { useTimetable } from './useTimetable';
import { showNotification } from '../../../lib/notificationsService';
import type { DragSource } from '../types/DragSource';
import { useClassSessions } from '../../classSessions/hooks/useClassSessions';

/** The key used to store drag-and-drop data in the DataTransfer object. */
const DRAG_DATA_KEY = 'application/json';

/**
 * A custom hook to encapsulate all drag-and-drop (DnD) logic for the timetable.
 *
 * This hook builds upon the `useTimetable` hook. It provides a set of pre-configured
 * event handlers (`onDragStart`, `onDrop`) that can be attached to the draggable elements
 * (in the sidebar) and the droppable targets (grid cells and the sidebar itself).
 * It handles serializing/deserializing drag data, calling the appropriate mutation
 * from `useTimetable`, and displaying notifications for any conflicts.
 *
 * @returns An object containing the necessary event handlers for DnD functionality.
 */
export const useTimetableDnd = () => {
  const { assignClassSession, removeClassSession, moveClassSession } = useTimetable();
  const { classSessions } = useClassSessions(); // Needed to find the full session object on drop.

  /**
   * `onDragStart` handler for draggable elements.
   * Serializes the source information and stores it in the browser's dataTransfer store.
   */
  const handleDragStart = useCallback((e: React.DragEvent, source: DragSource) => {
    e.dataTransfer.setData(DRAG_DATA_KEY, JSON.stringify(source));
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  /**
   * `onDrop` handler for the timetable grid cells.
   * It determines if the action is an "assign" or a "move" and calls the appropriate
   * method from `useTimetable`, aborting the action if a session is dropped onto its own head period.
   *
   * @param {React.DragEvent} e - The drop event.
   * @param {string} targetClassGroupId - The ID of the group (row) where the drop occurred.
   * @param {number} targetPeriodIndex - The index of the period (column) where the drop occurred.
   */
  const handleDropToGrid = useCallback(
    async (e: React.DragEvent, targetClassGroupId: string, targetPeriodIndex: number) => {
      e.preventDefault();
      const source: DragSource = JSON.parse(e.dataTransfer.getData(DRAG_DATA_KEY));

      const classSessionToDrop = classSessions.find((cs) => cs.id === source.class_session_id);
      if (!classSessionToDrop) {
        showNotification('Error: Could not find the class session to drop.');
        return;
      }

      let error = '';
      if (source.from === 'drawer') {
        // Handle dropping a new session from the sidebar onto the grid.
        error = await assignClassSession(targetClassGroupId, targetPeriodIndex, classSessionToDrop);
      } else if (source.from === 'timetable') {
        // --- PRECISE SELF-DROP CHECK ---
        // A "no-op" is only when a session is dropped onto the exact same starting cell.
        const isSameCell =
          source.class_group_id === targetClassGroupId && source.period_index === targetPeriodIndex;

        // If the drop is on the exact same starting cell, it's a no-op.
        if (isSameCell) {
          return; // Abort the operation silently.
        }
        // --- END SELF-DROP CHECK ---

        // Handle moving a session from one grid cell to another.
        error = await moveClassSession(
          { class_group_id: source.class_group_id, period_index: source.period_index },
          { class_group_id: targetClassGroupId, period_index: targetPeriodIndex },
          classSessionToDrop
        );
      }

      // If the mutation returned a conflict message, display it.
      if (error) {
        showNotification(error);
      }
    },
    [classSessions, assignClassSession, moveClassSession]
  );

  /**
   * `onDrop` handler for the sidebar/drawer area.
   * This handles "un-assigning" a class session by dragging it from the grid
   * back to the drawer.
   */
  const handleDropToDrawer = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      const source: DragSource = JSON.parse(e.dataTransfer.getData(DRAG_DATA_KEY));

      // Only act if the drag originated from the timetable.
      if (source.from === 'timetable') {
        await removeClassSession(source.class_group_id, source.period_index);
      }
    },
    [removeClassSession]
  );

  return {
    handleDragStart,
    handleDropToGrid,
    handleDropToDrawer,
  };
};
