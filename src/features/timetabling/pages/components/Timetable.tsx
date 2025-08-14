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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Timetable Grid
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-separate [border-spacing:0_4px]">
          {/* Thead remains the same */}
          <thead className="bg-gray-50">
            <tr>
              {/* Adjusted for sticky column with wider width */}
              <th className="p-2 text-left text-sm font-medium text-gray-600 sticky left-0 bg-gray-50 z-5 min-w-[7em]">
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
              <th className="p-2 text-left text-sm font-medium text-gray-600 sticky left-0 bg-gray-50 z-20"></th>
              {Array.from({ length: dayHeaders.length }).flatMap(() =>
                timeHeaders.map((time, timeIndex) => (
                  <th
                    key={timeIndex}
                    className="p-1 pb-2 text-center text-xs font-medium text-gray-500 min-w-[120px] bg-gray-50"
                  >
                    {time.label}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => {
              const assignedPeriods = new Set<number>();
              return (
                <tr key={group.id}>
                  <td className="p-2 font-semibold text-sm text-gray-700 bg-gray-50 sticky left-0 z-10 whitespace-nowrap align-top min-w-[7em]">
                    {group.name}
                  </td>
                  {Array.from({ length: totalPeriods }, (_, periodIndex) => {
                    if (assignedPeriods.has(periodIndex)) {
                      return null; // This period is already covered by a colSpan
                    }

                    const classSession = timetable.get(group.id)?.[periodIndex] || null;
                    const numberOfPeriods = classSession?.course.number_of_periods || 1;

                    if (classSession && numberOfPeriods > 1) {
                      for (let i = 1; i < numberOfPeriods; i++) {
                        assignedPeriods.add(periodIndex + i);
                      }
                    }

                    return (
                      <td key={periodIndex} className="p-1 align-top" colSpan={numberOfPeriods}>
                        <div
                          onDrop={(e) => onDropToGrid(e, group.id, periodIndex)}
                          onDragOver={handleDragOver}
                          className={`
                            group relative
                            h-16 rounded-md transition-colors duration-200
                            flex items-center justify-center p-2 text-center
                            ${
                              classSession
                                ? 'bg-blue-100'
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
                              className="w-full h-full cursor-grab flex items-center justify-center"
                            >
                              <p className="font-bold text-xs text-blue-900">
                                {classSession.course.name}
                              </p>
                              <div
                                className="absolute bottom-full mb-2 w-max max-w-xs
                                           bg-gray-800 text-white text-xs rounded-md shadow-lg p-3
                                           opacity-0 group-hover:opacity-85 transition-opacity duration-300
                                           invisible group-hover:visible pointer-events-none z-10"
                              >
                                <p className="font-bold text-sm">{classSession.course.name}</p>
                                <p className="mt-1">Instructor: {classSession.instructor.name}</p>
                                <p>Classroom: {classSession.classroom.name}</p>
                                <p>Group: {classSession.group.name}</p>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-[6px] border-t-gray-800"></div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-2xl font-light"></span>
                          )}
                        </div>
                      </td>
                    );
                  })}
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
