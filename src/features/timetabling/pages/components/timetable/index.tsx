import React, { useMemo, type JSX } from 'react';
import { LoadingSpinner } from '../../../../../components/ui';
import type { ClassGroup, Classroom, Instructor } from '../../../../classSessionComponents/types';
import type { ClassSession } from '../../../../classSessions/types/classSession';
import { useScheduleConfig } from '../../../../scheduleConfig/hooks/useScheduleConfig';
import { generateTimetableHeaders } from '../../../utils/timeLogic';
import { useAuth } from '../../../../shared/auth/hooks/useAuth';
import { useDepartmentId } from '../../../../shared/auth/hooks/useDepartmentId';
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
}: TimetableProps): JSX.Element => {
  const { user } = useAuth();
  const userDepartmentId = useDepartmentId();
  const { settings, isLoading: isLoadingConfig } = useScheduleConfig();
  const { handleDragLeave, handleDragOver } = useTimetableContext();

  // Separate resources by ownership based on view mode
  const { myResources, unassignedResources, otherResources, unassignedLabel, otherLabel } =
    useMemo(() => {
      // If user has no department (admin), show all resources without separation
      if (!userDepartmentId && viewMode !== 'class-group') {
        return {
          myResources: resources,
          unassignedResources: [],
          otherResources: [],
          unassignedLabel: '',
          otherLabel: '',
        };
      }

      if (viewMode === 'classroom') {
        const classrooms = resources as Classroom[];
        const myDeptClassrooms = classrooms.filter(
          (c) =>
            c.preferred_department_id !== null && c.preferred_department_id === userDepartmentId
        );
        const unassignedClassrooms = classrooms.filter((c) => c.preferred_department_id === null);
        const otherDeptClassrooms = classrooms.filter(
          (c) =>
            c.preferred_department_id !== null && c.preferred_department_id !== userDepartmentId
        );
        return {
          myResources: myDeptClassrooms,
          unassignedResources: unassignedClassrooms,
          otherResources: otherDeptClassrooms,
          unassignedLabel: 'Unassigned Classrooms',
          otherLabel: 'Classrooms from Other Departments',
        };
      } else if (viewMode === 'instructor') {
        const instructors = resources as Instructor[];
        const myDeptInstructors = instructors.filter(
          (i) => i.department_id !== null && i.department_id === userDepartmentId
        );
        const unassignedInstructors = instructors.filter((i) => i.department_id === null);
        const otherDeptInstructors = instructors.filter(
          (i) => i.department_id !== null && i.department_id !== userDepartmentId
        );
        return {
          myResources: myDeptInstructors,
          unassignedResources: unassignedInstructors,
          otherResources: otherDeptInstructors,
          unassignedLabel: 'Unassigned Instructors',
          otherLabel: 'Instructors from Other Departments',
        };
      } else {
        // class-group view
        const myGroups = groups.filter((g) => g.program_id === user?.program_id);
        const otherGroups = groups.filter((g) => g.program_id !== user?.program_id);
        return {
          myResources: myGroups,
          unassignedResources: [],
          otherResources: otherGroups,
          unassignedLabel: '',
          otherLabel: 'Schedules from Other Programs',
        };
      }
    }, [viewMode, resources, groups, user, userDepartmentId]);

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
      data-cy="timetable-grid"
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-auto max-h-[calc(100vh-240px)]"
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
    >
      <table className="min-w-full table-fixed border-collapse" role="table" data-cy="timetable-table">
          <TimetableHeader
            dayHeaders={dayHeaders}
            timeHeaders={timeHeaders}
            periodsPerDay={periodsPerDay}
            viewMode={viewMode}
          />
          <tbody data-cy="timetable-body">
            {/* Render the user's own department resources first */}
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

            {/* Render unassigned resources */}
            {unassignedResources.length > 0 && (
              <>
                <tr>
                  <td
                    colSpan={totalPeriods + 1}
                    className="p-2 text-center text-sm font-semibold text-gray-600 bg-gray-100 border-y-2 border-gray-300"
                  >
                    {unassignedLabel}
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

            {/* Render resources from other departments */}
            {otherResources.length > 0 && (
              <>
                <tr>
                  <td
                    colSpan={totalPeriods + 1}
                    className="p-2 text-center text-sm font-semibold text-gray-600 bg-gray-100 border-y-2 border-gray-300"
                  >
                    {otherLabel}
                  </td>
                </tr>
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
  );
};

export default Timetable;
