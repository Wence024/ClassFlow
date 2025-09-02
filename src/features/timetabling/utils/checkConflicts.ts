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
      return `Capacity conflict: The group "${group.name}" (${studentCount} students) exceeds the capacity of "${classroom.name}" (${classroomCapacity} seats).`;
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
    return 'Placement conflict: Class extends beyond the available timetable days.';
  }

  const startDay = Math.floor(targetPeriodIndex / periods_per_day);
  const endDay = Math.floor((targetPeriodIndex + period_count - 1) / periods_per_day);

  // Ensure the session doesn't span across multiple days.
  if (startDay !== endDay) {
    return 'Placement conflict: Class cannot span across multiple days.';
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
      return `Conflict within ${sessionInSlot.group.name}: This time slot is already occupied.`;
    }
  }

  return '';
}

/**
 * Checks for conflicts related to shared resources (instructors and classrooms).
 * Ensures no other session is using the same instructor or classroom at the same time.
 * 
 * @param timetable The full timetable grid.
 * @param sessionToCheck The class session to check for conflicts.
 * @param targetGroupId The ID of the target group.
 * @param targetPeriodIndex The index of the period where the session is scheduled to start.
 * @returns A string error message if a conflict is detected, or an empty string if no conflict is found.
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
      // Skip checking against the target group itself.
      if (groupId === targetGroupId) continue;

      const conflictingSession = schedule[currentPeriod];

      // Skip if no session is in the slot or if it's the same session we're checking.
      if (!conflictingSession || conflictingSession.id === sessionToCheck.id) continue;

      // Check for instructor conflict.
      if (conflictingSession.instructor.id === sessionToCheck.instructor.id) {
        const instructorName = `${conflictingSession.instructor.first_name} ${conflictingSession.instructor.last_name}`;
        return `Instructor conflict: ${instructorName} is already scheduled for ${conflictingSession.group.name} at this time.`;
      }

      // Check for classroom conflict.
      if (conflictingSession.classroom.id === sessionToCheck.classroom.id) {
        return `Classroom conflict: ${conflictingSession.classroom.name} is already in use by ${conflictingSession.group.name} at this time.`;
      }
    }
  }

  return '';
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
export default function checkConflicts(
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
