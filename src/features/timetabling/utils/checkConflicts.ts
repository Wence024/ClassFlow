import type { ClassGroup, Classroom } from '../../classSessionComponents/types';
import type { ClassSession } from '../../classSessions/types/classSession';
import type { Program } from '../../programs/types/program';
import type { ScheduleConfig } from '../../scheduleConfig/types/scheduleConfig';
import type { TimetableViewMode } from '../types/timetable';

/**
 * Type definition for a timetable grid, where each group has an array of class sessions.
 * The grid is indexed by group ID and stores either a class session or null for an empty slot.
 */
export type TimetableGrid = Map<string, (ClassSession[] | null)[]>;

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
 * Checks for soft conflicts in a cell containing one or more sessions.
 * Currently focuses on capacity issues in merged sessions.
 *
 * @param sessions - An array of class sessions in the cell.
 * @returns An array of conflict message strings.
 */
export function checkCellSoftConflicts(sessions: ClassSession[]): string[] {
  const conflicts: string[] = [];
  if (!sessions || sessions.length <= 1) {
    return conflicts;
  }

  const capacityConflict = getMergedCapacityConflictMessage(sessions);
  if (capacityConflict) {
    conflicts.push(capacityConflict);
  }

  return conflicts;
}

/**
 * Generates a conflict message if the total student count of a merged session exceeds classroom capacity.
 *
 * @param sessionsInSlot The sessions to be combined in a merge.
 * @returns A string error message if capacity is exceeded, otherwise an empty string.
 */
