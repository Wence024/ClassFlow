/**
 * Service layer for scheduling class sessions.
 */

import {
  getTimetableAssignments as infraGetTimetableAssignments,
  assignClassSessionToTimetable as infraAssignClassSessionToTimetable,
  moveClassSession as infraMoveClassSession,
  removeClassSessionFromTimetable as infraRemoveClassSessionFromTimetable,
} from '@/lib/services/timetableService';
import type {
  AssignSessionParams,
  MoveSessionParams,
  RemoveSessionParams,
  TimetableAssignment,
  TimetableStatus,
} from './types';
import type { ClassSession } from '@/types/classSession';

/**
 * Fetches timetable assignments.
 */
export async function fetchTimetableAssignments(semesterId: string): Promise<TimetableAssignment[]> {
  return infraGetTimetableAssignments(semesterId);
}

/**
 * Assigns a class session to the timetable.
 */
export async function assignSession(
  params: {
    class_session_id: string;
    class_group_id: string;
    period_index: number;
    user_id: string;
    semester_id: string;
  },
  userId: string,
  semesterId: string
): Promise<void> {
  // Map the parameters to the infrastructure function
  return infraAssignClassSessionToTimetable({...params, user_id: userId, semester_id: semesterId}, undefined);
}

/**
 * Moves a class session within the timetable.
 */
export async function moveSession(
  fromCell: {
    class_group_id: string;
    period_index: number;
    semester_id: string;
  },
  toCell: {
    class_group_id: string;
    period_index: number;
    semester_id: string;
  },
  userId: string,
  semesterId: string
): Promise<void> {
  return infraMoveClassSession(fromCell, toCell, '', userId); // We might need to get class session ID from params
}

/**
 * Removes a class session from the timetable.
 */
export async function removeSession(
  params: {
    class_group_id: string;
    period_index: number;
    semester_id: string;
  },
  semesterId: string
): Promise<void> {
  return infraRemoveClassSessionFromTimetable(params.class_group_id, params.period_index, semesterId);
}