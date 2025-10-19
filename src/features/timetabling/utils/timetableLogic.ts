/**
 * @file This module contains the core logic for transforming timetable data into a UI-friendly structure.
 * Supports multiple view modes: class-group, classroom, and instructor.
 */

import type { ClassGroup, Classroom, Instructor } from '../../classSessionComponents/types';
import type { ClassSession } from '../../classSessions/types/classSession';
import type { HydratedTimetableAssignment, TimetableViewMode } from '../types/timetable';

/**
 * A type representing the timetable's data structure.
 * It's a Map where keys are resource IDs (class group, classroom, or instructor) and values are arrays representing periods.
 * Each cell can contain an array of sessions (for merged classes) or null.
 */
export type TimetableGrid = Map<string, (ClassSession[] | null)[]>;

/**
 * Union type for all possible row resources in different view modes.
 */
export type TimetableRowResource = ClassGroup | Classroom | Instructor;

/**
 * Initializes the timetable grid with empty rows for each resource.
 *
 * @param grid - The timetable grid Map to populate with empty rows.
 * @param resources - The array of resources (class groups, classrooms, or instructors) that will form the rows of the timetable.
 * @param totalPeriods - The total number of periods in the schedule (days * periods_per_day).
 */
function initializeGridRows(
  grid: TimetableGrid,
  resources: TimetableRowResource[],
  totalPeriods: number
): void {
  if (resources.length === 0) {
    return;
  }

  for (const resource of resources) {
    grid.set(resource.id, Array(totalPeriods).fill(null));
  }
}

/**
 * Groups assignments by period index for efficient processing.
 *
 * @param assignments - The assignments to group.
 * @returns A map of period index to assignments.
 */
function groupAssignmentsByPeriod(assignments: HydratedTimetableAssignment[]): Map<number, HydratedTimetableAssignment[]> {
  const assignmentsByPeriod = new Map<number, HydratedTimetableAssignment[]>();
  for (const assignment of assignments) {
    if (!assignmentsByPeriod.has(assignment.period_index)) {
      assignmentsByPeriod.set(assignment.period_index, []);
    }
    assignmentsByPeriod.get(assignment.period_index)!.push(assignment);
  }
  return assignmentsByPeriod;
}

/**
 * Groups assignments in a period by what makes them mergeable.
 *
 * @param assignmentsInPeriod - The assignments in the current period.
 * @param grid - The timetable grid being built.
 * @param periodIndex - The index of the current period.
 * @returns Void.
 */
function groupMergeableAssignments(
  assignmentsInPeriod: HydratedTimetableAssignment[],
  grid: TimetableGrid,
  periodIndex: number
): Map<string, HydratedTimetableAssignment[]> {
  const mergeGroups = new Map<string, HydratedTimetableAssignment[]>();
  
  for (const assignment of assignmentsInPeriod) {
    const row = grid.get(assignment.class_group_id);
    if (!assignment.class_session || !row || row[periodIndex] !== null) {
      continue;
    }

    const { course, instructor, classroom } = assignment.class_session;
    if (!course || !instructor || !classroom) continue;

    const mergeKey = `${course.code}-${instructor.id}-${classroom.id}`;
    if (!mergeGroups.has(mergeKey)) {
      mergeGroups.set(mergeKey, []);
    }
    mergeGroups.get(mergeKey)!.push(assignment);
  }
  
  return mergeGroups;
}

/**
 * Updates a single group row with merged session data.
 * For merged sessions, we now create separate arrays for each group to enable
 * individual ownership tracking.
 *
 * @param groupRow - The row for a specific group.
 * @param sessionForThisGroup - The session belonging to this specific group.
 * @param allMergedSessions - All sessions that are merged together.
 * @param periodIndex - The index of the period.
 * @param periodCount - The number of periods this session spans.
 * @param totalPeriods - The total number of periods.
 */
function updateGroupRowWithMergedSessions(
  groupRow: (ClassSession[] | null)[],
  sessionForThisGroup: ClassSession,
  allMergedSessions: ClassSession[],
  periodIndex: number,
  periodCount: number,
  totalPeriods: number
): void {
  // Create array with this group's session first, followed by others
  const orderedSessions = [
    sessionForThisGroup,
    ...allMergedSessions.filter(s => s.id !== sessionForThisGroup.id)
  ];
  
  for (let i = 0; i < periodCount; i++) {
    if (periodIndex + i < totalPeriods) {
      groupRow[periodIndex + i] = orderedSessions;
    }
  }
}

