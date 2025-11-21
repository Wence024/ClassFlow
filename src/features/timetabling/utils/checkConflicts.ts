import type { ClassGroup, Classroom } from '../../classSessionComponents/types';
import type { ClassSession } from '@/types/classSession';
import type { Program } from '@/types/program';
import type { ScheduleConfig } from '@/types/scheduleConfig';
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
 * Finds a conflict in a specific time slot, checking for non-mergeable sessions.
 *
 * @param sessionsInSlot The sessions currently in the slot.
 * @param sessionToCheck The session being validated.
 * @param periodIndex The index of the period being checked.
 * @param resourceType A label for the resource type used in error messages.
 * @returns A string error message if a conflict is found, otherwise null.
 */
function findConflictInSlot(
  sessionsInSlot: ClassSession[],
  sessionToCheck: ClassSession,
  periodIndex: number,
  resourceType: string
): string | null {
  for (const sessionInSlot of sessionsInSlot) {
    if (sessionInSlot.id === sessionToCheck.id) continue; // Skip self

    const isMergeable =
      sessionInSlot.course.code === sessionToCheck.course.code &&
      sessionInSlot.instructor.id === sessionToCheck.instructor.id &&
      sessionInSlot.classroom.id === sessionToCheck.classroom.id;

    if (!isMergeable) {
      return `${resourceType} conflict: Period ${periodIndex + 1} is already occupied by class '${sessionInSlot.course.code}' for group '${sessionInSlot.group.name}'.`;
    }
  }
  return null;
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
  resourceType = 'resource'
): string {
  const period_count = sessionToCheck.period_count || 1;
  const targetRow = timetable.get(targetResourceId);

  if (!targetRow) return '';

  for (let i = 0; i < period_count; i++) {
    const periodIndex = targetPeriodIndex + i;
    const sessionsInSlot = targetRow[periodIndex];

    if (!sessionsInSlot) continue;

    const conflict = findConflictInSlot(sessionsInSlot, sessionToCheck, periodIndex, resourceType);
    if (conflict) return conflict;
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
 * @param targetGroupId - The ID of the group where the session is being placed.
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
 * Processes a potential instructor conflict to determine if it's a true conflict.
 * A conflict is ignored if it's a mergeable session (same course).
 *
 * @param conflictingSession - The session that might conflict.
 * @param sessionToCheck - The session being validated.
 * @param programs - A list of all programs to resolve program names.
 * @returns A formatted conflict message if it's a true conflict, otherwise null.
 */
function processInstructorConflict(
  conflictingSession: ClassSession,
  sessionToCheck: ClassSession,
  programs: Program[]
): string | null {
  // If the course is the same, it's a valid merge, so we ignore it.
  if (conflictingSession.course.code === sessionToCheck.course.code) {
    return null;
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
  const conflictingSessions = findConflictingSessionsAtPeriod(
    timetable,
    periodIndex,
    targetGroupId,
    sessionToCheck
  );

  for (const conflictingSession of conflictingSessions) {
    if (conflictingSession.instructor.id === sessionToCheck.instructor.id) {
      const conflictMessage = processInstructorConflict(
        conflictingSession,
        sessionToCheck,
        programs
      );
      if (conflictMessage) {
        return conflictMessage;
      }
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
 * Finds a group conflict within a single timetable cell.
 *
 * @param sessionsInCell - The sessions in the timetable cell to check.
 * @param sessionToCheck - The session being validated.
 * @param targetGroupId - The ID of the group to check for double-booking.
 * @param periodIndex - The period index, for the error message.
 * @returns A conflict message string if a non-mergeable session for the same group is found, otherwise null.
 */
function findGroupConflictInCell(
  sessionsInCell: ClassSession[],
  sessionToCheck: ClassSession,
  targetGroupId: string,
  periodIndex: number
): string | null {
  for (const existingSession of sessionsInCell) {
    if (existingSession.id === sessionToCheck.id) continue;

    if (existingSession.group.id === targetGroupId) {
      const isMergeable =
        existingSession.course.code === sessionToCheck.course.code &&
        existingSession.instructor.id === sessionToCheck.instructor.id &&
        existingSession.classroom.id === sessionToCheck.classroom.id;

      if (!isMergeable) {
        return `Group conflict: ${sessionToCheck.group.name} is already scheduled for '${existingSession.course.code}' at period ${periodIndex + 1}.`;
      }
    }
  }
  return null;
}

/**
 * Iterates over all timetable rows for a given period to find a group conflict.
 *
 * @param timetable - The full timetable grid.
 * @param sessionToCheck - The session being validated.
 * @param targetGroupId - The ID of the group to check for double-booking.
 * @param periodIndex - The specific period index to check.
 * @returns A conflict message string if found, otherwise an empty string.
 */
function findGroupConflictInPeriod(
  timetable: TimetableGrid,
  sessionToCheck: ClassSession,
  targetGroupId: string,
  periodIndex: number
): string {
  for (const [, schedule] of timetable.entries()) {
    const sessionsInCell = schedule[periodIndex];
    if (!sessionsInCell) continue;

    const conflict = findGroupConflictInCell(
      sessionsInCell,
      sessionToCheck,
      targetGroupId,
      periodIndex
    );
    if (conflict) return conflict;
  }
  return '';
}

/**
 * Checks for group double-booking by searching across all timetable rows.
 * This works in any view mode by examining all sessions in the timetable.
 *
 * @param timetable - The full timetable grid (keyed by view-specific resource IDs).
 * @param sessionToCheck - The session being validated.
 * @param targetPeriodIndex - The starting period where the session would be placed.
 * @returns A string describing the group conflict, or an empty string if no conflict.
 */
function checkGroupDoubleBooking(
  timetable: TimetableGrid,
  sessionToCheck: ClassSession,
  targetPeriodIndex: number
): string {
  const period_count = sessionToCheck.period_count || 1;
  const targetGroupId = sessionToCheck.group.id;

  for (let i = 0; i < period_count; i++) {
    const periodIndex = targetPeriodIndex + i;
    const conflict = findGroupConflictInPeriod(
      timetable,
      sessionToCheck,
      targetGroupId,
      periodIndex
    );
    if (conflict) {
      return conflict;
    }
  }

  return '';
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
 * Gets a resource type label for a given view mode.
 *
 * @param viewMode - The current timetable view mode.
 * @returns A string label for the resource type (e.g., 'Classroom', 'Instructor').
 */
function getResourceTypeForViewMode(viewMode: TimetableViewMode): string {
  switch (viewMode) {
    case 'classroom':
      return 'Classroom';
    case 'instructor':
      return 'Instructor';
    case 'class-group':
    default:
      return 'Group';
  }
}

/**
 * A class to encapsulate the logic for checking various types of conflicts in the timetable.
 * This helps to manage complexity and keep the `checkTimetableConflicts` function clean.
 */
class ConflictChecker {
  private timetable: TimetableGrid;
  private session: ClassSession;
  private settings: ScheduleConfig;
  private targetGroupId: string;
  private targetPeriodIndex: number;
  private programs: Program[];
  private viewMode: TimetableViewMode;
  private isMoving: boolean;
  private periodCount: number;

  constructor(
    timetable: TimetableGrid,
    session: ClassSession,
    settings: ScheduleConfig,
    targetGroupId: string,
    targetPeriodIndex: number,
    programs: Program[],
    viewMode: TimetableViewMode,
    isMoving: boolean
  ) {
    this.timetable = timetable;
    this.session = session;
    this.settings = settings;
    this.targetGroupId = targetGroupId;
    this.targetPeriodIndex = targetPeriodIndex;
    this.programs = programs;
    this.viewMode = viewMode;
    this.isMoving = isMoving;
    this.periodCount = session.period_count || 1;
  }

  /**
   * Runs all conflict checks in a predefined order and returns the first conflict message found.
   *
   * @returns A string message describing the first detected conflict, or an empty string if no conflicts exist.
   */
  run(): string {
    return (
      this.checkBoundary() ||
      this.checkResourceMismatch() ||
      this.checkRow() ||
      this.checkGroupDoubleBooking() ||
      this.checkResources() ||
      ''
    );
  }

  private checkBoundary(): string | null {
    return checkBoundaryConflicts(this.periodCount, this.targetPeriodIndex, this.settings);
  }

  private checkResourceMismatch(): string | null {
    if (this.isMoving) {
      return checkViewSpecificResourceMismatch(this.session, this.targetGroupId, this.viewMode);
    }
    return null;
  }

  private checkRow(): string | null {
    const resourceType = getResourceTypeForViewMode(this.viewMode);
    return checkRowConflicts(
      this.timetable,
      this.session,
      this.targetGroupId,
      this.targetPeriodIndex,
      resourceType
    );
  }

  private checkGroupDoubleBooking(): string | null {
    return checkGroupDoubleBooking(this.timetable, this.session, this.targetPeriodIndex);
  }

  private checkResources(): string | null {
    return checkResourceConflicts(
      this.timetable,
      this.session,
      this.targetGroupId,
      this.targetPeriodIndex,
      this.programs
    );
  }
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
 * @param isMovingSession - Whether this is a move operation (true) or assign operation (false). Resource mismatch checks only apply to moves.
 * @returns A string message describing the first detected conflict (boundary, group, or resource), or an empty string if the placement is valid.
 */
export default function checkTimetableConflicts(
  timetable: TimetableGrid,
  classSessionToCheck: ClassSession,
  settings: ScheduleConfig,
  targetGroupId: string,
  targetPeriodIndex: number,
  programs: Program[],
  viewMode: TimetableViewMode = 'class-group',
  isMovingSession = false
): string {
  const checker = new ConflictChecker(
    timetable,
    classSessionToCheck,
    settings,
    targetGroupId,
    targetPeriodIndex,
    programs,
    viewMode,
    isMovingSession
  );
  return checker.run();
}
