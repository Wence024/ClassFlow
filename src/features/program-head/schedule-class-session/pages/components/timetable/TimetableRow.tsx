import React from 'react';
import type { ClassGroup, Classroom, Instructor } from '@/types';
import type { ClassSession } from '@/types/classSession';
import type { TimetableViewMode } from '../../../types';
import type { TimetableRowResource } from '../../../utils/timetableLogic';
import EmptyCell from './EmptyCell';
import SessionCell from './SessionCell';

/**
 * Z-index hierarchy for timetable components.
 * - Toolbar (sticky top): z-40.
 * - Column headers (sticky top): z-30 (thead and left corner cell).
 * - Row headers (sticky left): z-20.
 * - Session warnings: z-20.
 * - Session pending badges: z-30.
 * - Session content: z-10.
 */

/**
 * Determines if a period is the last period in a day.
 *
 * @param periodIndex - The index of the period.
 * @param numberOfPeriods - The number of periods this session spans.
 * @param periodsPerDay - The number of periods per day.
 * @returns Whether this is the last period in the day.
 */
const isLastPeriodInDay = (
  periodIndex: number,
  numberOfPeriods: number,
  periodsPerDay: number
): boolean => {
  return (periodIndex + numberOfPeriods - 1) % periodsPerDay === periodsPerDay - 1;
};

/**
 * Determines if the current day is not the last day in the table.
 *
 * @param periodIndex - The index of the period.
 * @param totalPeriods - The total number of periods in the table.
 * @param periodsPerDay - The number of periods per day.
 * @returns Whether this is not the last day in the table.
 */
const isNotLastDayOfTable = (
  periodIndex: number,
  totalPeriods: number,
  periodsPerDay: number
): boolean => {
  const currentDay = Math.floor(periodIndex / periodsPerDay);
  const totalDays = Math.floor(totalPeriods / periodsPerDay);
  return currentDay < totalDays - 1;
};

/**
 * Marks periods as rendered to avoid duplicate cells.
 *
 * @param renderedPeriods - Set of periods that have been rendered.
 * @param periodIndex - The index of the period.
 * @param numberOfPeriods - The number of periods this session spans.
 */
const markPeriodsAsRendered = (
  renderedPeriods: Set<number>,
  periodIndex: number,
  numberOfPeriods: number
): void => {
  for (let i = 0; i < numberOfPeriods; i++) {
    renderedPeriods.add(periodIndex + i);
  }
};

/**
 * Renders a session cell for the given parameters.
 *
 * @param sessionsInCell - The sessions in this cell.
 * @param resource - The resource (group, classroom, or instructor).
 * @param periodIndex - The index of the period.
 * @param periodsPerDay - The number of periods per day.
 * @param totalPeriods - The total number of periods.
 * @param viewMode - The current view mode.
 * @returns The JSX element for the session cell.
 */
const renderSessionCell = (
  sessionsInCell: ClassSession[],
  resource: TimetableRowResource,
  periodIndex: number,
  periodsPerDay: number,
  totalPeriods: number,
  viewMode: TimetableViewMode
): React.ReactElement => {
  const primarySession = sessionsInCell[0];
  const numberOfPeriods = primarySession.period_count || 1;
  const isLastInDay = isLastPeriodInDay(periodIndex, numberOfPeriods, periodsPerDay);
  const isNotLastInTable = isNotLastDayOfTable(periodIndex, totalPeriods, periodsPerDay);

  return (
    <SessionCell
      key={`${resource.id}-${periodIndex}`}
      sessions={sessionsInCell}
      groupId={resource.id}
      periodIndex={periodIndex}
      isLastInDay={isLastInDay}
      isNotLastInTable={isNotLastInTable}
      viewMode={viewMode}
    />
  );
};

/**
 * Renders an empty cell for the given parameters.
 *
 * @param group - The class group.
 * @param periodIndex - The index of the period.
 * @param periodsPerDay - The number of periods per day.
 * @param totalPeriods - The total number of periods.
 * @returns The JSX element for the empty cell.
 */
