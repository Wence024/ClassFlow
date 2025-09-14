/**
 * @file This module contains pure utility functions for calculating and formatting time-related
 * data for the timetable UI based on a given schedule configuration.
 */

import type { ScheduleConfig } from '../../scheduleConfig/types/scheduleConfig';

/**
 * Represents the data needed for a single time header in the timetable's vertical axis.
 */
export interface TimeHeader {
  /** The formatted time string, e.g., "7:30-9:00". */
  label: string;
  /** The formatted start time, e.g., "7:30". */
  start: string;
  /** The formatted end time, e.g., "9:00". */
  end: string;
}

/**
 * Formats a JavaScript Date object into a 12-hour "h:mm" string.
 *
 * @param date - The date object to format.
 * @returns The formatted time string (e.g., "9:00", "12:30").
 */
const formatTimeHHMM = (date: Date): string => {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  hours = hours % 12 || 12; // Converts 0 to 12 for 12 AM.
  return `${hours}:${minutes}`;
};

/**
 * Generates the day and time headers required to render the timetable grid UI.
 *
 * This function takes the schedule configuration and calculates all the necessary labels
 * for the horizontal (days) and vertical (time slots) axes of the timetable.
 *
 * @param settings - The academic schedule configuration from the database.
 * @returns An object containing an array of day headers and an array of time headers.
 * @example
 * const headers = generateTimetableHeaders({ class_days_per_week: 5, ... });
 * // headers.dayHeaders -> [{ label: "Day 1", date: "Day 1" }, ...]
 * // headers.timeHeaders -> [{ label: "7:30-9:00", start: "7:30", end: "9:00" }, ...]
 */
export function generateTimetableHeaders(settings: ScheduleConfig): {
  dayHeaders: { label: string; date: string }[];
  timeHeaders: TimeHeader[];
} {
  const dayHeaders = [...Array(settings.class_days_per_week)].map((_, i) => {
    const label = `Day ${i + 1}`;
    return { label, date: label }; // Using label as date for a unique key
  });
  const timeHeaders: TimeHeader[] = [];

  const [startHour, startMinute] = settings.start_time.split(':').map(Number);
  const currentTime = new Date();
  currentTime.setHours(startHour, startMinute, 0, 0);

  for (let period = 0; period < settings.periods_per_day; period++) {
    const startTime = new Date(currentTime);
    const endTime = new Date(startTime.getTime() + settings.period_duration_mins * 60000);

    const start = formatTimeHHMM(startTime);
    const end = formatTimeHHMM(endTime);

    timeHeaders.push({
      label: `${start}-${end}`,
      start,
      end,
    });

    currentTime.setTime(endTime.getTime()); // Set up for the next loop.
  }

  return { dayHeaders, timeHeaders };
}
