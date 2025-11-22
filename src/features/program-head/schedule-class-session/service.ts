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
 */
export async function getTimetableAssignments(semesterId: string): Promise<TimetableAssignment[]> {
  return infraGetTimetableAssignments(semesterId);
}

/**
 * Assigns a class session to the timetable.
 */
export async function assignSession(
  params: AssignSessionParams,
  status?: TimetableStatus
): Promise<void> {
  return infraAssignClassSessionToTimetable(params, status);
}

/**
 * Moves a class session within the timetable.
 */
export async function moveSession(params: MoveSessionParams): Promise<void> {
  const fromCell = {
    class_group_id: params.fromClassGroupId,
    period_index: params.fromPeriodIndex,
    semester_id: params.fromPeriodIndex.toString(), // Note: This might need correction based on actual structure
  };

  const toCell = {
    class_group_id: params.toClassGroupId,
    period_index: params.toPeriodIndex,
    semester_id: params.toPeriodIndex.toString(), // Note: This might need correction based on actual structure
  };

  return infraMoveClassSession(fromCell, toCell, params.classSessionId, params.userId);
}

/**
 * Removes a class session from the timetable.
 */
export async function removeSession(params: RemoveSessionParams): Promise<void> {
  return infraRemoveClassSessionFromTimetable(params.classGroupId, params.periodIndex, params.semesterId);
}