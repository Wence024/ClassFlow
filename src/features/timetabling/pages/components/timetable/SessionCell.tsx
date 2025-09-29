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
import { AlertTriangle, Users } from 'lucide-react';

// --- PROPS ---

interface SessionCellProps {
  sessions: ClassSession[];
  groupId: string;
  periodIndex: number;
  isLastInDay: boolean;
  isNotLastInTable: boolean;
}

interface DropZoneProps {
  groupId: string;
  periodIndex: number;
  sessionsInCell: ClassSession[];
}

interface VisibleBlockProps {
  sessions: ClassSession[];
  isOwner: boolean;
  isDraggedSession: boolean;
  cellStyle: React.CSSProperties;
  textStyle: React.CSSProperties;
  onShowTooltip: (e: React.MouseEvent<HTMLElement>) => void;
  onHideTooltip: () => void;
}

// --- HELPER FUNCTIONS & COMPONENTS ---

/**
 * Builds the JSX content for a class session tooltip, adapting for merged sessions.
 *
 * @param sessions - An array of class sessions in this cell.
 * @returns The JSX element to be rendered inside the tooltip.
 */
const buildTooltipContent = (sessions: ClassSession[]) => {
  const primary = sessions[0];
  return (
    <>
      <p className="font-bold text-sm">{primary.course.name}</p>
      <p className="text-gray-300">{primary.course.code}</p>
      <p className="mt-1">
        Instructor: {primary.instructor.first_name} {primary.instructor.last_name}
      </p>
      <p>Classroom: {primary.classroom.name}</p>
      {sessions.length > 1 && (
        <>
          <hr className="my-1 border-gray-400" />
          <p className="font-semibold">Merged Groups:</p>
          <ul className="list-disc list-inside">
            {sessions.map((s) => (
              <li key={s.id}>{s.group.name}</li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

/**
 * Renders a fallback UI for a class session with invalid or missing relational data.
 */
const InvalidSessionCell = ({ periodCount }: { periodCount: number }) => {
  console.warn('Rendering fallback for an invalid class session with missing relational data.');
  return (
    <td colSpan={periodCount} className="p-0.5 align-top">
      <div className="h-20 bg-red-100 border-2 border-dashed border-red-300 rounded-md flex flex-col items-center justify-center text-center p-1">
        <AlertTriangle className="w-4 h-4 text-red-600" />
        <p className="text-xs font-semibold text-red-700">Invalid Session Data</p>
      </div>
    </td>
  );
};

/**
 * Creates a background style for the session cell.
 * For a single session, it's a solid color. For merged sessions, it's a linear gradient.
 */
const createCellBackground = (
  sessions: ClassSession[],
  isDragged: boolean
): React.CSSProperties => {
  const primarySession = sessions[0];
  const border = getSessionCellBorderStyle(
    primarySession.instructor.color ?? DEFAULT_FALLBACK_COLOR,
    isDragged
  );

  if (sessions.length === 1) {
    return {
      backgroundColor: getSessionCellBgColor(
        primarySession.instructor.color ?? DEFAULT_FALLBACK_COLOR,
        isDragged
      ),
      border,
    };
  }

  // Create a gradient from the unique instructor colors
  const uniqueColors = [
    ...new Set(
      sessions.map((s) =>
        getSessionCellBgColor(s.instructor.color ?? DEFAULT_FALLBACK_COLOR, isDragged)
      )
    ),
  ];

  const background =
    uniqueColors.length > 1
      ? `linear-gradient(135deg, ${uniqueColors.join(', ')})`
      : uniqueColors[0];

  return { background, border };
};

/**
 * Renders the visible, colored, and draggable block representing the session(s).
 */
const VisibleSessionBlock: React.FC<VisibleBlockProps> = ({
  sessions,
  isOwner,
  isDraggedSession,
  cellStyle,
  textStyle,
  onShowTooltip,
  onHideTooltip,
}) => {
  const primarySession = sessions[0];
  const isMerged = sessions.length > 1;

  return (
    <div
      data-testid={`session-card-${primarySession.id}`}
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
          {primarySession.course.code}
        </p>
        {isMerged && (
          <div
            className="absolute bottom-1 right-1 flex items-center gap-1 rounded-full px-1.5 py-0.5"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
          >
            <Users className="w-2.5 h-2.5" style={textStyle} />
            <span className="text-xs font-bold" style={textStyle}>
              {sessions.length}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Renders an invisible drop zone that overlays a session cell period.
 */
const DropZone: React.FC<DropZoneProps> = ({ groupId, periodIndex, sessionsInCell }) => {
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
  const isSelf = sessionsInCell.some((s) => s.id === activeDraggedSession?.id);

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
 * Renders a table cell (`<td>`) containing one or more class sessions.
 * This component handles both single and merged class sessions.
 */
const SessionCell: React.FC<SessionCellProps> = ({
  sessions,
  groupId,
  periodIndex,
  isLastInDay,
  isNotLastInTable,
}) => {
  const { activeDraggedSession, handleDragStart, onShowTooltip, onHideTooltip } =
    useTimetableContext();
  const { user } = useAuth();

  // --- Data and State Calculation ---
  if (!sessions || sessions.length === 0) {
    return <td className="p-0.5 align-top h-20" />;
  }

  const primarySession = sessions[0];
  const isDataInvalid =
    !primarySession.instructor ||
    !primarySession.course ||
    !primarySession.group ||
    !primarySession.classroom;

  if (isDataInvalid) {
    return <InvalidSessionCell periodCount={primarySession.period_count || 1} />;
  }

  const isOwner = !!user?.program_id && sessions.some((s) => s.program_id === user.program_id);
  const isDraggedSession = sessions.some((s) => s.id === activeDraggedSession?.id);
  const isDragging = activeDraggedSession !== null;
  const numberOfPeriods = primarySession.period_count || 1;

  const draggableSession = isOwner ? sessions.find((s) => s.program_id === user?.program_id) : null;

  const cellStyle = isOwner
    ? createCellBackground(sessions, isDraggedSession)
    : { backgroundColor: '#E5E7EB', border: 'none', opacity: 0.8 };

  const textStyle: React.CSSProperties = isOwner
    ? { color: getSessionCellTextColor(primarySession.instructor.color ?? DEFAULT_FALLBACK_COLOR) }
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
        <div
          className="relative w-full h-full"
          draggable={isOwner}
          onDragStart={(e) => {
            if (isOwner && draggableSession) {
              handleDragStart(e, {
                from: 'timetable',
                class_session_id: draggableSession.id,
                class_group_id: draggableSession.group.id,
                period_index: periodIndex,
              });
            }
          }}
        >
          <VisibleSessionBlock
            sessions={sessions}
            isOwner={isOwner}
            isDraggedSession={isDraggedSession}
            cellStyle={cellStyle}
            textStyle={textStyle}
            onShowTooltip={(e) => onShowTooltip(buildTooltipContent(sessions), e.currentTarget)}
            onHideTooltip={onHideTooltip}
          />

          {/* Layer 2: The Invisible Drop Zones */}
          <div className={`absolute inset-0 flex z-20 ${!isDragging ? 'pointer-events-none' : ''}`}>
            {Array.from({ length: numberOfPeriods }).map((_, i) => (
              <DropZone
                key={periodIndex + i}
                groupId={groupId}
                periodIndex={periodIndex + i}
                sessionsInCell={sessions}
              />
            ))}
          </div>
        </div>
      </div>
    </td>
  );
};

export default SessionCell;