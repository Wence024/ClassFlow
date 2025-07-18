import type { ClassSession } from '../types/scheduleLessons';

export type TimetableGrid = (ClassSession | null)[][];

/**
 * Checks for conflicts for a given session at a specific time period.
 * Returns a detailed message if a conflict is found, otherwise an empty string.
 */
export const checkConflicts = (
  timetable: TimetableGrid,
  sessionToCheck: ClassSession,
  targetPeriodIndex: number
): string => {
  for (const group of timetable) {
    const existingSession = group[targetPeriodIndex];
    if (existingSession) {
      if (existingSession.instructor.id === sessionToCheck.instructor.id) {
        return `Instructor conflict: ${existingSession.instructor.name} is already scheduled at this time.`;
      }
      if (existingSession.group.id === sessionToCheck.group.id) {
        return `Group conflict: ${existingSession.group.name} is already scheduled at this time.`;
      }
      if (existingSession.classroom.id === sessionToCheck.classroom.id) {
        return `Classroom conflict: ${existingSession.classroom.name} is already in use at this time.`;
      }
    }
  }
  return '';
};

/**
 * Creates a new timetable with the session assigned to the specified cell.
 * Returns an object with the updated timetable or an error message.
 */
export const assignSessionToTimetable = (
  timetable: TimetableGrid,
  groupIndex: number,
  periodIndex: number,
  session: ClassSession
): { updatedTimetable: TimetableGrid; error?: string } => {
  if (timetable[groupIndex][periodIndex]) {
    return { updatedTimetable: timetable, error: 'This slot is already occupied.' };
  }

  const conflict = checkConflicts(timetable, session, periodIndex);
  if (conflict) {
    return { updatedTimetable: timetable, error: conflict };
  }

  const updatedTimetable = timetable.map((row) => [...row]);
  updatedTimetable[groupIndex][periodIndex] = session;
  return { updatedTimetable };
};

/**
 * Creates a new timetable with the session removed from the specified cell.
 */
export const removeSessionFromTimetable = (
  timetable: TimetableGrid,
  groupIndex: number,
  periodIndex: number
): TimetableGrid => {
  const updatedTimetable = timetable.map((row) => [...row]);
  updatedTimetable[groupIndex][periodIndex] = null;
  return updatedTimetable;
};

/**
 * Creates a new timetable with the session moved from one cell to another.
 * Returns an object with the updated timetable or an error message.
 */
export const moveSessionInTimetable = (
  timetable: TimetableGrid,
  from: { groupIndex: number; periodIndex: number },
  to: { groupIndex: number; periodIndex: number }
): { updatedTimetable: TimetableGrid; error?: string } => {
  const sessionToMove = timetable[from.groupIndex][from.periodIndex];
  if (!sessionToMove) {
    return { updatedTimetable: timetable, error: 'No session to move.' };
  }

  if (timetable[to.groupIndex][to.periodIndex]) {
    return { updatedTimetable: timetable, error: 'This slot is already occupied.' };
  }

  // Create a temporary grid with the session removed from its original spot
  // to check for conflicts at the new spot.
  const tempTimetable = removeSessionFromTimetable(timetable, from.groupIndex, from.periodIndex);

  const conflict = checkConflicts(tempTimetable, sessionToMove, to.periodIndex);
  if (conflict) {
    return { updatedTimetable: timetable, error: conflict };
  }

  // If no conflicts, perform the move on the temporary grid
  const { updatedTimetable } = assignSessionToTimetable(
    tempTimetable,
    to.groupIndex,
    to.periodIndex,
    sessionToMove
  );

  return { updatedTimetable };
};