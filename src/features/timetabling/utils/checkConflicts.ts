import type { ClassSession } from '../../classSessions/types/classSession';
import type { ScheduleConfig } from '../../scheduleConfig/types/scheduleConfig';

export type TimetableGrid = Map<string, (ClassSession | null)[]>;

/**
 * Checks if a class session placement would violate timetable boundaries.
 * @returns An error message string or an empty string.
 */
function checkBoundaryConflicts(
  period_count: number,
  targetPeriodIndex: number,
  settings: ScheduleConfig
): string {
  const { periods_per_day, class_days_per_week } = settings;
  const totalPeriods = class_days_per_week * periods_per_day;

  if (targetPeriodIndex + period_count > totalPeriods) {
    return 'Placement conflict: Class extends beyond the available timetable days.';
  }

  const startDay = Math.floor(targetPeriodIndex / periods_per_day);
  const endDay = Math.floor((targetPeriodIndex + period_count - 1) / periods_per_day);

  if (startDay !== endDay) {
    return 'Placement conflict: Class cannot span across multiple days.';
  }

  return '';
}

/**
 * Checks for conflicts within the target group's own row.
 * @returns An error message string or an empty string.
 */
function checkGroupConflicts(
  timetable: TimetableGrid,
  sessionToCheck: ClassSession,
  targetGroupId: string,
  targetPeriodIndex: number
): string {
  const period_count = sessionToCheck.period_count || 1;
  const targetGroupSchedule = timetable.get(targetGroupId);

  if (!targetGroupSchedule) return '';

  for (let i = 0; i < period_count; i++) {
    const sessionInSlot = targetGroupSchedule[targetPeriodIndex + i];
    if (sessionInSlot && sessionInSlot.id !== sessionToCheck.id) {
      return `Conflict within ${sessionInSlot.group.name}: This time slot is already occupied.`;
    }
  }

  return '';
}

/**
 * Checks for resource (instructor, classroom) conflicts across all other groups.
 * (Refactored to reduce complexity)
 * @returns An error message string or an empty string.
 */
function checkResourceConflicts(
  timetable: TimetableGrid,
  sessionToCheck: ClassSession,
  targetGroupId: string,
  targetPeriodIndex: number
): string {
  const period_count = sessionToCheck.period_count || 1;

  for (let i = 0; i < period_count; i++) {
    const currentPeriod = targetPeriodIndex + i;

    for (const [groupId, schedule] of timetable.entries()) {
      // Skip checking against the target group itself
      if (groupId === targetGroupId) continue;

      const conflictingSession = schedule[currentPeriod];

      // Skip if there's no session or it's the same session we're checking
      if (!conflictingSession || conflictingSession.id === sessionToCheck.id) continue;

      // Now check for actual resource conflicts
      if (conflictingSession.instructor.id === sessionToCheck.instructor.id) {
        const instructorName = `${conflictingSession.instructor.first_name} ${conflictingSession.instructor.last_name}`;
        return `Instructor conflict: ${instructorName} is already scheduled for ${conflictingSession.group.name} at this time.`;
      }
      if (conflictingSession.classroom.id === sessionToCheck.classroom.id) {
        return `Classroom conflict: ${conflictingSession.classroom.name} is already in use by ${conflictingSession.group.name} at this time.`;
      }
    }
  }

  return '';
}

/**
 * Main conflict checking function.
 * (The unused 'source' parameter has been removed).
 */
export default function checkConflicts(
  timetable: TimetableGrid,
  classSessionToCheck: ClassSession,
  settings: ScheduleConfig,
  targetGroupId: string,
  targetPeriodIndex: number
): string {
  const period_count = classSessionToCheck.period_count || 1;

  const boundaryError = checkBoundaryConflicts(period_count, targetPeriodIndex, settings);
  if (boundaryError) return boundaryError;

  const groupError = checkGroupConflicts(
    timetable,
    classSessionToCheck,
    targetGroupId,
    targetPeriodIndex
  );
  if (groupError) return groupError;

  const resourceError = checkResourceConflicts(
    timetable,
    classSessionToCheck,
    targetGroupId,
    targetPeriodIndex
  );
  if (resourceError) return resourceError;

  return ''; // No conflicts found
}
