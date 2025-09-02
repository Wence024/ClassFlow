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
 * @param {TimetableRowProps} props The props for the component.
 * @returns {JSX.Element} The rendered component.
 */
const TimetableRow: React.FC<TimetableRowProps> = ({
  group,
  timetable,
  periodsPerDay,
  totalPeriods,
}) => {
  const renderedPeriods = new Set<number>();
  const cells = [];

  for (let periodIndex = 0; periodIndex < totalPeriods; periodIndex++) {
    if (renderedPeriods.has(periodIndex)) continue;

    const classSession = timetable.get(group.id)?.[periodIndex] || null;
    const numberOfPeriods = classSession?.period_count || 1;

    const isLastPeriodInDay =
      (periodIndex + numberOfPeriods - 1) % periodsPerDay === periodsPerDay - 1;
    const currentDay = Math.floor(periodIndex / periodsPerDay);
    const totalDays = Math.floor(totalPeriods / periodsPerDay);
    const isNotLastDayOfTable = currentDay < totalDays - 1;

    if (classSession) {
      for (let i = 1; i < numberOfPeriods; i++) {
        renderedPeriods.add(periodIndex + i);
      }
      cells.push(
        <SessionCell
          key={periodIndex}
          session={classSession}
          groupId={group.id}
          periodIndex={periodIndex}
          isLastInDay={isLastPeriodInDay}
          isNotLastInTable={isNotLastDayOfTable}
        />
      );
    } else {
      cells.push(
        <EmptyCell
          key={periodIndex}
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