/**
 * Places a merge group onto the grid.
 * Each group gets its own session array with its session first.
 *
 * @param mergeableAssignments - The assignments that can be merged.
 * @param grid - The timetable grid being built.
 * @param periodIndex - The index of the current period.
 * @param totalPeriods - The total number of periods.
 */
function placeMergeGroupOnGrid(
  mergeableAssignments: HydratedTimetableAssignment[],
  grid: TimetableGrid,
  periodIndex: number,
  totalPeriods: number
): void {
  if (mergeableAssignments.length === 0) return;

  const allMergedSessions = mergeableAssignments.map((a) => a.class_session!);
  const period_count = allMergedSessions[0]?.period_count || 1;

  // Place each session in its respective group's row
  for (const assignmentToPlace of mergeableAssignments) {
    const groupRowToUpdate = grid.get(assignmentToPlace.class_group_id);
    if (groupRowToUpdate && assignmentToPlace.class_session) {
      updateGroupRowWithMergedSessions(
        groupRowToUpdate,
        assignmentToPlace.class_session,
        allMergedSessions,
        periodIndex,
        period_count,
        totalPeriods
      );
    }
  }
}

/**
 * Transforms a flat array of timetable assignments into a grid structure for Class Group view.
 *
 * @param assignments - The flat array of assignment data from the server.
 * @param classGroups - The list of all class groups, used to initialize the grid rows.
 * @param totalPeriods - The total number of periods in the schedule (days * periods_per_day).
 * @returns A Map representing the populated timetable grid with merged sessions.
 */
export function buildTimetableGridForClassGroups(
  assignments: HydratedTimetableAssignment[],
  classGroups: ClassGroup[],
  totalPeriods: number
): TimetableGrid {
  const grid: TimetableGrid = new Map();
  initializeGridRows(grid, classGroups, totalPeriods);

  if (!assignments || assignments.length === 0) {
    return grid;
  }

  const assignmentsByPeriod = groupAssignmentsByPeriod(assignments);

  for (let periodIndex = 0; periodIndex < totalPeriods; periodIndex++) {
    const assignmentsInPeriod = assignmentsByPeriod.get(periodIndex) || [];
    if (assignmentsInPeriod.length === 0) continue;

    const mergeGroups = groupMergeableAssignments(assignmentsInPeriod, grid, periodIndex);

    for (const [, mergeableAssignments] of mergeGroups.entries()) {
      placeMergeGroupOnGrid(mergeableAssignments, grid, periodIndex, totalPeriods);
    }
  }

  return grid;
}

/**
 * Transforms a flat array of timetable assignments into a grid structure for Classroom view.
 * Rows represent classrooms instead of class groups.
 *
 * @param assignments - The flat array of assignment data from the server.
 * @param classrooms - The list of all classrooms, used to initialize the grid rows.
 * @param totalPeriods - The total number of periods in the schedule (days * periods_per_day).
 * @returns A Map representing the populated timetable grid organized by classroom.
 */
export function buildTimetableGridForClassrooms(
  assignments: HydratedTimetableAssignment[],
  classrooms: Classroom[],
  totalPeriods: number
): TimetableGrid {
  const grid: TimetableGrid = new Map();
  initializeGridRows(grid, classrooms, totalPeriods);

  if (!assignments || assignments.length === 0) {
    return grid;
  }

  const assignmentsByPeriod = groupAssignmentsByPeriod(assignments);

  for (let periodIndex = 0; periodIndex < totalPeriods; periodIndex++) {
    const assignmentsInPeriod = assignmentsByPeriod.get(periodIndex) || [];
    if (assignmentsInPeriod.length === 0) continue;

    // Group by classroom and merge key
    const classroomMergeGroups = new Map<string, HydratedTimetableAssignment[]>();
    
    for (const assignment of assignmentsInPeriod) {
      const session = assignment.class_session;
      if (!session?.classroom || !session.course || !session.instructor) continue;

      const classroomRow = grid.get(session.classroom.id);
      if (!classroomRow || classroomRow[periodIndex] !== null) continue;

      const mergeKey = `${session.classroom.id}-${session.course.code}-${session.instructor.id}`;
      if (!classroomMergeGroups.has(mergeKey)) {
        classroomMergeGroups.set(mergeKey, []);
      }
      classroomMergeGroups.get(mergeKey)!.push(assignment);
    }

    // Place merged groups on grid organized by classroom
    for (const [, mergeableAssignments] of classroomMergeGroups.entries()) {
      if (mergeableAssignments.length === 0) continue;

      const allMergedSessions = mergeableAssignments.map((a) => a.class_session!);
      const period_count = allMergedSessions[0]?.period_count || 1;
      const classroomId = allMergedSessions[0]?.classroom?.id;

      if (classroomId) {
        const classroomRow = grid.get(classroomId);
        if (classroomRow) {
          const orderedSessions = [...allMergedSessions];
          for (let i = 0; i < period_count; i++) {
            if (periodIndex + i < totalPeriods) {
              classroomRow[periodIndex + i] = orderedSessions;
            }
          }
        }
      }
    }
  }

  return grid;
}

