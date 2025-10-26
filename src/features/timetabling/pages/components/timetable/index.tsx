import { Clock, RefreshCw } from 'lucide-react';
import React, { useMemo, type JSX } from 'react';
import { LoadingSpinner } from '../../../../../components/ui';
import type { ClassGroup, Classroom, Instructor } from '../../../../classSessionComponents/types';
import type { ClassSession } from '../../../../classSessions/types/classSession';
import { useScheduleConfig } from '../../../../scheduleConfig/hooks/useScheduleConfig';
import { generateTimetableHeaders } from '../../../utils/timeLogic';
import { useAuth } from '../../../../auth/hooks/useAuth';
import type { TimetableViewMode } from '../../../types/timetable';
import type { TimetableRowResource } from '../../../utils/timetableLogic';
import TimetableHeader from './TimetableHeader';
import TimetableRow from './TimetableRow';
import { useTimetableContext } from './useTimetableContext';

interface TimetableProps {
  viewMode: TimetableViewMode;
  groups: ClassGroup[];
  resources: TimetableRowResource[];
  timetable: Map<string, (ClassSession[] | null)[]>;
  isLoading: boolean;
}

/**
 * Renders an interactive, multi-view timetable grid.
 *
 * This component adapts its display based on the selected view mode (class-group, classroom, or instructor).
 * It consumes interaction logic from the `TimetableContext` and structures the table
 * to map over the appropriate resources for the current view.
 *
 * @param t - The props for the component.
 * @param t.viewMode - The current view mode (class-group, classroom, or instructor).
 * @param t.groups - An array of all class groups (used for class-group view).
 * @param t.resources - An array of resources for the current view (groups, classrooms, or instructors).
 * @param t.timetable - A Map where keys are resource IDs and values are arrays of sessions or nulls.
 * @param t.isLoading - A boolean indicating if the timetable data is currently being synced or re-fetched.
 * @returns The rendered timetable grid component.
 */
const Timetable: React.FC<TimetableProps> = ({
  viewMode,
  groups,
  resources,
  timetable,
  isLoading,
}: TimetableProps): JSX.Element => {
  const { user } = useAuth();
  const { settings, isLoading: isLoadingConfig } = useScheduleConfig();
  const { handleDragLeave, handleDragOver } = useTimetableContext();

  // Separate resources by ownership based on view mode
  const { myResources, unassignedResources, otherResources } = useMemo(() => {
    if (viewMode === 'classroom') {
      const classrooms = resources as Classroom[];
      const myDeptClassrooms = classrooms.filter(
        (c) => c.preferred_department_id === user?.department_id
      );
      const unassignedClassrooms = classrooms.filter(
        (c) => !c.preferred_department_id
      );
      const otherDeptClassrooms = classrooms.filter(
        (c) => c.preferred_department_id && c.preferred_department_id !== user?.department_id
      );
      return {
        myResources: myDeptClassrooms,
        unassignedResources: unassignedClassrooms,
        otherResources: otherDeptClassrooms,
      };
    } else if (viewMode === 'instructor') {
      const instructors = resources as Instructor[];
      const myDeptInstructors = instructors.filter(
        (i) => i.department_id === user?.department_id
      );
      const otherDeptInstructors = instructors.filter(
        (i) => i.department_id !== user?.department_id
      );
      return {
        myResources: myDeptInstructors,
        unassignedResources: [],
        otherResources: otherDeptInstructors,
      };
    } else {
      // class-group view
      const myGroups = groups.filter((g) => g.program_id === user?.program_id);
      const otherGroups = groups.filter((g) => g.program_id !== user?.program_id);
      return {
        myResources: myGroups,
        unassignedResources: [],
        otherResources: otherGroups,
      };
    }
  }, [viewMode, resources, groups, user]);

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
            {/* Render the user's own resources first */}
            {myResources.map((resource) => (
              <TimetableRow
                key={resource.id}
                viewMode={viewMode}
                resource={resource}
                timetable={timetable}
                periodsPerDay={periodsPerDay}
                totalPeriods={totalPeriods}
              />
            ))}

            {/* Render unassigned resources with separator */}
            {unassignedResources.length > 0 && (
              <>
                <tr>
                  <td
                    colSpan={totalPeriods + 1}
                    className="p-2 text-center text-sm font-semibold text-gray-600 bg-gray-100 border-y-2 border-gray-300"
                  >
                    {viewMode === 'classroom' ? 'Unassigned Classrooms' : 'Unassigned Resources'}
                  </td>
                </tr>
                {unassignedResources.map((resource) => (
                  <TimetableRow
                    key={resource.id}
                    viewMode={viewMode}
                    resource={resource}
                    timetable={timetable}
                    periodsPerDay={periodsPerDay}
                    totalPeriods={totalPeriods}
                  />
                ))}
              </>
            )}

            {/* If there are other resources, render a visual separator */}
            {otherResources.length > 0 && (
              <>
                <tr>
                  <td
                    colSpan={totalPeriods + 1}
                    className="p-2 text-center text-sm font-semibold text-gray-600 bg-gray-100 border-y-2 border-gray-300"
                  >
                    {viewMode === 'classroom' 
                      ? 'Classrooms from Other Departments'
                      : viewMode === 'instructor'
                      ? 'Instructors from Other Departments'
                      : 'Schedules from Other Programs'}
                  </td>
                </tr>
                {/* Render the resources from other programs/departments */}
                {otherResources.map((resource) => (
                  <TimetableRow
                    key={resource.id}
                    viewMode={viewMode}
                    resource={resource}
                    timetable={timetable}
                    periodsPerDay={periodsPerDay}
                    totalPeriods={totalPeriods}
                  />
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Timetable;
