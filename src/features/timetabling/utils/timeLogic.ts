import type { ScheduleConfig } from '../../scheduleConfig/types/scheduleConfig';

/**
 * Represents a single time header in the timetable.
 */
export interface TimeHeader {
  label: string; // e.g., "7:30 AM - 9:00 AM"
}

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

    const formatTime = (date: Date) =>
      date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    timeHeaders.push({
      label: `${formatTime(startTime)} - ${formatTime(endTime)}`,
    });

    currentTime = endTime; // Set up for the next loop
  }

  return { dayHeaders, timeHeaders };
}
