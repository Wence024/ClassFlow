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

  return ''; // No boundary conflicts
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

  if (!targetGroupSchedule) return ''; // Should not happen in practice

  for (let i = 0; i < period_count; i++) {
    const sessionInSlot = targetGroupSchedule[targetPeriodIndex + i];
    if (sessionInSlot && sessionInSlot.id !== sessionToCheck.id) {
      return `Group conflict: ${sessionInSlot.group.name} already has a class scheduled in this slot.`;
    }
  }

  return ''; // No group conflicts
}

/**
 * Checks for resource (instructor, classroom) conflicts across all other groups.
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
      if (groupId === targetGroupId) continue; // We already checked the target group

      const conflictingSession = schedule[currentPeriod];
      if (conflictingSession && conflictingSession.id !== sessionToCheck.id) {
        if (conflictingSession.instructor.id === sessionToCheck.instructor.id) {
          const instructorName = `${conflictingSession.instructor.first_name} ${conflictingSession.instructor.last_name}`;
          return `Instructor conflict: ${instructorName} is already scheduled for ${conflictingSession.group.name} at this time.`;
        }
        if (conflictingSession.classroom.id === sessionToCheck.classroom.id) {
          return `Classroom conflict: ${conflictingSession.classroom.name} is already in use by ${conflictingSession.group.name} at this time.`;
        }
      }
    }
  }

  return ''; // No resource conflicts
}

/**
 * Main conflict checking function (now much simpler).
 */
export default function checkConflicts(
  timetable: TimetableGrid,
  classSessionToCheck: ClassSession,
  settings: ScheduleConfig,
  targetGroupId: string,
  targetPeriodIndex: number,
  source?: { class_group_id: string; period_index: number } // 'source' is now implicitly handled by checking session IDs
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
