/**
 * @file This module contains the core logic for transforming timetable data into a UI-friendly structure.
 */

import type { ClassGroup } from '../../classSessionComponents/types';
import type { ClassSession } from '../../classSessions/types/classSession';
import type { HydratedTimetableAssignment } from '../types/timetable';

/**
 * A type representing the timetable's data structure.
 * It's a Map where keys are class group IDs and values are arrays representing periods.
 */
export type TimetableGrid = Map<string, (ClassSession | null)[]>;

/**
 * Note: Function complexity is intentionally higher due to the nature of timetable grid construction.
 * Consider refactoring if performance becomes an issue in production.
 */

/**
 * Transforms a flat array of timetable assignments from the database into a grid-like
 * Map structure that is optimized for rendering the timetable UI.
 *
 * The grid is structured as `Map<class_group_id, Array<period>>`, making it easy
 * to look up the session for a specific group and time slot.
 *
 * @param assignments - The flat array of assignment data from the server.
 * @param classGroups - The list of all class groups, used to initialize the grid rows.
 * @param totalPeriods - The total number of periods in the schedule (days * periods_per_day).
 * @returns A Map representing the populated timetable grid.
 */
export function buildTimetableGrid(
  assignments: HydratedTimetableAssignment[],
  classGroups: ClassGroup[],
  totalPeriods: number
): TimetableGrid {
  const grid: TimetableGrid = new Map();

  // Initialize the grid with empty rows for all groups
  initializeGridRows(grid, classGroups, totalPeriods);

  // Populate the grid with assignments
  if (assignments.length > 0) {
    populateGridWithAssignments(grid, assignments, totalPeriods);
  }

  return grid;
}

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
 * Populates the timetable grid with class session assignments.
 *
 * @param grid - The initialized timetable grid to populate with session data.
 * @param assignments - The array of hydrated timetable assignments containing session placement data.
 * @param totalPeriods - The total number of periods in the schedule for boundary checking.
 */
function populateGridWithAssignments(
  grid: TimetableGrid,
  assignments: HydratedTimetableAssignment[],
  totalPeriods: number
): void {
  for (const assignment of assignments) {
    const row = grid.get(assignment.class_group_id);
    const classSession = assignment.class_session;

    if (row && classSession) {
      placeSessionInGrid(row, assignment, classSession, totalPeriods);
    }
  }
}

/**
 * Places a class session across multiple periods in the grid row.
 *
 * @param row - The group's row in the timetable grid (array of ClassSession | null).
 * @param assignment - The timetable assignment containing the starting period index.
 * @param classSession - The class session to place in the grid.
 * @param totalPeriods - The total number of periods to prevent array overflow.
 */
function placeSessionInGrid(
  row: (ClassSession | null)[],
  assignment: HydratedTimetableAssignment,
  classSession: ClassSession,
  totalPeriods: number
): void {
  const numberOfPeriods = classSession.period_count || 1;
  
  for (let i = 0; i < numberOfPeriods; i++) {
    const periodToFill = assignment.period_index + i;
    
    // Boundary check to ensure we don't write outside the array bounds
    if (periodToFill < totalPeriods) {
      row[periodToFill] = classSession;
    }
  }
}
