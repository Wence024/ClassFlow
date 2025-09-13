import React from 'react';
import type { DragSource } from '../../types/DragSource';
import type { ClassSession } from '../../../classSessions/types/classSession';

/** Represents the minimal data needed to display a class session in the drawer. */
type DrawerClassSession = Pick<ClassSession, 'id'> & { displayName: string };

/**
 * Props for the Drawer component.
 *
 * @param drawerClassSessions - An array of unassigned class sessions to be displayed.
 * @param onDragStart - The handler to call when dragging starts.
 * @param onDropToDrawer - The handler to call when something is dropped on the drawer.
 * @returns The rendered Drawer component.
 */
interface DrawerProps {
  /** An array of unassigned class sessions to be displayed. */
  drawerClassSessions: DrawerClassSession[];
  /** The `onDragStart` handler from the `useTimetableDnd` hook. */
  onDragStart: (e: React.DragEvent, source: DragSource) => void;
  /** The `onDrop` handler for the drawer area from the `useTimetableDnd` hook. */
  onDropToDrawer: (e: React.DragEvent) => void;
}

/**
 * A UI component that displays the list of unassigned class sessions.
 *
 * This component renders a list of draggable pills for each class session not yet on the timetable.
 * It also acts as a droppable target for class sessions dragged from the timetable, effectively unassigning them.
 *
 * @param d The props for the component.
 * @param d.drawerClassSessions - An array of unassigned class sessions to be displayed.
 * @param d.onDragStart - The `onDragStart` handler from the `useTimetableDnd` hook.
 * @param d.onDropToDrawer - The handler to call when something is dropped on the drawer.
 * @returns The rendered drawer component.
 */
const Drawer: React.FC<DrawerProps> = ({ drawerClassSessions, onDragStart, onDropToDrawer }) => {
  // Prevents the browser's default drag over behavior to enable custom drop actions.
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className="w-full bg-white p-4 rounded-lg shadow mt-6"
      onDrop={onDropToDrawer}
      onDragOver={handleDragOver}
      aria-label="Available Classes Drawer"
    >
      <h3 className="text-lg font-semibold mb-3 text-center text-gray-700">Available Classes</h3>
      {drawerClassSessions.length > 0 ? (
        <ul className="flex flex-wrap gap-2 justify-center">
          {drawerClassSessions.map((session) => (
            <li
              key={session.id}
              draggable
              onDragStart={(e) => onDragStart(e, { from: 'drawer', class_session_id: session.id })}
              className="px-3 py-2 bg-gray-100 rounded-md cursor-grab text-sm text-gray-800 hover:bg-gray-200 transition-colors"
              aria-label={`Draggable session: ${session.displayName}`}
            >
              {session.displayName}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 py-4">All classes have been scheduled.</p>
      )}
    </div>
  );
};

export default Drawer;
