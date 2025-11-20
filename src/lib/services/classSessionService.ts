/**
 * Centralized service for all class session database operations.
 * Consolidates operations from features/classSessions/services/.
 */

import { supabase } from '../supabase';
import type { ClassSession, ClassSessionInsert, ClassSessionUpdate } from '../../types/classSession';

const TABLE = 'class_sessions';

const SELECT_COLUMNS = `
  *,
  course:courses(*),
  group:class_groups(*),
  instructor:instructors(*),
  classroom:classrooms(*)
`;

/**
 * Retrieves all class sessions from the database.
 */
export async function getAllClassSessions(): Promise<ClassSession[]> {
  const { data, error } = await supabase.from('class_sessions').select(SELECT_COLUMNS);
  if (error) throw error;
  return (data as unknown as ClassSession[]) || [];
}

/**
 * Retrieves class sessions for a specific user.
 *
 * @param user_id
 */
export async function getClassSessions(user_id: string): Promise<ClassSession[]> {
  const { data, error } = await supabase.from(TABLE).select(SELECT_COLUMNS).eq('user_id', user_id);
  if (error) throw error;
  return (data as unknown as ClassSession[]) || [];
}

/**
 * Fetches a single, fully-hydrated class session by its ID.
 *
 * @param id
 */
export async function getClassSession(id: string): Promise<ClassSession> {
  const { data, error } = await supabase.from(TABLE).select(SELECT_COLUMNS).eq('id', id).single();
  if (error) throw error;
  return data as unknown as ClassSession;
}

/**
 * Adds a new class session to the database.
 *
 * @param classSession
 */
export async function addClassSession(classSession: ClassSessionInsert): Promise<ClassSession> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([classSession])
    .select(SELECT_COLUMNS)
    .single();
  if (error) throw error;
  return data as unknown as ClassSession;
}

/**
 * Updates an existing class session in the database.
 *
 * @param id
 * @param classSession
 */
export async function updateClassSession(
  id: string,
  classSession: ClassSessionUpdate
): Promise<ClassSession> {
  const { data, error } = await supabase
    .from(TABLE)
    .update(classSession)
    .eq('id', id)
    .select(SELECT_COLUMNS)
    .single();
  if (error) throw error;
  return data as unknown as ClassSession;
}

/**
 * Removes a class session from the database by its ID.
 *
 * @param id
 * @param user_id
 */
export async function removeClassSession(id: string, user_id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id).eq('user_id', user_id);
  if (error) throw error;
}

/**
 * Retrieves class sessions for a specific program.
 *
 * @param program_id
 */
export async function getClassSessionsByProgram(program_id: string): Promise<ClassSession[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select(SELECT_COLUMNS)
    .eq('program_id', program_id);
  if (error) throw error;
  return (data as unknown as ClassSession[]) || [];
}

/**
 * Checks if a class session exists in the timetable drawer (no timetable assignment).
 *
 * @param sessionId
 * @param semester_id
 */
export async function isSessionInDrawer(
  sessionId: string,
  semester_id: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('timetable_assignments')
    .select('id')
    .eq('class_session_id', sessionId)
    .eq('semester_id', semester_id);
  if (error) throw error;
  return !data || data.length === 0;
}

/**
 * Fetches unassigned class sessions (in drawer) for a specific program.
 *
 * @param program_id
 * @param semester_id
 */
export async function getUnassignedSessions(
  program_id: string,
  semester_id: string
): Promise<ClassSession[]> {
  // Get all sessions for the program
  const allSessions = await getClassSessionsByProgram(program_id);

  // Get assigned session IDs
  const { data: assignments, error } = await supabase
    .from('timetable_assignments')
    .select('class_session_id')
    .eq('semester_id', semester_id);

  if (error) throw error;

  const assignedIds = new Set((assignments || []).map((a) => a.class_session_id));
  return allSessions.filter((session) => !assignedIds.has(session.id));
}
