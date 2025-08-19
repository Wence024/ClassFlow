import React, { useMemo, useState } from 'react';
import { Clock } from 'lucide-react';
import type { DragSource } from '../../types/DragSouuce';
import { useScheduleConfig } from '../../../scheduleConfig/hooks/useScheduleConfig';
import { generateTimetableHeaders } from '../../utils/timeLogic';
import type { ClassGroup } from '../../../classSessionComponents/types';
import type { ClassSession } from '../../../classSessions/types/classSession';

/**
 * Props for the Timetable component.
 */
interface TimetableProps {
  groups: ClassGroup[];
  timetable: Map<string, (ClassSession | null)[]>;
  onDragStart: (e: React.DragEvent, source: DragSource) => void;
  onDropToGrid: (e: React.DragEvent, groupId: string, periodIndex: number) => void;
}

/**
 * A component that renders the main interactive timetable grid.
 * It handles the display of class sessions, including multi-period spanning,
 * and provides the necessary UI for drag-and-drop operations.
 */
const Timetable: React.FC<TimetableProps> = ({ groups, timetable, onDragStart, onDropToGrid }) => {
  const { settings } = useScheduleConfig();

  /**
   * State to track which specific grid cell (group + period) the user is currently dragging over.
   * This is used to provide visual feedback (a highlight overlay).
   */
  const [dragOverCell, setDragOverCell] = useState<{
    groupId: string;
    periodIndex: number;
  } | null>(null);

  /**
   * Memoized calculation of day and time headers based on schedule settings.
   */
  const { dayHeaders, timeHeaders } = useMemo(() => {
    if (!settings) return { dayHeaders: [], timeHeaders: [] };
    return generateTimetableHeaders(settings);
  }, [settings]);

  // --- Drag and Drop Event Handlers ---

  /**
   * Prevents the browser's default behavior for drag events to allow for a custom drop.
   * Sets the visual cursor icon to indicate a "move" operation.
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  /**
   * Sets the state to the current cell when the cursor enters a valid drop zone.
   * Stops event propagation to prevent parent elements from interfering.
   */
  const handleDragEnter = (e: React.DragEvent, groupId: string, periodIndex: number) => {
    e.stopPropagation();
    setDragOverCell({ groupId, periodIndex });
  };

  /**
   * Clears the visual highlight when the cursor leaves the entire table area.
   */
  const handleGlobalDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverCell(null);
    }
  };

  /**
   * Finalizes the drop operation, calls the parent handler, and clears the visual highlight.
   * Stops event propagation to ensure the most specific drop target handles the event.
   */
  const handleDrop = (e: React.DragEvent, groupId: string, periodIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    onDropToGrid(e, groupId, periodIndex);
    setDragOverCell(null);
  };

  // --- Render Logic ---

  if (!settings) {
    return <div className="text-center p-4">Loading configuration...</div>;
  }

  const periodsPerDay = settings.periods_per_day;
  const totalPeriods = settings.class_days_per_week * periodsPerDay;
  const newBorderStyle = 'border-r-2 border-dashed border-gray-300';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Timetable Grid
        </h3>
      </div>

      <div className="overflow-x-auto" onDragLeave={handleGlobalDragLeave}>
        <table className="w-full border-separate [border.spacing:0.4px]">
          {/* Table Head */}
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left text-sm font-medium text-gray-600 sticky left-0 bg-gray-50 z-5 min-w-[7em]">
                Class Group
              </th>
              {dayHeaders.map((dayLabel, dayIndex) => (
                <th
                  key={dayLabel}
                  colSpan={periodsPerDay}
                  className={`p-2 text-center text-sm font-medium text-gray-600 ${
                    dayIndex < dayHeaders.length - 1 ? newBorderStyle : ''
                  }`}
                >
                  {dayLabel}
                </th>
              ))}
            </tr>
            <tr>
              <th className="p-2 sticky left-0 bg-gray-50 z-20"></th>
              {Array.from({ length: dayHeaders.length }).flatMap((_, dayIndex) =>
                timeHeaders.map((time, timeIndex) => {
                  const isLastInDay = (timeIndex + 1) % periodsPerDay === 0;
                  const isNotLastInTable = dayIndex + 1 < dayHeaders.length;
                  const borderClass = isLastInDay && isNotLastInTable ? newBorderStyle : '';
                  return (
                    <th
                      key={`d${dayIndex}-t${timeIndex}`}
                      className={`p-1 pb-2 text-center text-xs font-medium text-gray-500 min-w-[120px] bg-gray-50 ${borderClass}`}
                    >
                      {time.label}
                    </th>
                  );
                })
              )}
            </tr>
          </thead>

          {/* Table Body */}
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
                      return null;
                    }

                    const classSession = timetable.get(group.id)?.[periodIndex] || null;
                    const numberOfPeriods = classSession?.course.number_of_periods || 1;

                    if (classSession) {
                      for (let i = 1; i < numberOfPeriods; i++) {
                        assignedPeriods.add(periodIndex + i);
                      }
                    }

                    const endPeriodIndex = periodIndex + numberOfPeriods - 1;
                    const isLastInDay = (endPeriodIndex + 1) % periodsPerDay === 0;
                    const isNotLastInTable = endPeriodIndex + 1 < totalPeriods;
                    const borderClass = isLastInDay && isNotLastInTable ? newBorderStyle : '';

                    return (
                      <td
                        key={periodIndex}
                        className={`p-1 align-top relative ${borderClass}`}
                        colSpan={numberOfPeriods}
                      >
                        <div className="h-16">
                          {classSession ? (
                            // --- RENDER AN ASSIGNED CLASS SESSION ---
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
                              className="group relative w-full h-full cursor-grab" // The relative parent for both layers
                            >
                              {/* Layer 1: The Visible Block (for visuals and dragging) */}
                              <div className="absolute inset-0 rounded-md bg-blue-100 flex items-center justify-center p-2 text-center z-10">
                                <p className="font-bold text-xs text-blue-900 pointer-events-none">
                                  {classSession.course.name}
                                </p>
                              </div>

                              {/* Layer 2: The Invisible, Granular Drop Zones (for functionality) */}
                              <div className="absolute inset-0 flex z-20">
                                {Array.from({ length: numberOfPeriods }).map((_, i) => {
                                  const currentSubPeriodIndex = periodIndex + i;
                                  const isDragOver =
                                    dragOverCell?.groupId === group.id &&
                                    dragOverCell?.periodIndex === currentSubPeriodIndex;
                                  return (
                                    <div
                                      key={currentSubPeriodIndex}
                                      className="flex-1"
                                      onDragEnter={(e) =>
                                        handleDragEnter(e, group.id, currentSubPeriodIndex)
                                      }
                                      onDragOver={handleDragOver}
                                      onDrop={(e) => handleDrop(e, group.id, currentSubPeriodIndex)}
                                    >
                                      {isDragOver && (
                                        <div className="w-full h-full bg-blue-200 bg-opacity-50 rounded-md"></div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Tooltip (attached to the visual group) */}
                              <div className="absolute bottom-full mb-2 w-max max-w-xs bg-gray-800 text-white text-xs rounded-md shadow-lg p-3 opacity-0 group-hover:opacity-85 transition-opacity duration-300 invisible group-hover:visible pointer-events-none z-30">
                                <p className="font-bold text-sm">{classSession.course.name}</p>
                                <p className="mt-1">Instructor: {classSession.instructor.name}</p>
                                <p>Classroom: {classSession.classroom.name}</p>
                                <p>Group: {classSession.group.name}</p>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-[6px] border-t-gray-800"></div>
                              </div>
                            </div>
                          ) : (
                            // --- RENDER AN EMPTY, DASHED CELL ---
                            <div
                              className="h-full rounded-md bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-200"
                              onDragEnter={(e) => handleDragEnter(e, group.id, periodIndex)}
                              onDragOver={handleDragOver}
                              onDrop={(e) => handleDrop(e, group.id, periodIndex)}
                            >
                              {dragOverCell?.groupId === group.id &&
                                dragOverCell?.periodIndex === periodIndex && (
                                  <div className="w-full h-full bg-blue-200 bg-opacity-50 rounded-md"></div>
                                )}
                            </div>
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
