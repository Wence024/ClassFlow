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

  // Create a map for quick lookup of assignments by period index
  const assignmentsByPeriod = new Map<number, HydratedTimetableAssignment[]>();
  for (const assignment of assignments) {
    if (!assignmentsByPeriod.has(assignment.period_index)) {
      assignmentsByPeriod.set(assignment.period_index, []);
    }
    assignmentsByPeriod.get(assignment.period_index)!.push(assignment);
  }

  // Process each assignment to build the grid
  for (const assignment of assignments) {
    const { class_group_id, period_index, class_session } = assignment;
    const row = grid.get(class_group_id);

    // If there's no session, or no row, or the cell is already filled, skip.
    if (!class_session || !row || row[period_index] !== null) {
      continue;
    }

    // Find all mergeable sessions at this exact period index
    const assignmentsInPeriod = assignmentsByPeriod.get(period_index) || [];
    const mergeableAssignments = assignmentsInPeriod.filter(
      (otherAssignment) =>
        otherAssignment.class_session &&
        otherAssignment.class_session.course.id === class_session.course.id &&
        otherAssignment.class_session.instructor.id === class_session.instructor.id &&
        otherAssignment.class_session.classroom.id === class_session.classroom.id
    );

    // This is the array that will be shared across all merged cells
    const mergedSessionArray = mergeableAssignments.map((a) => a.class_session!);

    // Get period count from the first session (they should all be the same)
    const period_count = class_session.period_count || 1;

    // Place the shared array into the grid for all participating groups and all spanned periods
    for (const mergedAssignment of mergeableAssignments) {
      const groupRowToUpdate = grid.get(mergedAssignment.class_group_id);
      if (groupRowToUpdate) {
        for (let i = 0; i < period_count; i++) {
          const periodToFill = period_index + i;
          if (periodToFill < totalPeriods) {
            groupRowToUpdate[periodToFill] = mergedSessionArray;
          }
        }
      }
    }
  }

  return grid;
}