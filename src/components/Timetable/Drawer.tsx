import React from 'react';
import './Timetable.css'; // We'll reuse the same CSS
import type { DrawerProps } from '../../types/timetable';

export const Drawer: React.FC<DrawerProps> = ({ 
  drawerClasses, 
  onDragStart, 
  onDropToDrawer 
}) => {
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  return (
    <div className="drawer" onDrop={onDropToDrawer} onDragOver={handleDragOver}>
      <h3>Available Classes</h3>
      <ul>
        {drawerClasses.map((classItem, index) => (
          <li
            key={index}
            draggable
            onDragStart={(e) =>
              onDragStart(e, { from: 'drawer', className: classItem })
            }
          >
            {classItem}
          </li>
        ))}
      </ul>
    </div>
  );
};