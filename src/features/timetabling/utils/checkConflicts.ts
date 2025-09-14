import type { ClassSession } from '../../classSessions/types/classSession';
import type { ScheduleConfig } from '../../scheduleConfig/types/scheduleConfig';
import type { ClassGroup, Classroom } from '../../classSessionComponents/types';

/**
 * Type definition for a timetable grid, where each group has an array of class sessions.
 * The grid is indexed by group ID and stores either a class session or null for an empty slot.
 */
export type TimetableGrid = Map<string, (ClassSession | null)[]>;

/**
 * Checks if the number of students in a class group exceeds the capacity of the assigned classroom.
 *
 * @param group The class group that needs to be checked.
 * @param classroom The classroom that the group is scheduled in.
 * @returns A string error message if there is a conflict, or an empty string if there is no conflict.
 */
export function checkCapacityConflict(group: ClassGroup, classroom: Classroom): string {
  const studentCount = group.student_count;
  const classroomCapacity = classroom.capacity;

  // Ensure both values are numbers before comparing.
  if (typeof studentCount === 'number' && typeof classroomCapacity === 'number') {
    if (studentCount > classroomCapacity) {
      return `Capacity conflict: The group "${group.name}" (${studentCount} students) exceeds the capacity of classroom "${classroom.name}" (${classroomCapacity} seats).`;
    }
  }

  // No conflict if student count is within capacity.
  return '';
}

/**
 * Checks for "soft" conflicts within a class session that are not blocking but should be flagged.
 * Soft conflicts may include capacity issues or other future concerns (e.g., resource requirements).
 *
 * @param session The class session to check for potential conflicts.
 * @returns An array of conflict messages, or an empty array if no conflicts are found.
 */
export function checkSoftConflicts(session: ClassSession): string[] {
  const conflicts: string[] = [];

  // 1. Check for capacity conflicts between the group and classroom.
  const capacityError = checkCapacityConflict(session.group, session.classroom);
  if (capacityError) {
    conflicts.push(capacityError);
  }

  // Future soft conflicts (e.g., instructor preferences, resource requirements) can be added here.

  return conflicts;
}

/**
 * Checks for boundary conflicts in the timetable, ensuring the session doesn't extend beyond the available time range.
 *
 * @param period_count The number of periods the class session spans.
 * @param targetPeriodIndex The starting period index of the class session.
 * @param settings The timetable settings that define the schedule structure (e.g., periods per day, days per week).
 * @returns A string error message if a conflict is detected, or an empty string if there are no boundary issues.
 */
function checkBoundaryConflicts(
  period_count: number,
  targetPeriodIndex: number,
  settings: ScheduleConfig
): string {
  const { periods_per_day, class_days_per_week } = settings;
  const totalPeriods = class_days_per_week * periods_per_day;

  // Ensure the session doesn't extend beyond the total number of periods in the schedule.
  if (targetPeriodIndex + period_count > totalPeriods) {
    return `Placement conflict: Class extends beyond timetable limit of ${totalPeriods} periods.`;
  }

  const startDay = Math.floor(targetPeriodIndex / periods_per_day);
  const endDay = Math.floor((targetPeriodIndex + period_count - 1) / periods_per_day);

  // Ensure the session doesn't span across multiple days.
  if (startDay !== endDay) {
    return `Placement conflict: Class cannot span multiple days (spans from day ${startDay + 1} to day ${endDay + 1}).`;
  }

  return '';
}

/**
 * Checks for conflicts within the target group's own row in the timetable.
 * Ensures that no other session is already occupying the same time slot.
 *
 * @param timetable The full timetable grid.
 * @param sessionToCheck The class session to check for conflicts.
 * @param targetGroupId The ID of the target group that the session belongs to.
 * @param targetPeriodIndex The index of the period where the session is scheduled to start.
 * @returns A string error message if a conflict is detected, or an empty string if no conflict is found.
 */
function checkGroupConflicts(
  timetable: TimetableGrid,
  sessionToCheck: ClassSession,
  targetGroupId: string,
  targetPeriodIndex: number
): string {
  const period_count = sessionToCheck.period_count || 1;
  const targetGroupSchedule = timetable.get(targetGroupId);

  // Return empty if the group has no schedule.
  if (!targetGroupSchedule) return '';

  // Check each period that the session spans to ensure no overlap.
  for (let i = 0; i < period_count; i++) {
    const sessionInSlot = targetGroupSchedule[targetPeriodIndex + i];
    if (sessionInSlot && sessionInSlot.id !== sessionToCheck.id) {
      return `Group conflict: Time slot occupied by class '${sessionInSlot.course.code}' of group '${sessionInSlot.group.name}'.`;
    }
  }

  return '';
}

/**
 * Finds all class sessions at a specific period that may conflict with the target session.
 * Ignores sessions from the same group and sessions with the same ID.
 *
 * @param timetable - The full timetable grid.
 * @param periodIndex - The index of the period to check.
 * @param targetGroupId - The ID of the group the class session is being scheduled for.
 * @param sessionToCheck - The class session being scheduled.
 * @returns An array of potentially conflicting sessions scheduled at the same period.
 */
