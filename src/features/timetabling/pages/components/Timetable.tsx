import React, { useMemo, useState } from 'react';
import { Clock, RefreshCw } from 'lucide-react'; // Import icons for the timetable UI
import type { DragSource } from '../../types/DragSource';
import { useScheduleConfig } from '../../../scheduleConfig/hooks/useScheduleConfig';
import { generateTimetableHeaders } from '../../utils/timeLogic';
import type { ClassGroup } from '../../../classSessionComponents/types';
import type { ClassSession } from '../../../classSessions/types/classSession';

/** 
 * Props for the Timetable component, defining the expected data and actions. 
 */
interface TimetableProps {
  groups: ClassGroup[];
  timetable: Map<string, (ClassSession | null)[]>;
  isLoading: boolean;
  onDragStart: (e: React.DragEvent, source: DragSource) => void;
  onDropToGrid: (e: React.DragEvent, groupId: string, periodIndex: number) => void;
  onShowTooltip: (content: React.ReactNode, target: HTMLElement) => void;
  onHideTooltip: () => void;
}

/**
 * The Timetable component displays an interactive timetable grid with drag-and-drop
 * functionality. It renders class groups, their corresponding sessions, and a non-blocking
 * sync indicator when data is being loaded or synced.
 */
const Timetable: React.FC<TimetableProps> = ({
  groups,
  timetable,
  isLoading,
  onDragStart,
  onDropToGrid,
  onShowTooltip,
  onHideTooltip,
}) => {
  // --- State & Memoization ---
  const { settings } = useScheduleConfig(); // Schedule settings (periods, days, etc.)
  const [dragOverCell, setDragOverCell] = useState<{ groupId: string; periodIndex: number } | null>(null);

  // Memoized headers for timetable
  const { dayHeaders, timeHeaders } = useMemo(() => {
    if (!settings) return { dayHeaders: [], timeHeaders: [] };
    return generateTimetableHeaders(settings); // Generates day and time headers based on settings
  }, [settings]);

  // --- Drag-and-Drop Handlers ---
  
  /**
   * Handles the drag-over event, preventing the default behavior and changing the cursor style.
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move'; // Indicate the move operation
  };

  /**
   * Sets the visual highlight when a drag enters a valid drop zone (cell).
   */
  const handleDragEnter = (e: React.DragEvent, groupId: string, periodIndex: number) => {
    e.stopPropagation(); // Stop event propagation
    setDragOverCell({ groupId, periodIndex });
  };

  /**
   * Clears the drag-over highlight when the cursor leaves the table area.
   */
  const handleGlobalDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOverCell(null);
  };

  /**
   * Handles the drop event, finalizes the drop action, and invokes the callback to update the timetable.
   */
  const handleDrop = (e: React.DragEvent, groupId: string, periodIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    onDropToGrid(e, groupId, periodIndex); // Call the parent handler
    setDragOverCell(null); // Clear the visual highlight
  };

  // --- Render Logic ---
  
  if (!settings) {
    return <div className="text-center p-4">Loading configuration...</div>; // Loading state
  }

  const periodsPerDay = settings.periods_per_day;
  const totalPeriods = settings.class_days_per_week * periodsPerDay;
  const dayBoundaryStyle = 'border-r-2 border-dashed border-gray-300'; // Style for separating days in the grid

  /**
   * Builds the tooltip content based on the class session.
   * @param session The class session object
   * @returns JSX content for the tooltip
   */
  const buildTooltipContent = (session: ClassSession) => (
    <>
      <p className="font-bold text-sm">{session.course.name}</p>
      <p className="text-gray-300">{session.course.code}</p>
      <p className="mt-1">
        Instructor: {session.instructor.first_name} {session.instructor.last_name}
      </p>
      <p>Classroom: {session.classroom.name}</p>
      <p>Group: {session.group.name}</p>
    </>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
      {/* Table Header */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Timetable Grid
        </h3>
        {/* Syncing indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-gray-500 animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Syncing...</span>
          </div>
        )}
      </div>

      {/* Timetable Table */}
      <div className="overflow-x-auto" onDragLeave={handleGlobalDragLeave}>
        <table className="w-full border-separate [border.spacing:0.5px]">
          {/* Table Head */}
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left text-sm font-medium text-gray-600 sticky left-0 bg-gray-50 z-5 min-w-[7em]">
                Class Group
              </th>
              {/* Days */}
              {dayHeaders.map((dayLabel, dayIndex) => (
                <th
                  key={dayLabel}
                  colSpan={periodsPerDay}
                  className={`p-2 text-center text-sm font-medium text-gray-600 ${dayIndex < dayHeaders.length - 1 ? dayBoundaryStyle : ''}`}
                >
                  {dayLabel}
                </th>
              ))}
            </tr>
            <tr>
              <th className="p-2 sticky left-0 bg-gray-50 z-20"></th>
              {/* Times */}
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
              const renderedPeriods = new Set<number>(); // Track rendered periods to avoid duplicates
              return (
                <tr key={group.id}>
                  <td className="p-2 font-semibold text-sm text-gray-700 bg-gray-50 sticky left-0 z-20 whitespace-nowrap align-top min-w-[12rem]">
                    {group.name}
                  </td>
                  {/* Render timetable cells */}
                  {Array.from({ length: totalPeriods }).map((_, periodIndex) => {
                    if (renderedPeriods.has(periodIndex)) return null;

                    const classSession = timetable.get(group.id)?.[periodIndex] || null;
                    const numberOfPeriods = classSession?.period_count || 1;

                    // Mark multiple periods for the session as rendered
                    if (classSession) {
                      for (let i = 1; i < numberOfPeriods; i++)
                        renderedPeriods.add(periodIndex + i);
                    }

                    // Determine the visual style of each cell
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
                            // Render assigned class session with drag-and-drop
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
                              onMouseEnter={(e) =>
                                onShowTooltip(buildTooltipContent(classSession), e.currentTarget)
                              }
                              onMouseLeave={onHideTooltip}
                              className="relative w-full h-full cursor-grab"
                            >
                              {/* Layer 1: The Visible Block */}
                              <div className="absolute inset-0 rounded-md bg-blue-100 flex items-center justify-center p-1 text-center z-10">
                                <p className="font-bold text-xs text-blue-900 pointer-events-none">
                                  {classSession.course.name}
                                </p>
                              </div>

                              {/* Layer 2: The Invisible Drop Zones */}
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
                            </div>
                          ) : (
                            // Render empty, droppable cell
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
