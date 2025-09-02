import React from 'react';
import type { ClassSession } from '../../../../classSessions/types/classSession';
import { useTimetableContext } from './useTimetableContext';

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
 * @param {ClassSession} session The class session object.
 * @returns {JSX.Element} JSX content for the tooltip.
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
 * @param {SessionCellProps} props The props for the component.
 * @returns {JSX.Element} The rendered component.
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
    onDragStart,
    onShowTooltip,
    onHideTooltip,
    onDragEnter,
    onDragOver,
    onDropToGrid,
  } = useTimetableContext();

  const numberOfPeriods = session.period_count || 1;
  const borderClass =
    isLastInDay && isNotLastInTable ? 'border-r-2 border-dashed border-gray-300' : '';

  return (
    <td colSpan={numberOfPeriods} className={`p-0.5 align-top relative ${borderClass}`}>
      <div className="h-20">
        <div
          draggable
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
          className="relative w-full h-full cursor-grab"
        >
          {/* Layer 1: The Visible Block */}
          <div className="absolute inset-0 rounded-md bg-blue-100 flex items-center justify-center p-1 text-center z-10">
            <p className="font-bold text-xs text-blue-900 pointer-events-none">
              {session.course.name}
            </p>
          </div>

          {/* Layer 2: The Invisible Drop Zones */}
          <div className="absolute inset-0 flex z-20">
            {Array.from({ length: numberOfPeriods }).map((_, i) => {
              const currentSubPeriodIndex = periodIndex + i;
              const isDragOver =
                dragOverCell?.groupId === groupId &&
                dragOverCell?.periodIndex === currentSubPeriodIndex;
              return (
                <div
                  key={currentSubPeriodIndex}
                  className="flex-1"
                  onDragEnter={(e) => onDragEnter(e, groupId, currentSubPeriodIndex)}
                  onDragOver={onDragOver}
                  onDrop={(e) => onDropToGrid(e, groupId, currentSubPeriodIndex)}
                >
                  {isDragOver && (
                    <div className="w-full h-full bg-blue-200 bg-opacity-50 rounded-md"></div>
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
