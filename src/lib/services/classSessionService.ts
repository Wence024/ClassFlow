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
 * Maps raw database row to ClassSession type, handling nullable resources.
 *
 * @param row - Raw database row
 */
function mapToClassSession(row: any): ClassSession {
  return {
    id: row.id,
    course: row.course,
    group: row.group,
    instructor: row.instructor || null,
    classroom: row.classroom || null,
    period_count: row.period_count,
    program_id: row.program_id,
  };
}

/**
 * Retrieves all class sessions from the database.
 * Handles nullable instructor and classroom for incomplete sessions.
 */
export async function getAllClassSessions(): Promise<ClassSession[]> {
  const { data, error } = await supabase.from('class_sessions').select(SELECT_COLUMNS);
  if (error) throw error;
  return (data || []).map(mapToClassSession);
}

/**
 * Retrieves class sessions for a specific user.
 *
 * @param user_id
 */
export async function getClassSessions(user_id: string): Promise<ClassSession[]> {
  const { data, error } = await supabase.from(TABLE).select(SELECT_COLUMNS).eq('user_id', user_id);
  if (error) throw error;
  return (data || []).map(mapToClassSession);
}

/**
 * Fetches a single, fully-hydrated class session by its ID.
 *
 * @param id
 */
export async function getClassSession(id: string): Promise<ClassSession> {
  const { data, error } = await supabase.from(TABLE).select(SELECT_COLUMNS).eq('id', id).single();
  if (error) throw error;
  return mapToClassSession(data);
}

/**
 * Adds a new class session to the database.
 * Supports both complete and incomplete sessions.
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
  return mapToClassSession(data);
}

/**
 * Updates an existing class session in the database.
 * Can be used to assign resources to incomplete sessions.
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
  return mapToClassSession(data);
}

/**
 * Removes a class session from the database by its ID.
 * Cancels all active resource requests for this session before deletion.
 *
 * @param id
 * @param user_id
 */
export async function removeClassSession(id: string, user_id: string): Promise<void> {
  // Cancel any active requests for this session before deletion
  const { cancelActiveRequestsForClassSession } = await import('./resourceRequestService');
  try {
    await cancelActiveRequestsForClassSession(id);
  } catch (err) {
    console.error('Failed to cancel requests for session:', err);
  }

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
  return (data || []).map(mapToClassSession);
}

/**
 * Creates an incomplete class session (no resources assigned).
 * Resources will be assigned later via timetable drag-and-drop.
 *
 * @param data - Session data without instructor_id and classroom_id
 */
export async function createIncompleteClassSession(
  data: Omit<ClassSessionInsert, 'instructor_id' | 'classroom_id'>
): Promise<ClassSession> {
  const { data: newSession, error } = await supabase
    .from(TABLE)
    .insert({
      ...data,
      instructor_id: null,
      classroom_id: null,
    })
    .select(SELECT_COLUMNS)
    .single();

  if (error) throw error;
  return mapToClassSession(newSession);
}

/**
 * Assigns resources to an incomplete or partially complete session.
 *
 * @param sessionId - The session ID to update
 * @param instructorId - Instructor ID to assign (or null)
 * @param classroomId - Classroom ID to assign (or null)
 */
export async function assignResourcesToSession(
  sessionId: string,
  instructorId: string | null,
  classroomId: string | null
): Promise<ClassSession> {
  const { data, error } = await supabase
    .from(TABLE)
    .update({
      instructor_id: instructorId,
      classroom_id: classroomId,
    })
    .eq('id', sessionId)
    .select(SELECT_COLUMNS)
    .single();

  if (error) throw error;
  return mapToClassSession(data);
}

/**
 * Fetches incomplete sessions for a program (missing instructor or classroom).
 *
 * @param program_id - The program ID to query
 */
export async function getIncompleteSessionsForProgram(
  program_id: string
): Promise<ClassSession[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select(SELECT_COLUMNS)
    .eq('program_id', program_id)
    .or('instructor_id.is.null,classroom_id.is.null');

  if (error) throw error;
  return (data || []).map(mapToClassSession);
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

/**
 * Checks if a session can be placed in a specific view mode.
 * Incomplete sessions have restrictions based on missing resources.
 *
 * @param session - The session to check
 * @param viewMode - The timetable view mode
 */
export function canPlaceInView(
  session: ClassSession,
  viewMode: 'class-group' | 'instructor' | 'classroom'
): boolean {
  // Class-group view accepts all sessions
  if (viewMode === 'class-group') return true;
  
  // Instructor view requires instructor to be assigned
  if (viewMode === 'instructor' && !session.instructor) return false;
  
  // Classroom view requires classroom to be assigned
  if (viewMode === 'classroom' && !session.classroom) return false;
  
  return true;
}

/**
 * Checks if an instructor belongs to a different department than the program.
 *
 * @param programId
 * @param instructorId
 */
export async function isCrossDepartmentInstructor(
  programId: string,
  instructorId: string
): Promise<boolean> {
  const { data, error } = await supabase.rpc(
    'is_cross_department_resource' as never,
    {
      _program_id: programId,
      _instructor_id: instructorId,
      _classroom_id: null,
    } as never
  );
  if (error) throw error;
  return data as boolean;
}

/**
 * Checks if a classroom belongs to a different department than the program.
 *
 * @param programId
 * @param classroomId
 */
export async function isCrossDepartmentClassroom(
  programId: string,
  classroomId: string
): Promise<boolean> {
  const { data, error } = await supabase.rpc(
    'is_cross_department_resource' as never,
    {
      _program_id: programId,
      _instructor_id: null,
      _classroom_id: classroomId,
    } as never
  );
  if (error) throw error;
  return data as boolean;
}

/**
 * Gets the department ID for an instructor or classroom.
 *
 * @param instructorId
 * @param classroomId
 */
export async function getResourceDepartmentId(
  instructorId?: string,
  classroomId?: string
): Promise<string | null> {
  if (instructorId) {
    const { data, error } = await supabase
      .from('instructors')
      .select('department_id')
      .eq('id', instructorId)
      .single();
    if (error) throw error;
    return data?.department_id || null;
  }
  if (classroomId) {
    const { data, error } = await supabase
      .from('classrooms')
      .select('preferred_department_id')
      .eq('id', classroomId)
      .single();
    if (error) throw error;
    return data?.preferred_department_id || null;
  }
  return null;
}
