/**
 * Service wrapper for Schedule Class Session use case.
 * 
 * This service provides a thin abstraction over the timetabling infrastructure
 * services, focusing on the scheduling workflow for program heads.
 */

import * as timetableService from '@/lib/services/timetableService';
import type {
  AssignSessionParams,
  MoveSessionParams,
  RemoveSessionParams,
  TimetableAssignmentInsert,
} from './types';

/**
 * Assigns a class session to a specific timetable slot.
 *
 * @param params
 * @param userId
 * @param semesterId
 */
export async function assignSession(
  params: AssignSessionParams,
  userId: string,
  semesterId: string
) {
  const assignment: TimetableAssignmentInsert = {
    class_session_id: params.classSessionId,
    class_group_id: params.classGroupId,
    period_index: params.periodIndex,
    user_id: userId,
    semester_id: semesterId,
  };

  return timetableService.assignClassSessionToTimetable(assignment, params.status);
}

/**
 * Moves a class session from one timetable slot to another.
 *
 * @param params
 * @param userId
 * @param semesterId
 */
export async function moveSession(
  params: MoveSessionParams,
  userId: string,
  semesterId: string
) {
  const fromCell = {
    class_group_id: params.fromClassGroupId,
    period_index: params.fromPeriodIndex,
    semester_id: semesterId,
  };

  const toCell = {
    class_group_id: params.toClassGroupId,
    period_index: params.toPeriodIndex,
    semester_id: semesterId,
  };

  return timetableService.moveClassSession(
    fromCell,
    toCell,
    params.classSessionId,
    userId
  );
}

/**
 * Removes a class session from a timetable slot.
 *
 * @param params
 * @param semesterId
 */
export async function removeSession(
  params: RemoveSessionParams,
  semesterId: string
) {
  return timetableService.removeClassSessionFromTimetable(
    params.classGroupId,
    params.periodIndex,
    semesterId
  );
}

/**
 * Fetches all timetable assignments for a semester.
 *
 * @param semesterId
 */
export async function fetchTimetableAssignments(semesterId: string) {
  return timetableService.getTimetableAssignments(semesterId);
}