function getMergedCapacityConflictMessage(sessionsInSlot: ClassSession[]): string {
  if (!sessionsInSlot || sessionsInSlot.length === 0) return '';

  const classroom = sessionsInSlot[0].classroom;
  if (!classroom) return '';

  const allGroupsInMerge = new Map<string, ClassGroup>();
  for (const session of sessionsInSlot) {
    allGroupsInMerge.set(session.group.id, session.group);
  }

  let totalStudents = 0;
  for (const group of allGroupsInMerge.values()) {
    totalStudents += group.student_count || 0;
  }

  if (classroom.capacity && totalStudents > classroom.capacity) {
    const groupNames = Array.from(allGroupsInMerge.values())
      .map((g) => g.name)
      .join(', ');
    return `Capacity conflict: The combined student count (${totalStudents}) of merged groups (${groupNames}) exceeds the capacity of classroom "${classroom.name}" (${classroom.capacity} seats).`;
  }

  return '';
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
 * Checks if a class session belongs to the target group.
 * Prevents moving sessions to rows that don't correspond to their class group.
 *
 * @param sessionToCheck The class session to check.
 * @param targetGroupId The ID of the target group.
 * @returns A string error message if there's a group mismatch, or null if the session belongs to the group.
 */
function checkGroupMismatch(sessionToCheck: ClassSession, targetGroupId: string): string | null {
  if (sessionToCheck.group.id !== targetGroupId) {
    return `Group mismatch: Cannot move session for class group '${sessionToCheck.group.name}' to row for class group '${targetGroupId}'. Sessions can only be moved within their own class group row.`;
  }
  return null;
}

/**
 * Checks if a session matches the target resource in view-specific contexts.
 * 
 * @param sessionToCheck - The session being validated.
 * @param targetResourceId - The ID of the target row resource (group, classroom, or instructor).
 * @param viewMode - The current view mode determining which resource to validate.
 * @returns A string error message if there's a resource mismatch, or null if valid.
 */
function checkViewSpecificResourceMismatch(
  sessionToCheck: ClassSession,
  targetResourceId: string,
  viewMode: TimetableViewMode
): string | null {
  switch (viewMode) {
    case 'class-group':
      return checkGroupMismatch(sessionToCheck, targetResourceId);
    
    case 'classroom':
      if (sessionToCheck.classroom.id !== targetResourceId) {
        return `Classroom mismatch: Cannot move session using classroom '${sessionToCheck.classroom.name}' to a row for classroom '${targetResourceId}'. Sessions can only be moved within their own classroom row.`;
      }
      return null;
    
    case 'instructor':
      if (sessionToCheck.instructor.id !== targetResourceId) {
        const instructorName = `${sessionToCheck.instructor.first_name} ${sessionToCheck.instructor.last_name}`;
        return `Instructor mismatch: Cannot move session taught by '${instructorName}' to a row for instructor '${targetResourceId}'. Sessions can only be moved within their own instructor row.`;
      }
      return null;
    
    default:
      return null;
  }
}

/**
 * Checks for conflicts within the target resource's row in the timetable.
 * This works for any view mode - checks if another session occupies the same time slot.
 *
 * @param timetable The full timetable grid.
 * @param sessionToCheck The class session to check for conflicts.
 * @param targetResourceId The ID of the target resource (group, classroom, or instructor).
 * @param targetPeriodIndex The index of the period where the session is scheduled to start.
 * @param resourceType Optional label for error messages (e.g., 'classroom', 'instructor').
 * @returns A string error message if a conflict is detected, or an empty string if no conflict is found.
 */
function checkRowConflicts(
  timetable: TimetableGrid,
  sessionToCheck: ClassSession,
  targetResourceId: string,
  targetPeriodIndex: number,
  resourceType: string = 'resource'
): string {
  const period_count = sessionToCheck.period_count || 1;
  const targetRow = timetable.get(targetResourceId);

  if (!targetRow) return '';

  for (let i = 0; i < period_count; i++) {
    const periodIndex = targetPeriodIndex + i;
    const sessionsInSlot = targetRow[periodIndex];
    
    if (!sessionsInSlot) continue;

    // Check if there's a different session already in this period
    for (const sessionInSlot of sessionsInSlot) {
      if (sessionInSlot.id !== sessionToCheck.id) {
        // Allow merging: sessions with same course, instructor, and classroom can coexist
        const isMergeable = 
          sessionInSlot.course.id === sessionToCheck.course.id &&
          sessionInSlot.instructor.id === sessionToCheck.instructor.id &&
          sessionInSlot.classroom.id === sessionToCheck.classroom.id;
        
        if (!isMergeable) {
          return `${resourceType} conflict: Period ${periodIndex + 1} is already occupied by class '${sessionInSlot.course.code}' for group '${sessionInSlot.group.name}'.`;
        }
      }
    }
  }

  return '';
}

/**
 * Legacy function for backward compatibility. Delegates to checkRowConflicts.
 * 
 * @deprecated Use checkRowConflicts instead for clarity.
 */
function checkGroupConflicts(
  timetable: TimetableGrid,
  sessionToCheck: ClassSession,
  targetGroupId: string,
  targetPeriodIndex: number
): string {
  return checkRowConflicts(timetable, sessionToCheck, targetGroupId, targetPeriodIndex, 'Group');
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
  // This function finds sessions from all groups, including other programs, for cross-program conflict detection.
  const conflicts: ClassSession[] = [];

  for (const [groupId, schedule] of timetable.entries()) {
    if (groupId === targetGroupId) continue;

    const sessionsInCell = schedule[periodIndex];
    if (!sessionsInCell) continue;

    for (const otherSession of sessionsInCell) {
      if (otherSession.id !== sessionToCheck.id) {
        conflicts.push(otherSession);
      }
    }
  }

  return conflicts;
}

/**
 * Checks if the session's instructor is already scheduled to teach another class at the same time.
 * This function checks all periods the session spans to detect instructor double-booking.
 *
 * @param timetable - The complete timetable grid containing all scheduled sessions.
 * @param sessionToCheck - The class session being validated for instructor conflicts.
 * @param targetGroupId - The ID of the target group where the session is being placed.
 * @param targetPeriodIndex - The starting period index for the session placement.
 * @param programs - A list of all programs to resolve program names from IDs.
 * @returns A string describing the instructor conflict, or an empty string if no conflict found.
 */
function checkInstructorConflicts(
  timetable: TimetableGrid,
  sessionToCheck: ClassSession,
  targetGroupId: string,
  targetPeriodIndex: number,
  programs: Program[]
): string {
  const period_count = sessionToCheck.period_count || 1;

  for (let i = 0; i < period_count; i++) {
    const periodIndex = targetPeriodIndex + i;
    const conflict = findInstructorConflictInPeriod(
      timetable,
      periodIndex,
      targetGroupId,
      sessionToCheck,
      programs
    );
    if (conflict) return conflict;
  }

  return '';
}

/**
 * Finds instructor conflicts in a specific period by comparing instructor names across sessions.
 *
 * @param timetable - The timetable grid to search for conflicting sessions.
 * @param periodIndex - The specific period index to check for conflicts.
 * @param targetGroupId - The group ID to exclude from conflict detection (same group).
 * @param sessionToCheck - The session whose instructor should not be double-booked.
 * @param programs - A list of all programs to resolve program names from IDs.
 * @returns A string describing the instructor conflict, or null if no conflict found in this period.
 */
function findInstructorConflictInPeriod(
  timetable: TimetableGrid,
  periodIndex: number,
  targetGroupId: string,
  sessionToCheck: ClassSession,
  programs: Program[]
): string | null {
  const conflicts = findConflictingSessionsAtPeriod(
    timetable,
    periodIndex,
    targetGroupId,
    sessionToCheck
  );

  for (const conflictingSession of conflicts) {
    // Check if the instructor is the same.
    if (conflictingSession.instructor.id === sessionToCheck.instructor.id) {
      // If the course is also the same, it's a valid merge, so we skip it.
      if (conflictingSession.course.code === sessionToCheck.course.code) {
        continue;
      }

      // If the courses are different, it's a true conflict.
      const name = `${conflictingSession.instructor.first_name} ${conflictingSession.instructor.last_name}`;
      const program = programs.find((p) => p.id === conflictingSession.group.program_id);

      let programInfo = '';
      if (program) {
        programInfo = ` (Program: ${program.name})`;
      } else if (conflictingSession.group.program_id) {
        programInfo = ` (Program ID: ${conflictingSession.group.program_id})`;
      }

      return `Instructor conflict: ${name} is already scheduled to teach group '${conflictingSession.group.name}'${programInfo} at this time (class: '${conflictingSession.course.code}').`;
    }
  }

  return null;
}

/**
 * Checks if the classroom is already booked for another session at the same time.
 * This function validates classroom availability across all periods the session spans.
 *
 * @param timetable - The complete timetable grid containing all scheduled sessions.
 * @param sessionToCheck - The class session being validated for classroom conflicts.
 * @param targetGroupId - The ID of the target group where the session is being placed.
 * @param targetPeriodIndex - The starting period index for the session placement.
 * @returns A string describing the classroom conflict, or an empty string if no conflict found.
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
    const conflict = findClassroomConflictInPeriod(
      timetable,
      periodIndex,
      targetGroupId,
      sessionToCheck
    );
    if (conflict) return conflict;
  }

  return '';
}

/**
 * Finds classroom conflicts in a specific period by comparing classroom names across sessions.
 *
 * @param timetable - The timetable grid to search for conflicting sessions.
 * @param periodIndex - The specific period index to check for conflicts.
 * @param targetGroupId - The group ID to exclude from conflict detection (same group).
 * @param sessionToCheck - The session whose classroom should not be double-booked.
 * @returns A string describing the classroom conflict, or null if no conflict found in this period.
 */
function findClassroomConflictInPeriod(
  timetable: TimetableGrid,
  periodIndex: number,
  targetGroupId: string,
  sessionToCheck: ClassSession
): string | null {
  const conflicts = findConflictingSessionsAtPeriod(
    timetable,
    periodIndex,
    targetGroupId,
    sessionToCheck
  );

  for (const conflictingSession of conflicts) {
    // Check if the classroom is the same.
    if (conflictingSession.classroom.id === sessionToCheck.classroom.id) {
      // If the course is also the same, it's a valid merge, so we skip it.
      if (conflictingSession.course.code === sessionToCheck.course.code) {
        continue;
      }

      // If the courses are different, it's a true conflict.
      return `Classroom conflict: Classroom '${conflictingSession.classroom.name}' is already booked by group '${conflictingSession.group.name}' at this time (class: '${conflictingSession.course.code}').`;
    }
  }

  return null;
}

/**
 * Checks for shared resource conflicts, including instructors and classrooms,
 * by delegating to specific conflict checkers.
 *
 * @param timetable - The full timetable grid containing all scheduled sessions across groups.
 * @param sessionToCheck - The class session to validate for resource conflicts.
 * @param targetGroupId - The ID of the group that the session belongs to.
 * @param targetPeriodIndex - The starting period index where the session is intended to be placed.
 * @param programs - A list of all programs to resolve program names from IDs.
 * @returns A string describing the first detected resource conflict, or an empty string if no conflicts exist.
 */
function checkResourceConflicts(
  timetable: TimetableGrid,
  sessionToCheck: ClassSession,
  targetGroupId: string,
  targetPeriodIndex: number,
  programs: Program[]
): string {
  return (
    checkInstructorConflicts(
      timetable,
      sessionToCheck,
      targetGroupId,
      targetPeriodIndex,
      programs
    ) || checkClassroomConflicts(timetable, sessionToCheck, targetGroupId, targetPeriodIndex)
  );
}

/**
 * Main function to check for all types of conflicts in a timetable.
 * It checks for boundary, group, and resource conflicts for the specified class session.
 *
 * @param timetable - The complete timetable grid representing all scheduled class sessions.
 * @param classSessionToCheck - The specific class session being placed or validated in the timetable.
 * @param settings - The schedule configuration defining the structure of the timetable (e.g., periods per day).
 * @param targetGroupId - The unique identifier of the group for which the session is being scheduled.
 * @param targetPeriodIndex - The starting period index in the timetable where the session should be placed.
 * @param programs - An array of all programs, used for resolving program names in conflict messages.
 * @param viewMode - Optional view mode for view-specific validation (defaults to 'class-group').
 * @returns A string message describing the first detected conflict (boundary, group, or resource), or an empty string if the placement is valid.
 */
export default function checkTimetableConflicts(
  timetable: TimetableGrid,
  classSessionToCheck: ClassSession,
  settings: ScheduleConfig,
  targetGroupId: string,
  targetPeriodIndex: number,
  programs: Program[],
  viewMode: TimetableViewMode = 'class-group'
): string {
  const period_count = classSessionToCheck.period_count || 1;

  const boundaryError = checkBoundaryConflicts(period_count, targetPeriodIndex, settings);
  if (boundaryError) return boundaryError;

  // Check view-specific resource mismatch
  const resourceMismatchError = checkViewSpecificResourceMismatch(
    classSessionToCheck,
    targetGroupId,
    viewMode
  );
  if (resourceMismatchError) {
    console.error('[checkConflicts] resource mismatch', {
      viewMode,
      error: resourceMismatchError,
      targetId: targetGroupId,
      sessionId: classSessionToCheck.id,
    });
    return resourceMismatchError;
  }

  // Check for time slot conflicts in the target row (view-specific)
  let resourceType: string;
  switch (viewMode) {
    case 'classroom':
      resourceType = 'Classroom';
      break;
    case 'instructor':
      resourceType = 'Instructor';
      break;
    case 'class-group':
    default:
      resourceType = 'Group';
      break;
  }

  const rowError = checkRowConflicts(
    timetable,
    classSessionToCheck,
    targetGroupId,
    targetPeriodIndex,
    resourceType
  );
  if (rowError) {
    console.error('[checkConflicts] row conflict', {
      viewMode,
      error: rowError,
      targetResourceId: targetGroupId,
      targetPeriodIndex,
      sessionId: classSessionToCheck.id,
    });
    return rowError;
  }

  // Also check the class group row for conflicts (ensures no double-booking of the group)
  // This is important even in classroom/instructor views
  if (viewMode !== 'class-group') {
    const groupError = checkGroupConflicts(
      timetable,
      classSessionToCheck,
      classSessionToCheck.group.id,
      targetPeriodIndex
    );
    if (groupError) {
      console.error('[checkConflicts] group double-booking', {
        viewMode,
        error: groupError,
        groupId: classSessionToCheck.group.id,
        targetPeriodIndex,
        sessionId: classSessionToCheck.id,
      });
      return groupError;
    }
  }

  // --- Standard Resource Conflict Check ---
  return checkResourceConflicts(
    timetable,
    classSessionToCheck,
    targetGroupId,
    targetPeriodIndex,
    programs
  );
}
