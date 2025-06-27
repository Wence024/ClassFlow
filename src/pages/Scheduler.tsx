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
const Timetable: React.FC<{ groups: string[]; onDrop: (e: React.DragEvent, group: string) => void }> = ({ groups, onDrop }) => {
  const timetableData = Array.from({ length: groups.length }, (_, i) => ({
    group: groups[i],
    slots: Array(16).fill(null), // 2 days * 8 periods
  }));

  const handleDrop = (e: React.DragEvent, group: string, index: number) => {
    e.preventDefault();
    onDrop(e, group);
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
            <th>Class Groups</th>
            {[...Array(2)].map((_, dayIndex) => (
              <th key={dayIndex}>Day {dayIndex + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timetableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>{row.group}</td>
              {row.slots.map((_, colIndex) => (
                <td
                  key={colIndex}
                  className="empty"
                  onDrop={(e) => handleDrop(e, row.group, colIndex)}
                  onDragOver={handleDragOver}
                >
                  {row.slots[colIndex] || 'Empty'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  const [classes] = useState([
    'Math 101',
    'Physics 101',
    'Chemistry 101',
    'Biology 101',
    'Computer Science 101',
  ]);
  const [groups] = useState(['Group 1', 'Group 2', 'Group 3', 'Group 4']);
  const [timetable, setTimetable] = useState<any>([]);

  // Handle the drag start
  const handleDragStart = (e: React.DragEvent, classItem: string) => {
    e.dataTransfer.setData('classItem', classItem);
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent, group: string) => {
    const classItem = e.dataTransfer.getData('classItem');
    const updatedTimetable = [...timetable];
    const groupIndex = groups.indexOf(group);

    if (groupIndex !== -1) {
      updatedTimetable[groupIndex] = {
        ...updatedTimetable[groupIndex],
        classItem,
      };
      setTimetable(updatedTimetable);
    }
  };

  return (
    <div className="container">
      <Drawer classes={classes} onDragStart={handleDragStart} />
      <Timetable groups={groups} onDrop={handleDrop} />
    </div>
  );
};

export default App;
