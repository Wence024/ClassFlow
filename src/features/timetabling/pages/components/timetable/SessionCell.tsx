import React from 'react';
import type { ClassSession } from '../../../../classSessions/types/classSession';
import { useTimetableContext } from './useTimetableContext';
import { hexToRgba, isColorLight } from '../../../../../lib/colorUtils';

/**
 * Props for the SessionCell component.
 */
interface SessionCellProps {
  session: ClassSession;
  groupId: string;
  periodIndex: number;
  isLastInDay: boolean;
  isNotLastInTable: boolean;
}

/**
 * Builds the tooltip content for a class session.
 *
 * @param session The class session object.
 * @returns JSX content for the tooltip.
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

/**
 * Renders a cell containing a class session in the timetable.
 * It is draggable and provides drop zones for moving items within it.
 * Shows visual feedback during drag operations with availability indicators.
 *
 * @param props The props for the component.
 * @returns The rendered component.
 */
const SessionCell: React.FC<SessionCellProps> = ({
  session,
  groupId,
  periodIndex,
  isLastInDay,
  isNotLastInTable,
}) => {
  const {
    dragOverCell,
    currentDraggedSession,
    isSlotAvailable,
    onDragStart,
    onShowTooltip,
    onHideTooltip,
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDropToGrid,
  } = useTimetableContext();

  const numberOfPeriods = session.period_count || 1;
  const borderClass =
    isLastInDay && isNotLastInTable ? 'border-r-2 border-dashed border-gray-300' : '';

  const isDragging = currentDraggedSession !== null;
  const isDraggedSession = currentDraggedSession?.id === session.id;

  const instructorHex = session.instructor.color || '#888888';

  const baseBg = isDraggedSession
    ? hexToRgba(instructorHex, 0.2) // A bit darker for dragged item
    : hexToRgba(instructorHex, 0.6); // Lighter for normal state

  const borderColor = hexToRgba(instructorHex, 0.8);
  const textColor = isColorLight(instructorHex) ? '#000000' : '#FFFFFF'; // Black on light, white on dark

  return (
    <td
      colSpan={numberOfPeriods}
      className={`p-0.5 align-top relative ${borderClass}`}
      data-testid={`cell-${groupId}-${periodIndex}`}
    >
      <div className="h-20">
        <div
          draggable
          data-testid={`session-card-${session.id}`}
          onDragStart={(e) =>
            onDragStart(e, {
              from: 'timetable',
              class_session_id: session.id,
              class_group_id: groupId,
              period_index: periodIndex,
            })
          }
          onMouseEnter={(e) => onShowTooltip(buildTooltipContent(session), e.currentTarget)}
          onMouseLeave={onHideTooltip}
          className={`relative w-full h-full cursor-grab ${isDraggedSession ? 'opacity-50' : ''}`}
        >
          {/* Layer 1: The Visible Block */}
          <div
            className="absolute inset-0 rounded-md flex items-center justify-center p-1 text-center z-10 transition-all duration-200"
            style={{
              backgroundColor: baseBg,
              border: isDraggedSession ? `2px dashed ${borderColor}` : 'none',
            }}
          >
            <p
              className="font-bold text-xs pointer-events-none"
              style={{ color: textColor }}
            >
              {session.course.code}
            </p>
          </div>

          {/* Layer 2: The Invisible Drop Zones */}
          <div className="absolute inset-0 flex z-20">
            {Array.from({ length: numberOfPeriods }).map((_, i) => {
              const currentSubPeriodIndex = periodIndex + i;
              const isDragOver =
                dragOverCell?.groupId === groupId &&
                dragOverCell?.periodIndex === currentSubPeriodIndex;
              const isSlotValidForDrop =
                isDragging && !isDraggedSession && isSlotAvailable(groupId, currentSubPeriodIndex);

              return (
                <div
                  key={currentSubPeriodIndex}
                  className="flex-1"
                  onDragEnter={(e) => onDragEnter(e, groupId, currentSubPeriodIndex)}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={(e) => onDropToGrid(e, groupId, currentSubPeriodIndex)}
                >
                  {isDragOver && (
                    <div
                      className={`w-full h-full rounded-md pointer-events-none ${
                        isSlotValidForDrop
                          ? 'bg-green-200 bg-opacity-50'
                          : 'bg-red-200 bg-opacity-50'
                      }`}
                    ></div>
                  )}
                  {isDragging && !isDraggedSession && isSlotValidForDrop && !isDragOver && (
                    <div className="w-full h-full flex items-center justify-center pointer-events-none">
                      <div className="w-2 h-2 bg-green-500 rounded-full opacity-60"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </td>
  );
};

export default SessionCell;