const renderEmptyCell = (
  group: ClassGroup,
  periodIndex: number,
  periodsPerDay: number,
  totalPeriods: number
): React.ReactElement => {
  const isLastInDay = periodIndex % periodsPerDay === periodsPerDay - 1;
  const isNotLastInTable = isNotLastDayOfTable(periodIndex, totalPeriods, periodsPerDay);

  return (
    <EmptyCell
      key={`${group.id}-${periodIndex}`}
      groupId={group.id}
      periodIndex={periodIndex}
      isLastInDay={isLastInDay}
      isNotLastInTable={isNotLastInTable}
    />
  );
};

/**
 * Props for the TimetableRow component.
 */
interface TimetableRowProps {
  viewMode: TimetableViewMode;
  resource: TimetableRowResource;
  timetable: Map<string, (ClassSession[] | null)[]>;
  periodsPerDay: number;
  totalPeriods: number;
}

/**
 * Generates a display label for a resource based on the view mode.
 *
 * @param viewMode - The current view mode.
 * @param resource - The resource to generate a label for.
 * @returns A formatted string label for the resource.
 */
function getResourceLabel(viewMode: TimetableViewMode, resource: TimetableRowResource): string {
  switch (viewMode) {
    case 'classroom': {
      const classroom = resource as Classroom;
      const capacityInfo = classroom.capacity ? ` (${classroom.capacity})` : '';
      return `${classroom.name}${capacityInfo}`;
    }
    case 'instructor': {
      const instructor = resource as Instructor;
      const fullName =
        `${instructor.prefix || ''} ${instructor.first_name} ${instructor.last_name} ${instructor.suffix || ''}`.trim();
      if (instructor.contract_type) {
        return `${fullName} (${instructor.contract_type})`;
      }
      return fullName;
    }
    case 'class-group':
    default: {
      const group = resource as ClassGroup;
      return group.name;
    }
  }
}

/**
 * Renders a single row in the timetable, corresponding to a resource (group, classroom, or instructor).
 * Adapts its rendering based on the current view mode.
 *
 * @param tr The props for the component.
 * @param tr.viewMode The current view mode (class-group, classroom, or instructor).
 * @param tr.resource The resource (class group, classroom, or instructor) for this row.
 * @param tr.timetable A map representing the timetable data.
 * @param tr.periodsPerDay The number of periods in a single day.
 * @param tr.totalPeriods The total number of periods in the entire timetable.
 * @returns The rendered timetable row component.
 */
const TimetableRow: React.FC<TimetableRowProps> = ({
  viewMode,
  resource,
  timetable,
  periodsPerDay,
  totalPeriods,
}) => {
  const rowData = timetable.get(resource.id) || [];
  const renderedPeriods = new Set<number>();

  const renderCellForPeriod = (periodIndex: number) => {
    if (renderedPeriods.has(periodIndex)) {
      return null;
    }

    const sessionsInCell = rowData[periodIndex];

    if (sessionsInCell && sessionsInCell.length > 0) {
      const primarySession = sessionsInCell[0];
      const numberOfPeriods = primarySession.period_count || 1;

      if (viewMode === 'class-group') {
        const group = resource as ClassGroup;
        if (primarySession.group.id !== group.id) {
          markPeriodsAsRendered(renderedPeriods, periodIndex, numberOfPeriods);
          return null; // Skip rendering
        }
      }

      markPeriodsAsRendered(renderedPeriods, periodIndex, numberOfPeriods);
      return renderSessionCell(
        sessionsInCell,
        resource,
        periodIndex,
        periodsPerDay,
        totalPeriods,
        viewMode
      );
    } else {
      return renderEmptyCell(resource as ClassGroup, periodIndex, periodsPerDay, totalPeriods);
    }
  };

  const cells = Array.from({ length: totalPeriods }, (_, i) => renderCellForPeriod(i));
  const resourceLabel = getResourceLabel(viewMode, resource);

  return (
    <tr className="border-b border-gray-200">
      <td className="p-2 text-sm font-medium text-gray-800 border-r border-gray-200 sticky left-0 bg-white z-20 min-w-[120px]">
        {resourceLabel}
      </td>
      {cells}
    </tr>
  );
};

export default TimetableRow;
