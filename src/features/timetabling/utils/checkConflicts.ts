import type { ClassSession } from '../../classSessions/types/classSession';
import type { ScheduleConfig } from '../../scheduleConfig/types/scheduleConfig';

/**
 * A type representing the timetable's data structure.
 * It's a Map where keys are class group IDs and values are arrays representing periods.
 */
export type TimetableGrid = Map<string, (ClassSession | null)[]>;

/**
 * Checks for scheduling conflicts for a given class session at a target location in the timetable.
 *
 * This pure function is the core of the scheduling validation logic. It checks for:
 * 1.  **Boundary Conflicts:** Ensures a session doesn't extend beyond timetable limits or span across days.
 * 2.  **Group Conflicts:** Ensures the target group's timeslot is free.
 * 3.  **Resource Conflicts:** Ensures the session's instructor and classroom are not in use by any other group during the target timeslot.
 *
 * @param {TimetableGrid} timetable - The current state of the timetable grid.
 * @param {ClassSession} classSessionToCheck - The class session being placed or moved.
 * @param {ScheduleConfig} settings - The schedule configuration (periods per day, etc.).
 * @param {string} targetGroupId - The ID of the class group (row) where the class session is being placed.
 * @param {number} targetPeriodIndex - The starting period index (column) for the placement.
 * @param {object} [source] - Optional. If moving a class session, its original location is used to exclude the session from conflicting with itself.
 * @returns {string} An empty string if no conflicts are found, or a user-friendly error message.
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
  const totalPeriods = settings.class_days_per_week * periodsPerDay;

  // --- 1. Boundary and Placement Pre-checks ---
  if (targetPeriodIndex + numberOfPeriods > totalPeriods) {
    return 'Placement conflict: Class extends beyond the available timetable days.';
  }
  const startDay = Math.floor(targetPeriodIndex / periodsPerDay);
  const endDay = Math.floor((targetPeriodIndex + numberOfPeriods - 1) / periodsPerDay);
  if (startDay !== endDay) {
    return 'Placement conflict: Class cannot span across multiple days.';
  }

  // --- 2. Per-Period Conflict Loop ---
  // Iterate through each period the new class session will occupy.
  for (let i = 0; i < numberOfPeriods; i++) {
    const currentPeriodIndex = targetPeriodIndex + i;

    // A. Check for conflicts within the target group's row
    const classSessionAtTargetSlot = timetable.get(targetGroupId)?.[currentPeriodIndex];
    if (classSessionAtTargetSlot && classSessionAtTargetSlot.id !== classSessionToCheck.id) {
      return `Group conflict: ${classSessionAtTargetSlot.group.name} already has a class scheduled in this slot.`;
    }

    // B. Check for resource conflicts across all other groups
    for (const [groupId, classSessions] of timetable.entries()) {
      // No need to check the target group again
      if (groupId === targetGroupId) continue;

      const conflictingClassSession = classSessions[currentPeriodIndex];

      // If there's a class session and it's not the one we're moving, check for conflicts.
      if (conflictingClassSession && conflictingClassSession.id !== classSessionToCheck.id) {
        // Check for instructor conflict
        if (conflictingClassSession.instructor.id === classSessionToCheck.instructor.id) {
          const instructorName = `${conflictingClassSession.instructor.first_name} ${conflictingClassSession.instructor.last_name}`;
          return `Instructor conflict: ${instructorName} is already scheduled for ${conflictingClassSession.group.name} at this time.`;
        }

        // Check for classroom conflict
        if (conflictingClassSession.classroom.id === classSessionToCheck.classroom.id) {
          return `Classroom conflict: ${conflictingClassSession.classroom.name} is already in use by ${conflictingClassSession.group.name} at this time.`;
        }
      }
    }
  }

  return ''; // No conflicts found.
}
