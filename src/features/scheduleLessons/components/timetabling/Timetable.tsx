import React, { useMemo } from 'react';
import type { ClassSession, ClassGroup } from '../../types/';
import type { DragSource } from './Drawer';
import { useScheduleConfig } from '../../hooks/useScheduleConfig';
import { generateTimeSlots, type TimeSlot } from '../../utils/timeLogic';

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

  // Generate the time slots and day headers using our new utility
  const { timeSlots, dayHeaders } = useMemo(() => {
    if (!settings) return { timeSlots: [], dayHeaders: [] };

    const allSlots = generateTimeSlots(settings);
    const uniqueDays = [...new Array(settings.class_days_per_week)].map((_, i) => `Day ${i + 1}`);

    return { timeSlots: allSlots, dayHeaders: uniqueDays };
  }, [settings]);

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  if (!settings) {
    return <div className="text-center p-4">Loading configuration...</div>;
  }

  const periodsPerDay = settings.periods_per_day;

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow overflow-x-auto">
      <h3 className="text-xl font-semibold mb-4 text-center">Timetable</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-2 border sticky left-0 bg-white z-10">Time / Group</th>
            {groups.map((group) => (
              <th key={group.id} className="p-2 border">
                {group.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dayHeaders.map((dayLabel, dayIndex) => (
            <React.Fragment key={dayIndex}>
              {/* Day Separator Row */}
              <tr>
                <td
                  colSpan={groups.length + 1}
                  className="p-2 border bg-gray-100 font-bold text-center"
                >
                  {dayLabel}
                </td>
              </tr>
              {/* Time Slot Rows for the Day */}
              {timeSlots
                .slice(dayIndex * periodsPerDay, (dayIndex + 1) * periodsPerDay)
                .map((slot, periodIndexInDay) => {
                  const absolutePeriodIndex = dayIndex * periodsPerDay + periodIndexInDay;
                  return (
                    <tr key={slot.label}>
                      <td className="p-2 border font-semibold bg-gray-50 sticky left-0 z-10">
                        {slot.label}
                      </td>
                      {groups.map((group) => {
                        const session = timetable.get(group.id)?.[absolutePeriodIndex] || null;
                        return (
                          <td
                            key={group.id}
                            className={`p-2 border text-center min-w-[120px] ${session ? 'bg-green-400 text-white font-bold' : 'bg-gray-50'}`}
                            onDrop={(e) => onDropToGrid(e, group.id, absolutePeriodIndex)}
                            onDragOver={handleDragOver}
                          >
                            {session ? (
                              <div
                                draggable
                                onDragStart={(e) =>
                                  onDragStart(e, {
                                    from: 'timetable',
                                    class_session_id: session.id,
                                    class_group_id: group.id,
                                    period_index: absolutePeriodIndex,
                                  })
                                }
                                className="cursor-grab"
                              >
                                <p>{session.course.name}</p>
                                <p className="text-xs">{session.instructor.name}</p>
                                <p className="text-xs">{session.classroom.name}</p>
                              </div>
                            ) : (
                              '—'
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Timetable;
