/**
 * @file This module contains the core logic for transforming timetable data into a UI-friendly structure.
 */

import type { ClassGroup } from '../../classSessionComponents/types';
import type { ClassSession } from '../../classSessions/types/classSession';
import type { HydratedTimetableAssignment } from '../types/timetable';

/**
 * A type representing the timetable's data structure.
 * It's a Map where keys are class group IDs and values are arrays representing periods.
 * Each cell can contain an array of sessions (for merged classes) or null.
 */
export type TimetableGrid = Map<string, (ClassSession[] | null)[]>;

/**
 * Initializes the timetable grid with empty rows for each class group.
 *
 * @param grid - The timetable grid Map to populate with empty rows.
 * @param classGroups - The array of class groups that will form the rows of the timetable.
 * @param totalPeriods - The total number of periods in the schedule (days * periods_per_day).
 */
function initializeGridRows(
  grid: TimetableGrid,
  classGroups: ClassGroup[],
  totalPeriods: number
): void {
  if (classGroups.length === 0) {
    return;
  }

  for (const group of classGroups) {
    grid.set(group.id, Array(totalPeriods).fill(null));
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

    const mergeKey = `${course.id}-${instructor.id}-${classroom.id}`;
    if (!mergeGroups.has(mergeKey)) {
      mergeGroups.set(mergeKey, []);
    }
    mergeGroups.get(mergeKey)!.push(assignment);
  }
  
  return mergeGroups;
}

/**
 * Updates a single group row with merged session data.
 *
 * @param groupRow - The row for a specific group.
 * @param mergedSessionArray - The array of merged sessions.
 * @param periodIndex - The index of the period.
 * @param periodCount - The number of periods this session spans.
 * @param totalPeriods - The total number of periods.
 */
function updateGroupRowWithMergedSessions(
  groupRow: (ClassSession[] | null)[],
  mergedSessionArray: ClassSession[],
  periodIndex: number,
  periodCount: number,
  totalPeriods: number
): void {
  for (let i = 0; i < periodCount; i++) {
    if (periodIndex + i < totalPeriods) {
      groupRow[periodIndex + i] = mergedSessionArray;
    }
  }
}

/**
 * Places a merge group onto the grid.
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

  const mergedSessionArray = mergeableAssignments.map((a) => a.class_session!);
  const period_count = mergedSessionArray[0]?.period_count || 1;

  console.log('[timetableLogic] Placing merge group:', {
    periodIndex,
    mergeCount: mergeableAssignments.length,
    sessionIds: mergedSessionArray.map(s => s.id),
    groupIds: mergeableAssignments.map(a => a.class_group_id),
    instructorColors: mergedSessionArray.map(s => s.instructor?.color)
  });

  for (const assignmentToPlace of mergeableAssignments) {
    const groupRowToUpdate = grid.get(assignmentToPlace.class_group_id);
    if (groupRowToUpdate) {
      updateGroupRowWithMergedSessions(
        groupRowToUpdate,
        mergedSessionArray,
        periodIndex,
        period_count,
        totalPeriods
      );
    }
  }
}

/**
 * Transforms a flat array of timetable assignments into a grid structure that supports merged sessions.
 *
 * This function processes assignments by:
 * 1. Grouping all assignments by their period index for efficient lookup.
 * 2. Iterating through each assignment and identifying "mergeable" sessions (same course, instructor, classroom at the same time).
 * 3. Creating a single array instance for each merged block (or a single-session array for non-merged ones).
 * 4. Placing the exact same array instance into the grid cells for all participating groups and across all spanned periods.
 * This ensures that a merged session is treated as a single, cohesive block in the UI.
 *
 * @param assignments - The flat array of assignment data from the server.
 * @param classGroups - The list of all class groups, used to initialize the grid rows.
 * @param totalPeriods - The total number of periods in the schedule (days * periods_per_day).
 * @returns A Map representing the populated timetable grid with merged sessions.
 */
export function buildTimetableGrid(
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

    console.log('[timetableLogic] Period', periodIndex, 'merge groups:', mergeGroups.size);

    for (const [mergeKey, mergeableAssignments] of mergeGroups.entries()) {
      console.log('[timetableLogic] Processing merge group:', {
        mergeKey,
        assignmentCount: mergeableAssignments.length
      });
      placeMergeGroupOnGrid(mergeableAssignments, grid, periodIndex, totalPeriods);
    }
  }

  return grid;
}