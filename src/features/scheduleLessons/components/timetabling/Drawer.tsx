import React from 'react';

export type DragSource = {
  from: 'drawer' | 'timetable';
  className: string;
  groupIndex?: number;
  periodIndex?: number;
};

interface DrawerProps {
  drawerClasses: string[];
  onDragStart: (e: React.DragEvent, source: DragSource) => void;
  onDropToDrawer: (e: React.DragEvent) => void;
}

/**
 * Drawer component for displaying available (unassigned) class sessions.
 * Allows drag-and-drop to timetable.
 * Single responsibility: only renders the drawer UI and handles drag events.
 */
const Drawer: React.FC<DrawerProps> = ({ drawerClasses, onDragStart, onDropToDrawer }) => {
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  return (
    <div
      className="w-full md:w-1/4 bg-white p-6 rounded-lg shadow mb-6 md:mb-0"
      onDrop={onDropToDrawer}
      onDragOver={handleDragOver}
    >
      <h3 className="text-xl font-semibold mb-4 text-center">Available Classes</h3>
      <ul className="space-y-2">
        {drawerClasses.map((classItem, index) => (
          <li
            key={index}
            draggable
            onDragStart={(e) => onDragStart(e, { from: 'drawer', className: classItem })}
            className="p-2 bg-gray-100 rounded cursor-grab text-center hover:bg-gray-200 text-gray-900"
          >
            {classItem}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Drawer; 