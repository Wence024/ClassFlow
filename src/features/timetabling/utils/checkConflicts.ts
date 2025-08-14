import type { ClassSession } from '../../classSessions/types/classSession';
import type { ScheduleConfig } from '../../scheduleConfig/types/scheduleConfig';

export type TimetableGrid = Map<string, (ClassSession | null)[]>;

/**
 * Pure business rule: Checks for conflicts for a given session across its entire duration.
 * Ignores the cell from which the session is being moved (if provided).
 *
 * This function is designed to be reused in a custom backend or API later.
 */
export default function checkConflicts(
  timetable: TimetableGrid,
  classSessionToCheck: ClassSession,
  settings: ScheduleConfig,
  targetGroupId: string,
  targetPeriodIndex: number,
  source?: { class_group_id: string; period_index: number }
): string {
  const { course } = classSessionToCheck;
  const numberOfPeriods = course.number_of_periods || 1;
  const periodsPerDay = settings.periods_per_day;

  // Check all periods this class session would occupy
  for (let i = 0; i < numberOfPeriods; i++) {
    const currentPeriodIndex = targetPeriodIndex + i;

    // --- Boundary Check ---
    // 1. Check if the class exceeds the total number of periods in the timetable
    if (currentPeriodIndex >= settings.class_days_per_week * periodsPerDay) {
      return 'Placement conflict: Class extends beyond the available timetable days.';
    }

    // 2. Check if the class spans across a day boundary
    const startDay = Math.floor(targetPeriodIndex / periodsPerDay);
    const currentDay = Math.floor(currentPeriodIndex / periodsPerDay);
    if (startDay !== currentDay) {
      return 'Placement conflict: Class cannot span across multiple days.';
    }

    // --- Conflict Checks for the current period ---

    // 1. Check the target cell itself for a group conflict
    const targetGroupSessions = timetable.get(targetGroupId);
    if (
      targetGroupSessions?.[currentPeriodIndex] &&
      (!source ||
        targetGroupId !== source.class_group_id ||
        currentPeriodIndex !== source.period_index)
    ) {
      return `Group conflict: A class is already scheduled in this slot for ${classSessionToCheck.group.name}.`;
    }

    // 2. Check for instructor and classroom conflicts across all other groups at the current period
    for (const [groupId, classSessions] of timetable.entries()) {
      const existingClassSession = classSessions[currentPeriodIndex];

      if (existingClassSession) {
        // If we are checking the source cell of a "move" operation, skip it
        if (
          source &&
          groupId === source.class_group_id &&
          currentPeriodIndex === source.period_index
        ) {
          continue;
        }

        if (existingClassSession.instructor.id === classSessionToCheck.instructor.id) {
          return `Instructor conflict: ${existingClassSession.instructor.name} is already scheduled in this period for group ${existingClassSession.group.name}.`;
        }
        if (existingClassSession.classroom.id === classSessionToCheck.classroom.id) {
          return `Classroom conflict: ${existingClassSession.classroom.name} is already in use during this period by group ${existingClassSession.group.name}.`;
        }
      }
    }
  }

  return ''; // No conflicts found
}
