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

// TODO: Simplify buildTimetableGrid to alleviate cognitive complexity 16.

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

  // 1. Initialize the grid with an empty row for every class group.
  //    Each row is an array of the specified total number of periods, filled with `null`.
  if (!classGroups.length) {
    return grid;
  }
  for (const group of classGroups) {
    grid.set(group.id, Array(totalPeriods).fill(null));
  }

  // 2. Populate the grid by placing each class session from the assignments
  //    into its correct `[class_group_id, period_index]` coordinate.
  if (!assignments.length) {
    return grid;
  }
  for (const assignment of assignments) {
    const row = grid.get(assignment.class_group_id);
    const classSession = assignment.class_session || null;

    if (row && classSession) {
      // Instead of just placing the session at its start, fill all the slots
      // that it occupies based on its duration (period_count).
      const numberOfPeriods = classSession.period_count || 1;
      for (let i = 0; i < numberOfPeriods; i++) {
        const periodToFill = assignment.period_index + i;
        // Boundary check to ensure we don't write outside the array
        if (periodToFill < totalPeriods) {
          row[periodToFill] = classSession;
        }
      }
    }
  }

  return grid;
}
