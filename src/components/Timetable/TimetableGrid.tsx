import React from 'react';
import './Timetable.css';
import type { TimetableProps } from '../../types/timetable';

export const TimetableGrid: React.FC<TimetableProps> = ({
  classGroups,
  timetable,
  onDragStart,
  onDropToGrid,
}) => {
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  return (
    <div className="timetable">
      <h3>Timetable</h3>
      <table>
        <thead>
          <tr>
            <th>Class Group</th>
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
          {classGroups.map((classGroup, classGroupIndex) => (
            <tr key={classGroupIndex}>
              <td>{classGroup}</td>
              {timetable[classGroupIndex].map((item, periodIndex) => (
                <td
                  key={periodIndex}
                  className={item ? 'assigned' : 'empty'}
                  onDrop={(e) => onDropToGrid(e, classGroupIndex, periodIndex)}
                  onDragOver={handleDragOver}
                  draggable={!!item}
                  onDragStart={
                    item
                      ? (e) =>
                          onDragStart(e, {
                            from: 'timetable',
                            className: `${item.course.name} - ${item.classGroup.name}`,
                            classGroupIndex,
                            periodIndex,
                          })
                      : undefined
                  }
                >
                  {item ? `${item.course.name} - ${item.classGroup.name}` : '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
