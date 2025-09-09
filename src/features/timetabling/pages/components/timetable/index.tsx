import { Clock, RefreshCw } from 'lucide-react';
import React, { useEffect, useMemo, useState, type JSX } from 'react';
import { LoadingSpinner } from '../../../../../components/ui';
import type { ClassGroup } from '../../../../classSessionComponents/types';
import type { ClassSession } from '../../../../classSessions/types/classSession';
import { useScheduleConfig } from '../../../../scheduleConfig/hooks/useScheduleConfig';
import type { DragSource } from '../../../types/DragSource';
import { generateTimetableHeaders } from '../../../utils/timeLogic';
import checkConflicts from '../../../utils/checkConflicts';
import TimetableContext from './TimetableContext';
import TimetableHeader from './TimetableHeader';
import TimetableRow from './TimetableRow';

/**
 * Props for the Timetable component.
 *
 * @interface TimetableProps
 * @prop {ClassGroup[]} groups - List of class groups to be displayed in the timetable.
 * @prop {Map<string, (ClassSession | null)[]>} timetable - A map of time slots to ClassSessions.
 * @prop {boolean} isLoading - Indicates if the timetable data is still being loaded.
 * @prop {(e: React.DragEvent, source: DragSource) => void} onDragStart - Function for initiating drag events.
 * @prop {(e: React.DragEvent, groupId: string, periodIndex: number) => void} onDropToGrid - Handler for dropping items onto the timetable.
 * @prop {(content: React.ReactNode, target: HTMLElement) => void} onShowTooltip - Function to display a tooltip.
 * @prop {() => void} onHideTooltip - Function to hide the tooltip.
 */
interface TimetableProps {
  groups: ClassGroup[];
  timetable: Map<string, (ClassSession | null)[]>;
  classSessions: ClassSession[];
  isLoading: boolean;
  onDragStart: (e: React.DragEvent, source: DragSource) => void;
  onDropToGrid: (e: React.DragEvent, groupId: string, periodIndex: number) => void;
  onShowTooltip: (content: React.ReactNode, target: HTMLElement) => void;
  onHideTooltip: () => void;
  /** When dragging from outside the Timetable (e.g., Drawer), the active dragged session */
  externalDraggedSession?: ClassSession | null;
}

/**
 * Renders an interactive timetable grid with drag-and-drop functionality.
 * This component provides the timetable context to its child components to avoid prop drilling.
 *
 * @component
 * @example
 * // Example usage of the Timetable component
 * <Timetable
 *   groups={classGroups}
 *   timetable={timetableData}
 *   isLoading={false}
 *   onDragStart={handleDragStart}
 *   onDropToGrid={handleDropToGrid}
 *   onShowTooltip={showTooltip}
 *   onHideTooltip={hideTooltip}
 * />
 *
 * @param {TimetableProps} props - The props for this component.
 * @returns {JSX.Element} The rendered component.
 */
