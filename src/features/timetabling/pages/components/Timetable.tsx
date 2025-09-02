import React, { useMemo, useState } from 'react';
import { Clock, RefreshCw } from 'lucide-react';
import type { DragSource } from '../../types/DragSource';
import { useScheduleConfig } from '../../../scheduleConfig/hooks/useScheduleConfig';
import { generateTimetableHeaders } from '../../utils/timeLogic';
import type { ClassGroup } from '../../../classSessionComponents/types';
import type { ClassSession } from '../../../classSessions/types/classSession';
import { TimetableHeader, TimetableRow } from './timetable/index';
import { LoadingSpinner } from '../../../../components/ui';
import TimetableContext from './timetable/TimetableContext';

/**
 * Props for the Timetable component.
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
 * A component that renders the main interactive timetable grid.
 * It provides a context for its children to avoid prop drilling drag-and-drop handlers.
 * @param {TimetableProps} props The props for the component.
 * @returns {JSX.Element} The rendered component.
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
  // --- State & Hooks ---
  const { settings, isLoading: isLoadingConfig } = useScheduleConfig();
  const [dragOverCell, setDragOverCell] = useState<{
    groupId: string;
    periodIndex: number;
  } | null>(null);

  const { dayHeaders, timeHeaders } = useMemo(() => {
    if (!settings) return { dayHeaders: [], timeHeaders: [] };
    return generateTimetableHeaders(settings);
  }, [settings]);

  // --- Drag-and-Drop Event Handlers ---

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, groupId: string, periodIndex: number) => {
    e.stopPropagation();
    setDragOverCell({ groupId, periodIndex });
  };

  const handleGlobalDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverCell(null);
    }
  };

  const handleDrop = (e: React.DragEvent, groupId: string, periodIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    onDropToGrid(e, groupId, periodIndex);
    setDragOverCell(null);
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
    onDragStart,
    onDropToGrid: handleDrop,
    onShowTooltip,
    onHideTooltip,
    onDragEnter: handleDragEnter,
    onDragOver: handleDragOver,
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200"
      onDragLeave={handleGlobalDragLeave}
    >
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Timetable Grid
        </h3>
        <button
          onClick={() => window.location.reload()}
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          aria-label="Refresh Timetable"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
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
              {isLoading ? (
                <tr>
                  <td colSpan={totalPeriods + 1} className="text-center p-8">
                    <LoadingSpinner />
                    <span className="ml-2">Loading timetable...</span>
                  </td>
                </tr>
              ) : (
                groups.map((group) => (
                  <TimetableRow
                    key={group.id}
                    group={group}
                    timetable={timetable}
                    periodsPerDay={periodsPerDay}
                    totalPeriods={totalPeriods}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </TimetableContext.Provider>
    </div>
  );
};

export default Timetable;
