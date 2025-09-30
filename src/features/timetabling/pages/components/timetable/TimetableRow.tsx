import React from 'react';
import type { ClassGroup } from '../../../../classSessionComponents/types';
import type { ClassSession } from '../../../../classSessions/types/classSession';
import EmptyCell from './EmptyCell';
import SessionCell from './SessionCell';

/**
 * Determines if a period is the last period in a day.
 *
 * @param periodIndex
 * @param numberOfPeriods
 * @param periodsPerDay
 */
const isLastPeriodInDay = (periodIndex: number, numberOfPeriods: number, periodsPerDay: number): boolean => {
  return (periodIndex + numberOfPeriods - 1) % periodsPerDay === periodsPerDay - 1;
};

/**
 * Determines if the current day is not the last day in the table.
 *
 * @param periodIndex
 * @param totalPeriods
 * @param periodsPerDay
 */
const isNotLastDayOfTable = (periodIndex: number, totalPeriods: number, periodsPerDay: number): boolean => {
  const currentDay = Math.floor(periodIndex / periodsPerDay);
  const totalDays = Math.floor(totalPeriods / periodsPerDay);
  return currentDay < totalDays - 1;
};

/**
 * Marks periods as rendered to avoid duplicate cells.
 *
 * @param renderedPeriods
 * @param periodIndex
 * @param numberOfPeriods
 */
const markPeriodsAsRendered = (renderedPeriods: Set<number>, periodIndex: number, numberOfPeriods: number): void => {
  for (let i = 0; i < numberOfPeriods; i++) {
    renderedPeriods.add(periodIndex + i);
  }
};

/**
 * Renders a session cell for the given parameters.
 *
 * @param sessionsInCell
 * @param group
 * @param periodIndex
 * @param periodsPerDay
 * @param totalPeriods
 */
const renderSessionCell = (
  sessionsInCell: ClassSession[],
  group: ClassGroup,
  periodIndex: number,
  periodsPerDay: number,
  totalPeriods: number
): React.ReactElement => {
  const primarySession = sessionsInCell[0];
  const numberOfPeriods = primarySession.period_count || 1;
  const isLastInDay = isLastPeriodInDay(periodIndex, numberOfPeriods, periodsPerDay);
  const isNotLastInTable = isNotLastDayOfTable(periodIndex, totalPeriods, periodsPerDay);

  return (
    <SessionCell
      key={`${group.id}-${periodIndex}`}
      sessions={sessionsInCell}
      groupId={group.id}
      periodIndex={periodIndex}
      isLastInDay={isLastInDay}
      isNotLastInTable={isNotLastInTable}
    />
  );
};

/**
 * Renders an empty cell for the given parameters.
 *
 * @param group
 * @param periodIndex
 * @param periodsPerDay
 * @param totalPeriods
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
  group: ClassGroup;
  timetable: Map<string, (ClassSession | null)[]>;
  periodsPerDay: number;
  totalPeriods: number;
}

/**
 * Renders a single row in the timetable, corresponding to a class group.
 * It iterates through the periods of the week and renders either a SessionCell or an EmptyCell.
 *
 * @param tr The props for the component.
 * @param tr.group The class group for this row.
 * @param tr.timetable A map representing the timetable data.
 * @param tr.periodsPerDay The number of periods in a single day.
 * @param tr.totalPeriods The total number of periods in the entire timetable.
 * @returns The rendered timetable row component.
 */
const TimetableRow: React.FC<TimetableRowProps> = ({
  group,
  timetable,
  periodsPerDay,
  totalPeriods,
}) => {
  const cells = [];
  const rowData = timetable.get(group.id) || [];
  const renderedPeriods = new Set<number>();

  for (let periodIndex = 0; periodIndex < totalPeriods; periodIndex++) {
    if (renderedPeriods.has(periodIndex)) {
      continue;
    }

    const sessionsInCell = rowData[periodIndex];

    if (sessionsInCell && sessionsInCell.length > 0) {
      const primarySession = sessionsInCell[0];
      const numberOfPeriods = primarySession.period_count || 1;

      if (primarySession.group.id !== group.id) {
        markPeriodsAsRendered(renderedPeriods, periodIndex, numberOfPeriods);
        continue;
      }

      markPeriodsAsRendered(renderedPeriods, periodIndex, numberOfPeriods);
      cells.push(renderSessionCell(sessionsInCell, group, periodIndex, periodsPerDay, totalPeriods));
    } else {
      cells.push(renderEmptyCell(group, periodIndex, periodsPerDay, totalPeriods));
    }
  }

  return (
    <tr className="border-b border-gray-200">
      <td className="p-2 text-sm font-medium text-gray-800 border-r border-gray-200 sticky left-0 bg-white z-10 min-w-[120px]">
        {group.name}
      </td>
      {cells}
    </tr>
  );
};

export default TimetableRow;
