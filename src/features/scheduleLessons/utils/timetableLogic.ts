import type { ClassSession, HydratedTimetableAssignment, ClassGroup } from '../types';

export type TimetableGrid = Map<string, (ClassSession | null)[]>;

const NUMBER_OF_PERIODS = 16;

/**
 * Pure business rule: Transforms a flat array of timetable assignments and a list of class groups
 * into a grid-like Map structure suitable for rendering the timetable UI.
 *
 * @param assignments The flat array of hydrated assignment data from the server.
 * @param classGroups The list of all class groups to create rows for.
 * @returns A Map where keys are group IDs and values are arrays of ClassSessions or null.
 */
export function buildTimetableGrid(
  assignments: HydratedTimetableAssignment[],
  classGroups: ClassGroup[]
): TimetableGrid {
  const grid: TimetableGrid = new Map();

  // 1. Initialize the grid with empty rows for every class group.
  if (!classGroups.length) {
    return grid;
  }
  for (const group of classGroups) {
    grid.set(group.id, Array(NUMBER_OF_PERIODS).fill(null));
  }

  // 2. Populate the grid with the assignments.
  if (!assignments.length) {
    return grid;
  }
  for (const assignment of assignments) {
    const row = grid.get(assignment.class_group_id);
    // The full session object is directly on the assignment.
    const session = assignment.class_session || null;
    if (row && session) {
      row[assignment.period_index] = session;
    }
  }

  return grid;
}
