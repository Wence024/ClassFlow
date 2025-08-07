import React, { useMemo } from 'react';
import type { DragSource } from '../types/DragSouuce';
import { useScheduleConfig } from '../../scheduleConfig/useScheduleConfig';
import { generateTimetableHeaders } from '../utils/timeLogic';
import type { ClassGroup } from '../../classComponents/types';
import type { ClassSession } from '../../classes/classSession';

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
  const { settings } = useScheduleConfig();

  // Generate the day and time headers for the columns
  const { dayHeaders, timeHeaders } = useMemo(() => {
    if (!settings) return { dayHeaders: [], timeHeaders: [] };
    return generateTimetableHeaders(settings);
  }, [settings]);

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  if (!settings) {
    return <div className="text-center p-4">Loading configuration...</div>;
  }

  const periodsPerDay = settings.periods_per_day;

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow overflow-x-auto">
      <h3 className="text-xl font-semibold mb-4 text-center">Timetable</h3>
      <table className="w-full border-collapse text-sm">
        <thead>
          {/* Row 1: Day Headers */}
          <tr>
            <th className="p-2 border sticky left-0 bg-white z-10">Class Group</th>
            {dayHeaders.map((dayLabel) => (
              <th key={dayLabel} colSpan={periodsPerDay} className="p-2 border text-center">
                {dayLabel}
              </th>
            ))}
          </tr>
          {/* Row 2: Time Period Headers */}
          <tr>
            <th className="p-2 border sticky left-0 bg-white z-10"></th>
            {dayHeaders.flatMap((_day, dayIndex) =>
              timeHeaders.map((time, timeIndex) => (
                <th key={`${dayIndex}-${timeIndex}`} className="p-2 border font-normal">
                  {time.label}
                </th>
              ))
            )}
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => (
            <tr key={group.id}>
              {/* Row Header: Group Name */}
              <td className="p-2 border font-semibold bg-gray-50 sticky left-0 z-10 whitespace-nowrap">
                {group.name}
              </td>
              {/* Data Cells */}
              {Array.from({ length: dayHeaders.length * timeHeaders.length }, (_, periodIndex) => {
                const classSession = timetable.get(group.id)?.[periodIndex] || null;
                return (
                  <td
                    key={periodIndex}
                    className={`p-2 border text-center min-w-[120px] ${classSession ? 'bg-green-400 text-white font-bold' : 'bg-gray-50'}`}
                    onDrop={(e) => onDropToGrid(e, group.id, periodIndex)}
                    onDragOver={handleDragOver}
                  >
                    {classSession ? (
                      <div
                        draggable
                        onDragStart={(e) =>
                          onDragStart(e, {
                            from: 'timetable',
                            class_session_id: classSession.id,
                            class_group_id: group.id,
                            period_index: periodIndex,
                          })
                        }
                        className="cursor-grab"
                      >
                        <p>{classSession.course.name}</p>
                        <p className="text-xs">{classSession.instructor.name}</p>
                        <p className="text-xs">{classSession.classroom.name}</p>
                      </div>
                    ) : (
                      '—'
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Timetable;
