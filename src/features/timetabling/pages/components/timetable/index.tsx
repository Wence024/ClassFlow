import { Clock, RefreshCw } from 'lucide-react';
import React, { useMemo, type JSX } from 'react';
import { LoadingSpinner } from '../../../../../components/ui';
import type { ClassGroup } from '../../../../classSessionComponents/types';
import type { ClassSession } from '../../../../classSessions/types/classSession';
import { useScheduleConfig } from '../../../../scheduleConfig/hooks/useScheduleConfig';
import type { DragSource } from '../../../types/DragSource';
import { generateTimetableHeaders } from '../../../utils/timeLogic';
import TimetableContext from './TimetableContext';
import TimetableHeader from './TimetableHeader';
import TimetableRow from './TimetableRow';

// TODO: Apply refactor to prop drilling later

/**
 * Props for the Timetable component.
 */
interface TimetableProps {
  groups: ClassGroup[];
  timetable: Map<string, (ClassSession | null)[]>;
  isLoading: boolean;

  // D&D Props from parent hook
  draggedSession: ClassSession | null;
  dragOverCell: { groupId: string; periodIndex: number } | null;
  isSlotAvailable: (groupId: string, periodIndex: number) => boolean;
  onDragStart: (e: React.DragEvent, source: DragSource) => void;
  onDropToGrid: (e: React.DragEvent, groupId: string, periodIndex: number) => void;
  onDragEnter: (e: React.DragEvent, groupId: string, periodIndex: number) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;

  // Tooltip Props
  onShowTooltip: (content: React.ReactNode, target: HTMLElement) => void;
  onHideTooltip: () => void;
}

/**
 * Renders an interactive timetable grid.
 * This component has been refactored to be a pure presentational component.
 * It receives all drag-and-drop state and handlers from a parent component
 * and provides them to its children via TimetableContext.
 *
 * @param tt The props for the component.
 * @param tt.groups An array of class groups to display in the timetable.
 * @param tt.timetable A map representing the timetable data.
 * @param tt.isLoading Boolean indicating if the timetable data is currently loading.
 * @param tt.draggedSession The class session currently being dragged.
 * @param tt.dragOverCell The cell over which a draggable item is currently hovered.
 * @param tt.isSlotAvailable Function to check if a given slot is available for dropping.
 * @param tt.onDragStart Callback function for when a drag operation starts.
 * @param tt.onDropToGrid Callback function for when a draggable item is dropped onto the grid.
 * @param tt.onDragEnter Callback function for when a draggable item enters a droppable area.
 * @param tt.onDragLeave Callback function for when a draggable item leaves a droppable area.
 * @param tt.onDragOver Callback function for when a draggable item is dragged over a droppable area.
 * @param tt.onShowTooltip Callback function to display a tooltip.
 * @param tt.onHideTooltip Callback function to hide the tooltip.
 * @returns The rendered timetable grid.
 */
const Timetable: React.FC<TimetableProps> = ({
  groups,
  timetable,
  isLoading,
  draggedSession,
  dragOverCell,
  isSlotAvailable,
  onDragStart,
  onDropToGrid,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onShowTooltip,
  onHideTooltip,
}: TimetableProps): JSX.Element => {
  const { settings, isLoading: isLoadingConfig } = useScheduleConfig();

  const { dayHeaders, timeHeaders } = useMemo(() => {
    if (!settings) return { dayHeaders: [], timeHeaders: [] };
    return generateTimetableHeaders(settings);
  }, [settings]);

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

  // The value provided to the context now comes directly from props.
  const contextValue = {
    dragOverCell,
    currentDraggedSession: draggedSession,
    isSlotAvailable,
    onDragStart,
    onDropToGrid,
    onShowTooltip,
    onHideTooltip,
    onDragEnter,
    onDragLeave,
    onDragOver,
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200"
      onDragLeave={onDragLeave}
      onDragOver={onDragOver} // onDragOver is needed here to allow dropping
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
