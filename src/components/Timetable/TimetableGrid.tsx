import React from 'react';
import './Timetable.css';
import type { TimetableProps } from '../../types/timetable';

export const TimetableGrid: React.FC<TimetableProps> = ({ 
  groups, 
  timetable, 
  onDragStart, 
  onDropToGrid 
}) => {
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
                            className: `${item.course.name} - ${item.group.name}`,
                            groupIndex,
                            periodIndex,
                          })
                      : undefined
                  }
                >
                  {item ? `${item.course.name} - ${item.group.name}` : '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};