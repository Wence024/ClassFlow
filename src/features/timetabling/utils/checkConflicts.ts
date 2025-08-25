import type { ClassSession } from '../../classSessions/types/classSession';
import type { ScheduleConfig } from '../../scheduleConfig/types/scheduleConfig';

/**
 * A type representing the timetable's data structure.
 * It's a Map where keys are class group IDs and values are arrays representing periods.
 * The array contains either a `ClassSession` object or `null` for an empty slot.
 */
export type TimetableGrid = Map<string, (ClassSession | null)[]>;

/**
 * Checks for scheduling conflicts for a given class session at a target location in the timetable.
 *
 * This is a pure business logic function, free of UI or state management concerns. It can be reused
 * on the front-end for immediate user feedback or on a back-end for server-side validation.
 * It checks for three types of conflicts:
 * 1.  **Placement Conflicts:** Ensures a session doesn't extend beyond the timetable boundaries or span across multiple days.
 * 2.  **Group Conflicts:** Ensures the target group doesn't already have a session in any of the target periods.
 * 3.  **Resource Conflicts:** Ensures the session's assigned instructor and classroom are not already in use by any other group during any of the target periods.
 *
 * @param {TimetableGrid} timetable - The current state of the timetable grid.
 * @param {ClassSession} classSessionToCheck - The class session being placed or moved.
 * @param {ScheduleConfig} settings - The schedule configuration, providing rules like periods per day.
 * @param {string} targetGroupId - The ID of the class group (row) where the session is being placed.
 * @param {number} targetPeriodIndex - The starting period index (column) for the placement.
 * @param {object} [source] - Optional. If the session is being *moved*, this object contains the original `class_group_id` and `period_index` to exclude from conflict checks.
 * @returns {string} An empty string if no conflicts are found, or a user-friendly error message describing the first conflict encountered.
 */
export default function checkConflicts(
  timetable: TimetableGrid,
  classSessionToCheck: ClassSession,
  settings: ScheduleConfig,
  targetGroupId: string,
  targetPeriodIndex: number,
  source?: { class_group_id: string; period_index: number }
): string {
  const numberOfPeriods = classSessionToCheck.period_count || 1;
  const periodsPerDay = settings.periods_per_day;

  // Iterate through each period the new session would occupy.
  for (let i = 0; i < numberOfPeriods; i++) {
    const currentPeriodIndex = targetPeriodIndex + i;

    // --- BOUNDARY CHECKS ---
    // Check if the session would extend beyond the total number of periods in the schedule.
    if (currentPeriodIndex >= settings.class_days_per_week * periodsPerDay) {
      return 'Placement conflict: Class extends beyond the available timetable days.';
    }

    // Check if the session would span across a day boundary.
    const startDay = Math.floor(targetPeriodIndex / periodsPerDay);
    const currentDay = Math.floor(currentPeriodIndex / periodsPerDay);
    if (startDay !== currentDay) {
      return 'Placement conflict: Class cannot span across multiple days.';
    }

    // --- CONFLICT CHECKS ---

    // 1. Group Conflict Check: Is there already a session in the target cell for this group?
    const targetGroupSessions = timetable.get(targetGroupId);
    const isOccupied = !!targetGroupSessions?.[currentPeriodIndex];
    const isNotSourceCell =
      !source ||
      targetGroupId !== source.class_group_id ||
      currentPeriodIndex !== source.period_index;

    if (isOccupied && isNotSourceCell) {
      return `Group conflict: A class is already scheduled in this slot for ${classSessionToCheck.group.name}.`;
    }

    // 2. Resource Conflict Check: Iterate through all other groups at the same period.
    for (const [groupId, classSessions] of timetable.entries()) {
      const existingClassSession = classSessions[currentPeriodIndex];

      if (existingClassSession) {
        // Skip checking against the cell where the session is being moved FROM.
        if (
          source &&
          groupId === source.class_group_id &&
          currentPeriodIndex === source.period_index
        ) {
          continue;
        }

        // Check for instructor conflict.
        if (existingClassSession.instructor.id === classSessionToCheck.instructor.id) {
          return `Instructor conflict: ${existingClassSession.instructor.first_name} is already scheduled in this period for group ${existingClassSession.group.name}.`;
        }
        // Check for classroom conflict.
        if (existingClassSession.classroom.id === classSessionToCheck.classroom.id) {
          return `Classroom conflict: ${existingClassSession.classroom.name} is already in use during this period by group ${existingClassSession.group.name}.`;
        }
      }
    }
  }

  return ''; // No conflicts found.
}
