import React from 'react';
import type { ClassGroup } from '../../../../classSessionComponents/types';
import type { ClassSession } from '../../../../classSessions/types/classSession';
import EmptyCell from './EmptyCell';
import SessionCell from './SessionCell';

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

  // Use a Set to track periods that have already been rendered by a colSpan > 1
  const renderedPeriods = new Set<number>();

  for (let periodIndex = 0; periodIndex < totalPeriods; periodIndex++) {
    if (renderedPeriods.has(periodIndex)) {
      continue; // This period is already covered by a previous session's colSpan
    }

    const sessionsInCell = rowData[periodIndex]; // This is ClassSession[] | null

    if (sessionsInCell && sessionsInCell.length > 0) {
      const primarySession = sessionsInCell[0];
      const numberOfPeriods = primarySession.period_count || 1;

      // Rule: Only the row whose group matches the *first* session in a merged
      // block is responsible for rendering it.
      if (primarySession.group.id !== group.id) {
        // This merged session is rendered by another row. Render nothing.
        // We still need to mark these periods as 'rendered' to avoid empty cells later.
        for (let i = 0; i < numberOfPeriods; i++) {
          renderedPeriods.add(periodIndex + i);
        }
        continue;
      }

      // This row IS responsible for rendering the cell.
      const isLastPeriodInDay =
        (periodIndex + numberOfPeriods - 1) % periodsPerDay === periodsPerDay - 1;
      const currentDay = Math.floor(periodIndex / periodsPerDay);
      const totalDays = Math.floor(totalPeriods / periodsPerDay);
      const isNotLastDayOfTable = currentDay < totalDays - 1;

      // Mark all periods covered by this session's colSpan as rendered
      for (let i = 0; i < numberOfPeriods; i++) {
        renderedPeriods.add(periodIndex + i);
      }

      cells.push(
        <SessionCell
          key={`${group.id}-${periodIndex}`}
          sessions={sessionsInCell}
          groupId={group.id}
          periodIndex={periodIndex}
          isLastInDay={isLastPeriodInDay}
          isNotLastInTable={isNotLastDayOfTable}
        />
      );
    } else {
      // This is an empty slot in the timetable
      const isLastPeriodInDay = periodIndex % periodsPerDay === periodsPerDay - 1;
      const currentDay = Math.floor(periodIndex / periodsPerDay);
      const totalDays = Math.floor(totalPeriods / periodsPerDay);
      const isNotLastDayOfTable = currentDay < totalDays - 1;

      cells.push(
        <EmptyCell
          key={`${group.id}-${periodIndex}`}
          groupId={group.id}
          periodIndex={periodIndex}
          isLastInDay={isLastPeriodInDay}
          isNotLastInTable={isNotLastDayOfTable}
        />
      );
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
