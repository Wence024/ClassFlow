import type { ClassSession } from '../types';

export type TimetableGrid = Map<string, (ClassSession | null)[]>;

/**
 * Pure business rule: Checks for conflicts for a given session at a specific time period across all groups.
 * Ignores the cell from which the session is being moved (if provided).
 *
 * This function is designed to be reused in a custom backend or API later.
 */
export default function checkConflicts(
  timetable: TimetableGrid,
  sessionToCheck: ClassSession,
  targetGroupId: string,
  targetPeriodIndex: number,
  source?: { groupId: string; periodIndex: number }
): string {
  // 1. Check the target cell itself for a group conflict
  const targetGroupSessions = timetable.get(targetGroupId);
  if (
    targetGroupSessions?.[targetPeriodIndex] &&
    (!source || targetGroupId !== source.groupId || targetPeriodIndex !== source.periodIndex)
  ) {
    return `Group conflict: A session is already scheduled in this slot for ${sessionToCheck.group.name}.`;
  }

  // 2. Check for instructor and classroom conflicts across all groups at the target time
  for (const [groupId, sessions] of timetable.entries()) {
    const existingSession = sessions[targetPeriodIndex];

    if (existingSession) {
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

  return '';
}
