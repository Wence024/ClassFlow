import React, { useMemo, useState } from 'react';
import { Clock } from 'lucide-react';
import type { DragSource } from '../../types/DragSource';
import { useScheduleConfig } from '../../../scheduleConfig/hooks/useScheduleConfig';
import { generateTimetableHeaders } from '../../utils/timeLogic';
import type { ClassGroup } from '../../../classSessionComponents/types';
import type { ClassSession } from '../../../classSessions/types/classSession';

/** Props for the Timetable component. */
interface TimetableProps {
  groups: ClassGroup[];
  timetable: Map<string, (ClassSession | null)[]>;
  onDragStart: (e: React.DragEvent, source: DragSource) => void;
  onDropToGrid: (e: React.DragEvent, groupId: string, periodIndex: number) => void;
}

/**
 * A component that renders the main interactive timetable grid.
 *
 * This is a highly complex presentational component. Its responsibilities include:
 * - Calculating and rendering table headers based on schedule settings.
 * - Rendering a row for each class group.
 * - Rendering cells for each period, correctly handling multi-period spanning for longer sessions.
 * - Rendering assigned class sessions with a sophisticated two-layer system for robust drag-and-drop.
 * - Providing droppable zones for empty cells.
 * - Managing local UI state for visual feedback during drag-over events.
 *
 * @param {TimetableProps} props - The props for the component.
 */
const Timetable: React.FC<TimetableProps> = ({ groups, timetable, onDragStart, onDropToGrid }) => {
  const { settings } = useScheduleConfig();
  const [dragOverCell, setDragOverCell] = useState<{ groupId: string; periodIndex: number } | null>(
    null
  );

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
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOverCell(null);
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
  const dayBoundaryStyle = 'border-r-2 border-dashed border-gray-300';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Timetable Grid
        </h3>
      </div>
      <div className="overflow-x-auto" onDragLeave={handleGlobalDragLeave}>
        <table className="w-full border-separate [border.spacing:0.5px]">
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
                    dayIndex < dayHeaders.length - 1 ? dayBoundaryStyle : ''
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
                  const borderClass = isLastInDay && isNotLastInTable ? dayBoundaryStyle : '';
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
              const renderedPeriods = new Set<number>();
              return (
                <tr key={group.id}>
                  <td className="p-2 font-semibold text-sm text-gray-700 bg-gray-50 sticky left-0 z-20 whitespace-nowrap align-top min-w-[12rem]">
                    {group.name}
                  </td>
                  {Array.from({ length: totalPeriods }).map((_, periodIndex) => {
                    if (renderedPeriods.has(periodIndex)) return null;

                    const classSession = timetable.get(group.id)?.[periodIndex] || null;
                    const numberOfPeriods = classSession?.course.number_of_periods || 1;

                    if (classSession) {
                      for (let i = 1; i < numberOfPeriods; i++)
                        renderedPeriods.add(periodIndex + i);
                    }

                    const isLastInDay = (periodIndex + numberOfPeriods) % periodsPerDay === 0;
                    const isNotLastInTable = periodIndex + numberOfPeriods < totalPeriods;

                    return (
                      <td
                        key={periodIndex}
                        colSpan={numberOfPeriods}
                        className={`p-0.5 align-top relative ${isLastInDay && isNotLastInTable ? dayBoundaryStyle : ''}`}
                      >
                        <div className="h-20">
                          {classSession ? (
                            // --- RENDER AN ASSIGNED CLASS SESSION (WITH TWO-LAYER DND) ---
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
                              className="group relative w-full h-full cursor-grab"
                            >
                              {/* Layer 1: The Visible Block (for visuals) */}
                              <div className="absolute inset-0 rounded-md bg-blue-100 flex items-center justify-center p-1 text-center z-10">
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
                              <div className="absolute bottom-full mb-2 w-max max-w-xs bg-gray-800 text-white text-xs rounded-md shadow-lg p-3 opacity-0 group-hover:opacity-90 transition-opacity duration-300 invisible group-hover:visible pointer-events-none z-30">
                                <p className="font-bold text-sm">{classSession.course.name}</p>
                                <p className="text-gray-300">{classSession.course.code}</p>
                                <p className="mt-1">Instructor: {classSession.instructor.name}</p>
                                <p>Classroom: {classSession.classroom.name}</p>
                                <p>Group: {classSession.group.name}</p>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-[6px] border-t-gray-800"></div>
                              </div>
                            </div>
                          ) : (
                            // --- RENDER AN EMPTY, DROPPABLE CELL ---
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