const Timetable: React.FC<TimetableProps> = ({
  groups,
  timetable,
  classSessions,
  isLoading,
  onDragStart,
  onDropToGrid,
  onShowTooltip,
  onHideTooltip,
  externalDraggedSession,
}: TimetableProps): JSX.Element => {
  // --- State & Hooks ---
  const { settings, isLoading: isLoadingConfig } = useScheduleConfig();
  const [dragOverCell, setDragOverCell] = useState<{
    groupId: string;
    periodIndex: number;
  } | null>(null);
  const [currentDraggedSession, setCurrentDraggedSession] = useState<ClassSession | null>(null);
  const [draggedFromGroupId, setDraggedFromGroupId] = useState<string | null>(null);

  const { dayHeaders, timeHeaders } = useMemo(() => {
    if (!settings) return { dayHeaders: [], timeHeaders: [] };
    return generateTimetableHeaders(settings);
  }, [settings]);

  // Determine which dragged session to use (external from Drawer or internal from grid)
  const activeDraggedSession = externalDraggedSession ?? currentDraggedSession;

  // If a drag operation ends outside the grid (e.g., dropped into the Drawer), clear hover state
  useEffect(() => {
    if (externalDraggedSession === null) {
      setDragOverCell(null);
    }
  }, [externalDraggedSession]);

  // --- Conflict Detection Logic ---

  /**
   * Checks if a slot is available for the currently dragged session without conflicts.
   *
   * @param {string} groupId - The ID of the group to check.
   * @param {number} periodIndex - The period index to check.
   * @returns {boolean} True if the slot is available, false otherwise.
   */
  const isSlotAvailable = (groupId: string, periodIndex: number): boolean => {
    if (!activeDraggedSession || !settings) return false;
    // Disallow moving a session to a different group row when dragging from the grid
    if (draggedFromGroupId && draggedFromGroupId !== groupId) {
      return false;
    }

    const conflictMessage = checkConflicts(
      timetable,
      activeDraggedSession,
      settings,
      groupId,
      periodIndex
    );

    return conflictMessage === '';
  };

  // --- Drag-and-Drop Event Handlers ---

  /**
   * Handles drag start events, tracking the currently dragged session.
   * Searches for the session in both the timetable and from external sources.
   *
   * @param {React.DragEvent} e - The drag event.
   * @param {DragSource} source - The drag source information.
   */
  const handleDragStart = (e: React.DragEvent, source: DragSource) => {
    // Find the session being dragged - check timetable first, then all sessions
    let draggedSession = Array.from(timetable.values())
      .flat()
      .find((session) => session?.id === source.class_session_id);

    // If not found in timetable (dragging from drawer), find in classSessions
    if (!draggedSession) {
      draggedSession =
        classSessions.find((session) => session.id === source.class_session_id) || null;
    }

    setCurrentDraggedSession(draggedSession);
    // Track origin group only when dragging from the timetable grid
    if (source.from === 'timetable' && 'class_group_id' in source) {
      setDraggedFromGroupId(source.class_group_id as string);
    } else {
      setDraggedFromGroupId(null);
    }
    onDragStart(e, source);
  };

  /**
   * Handles drag over events, allowing drag-and-drop interaction.
   *
   * @param {React.DragEvent} e - The drag event.
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  /**
   * Handles the drag enter event for specific cells.
   *
   * @param {React.DragEvent} e - The drag event.
   * @param {string} groupId - The ID of the group the event is associated with.
   * @param {number} periodIndex - The index of the period within the group.
   */
  const handleDragEnter = (e: React.DragEvent, groupId: string, periodIndex: number) => {
    e.stopPropagation();
    setDragOverCell({ groupId, periodIndex });
  };

  /**
   * Handles the drag leave event for specific cells.
   *
   * @param {React.DragEvent} e - The drag event.
   */
  const handleDragLeave = (e: React.DragEvent) => {
    const currentTarget = e.currentTarget as HTMLElement;
    const related = e.relatedTarget as Node | null;
    // Only clear if the drag actually left this element and not moved to a child
    if (!related || !currentTarget.contains(related)) {
      setDragOverCell(null);
    }
  };

  /**
   * Handles the global drag leave event.
   *
   * @param {React.DragEvent} e - The drag event.
   */
  const handleGlobalDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverCell(null);
    }
  };

  /**
   * Handles the drop event on the timetable grid.
   *
   * @param {React.DragEvent} e - The drop event.
   * @param {string} groupId - The group ID for the drop target.
   * @param {number} periodIndex - The period index for the drop target.
   */
  const handleDrop = (e: React.DragEvent, groupId: string, periodIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    onDropToGrid(e, groupId, periodIndex);
    // Clean up drag state after drop
    setDragOverCell(null);
    setCurrentDraggedSession(null);
    setDraggedFromGroupId(null);
  };

  /**
   * Handles the global drag end event to clean up state.
   */
  const handleDragEnd = () => {
    setCurrentDraggedSession(null);
    setDragOverCell(null);
    setDraggedFromGroupId(null);
  };

  // --- Render Logic ---

  if (isLoadingConfig || !settings) {
    return (
      <div className="flex justify-center items-center p-8">
        <LoadingSpinner />
        <span className="ml-2">Loading configuration...</span>
      </div>
    );
  }

  const periodsPerDay = settings.periods_per_day;
  const totalPeriods = settings.class_days_per_week * periodsPerDay;

  // The value provided to the context, combining state and handlers.
  const contextValue = {
    dragOverCell,
    currentDraggedSession: activeDraggedSession,
    isSlotAvailable,
    onDragStart: handleDragStart,
    onDropToGrid: handleDrop,
    onShowTooltip,
    onHideTooltip,
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDragOver: handleDragOver,
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200"
      onDragLeave={handleGlobalDragLeave}
      onDragEnd={handleDragEnd}
      onDrop={handleDragEnd} // Also clean up on any drop to this container
    >
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Timetable Grid
        </h3>
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-gray-500 animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Syncing...</span>
          </div>
        )}
      </div>

      <TimetableContext.Provider value={contextValue}>
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed border-collapse">
            <TimetableHeader
              dayHeaders={dayHeaders}
              timeHeaders={timeHeaders}
              periodsPerDay={periodsPerDay}
            />
            <tbody>
              {groups.map((group) => (
                <TimetableRow
                  key={group.id}
                  group={group}
                  timetable={timetable}
                  periodsPerDay={periodsPerDay}
                  totalPeriods={totalPeriods}
                />
              ))}
            </tbody>
          </table>
        </div>
      </TimetableContext.Provider>
    </div>
  );
};

export default Timetable;
