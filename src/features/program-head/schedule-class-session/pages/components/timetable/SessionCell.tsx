import React from 'react';
import type { ClassSession } from '@/types/classSession';
import { useTimetableContext } from './useTimetableContext';
import {
  DEFAULT_FALLBACK_COLOR,
  getSessionCellBgColor,
  getSessionCellBorderStyle,
  getSessionCellTextColor,
} from '@/lib/colorUtils';
import { useAuth } from '@/features/shared/auth/hooks/useAuth';
import { AlertTriangle, Users, Clock } from 'lucide-react';
import { useMemo } from 'react';
import { checkCellSoftConflicts } from '../../../utils/checkConflicts';

// --- PROPS ---

interface SessionCellProps {
  sessions: ClassSession[];
  groupId: string;
  periodIndex: number;
  isLastInDay: boolean;
  isNotLastInTable: boolean;
  viewMode: 'class-group' | 'classroom' | 'instructor';
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
  softConflicts: string[];
  contextOnShowTooltip: (content: React.ReactNode, target: HTMLElement) => void;
}

// --- HELPER FUNCTIONS & COMPONENTS ---

/**
 * Builds the JSX content for a class session tooltip, adapting for merged sessions and view mode.
 *
 * @param sessions - An array of class sessions in this cell.
 * @param viewMode - The current view mode.
 * @returns The JSX element to be rendered inside the tooltip.
 */
