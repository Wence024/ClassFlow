import { useState } from 'react';
import type { DragSource } from '../components/timetabling/Drawer';
import { useTimetable } from './useTimetable';
import { useClassSessions } from './useClassSessions';

// Placeholder for notification callback (to be set by the UI layer)
let notifyConflict: (msg: string) => void = () => {};
export const setNotifyConflict = (fn: (msg: string) => void) => {
  notifyConflict = fn;
};

/**
 * A custom hook to encapsulate all drag-and-drop logic for the scheduler.
 * It manages the drag source state and provides memoized event handlers
 * for drag start, drop on grid, and drop on drawer.
 *
 * This cleans up the Scheduler page component, making it a pure orchestrator
 * of UI components.
 */
export const useTimetableDnd = () => {
  const { classSessions } = useClassSessions();
  const { assignSession, removeSession, moveSession } = useTimetable();
  const [dragSource, setDragSource] = useState<DragSource | null>(null);

  const handleDragStart = (e: React.DragEvent, source: DragSource) => {
    setDragSource(source);
    // Use a generic data type; the important data is in the `dragSource` state
    e.dataTransfer.setData('text/plain', source.sessionId);
  };

  const handleDropToGrid = (e: React.DragEvent, groupIndex: number, periodIndex: number) => {
    e.preventDefault();
    if (!dragSource) return;

    let conflictMsg = '';
    // Case 1: Moving an item within the timetable grid
    if (dragSource.from === 'timetable') {
      conflictMsg = moveSession(
        { groupIndex: dragSource.groupIndex!, periodIndex: dragSource.periodIndex! },
        { groupIndex, periodIndex }
      );
      if (conflictMsg) {
        console.log(conflictMsg);
        notifyConflict(conflictMsg);
      }
    }
    // Case 2: Dragging a new item from the drawer
    else if (dragSource.from === 'drawer') {
      const sessionToAssign = classSessions.find((cs) => cs.id === dragSource.sessionId);
      if (sessionToAssign) {
        conflictMsg = assignSession(groupIndex, periodIndex, sessionToAssign);
        if (conflictMsg) {
          console.log(conflictMsg);
          notifyConflict(conflictMsg);
        }
      }
    }
    setDragSource(null); // Clean up after drop
  };

  const handleDropToDrawer = (e: React.DragEvent) => {
    e.preventDefault();
    // Only handle drops from the timetable grid back to the drawer
    if (dragSource?.from === 'timetable') {
      removeSession(dragSource.groupIndex!, dragSource.periodIndex!);
    }
    setDragSource(null); // Clean up after drop
  };

  return { handleDragStart, handleDropToGrid, handleDropToDrawer };
};