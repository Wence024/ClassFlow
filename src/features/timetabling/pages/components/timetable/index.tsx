import { Clock, RefreshCw } from 'lucide-react';
import React, { useMemo, type JSX } from 'react';
import { LoadingSpinner } from '../../../../../components/ui';
import type { ClassGroup } from '../../../../classSessionComponents/types';
import type { ClassSession } from '../../../../classSessions/types/classSession';
import { useScheduleConfig } from '../../../../scheduleConfig/hooks/useScheduleConfig';
import { generateTimetableHeaders } from '../../../utils/timeLogic';
import { useAuth } from '../../../../auth/hooks/useAuth';
import TimetableHeader from './TimetableHeader';
import TimetableRow from './TimetableRow';
import { useTimetableContext } from './useTimetableContext';

interface TimetableProps {
  groups: ClassGroup[];
  timetable: Map<string, (ClassSession[] | null)[]>;
  isLoading: boolean;
}

/**
 * Renders an interactive, multi-program timetable grid.
 *
 * This component is a pure view component that consumes its interaction logic
 * (like drag-and-drop handlers) from the `TimetableContext`, which is provided
 * by a parent component (`TimetablePage`). It is responsible for structuring the
 * table and mapping over groups to render `TimetableRow` components.
 *
 * @param t - The props for the component.
 * @param t.groups - An array of all class groups to display as rows in the timetable.
 * @param t.timetable - A Map where keys are group IDs and values are arrays of sessions or nulls, representing the schedule.
 * @param t.isLoading - A boolean indicating if the timetable data is currently being synced or re-fetched.
 * @returns The rendered timetable grid component.
 */
const Timetable: React.FC<TimetableProps> = ({
  groups,
  timetable,
  isLoading,
}: TimetableProps): JSX.Element => {
  const { user } = useAuth();
  const { settings, isLoading: isLoadingConfig } = useScheduleConfig();
  const { handleDragLeave, handleDragOver } = useTimetableContext();

  const myGroups = useMemo(
    () => groups.filter((group) => group.program_id === user?.program_id),
    [groups, user]
  );

  const otherGroups = useMemo(
    () => groups.filter((group) => group.program_id !== user?.program_id),
    [groups, user]
  );

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

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200"
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
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
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed border-collapse">
          <TimetableHeader
            dayHeaders={dayHeaders}
            timeHeaders={timeHeaders}
            periodsPerDay={periodsPerDay}
          />
          <tbody>
            {/* Render the user's own groups first */}
            {myGroups.map((group) => (
              <TimetableRow
                key={group.id}
                group={group}
                timetable={timetable}
                periodsPerDay={periodsPerDay}
                totalPeriods={totalPeriods}
              />
            ))}

            {/* If there are other groups, render a visual separator and then the other groups */}
            {otherGroups.length > 0 && (
              <tr>
                <td
                  colSpan={totalPeriods + 1}
                  className="p-2 text-center text-sm font-semibold text-gray-600 bg-gray-100 border-y-2 border-gray-300"
                >
                  Schedules from Other Programs
                </td>
              </tr>
            )}

            {/* Render the groups from other programs */}
            {otherGroups.map((group) => (
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
    </div>
  );
};

export default Timetable;
