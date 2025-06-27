import React, { useState } from 'react';
import './Scheduler.css';

// Drawer Component
const Drawer: React.FC<{ classes: string[]; onDragStart: (e: React.DragEvent, classItem: string) => void }> = ({
  classes,
  onDragStart,
}) => {
  return (
    <div className="drawer">
      <h3>Available Classes</h3>
      <ul>
        {classes.map((classItem, index) => (
          <li key={index} draggable onDragStart={(e) => onDragStart(e, classItem)}>
            {classItem}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Timetable Component
const Timetable: React.FC<{
  groups: string[];
  timetable: string[][];
  onDrop: (e: React.DragEvent, groupIndex: number, period: number) => void;
}> = ({ groups, timetable, onDrop }) => {
  const handleDrop = (e: React.DragEvent, groupIndex: number, period: number) => {
    e.preventDefault();
    onDrop(e, groupIndex, period);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="timetable">
      <h3>Timetable</h3>
      <table>
        <thead>
          <tr>
            <th>Group</th>
            <th colSpan={8}>Day 1 (Periods 1–8)</th>
            <th colSpan={8}>Day 2 (Periods 9–16)</th>
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
              {timetable[groupIndex].map((cell, period) => (
                <td
                  key={period}
                  className={cell ? 'assigned' : 'empty'}
                  onDrop={(e) => handleDrop(e, groupIndex, period)}
                  onDragOver={handleDragOver}
                >
                  {cell || '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// App Component
const App: React.FC = () => {
  const [classes] = useState([
    'Math 101',
    'Physics 101',
    'Chemistry 101',
    'Biology 101',
    'Comp Sci 101',
  ]);
  const groups = ['Group 1', 'Group 2', 'Group 3', 'Group 4'];

  // Timetable state: each group has 16 periods initialized to empty string
  const [timetable, setTimetable] = useState<string[][]>(
    Array.from({ length: groups.length }, () => Array(16).fill(''))
  );

  // Drag start sets the dataTransfer
  const handleDragStart = (e: React.DragEvent, classItem: string) => {
    e.dataTransfer.setData('text/plain', classItem);
  };

  // On drop: assign class to the target cell
  const handleDrop = (e: React.DragEvent, groupIndex: number, period: number) => {
    const classItem = e.dataTransfer.getData('text/plain');
    setTimetable((prev) => {
      const updated = [...prev];
      if (!updated[groupIndex][period]) {
        updated[groupIndex][period] = classItem;
      }
      return updated;
    });
  };

  return (
    <div className="container">
      <Drawer classes={classes} onDragStart={handleDragStart} />
      <Timetable groups={groups} timetable={timetable} onDrop={handleDrop} />
    </div>
  );
};

export default App;
