/**
 * Service layer for schedule class session functionality.
 */

import {
  getTimetableAssignments as infraGetTimetableAssignments,
  assignClassSessionToTimetable as infraAssignClassSessionToTimetable,
  moveClassSession as infraMoveClassSession,
  removeClassSessionFromTimetable as infraRemoveClassSessionFromTimetable,
} from '@/lib/services/timetableService';
import type {
  TimetableAssignment,
  TimetableStatus,
} from './types';

interface AssignSessionParams {
  class_session_id: string;
  class_group_id: string;
  period_index: number;
  user_id: string;
  semester_id: string;
}

interface MoveSessionParams {
  fromClassGroupId: string;
  fromPeriodIndex: number;
  toClassGroupId: string;
  toPeriodIndex: number;
  classSessionId: string;
  userId: string;
}

interface RemoveSessionParams {
  classGroupId: string;
  periodIndex: number;
  semesterId: string;
}

/**
 * Fetches timetable assignments for a semester.
 *
 * @param semesterId - The ID of the semester to fetch assignments for.
 * @returns A promise that resolves to an array of timetable assignments.
 */
export async function getTimetableAssignments(semesterId: string): Promise<TimetableAssignment[]> {
  return infraGetTimetableAssignments(semesterId);
}

/**
 * Assigns a class session to the timetable.
 *
 * @param params - The parameters for assigning the session.
 * @param params.class_session_id - The ID of the class session to assign.
 * @param params.class_group_id - The ID of the class group to assign to.
 * @param params.period_index - The period index to assign to.
 * @param params.user_id - The ID of the user performing the assignment.
 * @param params.semester_id - The ID of the semester.
 * @param status - The status of the assignment.
 */
export async function assignSession(
  params: AssignSessionParams,
  status?: TimetableStatus
): Promise<void> {
  return infraAssignClassSessionToTimetable(params, status);
}

/**
 * Moves a class session within the timetable.
 *
 * @param params - The parameters for moving the session.
 * @param params.fromClassGroupId - The class group ID to move from.
 * @param params.fromPeriodIndex - The period index to move from.
 * @param params.toClassGroupId - The class group ID to move to.
 * @param params.toPeriodIndex - The period index to move to.
 * @param params.classSessionId - The ID of the class session to move.
 * @param params.userId - The ID of the user performing the move.
 */
export async function moveSession(params: MoveSessionParams): Promise<void> {
  // Note: This implementation has an issue where semester_id is incorrectly derived from period index
  // This needs backend infrastructure changes to properly retrieve the semester ID
  const fromCell = {
    class_group_id: params.fromClassGroupId,
    period_index: params.fromPeriodIndex,
    semester_id: '', // This should be properly retrieved from the class session's semester
  };

  const toCell = {
    class_group_id: params.toClassGroupId,
    period_index: params.toPeriodIndex,
    semester_id: '', // This should be properly retrieved from the class session's semester
  };

  return infraMoveClassSession(fromCell, toCell, params.classSessionId, params.userId);
}

/**
 * Removes a class session from the timetable.
 *
 * @param params - The parameters for removing the session.
 * @param params.classGroupId - The class group ID to remove from.
 * @param params.periodIndex - The period index to remove from.
 * @param params.semesterId - The ID of the semester.
 */
export async function removeSession(params: RemoveSessionParams): Promise<void> {
  return infraRemoveClassSessionFromTimetable(params.classGroupId, params.periodIndex, params.semesterId);
}