import type { ScheduleConfig } from '../../scheduleConfig/types/scheduleConfig';

/**
 * Represents a single time header in the timetable.
 */
export interface TimeHeader {
  label: string; // e.g., "7:30-9:00"
}

/**
 * Helper function to format a Date object into hh:mm format (12-hour, no AM/PM).
 * @param date The date to format.
 * @returns A string in "h:mm" format.
 */
const formatTimeHHMM = (date: Date): string => {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');

  // Convert 24-hour to 12-hour format
  hours = hours % 12 || 12; // Converts 0 to 12, 13 to 1, etc.

  return `${hours}:${minutes}`;
};

/**
 * Pure business logic to generate headers for the timetable UI
 * based on the academic schedule configuration.
 *
 * @param settings The academic settings from the database.
 * @returns An object containing day headers and time headers for a single day.
 */
export function generateTimetableHeaders(settings: ScheduleConfig): {
  dayHeaders: string[];
  timeHeaders: TimeHeader[];
} {
  const dayHeaders = [...new Array(settings.class_days_per_week)].map((_, i) => `Day ${i + 1}`);
  const timeHeaders: TimeHeader[] = [];

  const [startHour, startMinute] = settings.start_time.split(':').map(Number);
  let currentTime = new Date();
  currentTime.setHours(startHour, startMinute, 0, 0);

  for (let period = 0; period < settings.periods_per_day; period++) {
    const startTime = new Date(currentTime);
    const endTime = new Date(startTime.getTime() + settings.period_duration_mins * 60000);

    timeHeaders.push({
      // Use the new, cleaner format
      label: `${formatTimeHHMM(startTime)}-${formatTimeHHMM(endTime)}`,
    });

    currentTime = endTime; // Set up for the next loop
  }

  return { dayHeaders, timeHeaders };
}