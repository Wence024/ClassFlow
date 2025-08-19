import React from 'react';
import type { DragSource } from '../../types/DragSource';
import type { ClassSession } from '../../../classSessions/types/classSession';

/** Represents the minimal data needed to display a class session in the drawer. */
type DrawerClassSession = Pick<ClassSession, 'id'> & { displayName: string };

/**
 * Props for the Drawer component.
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
 * This component serves two main purposes:
 * 1. It renders a list of draggable "pills" for each class session not yet on the timetable.
 * 2. It acts as a droppable target for class sessions dragged from the timetable,
 *    effectively "un-assigning" them.
 *
 * All drag-and-drop logic is delegated to the handlers provided via props from the `useTimetableDnd` hook.
 *
 * @param {DrawerProps} props - The props for the component.
 */
const Drawer: React.FC<DrawerProps> = ({ drawerClassSessions, onDragStart, onDropToDrawer }) => {
  /** Prevents the browser's default drag behavior to enable a custom drop action. */
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

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
