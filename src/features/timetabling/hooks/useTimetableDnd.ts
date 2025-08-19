import { useCallback } from 'react';
import { useTimetable } from './useTimetable';
import { showNotification } from '../../../lib/notificationsService';
import type { DragSource } from '../types/DragSource'; // Corrected import name
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
   * Serializes the source information (where the drag originated and what is being dragged)
   * and stores it in the browser's dataTransfer store.
   *
   * @param {React.DragEvent} e - The drag event.
   * @param {DragSource} source - An object describing the drag source.
   */
  const handleDragStart = useCallback((e: React.DragEvent, source: DragSource) => {
    e.dataTransfer.setData(DRAG_DATA_KEY, JSON.stringify(source));
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  /**
   * `onDrop` handler for the timetable grid cells.
   * It parses the source data from the event and determines whether the action is
   * an "assign" (from the drawer) or a "move" (from another grid cell).
   * It then calls the appropriate method from `useTimetable`.
   *
   * @param {React.DragEvent} e - The drop event.
   * @param {string} class_group_id - The ID of the group (row) where the drop occurred.
   * @param {number} period_index - The index of the period (column) where the drop occurred.
   */
  const handleDropToGrid = useCallback(
    async (e: React.DragEvent, class_group_id: string, period_index: number) => {
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
        error = await assignClassSession(class_group_id, period_index, classSessionToDrop);
      } else if (source.from === 'timetable') {
        // Handle moving a session from one grid cell to another.
        error = await moveClassSession(
          { class_group_id: source.class_group_id, period_index: source.period_index },
          { class_group_id, period_index },
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
   *
   * @param {React.DragEvent} e - The drop event.
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
