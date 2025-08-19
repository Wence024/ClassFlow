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
}

/**
 * Formats a JavaScript Date object into a 12-hour "h:mm" string.
 * @param {Date} date - The date object to format.
 * @returns {string} The formatted time string (e.g., "9:00", "12:30").
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
 * @param {ScheduleConfig} settings - The academic schedule configuration from the database.
 * @returns An object containing an array of day headers and an array of time headers.
 * @example
 * const headers = generateTimetableHeaders({ class_days_per_week: 5, ... });
 * // headers.dayHeaders -> ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"]
 * // headers.timeHeaders -> [{ label: "7:30-9:00" }, { label: "9:00-10:30" }, ...]
 */
export function generateTimetableHeaders(settings: ScheduleConfig): {
  dayHeaders: string[];
  timeHeaders: TimeHeader[];
} {
  const dayHeaders = [...Array(settings.class_days_per_week)].map((_, i) => `Day ${i + 1}`);
  const timeHeaders: TimeHeader[] = [];

  const [startHour, startMinute] = settings.start_time.split(':').map(Number);
  const currentTime = new Date();
  currentTime.setHours(startHour, startMinute, 0, 0);

  for (let period = 0; period < settings.periods_per_day; period++) {
    const startTime = new Date(currentTime);
    const endTime = new Date(startTime.getTime() + settings.period_duration_mins * 60000);

    timeHeaders.push({
      label: `${formatTimeHHMM(startTime)}-${formatTimeHHMM(endTime)}`,
    });

    currentTime.setTime(endTime.getTime()); // Set up for the next loop.
  }

  return { dayHeaders, timeHeaders };
}
