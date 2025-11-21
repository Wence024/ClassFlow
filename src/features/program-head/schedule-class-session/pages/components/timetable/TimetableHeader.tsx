import React from 'react';
import type { TimetableViewMode } from '../../../types';

/**
 * Props for the TimetableHeader component.
 */
interface TimetableHeaderProps {
  dayHeaders: { label: string; date: string }[];
  timeHeaders: { label: string; start: string; end: string }[];
  periodsPerDay: number;
  viewMode: TimetableViewMode;
}

/**
 * Renders the header section of the timetable, including day and time headers.
 *
 * @param th - The props for the component.
 * @param th.dayHeaders - An array of objects representing the day headers.
 * @param th.timeHeaders - An array of objects representing the time period headers.
 * @param th.periodsPerDay - The number of periods in a single day.
 * @param th.viewMode - The current view mode ('class-group' or 'instructor').
 * @returns The rendered timetable header component.
 */
const TimetableHeader: React.FC<TimetableHeaderProps> = ({
  dayHeaders,
  timeHeaders,
  periodsPerDay,
  viewMode,
}) => {
  const getCornerLabel = () => {
    switch (viewMode) {
      case 'classroom':
        return 'Classroom';
      case 'instructor':
        return 'Instructor';
      default:
        return 'Group';
    }
  };
  /**
   * Renders the table header cells for time periods for a specific day.
   *
   * @param dayIndex The index of the current day.
   * @returns An array of table header elements.
   */
  const renderTimeHeaders = (dayIndex: number) => {
    return timeHeaders.map((time, timeIndex) => {
      const isLastInDay = (timeIndex + 1) % periodsPerDay === 0;
      const isNotLastDay = dayIndex < dayHeaders.length - 1;
      const borderClass =
        isLastInDay && isNotLastDay ? 'border-r-2 border-dashed border-gray-300' : '';

      return (
        <th
          key={`d${dayIndex}-t${timeIndex}`}
          className={`p-1 pb-2 text-center text-xs font-medium text-gray-500 min-w-[120px] bg-gray-50 ${borderClass}`}
        >
          {time.label}
        </th>
      );
    });
  };

  return (
    <thead className="sticky top-0 z-30 bg-gray-50">
      {/* Day Headers */}
      <tr>
        <th 
          rowSpan={2}
          className="p-1 text-center text-xs font-medium text-gray-500 min-w-[120px] sticky left-0 bg-gray-50 z-30 align-middle border-r border-gray-200"
        >
          {getCornerLabel()}
        </th>
        {dayHeaders.map((day, dayIndex) => (
          <th
            key={day.date}
            colSpan={periodsPerDay}
            className={`p-1 pt-2 text-center text-sm font-semibold text-gray-700 ${
              dayIndex < dayHeaders.length - 1 ? 'border-r-2 border-dashed border-gray-300' : ''
            }`}
          >
            {day.label}
          </th>
        ))}
      </tr>
      {/* Time Headers */}
      <tr>
        {dayHeaders.map((_, dayIndex) => renderTimeHeaders(dayIndex))}
      </tr>
    </thead>
  );
};

export default TimetableHeader;
