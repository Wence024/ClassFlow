import React from 'react';
import type { ClassSession } from '../../../../classSessions/types/classSession';
import { useTimetableContext } from './useTimetableContext';
import {
  DEFAULT_FALLBACK_COLOR,
  getSessionCellBgColor,
  getSessionCellBorderStyle,
  getSessionCellTextColor,
} from '../../../../../lib/colorUtils';
import { useAuth } from '../../../../auth/hooks/useAuth';
import { AlertTriangle } from 'lucide-react';

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

// Define the props interface for SessionCell
interface SessionCellProps {
  session: ClassSession;
  groupId: string;
  periodIndex: number;
  isLastInDay: boolean;
  isNotLastInTable: boolean;
}

/**
 * Renders a cell containing a class session in the timetable.
 * It is draggable and provides drop zones for moving items within it.
 * It will now appear "washed out" if not owned by the user's program and
 * will render a fallback state for invalid/orphaned data to prevent crashes.
 *
 * @param sc The props for the component.
 * @param sc.session The class session data.
 * @param sc.groupId The ID of the group row.
 * @param sc.periodIndex The starting period index of the cell.
 * @param sc.isLastInDay Whether this is the last cell in a day's block.
 * @param sc.isNotLastInTable Whether this is not the last cell in the entire row.
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

  const { user } = useAuth();

  // --- ADDED: Defensive Check for Invalid Data ---
  if (!session.instructor || !session.course || !session.group || !session.classroom) {
    console.warn(
      'Rendering fallback for an invalid class session with missing relational data. Session ID:',
      session.id
    );
    return (
      <td colSpan={session.period_count || 1} className="p-0.5 align-top">
        <div className="h-20 bg-red-100 border-2 border-dashed border-red-300 rounded-md flex flex-col items-center justify-center text-center p-1">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <p className="text-xs font-semibold text-red-700">Invalid Session Data</p>
        </div>
      </td>
    );
  }
  // --- END ADDED CHECK ---
  const isOwner = !!user?.program_id && user.program_id === session.program_id;

  const numberOfPeriods = session.period_count || 1;
  const borderClass =
    isLastInDay && isNotLastInTable ? 'border-r-2 border-dashed border-gray-300' : '';

  const isDragging = currentDraggedSession !== null;
  const isDraggedSession = currentDraggedSession?.id === session.id;
  const instructorHex = session.instructor.color ?? DEFAULT_FALLBACK_COLOR;

  const cellStyle: React.CSSProperties = isOwner
    ? {
        backgroundColor: getSessionCellBgColor(instructorHex, isDraggedSession),
        border: getSessionCellBorderStyle(instructorHex, isDraggedSession),
      }
    : {
        backgroundColor: '#E5E7EB',
        border: 'none',
        opacity: 0.8,
      };

  const textStyle: React.CSSProperties = isOwner
    ? {
        color: getSessionCellTextColor(instructorHex),
      }
    : {
        color: '#4B5563',
      };

  return (
    <td
      colSpan={numberOfPeriods}
      className={`p-0.5 align-top relative ${borderClass}`}
      data-testid={`cell-${groupId}-${periodIndex}`}
    >
      <div className="h-20">
        <div
          draggable={isOwner}
          data-testid={`session-card-${session.id}`}
          onDragStart={(e) =>
            isOwner &&
            onDragStart(e, {
              from: 'timetable',
              class_session_id: session.id,
              class_group_id: groupId,
              period_index: periodIndex,
            })
          }
          onMouseEnter={(e) => onShowTooltip(buildTooltipContent(session), e.currentTarget)}
          onMouseLeave={onHideTooltip}
          className={`relative w-full h-full ${isOwner ? 'cursor-grab' : 'cursor-not-allowed'} ${
            isDraggedSession ? 'opacity-50' : ''
          }`}
        >
          {/* Layer 1: The Visible Block */}
          <div
            className="absolute inset-0 rounded-md flex items-center justify-center p-1 text-center z-10 transition-all duration-200"
            style={cellStyle}
          >
            <p className="font-bold text-xs pointer-events-none" style={textStyle}>
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
