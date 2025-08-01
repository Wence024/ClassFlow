import type { ScheduleConfig } from '../types/scheduleConfig';

/**
 * Represents a single time slot in the timetable header.
 */
export interface TimeSlot {
  label: string; // e.g., "7:30 AM - 9:00 AM"
  dayIndex: number;
  periodIndexInDay: number;
}

/**
 * Pure business logic to generate an array of formatted time slots
 * based on the academic schedule configuration.
 *
 * @param settings The academic settings from the database.
 * @returns An array of TimeSlot objects.
 */
export function generateTimeSlots(settings: ScheduleConfig): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const { start_time, period_duration_mins, periods_per_day, class_days_per_week } = settings;

  // Create a Date object to handle time calculations safely
  const [startHour, startMinute] = start_time.split(':').map(Number);
  let currentTime = new Date();
  currentTime.setHours(startHour, startMinute, 0, 0);

  for (let day = 0; day < class_days_per_week; day++) {
    for (let period = 0; period < periods_per_day; period++) {
      const startTime = new Date(currentTime);
      const endTime = new Date(startTime.getTime() + period_duration_mins * 60000);

      const formatTime = (date: Date) =>
        date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

      slots.push({
        label: `${formatTime(startTime)} - ${formatTime(endTime)}`,
        dayIndex: day,
        periodIndexInDay: period,
      });

      // Set the start time for the next period
      currentTime = endTime;
    }
    // Reset time for the next day
    currentTime.setHours(startHour, startMinute, 0, 0);
  }

  return slots;
}
