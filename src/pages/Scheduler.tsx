import React, { useState } from 'react';
import './Scheduler.css';

type DragSource = {
  from: 'drawer' | 'timetable';
  className: string;
  groupIndex?: number;
  periodIndex?: number;
};

// Drawer component
const Drawer: React.FC<{
  drawerClasses: string[];
  onDragStart: (e: React.DragEvent, source: DragSource) => void;
  onDropToDrawer: (e: React.DragEvent) => void;
}> = ({ drawerClasses, onDragStart, onDropToDrawer }) => {
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

// Timetable grid
const Timetable: React.FC<{
  groups: string[];
  timetable: string[][];
  onDragStart: (e: React.DragEvent, source: DragSource) => void;
  onDropToGrid: (e: React.DragEvent, groupIndex: number, periodIndex: number) => void;
}> = ({ groups, timetable, onDragStart, onDropToGrid }) => {
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  return (
    <div className="timetable">
      <h3>Timetable</h3>
      <table>
        <thead>
          <tr>
            <th>Group</th>
            <th colSpan={8}>Day 1</th>
            <th colSpan={8}>Day 2</th>
          </tr>
          <tr>
            <th></th>
            {Array.from({ length: 16 }, (_, i) => (
              <th key={i}>P{i + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groups.map((group, groupIndex) => (
            <tr key={groupIndex}>
              <td>{group}</td>
              {timetable[groupIndex].map((item, periodIndex) => (
                <td
                  key={periodIndex}
                  className={item ? 'assigned' : 'empty'}
                  onDrop={(e) => onDropToGrid(e, groupIndex, periodIndex)}
                  onDragOver={handleDragOver}
                  draggable={!!item}
                  onDragStart={
                    item
                      ? (e) =>
                          onDragStart(e, {
                            from: 'timetable',
                            className: item,
                            groupIndex,
                            periodIndex,
                          })
                      : undefined
                  }
                >
                  {item || '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// App component
const App: React.FC = () => {
  const [drawerClasses, setDrawerClasses] = useState([
    'Math 101',
    'Physics 101',
    'Chemistry 101',
    'Biology 101',
    'Comp Sci 101',
  ]);
  const groups = ['Group 1', 'Group 2', 'Group 3', 'Group 4'];
  const [timetable, setTimetable] = useState<string[][]>(
    Array.from({ length: groups.length }, () => Array(16).fill(''))
  );

  const [dragSource, setDragSource] = useState<DragSource | null>(null);

  // Drag started from drawer or timetable
  const handleDragStart = (e: React.DragEvent, source: DragSource) => {
    setDragSource(source);
    e.dataTransfer.setData('text/plain', source.className);
  };

  // Drop into a timetable cell
  const handleDropToGrid = (
    e: React.DragEvent,
    groupIndex: number,
    periodIndex: number
  ) => {
    e.preventDefault();
    if (!dragSource) return;

    setTimetable((prev) => {
      const updated = prev.map((row) => [...row]);
      // Do not overwrite if destination already filled
      if (updated[groupIndex][periodIndex]) return prev;

      updated[groupIndex][periodIndex] = dragSource.className;

      // Remove from original location
      if (dragSource.from === 'timetable' && dragSource.groupIndex !== undefined) {
        updated[dragSource.groupIndex][dragSource.periodIndex!] = '';
      }
      return updated;
    });

    if (dragSource.from === 'drawer') {
      setDrawerClasses((prev) =>
        prev.filter((c) => c !== dragSource.className)
      );
    }
  };

  // Drop into the drawer
  const handleDropToDrawer = (e: React.DragEvent) => {
    e.preventDefault();
    if (!dragSource) return;

    // Add class back to drawer
    setDrawerClasses((prev) =>
      prev.includes(dragSource.className)
        ? prev
        : [...prev, dragSource.className]
    );

    // Remove from timetable if that's the source
    if (dragSource.from === 'timetable' && dragSource.groupIndex !== undefined) {
      setTimetable((prev) => {
        const updated = prev.map((row) => [...row]);
        updated[dragSource.groupIndex!][dragSource.periodIndex!] = '';
        return updated;
      });
    }
  };

  return (
    <div className="container">
      <Drawer
        drawerClasses={drawerClasses}
        onDragStart={handleDragStart}
        onDropToDrawer={handleDropToDrawer}
      />
      <Timetable
        groups={groups}
        timetable={timetable}
        onDragStart={handleDragStart}
        onDropToGrid={handleDropToGrid}
      />
    </div>
  );
};

export default App;
