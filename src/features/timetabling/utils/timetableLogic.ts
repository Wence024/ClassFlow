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
 * Groups assignments in a period by a resource-specific merge key.
 *
 * @param assignmentsInPeriod - The assignments in the current period.
 * @param grid - The timetable grid being built.
 * @param periodIndex - The index of the current period.
 * @param getResourceId - A function to extract the resource ID for the current view.
 * @returns A map of merge keys to assignments.
 */
function groupResourceAssignments(
  assignmentsInPeriod: HydratedTimetableAssignment[],
  grid: TimetableGrid,
  periodIndex: number,
  getResourceId: (session: ClassSession) => string | undefined
): Map<string, HydratedTimetableAssignment[]> {
  const resourceMergeGroups = new Map<string, HydratedTimetableAssignment[]>();

  for (const assignment of assignmentsInPeriod) {
    const session = assignment.class_session;
    if (!session?.course || !session.instructor || !session.classroom) continue;

    const resourceId = getResourceId(session);
    if (!resourceId) continue;

    const resourceRow = grid.get(resourceId);
    if (!resourceRow || resourceRow[periodIndex] !== null) continue;

    const mergeKey = `${resourceId}-${session.course.code}-${session.instructor.id}`;
    if (!resourceMergeGroups.has(mergeKey)) {
      resourceMergeGroups.set(mergeKey, []);
    }
    resourceMergeGroups.get(mergeKey)!.push(assignment);
  }

  return resourceMergeGroups;
}

/**
 * Fills the periods for a merged session in a given row.
 *
 * @param row - The timetable row to update.
 * @param sessions - The merged sessions to place.
 * @param periodIndex - The starting period index.
 * @param periodCount - The number of periods the session spans.
 * @param totalPeriods - The total number of periods in the schedule.
 */
function fillPeriodsForMergedSession(
  row: (ClassSession[] | null)[],
  sessions: ClassSession[],
  periodIndex: number,
  periodCount: number,
  totalPeriods: number
) {
  for (let i = 0; i < periodCount; i++) {
    if (periodIndex + i < totalPeriods) {
      row[periodIndex + i] = sessions;
    }
  }
}

/**
 * Places merged assignments onto the grid for a specific resource type.
 *
 * @param resourceMergeGroups - A map of merge keys to assignments.
 * @param grid - The timetable grid being built.
 * @param periodIndex - The index of the current period.
 * @param totalPeriods - The total number of periods.
 * @param getResourceId - A function to extract the resource ID for the current view.
 */
function placeResourceAssignments(
  resourceMergeGroups: Map<string, HydratedTimetableAssignment[]>,
  grid: TimetableGrid,
  periodIndex: number,
  totalPeriods: number,
  getResourceId: (session: ClassSession) => string | undefined
): void {
  for (const [, mergeableAssignments] of resourceMergeGroups.entries()) {
    if (mergeableAssignments.length === 0) continue;

    const allMergedSessions = mergeableAssignments.map((a) => a.class_session!);
    const period_count = allMergedSessions[0]?.period_count || 1;
    const resourceId = getResourceId(allMergedSessions[0]);

    if (resourceId) {
      const resourceRow = grid.get(resourceId);
      if (resourceRow) {
        fillPeriodsForMergedSession(resourceRow, allMergedSessions, periodIndex, period_count, totalPeriods);
      }
    }
  }
}

/**
 * Transforms a flat array of timetable assignments into a grid structure for a specific resource (Classroom or Instructor).
 * This generic function is used by the view-specific builder functions.
 *
 * @param assignments - The flat array of assignment data from the server.
 * @param resources - The list of all resources (classrooms or instructors) for the rows.
 * @param totalPeriods - The total number of periods in the schedule.
 * @param getResourceId - A function that extracts the relevant resource ID from a class session.
 * @returns A Map representing the populated timetable grid organized by the specified resource.
 */
function buildTimetableGridForResource(
  assignments: HydratedTimetableAssignment[],
  resources: TimetableRowResource[],
  totalPeriods: number,
  getResourceId: (session: ClassSession) => string | undefined
): TimetableGrid {
  const grid: TimetableGrid = new Map();
  initializeGridRows(grid, resources, totalPeriods);

  if (!assignments || assignments.length === 0) {
    return grid;
  }

  const assignmentsByPeriod = groupAssignmentsByPeriod(assignments);

  for (let periodIndex = 0; periodIndex < totalPeriods; periodIndex++) {
    const assignmentsInPeriod = assignmentsByPeriod.get(periodIndex) || [];
    if (assignmentsInPeriod.length === 0) continue;

    const resourceMergeGroups = groupResourceAssignments(assignmentsInPeriod, grid, periodIndex, getResourceId);
    placeResourceAssignments(resourceMergeGroups, grid, periodIndex, totalPeriods, getResourceId);
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
  return buildTimetableGridForResource(assignments, classrooms, totalPeriods, (session) => session.classroom?.id);
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
  return buildTimetableGridForResource(assignments, instructors, totalPeriods, (session) => session.instructor?.id);
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
