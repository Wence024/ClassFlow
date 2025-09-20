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

// --- PROPS ---

interface SessionCellProps {
  session: ClassSession;
  groupId: string;
  periodIndex: number;
  isLastInDay: boolean;
  isNotLastInTable: boolean;
}

interface DropZoneProps {
  groupId: string;
  periodIndex: number;
  sessionInCell: ClassSession;
}

interface VisibleBlockProps {
  session: ClassSession;
  isOwner: boolean;
  isDraggedSession: boolean;
  cellStyle: React.CSSProperties;
  textStyle: React.CSSProperties;
  onDragStart: (e: React.DragEvent) => void;
  onShowTooltip: (e: React.MouseEvent<HTMLElement>) => void;
  onHideTooltip: () => void;
}

// --- HELPER FUNCTIONS & COMPONENTS ---

/**
 * Builds the JSX content for a class session tooltip.
 *
 * @param session - The class session object.
 * @returns The JSX element to be rendered inside the tooltip.
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
 * Renders a fallback UI for a class session with invalid or missing relational data.
 *
 * @param isc - The component props.
 * @param isc.session - The invalid class session data.
 * @returns The rendered fallback table cell component.
 */
const InvalidSessionCell = ({ session }: { session: ClassSession }) => {
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
};

/**
 * Renders the visible, colored, and draggable block representing the session.
 *
 * @param vsb - The props for the component.
 * @param vsb.session - The class session data to display.
 * @param vsb.isOwner - Whether the current user owns this session, controlling draggable status.
 * @param vsb.isDraggedSession - Whether this is the specific session currently being dragged.
 * @param vsb.cellStyle - The calculated CSS styles for the cell's background and border.
 * @param vsb.textStyle - The calculated CSS styles for the text.
 * @param vsb.onDragStart - The callback handler for the drag start event.
 * @param vsb.onShowTooltip - The callback handler for showing the tooltip on mouse enter.
 * @param vsb.onHideTooltip - The callback handler for hiding the tooltip on mouse leave.
 * @returns The rendered visible block component.
 */
const VisibleSessionBlock: React.FC<VisibleBlockProps> = ({
  session,
  isOwner,
  isDraggedSession,
  cellStyle,
  textStyle,
  onDragStart,
  onShowTooltip,
  onHideTooltip,
}) => (
  <div
    draggable={isOwner}
    data-testid={`session-card-${session.id}`}
    onDragStart={onDragStart}
    onMouseEnter={onShowTooltip}
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
  </div>
);

/**
 * Renders an invisible drop zone that overlays a session cell period, providing visual feedback on hover.
 * It consumes D&D logic directly from the `TimetableContext`.
 *
 * @param dz - The props for the component.
 * @param dz.groupId - The ID of the group row this drop zone belongs to.
 * @param dz.periodIndex - The specific period index of this drop zone within the row.
 * @param dz.sessionInCell - The session contained within the parent cell, used to prevent dropping on itself.
 * @returns The rendered DropZone component.
 */
const DropZone: React.FC<DropZoneProps> = ({ groupId, periodIndex, sessionInCell }) => {
  const {
    dragOverCell,
    activeDraggedSession,
    isSlotAvailable,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDropToGrid,
  } = useTimetableContext();

  const isDragging = activeDraggedSession !== null;
  const isSelf = activeDraggedSession?.id === sessionInCell.id;

  const isDragOver = dragOverCell?.groupId === groupId && dragOverCell?.periodIndex === periodIndex;
  const isSlotValidForDrop = isDragging && !isSelf && isSlotAvailable(groupId, periodIndex);

  return (
    <div
      className="flex-1"
      onDragEnter={(e) => handleDragEnter(e, groupId, periodIndex)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDropToGrid(e, groupId, periodIndex)}
    >
      {isDragOver && (
        <div
          className={`w-full h-full rounded-md pointer-events-none ${
            isSlotValidForDrop ? 'bg-green-200 bg-opacity-50' : 'bg-red-200 bg-opacity-50'
          }`}
        />
      )}
      {isDragging && !isSelf && isSlotValidForDrop && !isDragOver && (
        <div className="w-full h-full flex items-center justify-center pointer-events-none">
          <div className="w-2 h-2 bg-green-500 rounded-full opacity-60" />
        </div>
      )}
    </div>
  );
};

// --- MAIN COMPONENT ---

/**
 * Renders a table cell (`<td>`) containing a class session.
 * This component orchestrates the rendering of the visible session block and the
 * invisible, interactive drop zones that overlay it. It derives all its interactive
 * logic and state from the `TimetableContext`.
 *
 * @param sc - The props for the component.
 * @param sc.session - The class session data for this cell.
 * @param sc.groupId - The ID of the group row this cell belongs to.
 * @param sc.periodIndex - The starting period index of the cell.
 * @param sc.isLastInDay - Whether this is the last cell in a day's block, used for styling.
 * @param sc.isNotLastInTable - Whether this is not the last cell in the entire row, used for styling.
 * @returns The rendered `SessionCell` component.
 */
const SessionCell: React.FC<SessionCellProps> = ({
  session,
  groupId,
  periodIndex,
  isLastInDay,
  isNotLastInTable,
}) => {
  const { activeDraggedSession, handleDragStart, onShowTooltip, onHideTooltip } =
    useTimetableContext();
  const { user } = useAuth();

  // --- Data and State Calculation ---
  const isDataInvalid =
    !session.instructor || !session.course || !session.group || !session.classroom;
  if (isDataInvalid) {
    return <InvalidSessionCell session={session} />;
  }

  const isOwner = !!user?.program_id && user.program_id === session.program_id;
  const isDraggedSession = activeDraggedSession?.id === session.id;
  const instructorHex = session.instructor.color ?? DEFAULT_FALLBACK_COLOR;
  const numberOfPeriods = session.period_count || 1;

  const cellStyle: React.CSSProperties = isOwner
    ? {
        backgroundColor: getSessionCellBgColor(instructorHex, isDraggedSession),
        border: getSessionCellBorderStyle(instructorHex, isDraggedSession),
      }
    : { backgroundColor: '#E5E7EB', border: 'none', opacity: 0.8 };

  const textStyle: React.CSSProperties = isOwner
    ? { color: getSessionCellTextColor(instructorHex) }
    : { color: '#4B5563' };

  const borderClass =
    isLastInDay && isNotLastInTable ? 'border-r-2 border-dashed border-gray-300' : '';

  return (
    <td
      colSpan={numberOfPeriods}
      className={`p-0.5 align-top relative ${borderClass}`}
      data-testid={`cell-${groupId}-${periodIndex}`}
    >
      <div className="h-20">
        <div className="relative w-full h-full">
          <VisibleSessionBlock
            session={session}
            isOwner={isOwner}
            isDraggedSession={isDraggedSession}
            cellStyle={cellStyle}
            textStyle={textStyle}
            onDragStart={(e) =>
              handleDragStart(e, {
                from: 'timetable',
                class_session_id: session.id,
                class_group_id: groupId,
                period_index: periodIndex,
              })
            }
            onShowTooltip={(e) => onShowTooltip(buildTooltipContent(session), e.currentTarget)}
            onHideTooltip={onHideTooltip}
          />

          {/* Layer 2: The Invisible Drop Zones */}
          <div className="absolute inset-0 flex z-20">
            {Array.from({ length: numberOfPeriods }).map((_, i) => (
              <DropZone
                key={periodIndex + i}
                groupId={groupId}
                periodIndex={periodIndex + i}
                sessionInCell={session}
              />
            ))}
          </div>
        </div>
      </div>
    </td>
  );
};

export default SessionCell;
