import type { ClassSession } from "../../classes/classSession";

export type TimetableGrid = Map<string, (ClassSession | null)[]>;

/**
 * Pure business rule: Checks for conflicts for a given session at a specific time period across all groups.
 * Ignores the cell from which the session is being moved (if provided).
 *
 * This function is designed to be reused in a custom backend or API later.
 */
export default function checkConflicts(
  timetable: TimetableGrid,
  classSessionToCheck: ClassSession,
  targetGroupId: string,
  targetPeriodIndex: number,
  source?: { class_group_id: string; period_index: number }
): string {
  // 1. Check the target cell itself for a group conflict
  const targetGroupSessions = timetable.get(targetGroupId);
  if (
    targetGroupSessions?.[targetPeriodIndex] &&
    (!source ||
      targetGroupId !== source.class_group_id ||
      targetPeriodIndex !== source.period_index)
  ) {
    return `Group conflict: A class is already scheduled in this slot for ${classSessionToCheck.group.name}.`;
  }

  // 2. Check for instructor and classroom conflicts across all groups at the target time
  for (const [groupId, classSessions] of timetable.entries()) {
    const existingClassSession = classSessions[targetPeriodIndex];

    if (existingClassSession) {
      if (
        source &&
        groupId === source.class_group_id &&
        targetPeriodIndex === source.period_index
      ) {
        continue;
      }

      if (existingClassSession.instructor.id === classSessionToCheck.instructor.id) {
        return `Instructor conflict: ${existingClassSession.instructor.name} is already scheduled in this period for group ${existingClassSession.group.name}.`;
      }
      if (existingClassSession.classroom.id === classSessionToCheck.classroom.id) {
        return `Classroom conflict: ${existingClassSession.classroom.name} is already in use during this period by group ${existingClassSession.group.name}.`;
      }
    }
  }

  return '';
}
