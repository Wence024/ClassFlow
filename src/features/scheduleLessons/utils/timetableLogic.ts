import type { ClassSession } from '../types/scheduleLessons';

export type TimetableGrid = Map<string, (ClassSession | null)[]>;

/**
 * Checks for conflicts for a given session at a specific time period across all groups.
 * It ignores the cell from which the session is being moved (if provided).
 */
const checkConflicts = (
  timetable: TimetableGrid,
  sessionToCheck: ClassSession,
  targetGroupId: string,
  targetPeriodIndex: number,
  source?: { groupId: string; periodIndex: number }
): string => {
  // 1. Check the target cell itself for a group conflict
  const targetGroupSessions = timetable.get(targetGroupId);
  if (
    targetGroupSessions?.[targetPeriodIndex] &&
    // If moving, ignore the source cell (the session itself)
    (!source || targetGroupId !== source.groupId || targetPeriodIndex !== source.periodIndex)
  ) {
    return `Group conflict: A session is already scheduled in this slot for ${sessionToCheck.group.name}.`;
  }

  // 2. Check for instructor and classroom conflicts across all groups at the target time
  for (const [groupId, sessions] of timetable.entries()) {
    const existingSession = sessions[targetPeriodIndex];

    if (existingSession) {
      // If we are moving a session, we must ignore a conflict with itself at its original position.
      if (source && groupId === source.groupId && targetPeriodIndex === source.periodIndex) {
        continue;
      }

      if (existingSession.instructor.id === sessionToCheck.instructor.id) {
        return `Instructor conflict: ${existingSession.instructor.name} is already scheduled in this period for group ${existingSession.group.name}.`;
      }
      if (existingSession.classroom.id === sessionToCheck.classroom.id) {
        return `Classroom conflict: ${existingSession.classroom.name} is already in use during this period by group ${existingSession.group.name}.`;
      }
    }
  }

  return ''; // No conflicts
};

/**
 * Creates a new timetable Map with the session assigned.
 */
export const assignSessionToTimetable = (
  timetable: TimetableGrid,
  groupId: string,
  periodIndex: number,
  session: ClassSession
): { updatedTimetable: TimetableGrid; error?: string } => {
  const conflict = checkConflicts(timetable, session, groupId, periodIndex);
  if (conflict) {
    return { updatedTimetable: timetable, error: conflict };
  }

  const newTimetable = new Map(timetable);
  const groupSessions = [...(newTimetable.get(groupId) || [])];
  groupSessions[periodIndex] = session;
  newTimetable.set(groupId, groupSessions);

  return { updatedTimetable: newTimetable };
};

/**
 * Creates a new timetable Map with the session removed.
 */
export const removeSessionFromTimetable = (
  timetable: TimetableGrid,
  groupId: string,
  periodIndex: number
): TimetableGrid => {
  const newTimetable = new Map(timetable);
  const groupSessions = [...(newTimetable.get(groupId) || [])];
  groupSessions[periodIndex] = null;
  newTimetable.set(groupId, groupSessions);
  return newTimetable;
};

/**
 * Moves a session from one cell to another, checking for conflicts.
 */
export const moveSessionInTimetable = (
  timetable: TimetableGrid,
  from: { groupId: string; periodIndex: number },
  to: { groupId: string; periodIndex: number }
): { updatedTimetable: TimetableGrid; error?: string } => {
  const sessionToMove = timetable.get(from.groupId)?.[from.periodIndex];

  if (!sessionToMove) {
    return { updatedTimetable: timetable, error: 'No session to move.' };
  }

  // Check for conflicts, but ignore the source cell (the session itself)
  const conflict = checkConflicts(timetable, sessionToMove, to.groupId, to.periodIndex, from);
  if (conflict) {
    return { updatedTimetable: timetable, error: conflict };
  }

  // Perform the move in a single pass
  const newTimetable = new Map(timetable);
  // Remove from old cell
  const fromSessions = [...(newTimetable.get(from.groupId) || [])];
  fromSessions[from.periodIndex] = null;
  newTimetable.set(from.groupId, fromSessions);
  // Assign to new cell
  const toSessions = [...(newTimetable.get(to.groupId) || [])];
  toSessions[to.periodIndex] = sessionToMove;
  newTimetable.set(to.groupId, toSessions);

  return { updatedTimetable: newTimetable };
};