export function findConflictingSessionsAtPeriod(
  timetable: TimetableGrid,
  periodIndex: number,
  targetGroupId: string,
  sessionToCheck: ClassSession
): ClassSession[] {
  const conflicts: ClassSession[] = [];

  for (const [groupId, schedule] of timetable.entries()) {
    if (groupId === targetGroupId) continue;

    const otherSession = schedule[periodIndex];
    if (!otherSession || otherSession.id === sessionToCheck.id) continue;

    conflicts.push(otherSession);
  }

  return conflicts;
}

/**
 * Checks if the session's instructor is already scheduled to teach another class at the same time.
 *
 * @param timetable - The full timetable grid.
 * @param sessionToCheck - The session being checked.
 * @param targetGroupId - The ID of the group the session is being scheduled for.
 * @param targetPeriodIndex - The index of the period the session is scheduled to start.
 * @returns A string describing the conflict, or an empty string if no instructor conflict is found.
 */
function checkInstructorConflicts(
  timetable: TimetableGrid,
  sessionToCheck: ClassSession,
  targetGroupId: string,
  targetPeriodIndex: number
): string {
  const period_count = sessionToCheck.period_count || 1;

  for (let i = 0; i < period_count; i++) {
    const periodIndex = targetPeriodIndex + i;
    const conflicts = findConflictingSessionsAtPeriod(
      timetable,
      periodIndex,
      targetGroupId,
      sessionToCheck
    );

    for (const conflictingSession of conflicts) {
      if (conflictingSession.instructor.id === sessionToCheck.instructor.id) {
        const name = `${conflictingSession.instructor.first_name} ${conflictingSession.instructor.last_name}`;
        return `Instructor conflict: ${name} is already scheduled to teach group '${conflictingSession.group.name}' at this time (class: '${conflictingSession.course.code}').`;
      }
    }
  }

  return '';
}

/**
 * Checks if the classroom is already booked for another session at the same time.
 *
 * @param timetable - The full timetable grid.
 * @param sessionToCheck - The session being checked.
 * @param targetGroupId - The ID of the group the session is being scheduled for.
 * @param targetPeriodIndex - The index of the period the session is scheduled to start.
 * @returns A string describing the conflict, or an empty string if no classroom conflict is found.
 */
function checkClassroomConflicts(
  timetable: TimetableGrid,
  sessionToCheck: ClassSession,
  targetGroupId: string,
  targetPeriodIndex: number
): string {
  const period_count = sessionToCheck.period_count || 1;

  for (let i = 0; i < period_count; i++) {
    const periodIndex = targetPeriodIndex + i;
    const conflicts = findConflictingSessionsAtPeriod(
      timetable,
      periodIndex,
      targetGroupId,
      sessionToCheck
    );

    for (const conflictingSession of conflicts) {
      if (conflictingSession.classroom.id === sessionToCheck.classroom.id) {
        return `Classroom conflict: Classroom '${conflictingSession.classroom.name}' is already booked by group '${conflictingSession.group.name}' at this time (class: '${conflictingSession.course.code}').`;
      }
    }
  }

  return '';
}

/**
 * Checks for shared resource conflicts, including instructors and classrooms,
 * by delegating to specific conflict checkers.
 *
 * @param timetable The full timetable grid.
 * @param sessionToCheck The class session to validate.
 * @param targetGroupId The ID of the group the session belongs to.
 * @param targetPeriodIndex The index of the period where the session is scheduled to start.
 * @returns A string error message if any resource conflict is found, or an empty string if none.
 */
function checkResourceConflicts(
  timetable: TimetableGrid,
  sessionToCheck: ClassSession,
  targetGroupId: string,
  targetPeriodIndex: number
): string {
  return (
    checkInstructorConflicts(timetable, sessionToCheck, targetGroupId, targetPeriodIndex) ||
    checkClassroomConflicts(timetable, sessionToCheck, targetGroupId, targetPeriodIndex)
  );
}

/**
 * Main function to check for all types of conflicts in a timetable.
 * It checks for boundary, group, and resource conflicts for the specified class session.
 *
 * @param timetable The full timetable grid to check.
 * @param classSessionToCheck The class session to check for conflicts.
 * @param settings The timetable settings.
 * @param targetGroupId The ID of the group that the session belongs to.
 * @param targetPeriodIndex The index of the period where the session is scheduled to start.
 * @returns A string describing the conflict, or an empty string if no conflicts are found.
 */
export default function checkTimetableConflicts(
  timetable: TimetableGrid,
  classSessionToCheck: ClassSession,
  settings: ScheduleConfig,
  targetGroupId: string,
  targetPeriodIndex: number
): string {
  const period_count = classSessionToCheck.period_count || 1;

  // Check for boundary conflicts.
  const boundaryError = checkBoundaryConflicts(period_count, targetPeriodIndex, settings);
  if (boundaryError) return boundaryError;

  // Check for conflicts within the same group.
  const groupError = checkGroupConflicts(
    timetable,
    classSessionToCheck,
    targetGroupId,
    targetPeriodIndex
  );
  if (groupError) return groupError;

  // Check for resource conflicts (instructor and classroom).
  const resourceError = checkResourceConflicts(
    timetable,
    classSessionToCheck,
    targetGroupId,
    targetPeriodIndex
  );
  if (resourceError) return resourceError;

  // No conflicts found.
  return '';
}
