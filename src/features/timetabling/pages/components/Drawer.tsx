import React from 'react';
import type { DragSource } from '../../types/DragSouuce';
import type { ClassSession } from '../../../classSessions/types/classSession';

type DrawerClassSession = Pick<ClassSession, 'id'> & { displayName: string };

interface DrawerProps {
  // Use a structured object instead of just a string for better data handling
  drawerClassSessions: DrawerClassSession[];
  onDragStart: (e: React.DragEvent, source: DragSource) => void;
  onDropToDrawer: (e: React.DragEvent) => void;
}

/**
 * Drawer component for displaying available (unassigned) class sessions.
 * Allows drag-and-drop to timetable.
 * Single responsibility: only renders the drawer UI and handles drag events.
 */
const Drawer: React.FC<DrawerProps> = ({
  drawerClassSessions: drawerClassSessions,
  onDragStart,
  onDropToDrawer,
}) => {
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  return (
    <div
      className="w-full bg-white p-6 rounded-lg shadow mb-6 md:mb-0"
      onDrop={onDropToDrawer}
      onDragOver={handleDragOver}
    >
      <h3 className="text-xl font-semibold mb-4 text-center">Available Classes</h3>
      <ul className="space-y-2 flex">
        {drawerClassSessions.map((session) => (
          <li
            key={session.id}
            draggable
            onDragStart={(e) => onDragStart(e, { from: 'drawer', class_session_id: session.id })}
            className="p-2 m-2 md:w-1/4 bg-gray-100 rounded cursor-grab text-center hover:bg-gray-200 text-gray-900"
          >
            {session.displayName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Drawer;
