import React, { useMemo } from 'react';
import { Clock } from 'lucide-react';
import type { DragSource } from '../../types/DragSouuce';
import { useScheduleConfig } from '../../../scheduleConfig/hooks/useScheduleConfig';
import { generateTimetableHeaders } from '../../utils/timeLogic';
import type { ClassGroup } from '../../../classSessionComponents/types';
import type { ClassSession } from '../../../classSessions/types/classSession';

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

  const { dayHeaders, timeHeaders } = useMemo(() => {
    if (!settings) return { dayHeaders: [], timeHeaders: [] };
    return generateTimetableHeaders(settings);
  }, [settings]);

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  if (!settings) {
    return <div className="text-center p-4">Loading configuration...</div>;
  }

  const periodsPerDay = settings.periods_per_day;
  const totalPeriods = settings.class_days_per_week * periodsPerDay;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Timetable Grid
        </h3>
      </div>
      {/* The scroll container is now inside the main card */}
      <div className="overflow-x-auto p-2">
        <table className="w-full min-w-[1200px] border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="p-2 text-left text-sm font-medium text-gray-600 sticky left-0 bg-white z-20">
                Class Group
              </th>
              {dayHeaders.map((dayLabel) => (
                <th
                  key={dayLabel}
                  colSpan={periodsPerDay}
                  className="p-2 text-center text-sm font-medium text-gray-600"
                >
                  {dayLabel}
                </th>
              ))}
            </tr>
            <tr>
              <th className="p-2 sticky left-0 bg-white z-20"></th>
              {Array.from({ length: dayHeaders.length }).flatMap(() =>
                timeHeaders.map((time, timeIndex) => (
                  <th
                    key={timeIndex}
                    className="p-1 pb-2 text-center text-xs font-medium text-gray-500"
                  >
                    {/* Time labels fit on one line now */}
                    {time.label}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr key={group.id}>
                <td className="p-2 font-semibold text-sm text-gray-700 bg-white sticky left-0 z-10 whitespace-nowrap align-top">
                  {group.name}
                </td>
                {Array.from({ length: totalPeriods }, (_, periodIndex) => {
                  const classSession = timetable.get(group.id)?.[periodIndex] || null;
                  return (
                    // The TD itself has no border
                    <td key={periodIndex} className="p-1 align-top">
                      <div
                        onDrop={(e) => onDropToGrid(e, group.id, periodIndex)}
                        onDragOver={handleDragOver}
                        className={`
                          h-24 rounded-md transition-all duration-200
                          flex flex-col items-center justify-center
                          p-1 text-center 
                          ${
                            classSession
                              ? 'bg-teal-100 text-teal-900 shadow-sm'
                              : 'bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-200'
                          }
                        `}
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
                            className="w-full h-full cursor-grab flex flex-col justify-center p-1 hover:shadow-lg transition-shadow rounded-md"
                          >
                            <p className="font-bold text-xs">{classSession.course.name}</p>
                            <p className="text-xs mt-1 text-gray-600">{classSession.instructor.name}</p>
                            <p className="text-xs text-gray-500">({classSession.classroom.name})</p>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-2xl font-light"></span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Timetable;