/**
 * Transforms a flat array of timetable assignments into a grid structure for Instructor view.
 * Rows represent instructors instead of class groups.
 *
 * @param assignments - The flat array of assignment data from the server.
 * @param instructors - The list of all instructors, used to initialize the grid rows.
 * @param totalPeriods - The total number of periods in the schedule (days * periods_per_day).
 * @returns A Map representing the populated timetable grid organized by instructor.
 */
export function buildTimetableGridForInstructors(
  assignments: HydratedTimetableAssignment[],
  instructors: Instructor[],
  totalPeriods: number
): TimetableGrid {
  const grid: TimetableGrid = new Map();
  initializeGridRows(grid, instructors, totalPeriods);

  if (!assignments || assignments.length === 0) {
    return grid;
  }

  const assignmentsByPeriod = groupAssignmentsByPeriod(assignments);

  for (let periodIndex = 0; periodIndex < totalPeriods; periodIndex++) {
    const assignmentsInPeriod = assignmentsByPeriod.get(periodIndex) || [];
    if (assignmentsInPeriod.length === 0) continue;

    // Group by instructor and merge key
    const instructorMergeGroups = new Map<string, HydratedTimetableAssignment[]>();
    
    for (const assignment of assignmentsInPeriod) {
      const session = assignment.class_session;
      if (!session?.instructor || !session.course || !session.classroom) continue;

      const instructorRow = grid.get(session.instructor.id);
      if (!instructorRow || instructorRow[periodIndex] !== null) continue;

      const mergeKey = `${session.instructor.id}-${session.course.code}-${session.classroom.id}`;
      if (!instructorMergeGroups.has(mergeKey)) {
        instructorMergeGroups.set(mergeKey, []);
      }
      instructorMergeGroups.get(mergeKey)!.push(assignment);
    }

    // Place merged groups on grid organized by instructor
    for (const [, mergeableAssignments] of instructorMergeGroups.entries()) {
      if (mergeableAssignments.length === 0) continue;

      const allMergedSessions = mergeableAssignments.map((a) => a.class_session!);
      const period_count = allMergedSessions[0]?.period_count || 1;
      const instructorId = allMergedSessions[0]?.instructor?.id;

      if (instructorId) {
        const instructorRow = grid.get(instructorId);
        if (instructorRow) {
          const orderedSessions = [...allMergedSessions];
          for (let i = 0; i < period_count; i++) {
            if (periodIndex + i < totalPeriods) {
              instructorRow[periodIndex + i] = orderedSessions;
            }
          }
        }
      }
    }
  }

  return grid;
}

/**
 * Factory function that builds the appropriate timetable grid based on view mode.
 *
 * @param assignments - The flat array of assignment data from the server.
 * @param viewMode - The current view mode (class-group, classroom, or instructor).
 * @param resources - The list of resources (class groups, classrooms, or instructors) for the current view.
 * @param totalPeriods - The total number of periods in the schedule (days * periods_per_day).
 * @returns A Map representing the populated timetable grid for the specified view mode.
 */
export function buildTimetableGrid(
  assignments: HydratedTimetableAssignment[],
  viewMode: TimetableViewMode,
  resources: TimetableRowResource[],
  totalPeriods: number
): TimetableGrid {
  switch (viewMode) {
    case 'classroom':
      return buildTimetableGridForClassrooms(assignments, resources as Classroom[], totalPeriods);
    case 'instructor':
      return buildTimetableGridForInstructors(assignments, resources as Instructor[], totalPeriods);
    case 'class-group':
    default:
      return buildTimetableGridForClassGroups(assignments, resources as ClassGroup[], totalPeriods);
  }
}