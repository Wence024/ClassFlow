import React from 'react';
import type { ClassSession, ClassGroup } from '../../types/';
import type { DragSource } from './Drawer';

interface TimetableProps {
  groups: ClassGroup[];
  timetable: Map<string, (ClassSession | null)[]>;
  onDragStart: (e: React.DragEvent, source: DragSource) => void;
  onDropToGrid: (e: React.DragEvent, groupId: string, periodIndex: number) => void;
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
              <th className="p-2 border">Group</th>
              {Array.from({ length: 16 }, (_, i) => (
                <th key={i} className="p-2 border">
                  Period {i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => {
              const sessions = timetable.get(group.id) || [];
              return (
                <tr key={group.id}>
                  <td className="p-2 border text-gray-900 font-semibold bg-gray-50">
                    {group.name}
                  </td>
                  {sessions.map((item, periodIndex) => (
                    <td
                      key={periodIndex}
                      className={`p-2 border text-center min-w-[80px] ${item ? 'bg-green-400 text-white font-bold' : 'bg-gray-50 text-gray-900'}`}
                      onDrop={(e) => onDropToGrid(e, group.id, periodIndex)}
                      onDragOver={handleDragOver}
                    >
                      {item ? (
                        <div
                          draggable
                          onDragStart={(e) =>
                            onDragStart(e, {
                              from: 'timetable',
                              class_session_id: item.id,
                              class_group_id: group.id,
                              period_index: periodIndex,
                            })
                          }
                          className="cursor-grab"
                        >
                          <p>{item.course.name}</p>
                          <p className="text-xs">{item.instructor.name}</p>
                          <p className="text-xs">{item.classroom.name}</p>
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Timetable;
