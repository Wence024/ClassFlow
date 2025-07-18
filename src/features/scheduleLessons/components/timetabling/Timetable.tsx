import React from 'react';
import type { ClassSession } from '../../types/scheduleLessons';
import type { DragSource } from './Drawer';

interface TimetableProps {
  groups: string[];
  timetable: (ClassSession | null)[][];
  onDragStart: (e: React.DragEvent, source: DragSource) => void;
  onDropToGrid: (e: React.DragEvent, groupIndex: number, periodIndex: number) => void;
}

/**
 * Timetable grid component for displaying and managing class session assignments.
 * Supports drag-and-drop from drawer and between timetable cells.
 * Single responsibility: only renders the timetable UI and handles drag events.
 */
const Timetable: React.FC<TimetableProps> = ({ groups, timetable, onDragStart, onDropToGrid }) => {
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  return (
    <div className="w-full md:w-3/4 bg-white p-6 rounded-lg shadow overflow-x-auto">
      <h3 className="text-xl font-semibold mb-4 text-center">Timetable</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 border text-gray-700 bg-gray-100">Group</th>
              <th colSpan={8} className="p-2 border text-gray-700 bg-gray-100">
                Day 1
              </th>
              <th colSpan={8} className="p-2 border text-gray-700 bg-gray-100">
                Day 2
              </th>
            </tr>
            <tr>
              <th className="p-2 border text-gray-700 bg-gray-100"></th>
              {Array.from({ length: 16 }, (_, i) => (
                <th key={i} className="p-2 border text-gray-700 bg-gray-100">
                  P{i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map((group, groupIndex) => (
              <tr key={groupIndex}>
                <td className="p-2 border text-gray-900 font-semibold bg-gray-50">{group}</td>
                {timetable[groupIndex].map((item, periodIndex) => (
                  <td
                    key={periodIndex}
                    className={`p-2 border text-center min-w-[80px] ${item ? 'bg-green-400 text-white font-bold' : 'bg-gray-50 text-gray-900'}`}
                    onDrop={(e) => onDropToGrid(e, groupIndex, periodIndex)}
                    onDragOver={handleDragOver}
                    draggable={!!item}
                    onDragStart={
                      item
                        ? (e) =>
                            onDragStart(e, {
                              from: 'timetable',
                              className: item.course.name + ' - ' + item.group.name,
                              groupIndex,
                              periodIndex,
                            })
                        : undefined
                    }
                  >
                    {item ? item.course.name + ' - ' + item.group.name : '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Timetable; 