const buildTooltipContent = (
  sessions: ClassSession[],
  viewMode: 'class-group' | 'classroom' | 'instructor'
): React.ReactElement => {
  const primary = sessions[0];

  if (viewMode === 'classroom') {
    return (
      <>
        <p className="font-bold text-sm">{primary.course.name}</p>
        <p className="text-gray-300">{primary.course.code}</p>
        <p className="mt-1">Class Group: {primary.group.name}</p>
        <p>
          Instructor: {primary.instructor.first_name} {primary.instructor.last_name}
        </p>
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
  } else if (viewMode === 'instructor') {
    return (
      <>
        <p className="font-bold text-sm">{primary.course.name}</p>
        <p className="text-gray-300">{primary.course.code}</p>
        <p className="mt-1">Class Group: {primary.group.name}</p>
        <p className="text-gray-300">{primary.instructor.contract_type}</p>
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
  }

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

const createCellBackground = (
  sessions: ClassSession[],
  isDragged: boolean
): React.CSSProperties => {
  const primarySession = sessions[0];
  const instructorColor = primarySession?.instructor?.color ?? DEFAULT_FALLBACK_COLOR;
  const border = getSessionCellBorderStyle(instructorColor, isDragged);

  if (sessions.length === 1) {
    return {
      backgroundColor: getSessionCellBgColor(instructorColor, isDragged),
      border,
    };
  }

  const color1 = getSessionCellBgColor(instructorColor, isDragged);

  if (sessions.length > 1 && sessions[1]?.instructor?.color !== primarySession?.instructor?.color) {
    const color2 = getSessionCellBgColor(
      sessions[1]?.instructor?.color ?? DEFAULT_FALLBACK_COLOR,
      isDragged
    );
    const background = `linear-gradient(135deg, ${color1}, ${color2})`;
    return { background, border };
  }

  const background = `linear-gradient(to bottom right, transparent 49.5%, rgba(0,0,0,0.15) 50.5%), ${color1}`;
  return { background, border };
};

const useSessionCellStyles = (
  sessions: ClassSession[],
  isOwnSession: boolean,
  isPending: boolean,
  isHighlighted: boolean,
  isDraggedSession: boolean
) => {
  const primarySession = sessions[0];
  const instructorColor = primarySession?.instructor?.color ?? DEFAULT_FALLBACK_COLOR;
  let cellStyle: React.CSSProperties;

  if (!isOwnSession) {
    cellStyle = { backgroundColor: '#E5E7EB', border: 'none', opacity: 0.8 };
  } else {
    const baseStyle = createCellBackground(sessions, isDraggedSession);
    if (isPending) {
      cellStyle = { ...baseStyle, border: '2px dashed #F59E0B', opacity: 0.7 };
    } else if (isHighlighted) {
      cellStyle = {
        ...baseStyle,
        border: '3px solid #10B981',
        boxShadow: '0 0 12px rgba(16, 185, 129, 0.6)',
      };
    } else {
      cellStyle = baseStyle;
    }
  }

  const textStyle: React.CSSProperties = isOwnSession
    ? { color: getSessionCellTextColor(instructorColor) }
    : { color: '#4B5563' };

  return { cellStyle, textStyle };
};

const VisibleSessionBlock: React.FC<VisibleBlockProps> = ({
  sessions,
  isOwner,
  isDraggedSession,
  cellStyle,
  textStyle,
  onShowTooltip,
  onHideTooltip,
  softConflicts,
  contextOnShowTooltip,
}) => {
  const primarySession = sessions[0];
  const isMerged = sessions.length > 1;
  const hasSoftConflicts = softConflicts.length > 0;

  return (
    <div
      data-testid={`session-card-${primarySession.id}`}
      onMouseEnter={onShowTooltip}
      onMouseLeave={onHideTooltip}
      className={`relative w-full h-full ${isOwner ? 'cursor-grab' : 'cursor-not-allowed'} ${
        isDraggedSession ? 'opacity-50' : ''
      }`}
    >
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
        {hasSoftConflicts && (
          <div
            className="absolute top-1 left-1 bg-yellow-400 rounded-full p-0.5 cursor-help z-20"
            onMouseEnter={(e) => {
              e.stopPropagation();
              contextOnShowTooltip(
                <div>
                  <p className="font-semibold">Warnings:</p>
                  <ul className="list-disc list-inside">
                    {softConflicts.map((conflict, i) => (
                      <li key={i}>{conflict}</li>
                    ))}
                  </ul>
                </div>,
                e.currentTarget as HTMLElement
              );
            }}
            onMouseLeave={onHideTooltip}
          >
            <AlertTriangle className="w-3 h-3 text-black" />
          </div>
        )}
      </div>
    </div>
  );
};

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

// Add helper functions outside SessionCell to reduce cognitive complexity
function isSessionDataInvalid(session: ClassSession | undefined) {
  return !session?.instructor || !session?.course || !session?.group || !session?.classroom;
}

function findOwnSession(sessions: ClassSession[], userProgramId: string | undefined) {
  if (!sessions || !userProgramId) return undefined;
  return sessions.find((s) => s.program_id === userProgramId);
}

function computeSessionState(
  sessions: ClassSession[],
  primarySession: ClassSession | undefined,
  ownSession: ClassSession | undefined,
  activeDraggedSession: { id: string } | null,
  pendingSessionIds: Set<string> | undefined,
  highlightPeriod: number | undefined,
  highlightGroup: string | undefined,
  periodIndex: number,
  groupId: string
) {
  const isOwnSession = !!ownSession;
  const isDraggedSession =
    activeDraggedSession && sessions
      ? sessions.some((s) => s.id === activeDraggedSession.id)
      : false;
  const isPending =
    primarySession && pendingSessionIds ? pendingSessionIds.has(primarySession.id) : false;
  const isHighlighted = highlightPeriod === periodIndex && highlightGroup === groupId;

  return { isOwnSession, isDraggedSession, isPending, isHighlighted };
}

function createDragStartHandler(
  isOwnSession: boolean,
  ownSession: ClassSession | undefined,
  isPending: boolean,
  periodIndex: number,
  handleDragStart: (
    e: React.DragEvent,
    source: {
      from: 'timetable';
      class_session_id: string;
      class_group_id: string;
      period_index: number;
    }
  ) => void
) {
  return (e: React.DragEvent) => {
    if (isOwnSession && ownSession && !isPending) {
      handleDragStart(e, {
        from: 'timetable',
        class_session_id: ownSession.id,
        class_group_id: ownSession.group.id,
        period_index: periodIndex,
      });
    }
  };
}

function computeBorderClass(isLastInDay: boolean, isNotLastInTable: boolean) {
  return isLastInDay && isNotLastInTable ? 'border-r-2 border-dashed border-gray-300' : '';
}

// --- MAIN COMPONENT ---

/**
 * Renders a timetable session cell, handling drag-and-drop, visual indicators, and session details.
 *
 * @param props Component props.
 * @param props.sessions Array of class sessions in this cell.
 * @param props.groupId The group ID for this cell.
 * @param props.periodIndex The time period index.
 * @param props.isLastInDay True if this is the last cell in the day.
 * @param props.isNotLastInTable True if this is not the last cell in the table.
 * @param props.viewMode View mode for rendering.
 * @returns The rendered timetable session cell.
 */
const SessionCell: React.FC<SessionCellProps> = ({
  sessions,
  groupId,
  periodIndex,
  isLastInDay,
  isNotLastInTable,
  viewMode,
}) => {
  const {
    activeDraggedSession,
    handleDragStart,
    onShowTooltip: contextOnShowTooltip,
    onHideTooltip,
    pendingSessionIds,
    highlightPeriod,
    highlightGroup,
  } = useTimetableContext();
  const { user } = useAuth();

  const primarySession = sessions && sessions[0];
  const ownSession = findOwnSession(sessions || [], user?.program_id ?? undefined);
  const sessionState = computeSessionState(
    sessions || [],
    primarySession,
    ownSession,
    activeDraggedSession,
    pendingSessionIds,
    highlightPeriod,
    highlightGroup,
    periodIndex,
    groupId
  );
  const { isOwnSession, isDraggedSession, isPending, isHighlighted } = sessionState;

  const { cellStyle, textStyle } = useSessionCellStyles(
    Array.isArray(sessions) ? sessions : [],
    isOwnSession,
    isPending,
    isHighlighted,
    isDraggedSession
  );
  const softConflicts = useMemo(() => checkCellSoftConflicts(sessions), [sessions]);

  // Early outs
  if (!sessions || sessions.length === 0) return <td className="p-0.5 align-top h-20" />;
  if (isSessionDataInvalid(primarySession))
    return <InvalidSessionCell periodCount={primarySession?.period_count || 1} />;

  const handleShowTooltip = (e: React.MouseEvent<HTMLElement>) => {
    contextOnShowTooltip(buildTooltipContent(sessions, viewMode), e.currentTarget as HTMLElement);
  };
  const onDragStart = createDragStartHandler(
    isOwnSession,
    ownSession,
    isPending,
    periodIndex,
    handleDragStart
  );
  const isDragging = activeDraggedSession !== null;
  const numberOfPeriods = primarySession.period_count || 1;
  const borderClass = computeBorderClass(isLastInDay, isNotLastInTable);

  return (
    <td
      colSpan={numberOfPeriods}
      className={`p-0.5 align-top relative ${borderClass}`}
      data-testid={`cell-${groupId}-${periodIndex}`}
    >
      <div className="h-20">
        <div
          className="relative w-full h-full"
          draggable={isOwnSession && !isPending}
          onDragStart={onDragStart}
        >
          {isPending && (
            <div className="absolute top-1 right-1 bg-amber-400 rounded-full p-0.5 z-30">
              <Clock className="w-3 h-3 text-black" />
            </div>
          )}
          <VisibleSessionBlock
            sessions={sessions}
            isOwner={isOwnSession}
            isDraggedSession={isDraggedSession}
            cellStyle={cellStyle}
            textStyle={textStyle}
            onShowTooltip={handleShowTooltip}
            onHideTooltip={onHideTooltip}
            softConflicts={softConflicts}
            contextOnShowTooltip={contextOnShowTooltip}
          />
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
