/**
 * Centralized service for all timetable database operations.
 * Consolidates operations from features/timetabling/services/.
 */

import { supabase } from '../supabase';
import type {
  TimetableAssignment,
  TimetableAssignmentInsert,
  HydratedTimetableAssignment,
} from '../../types/timetable';

/**
 * Fetch all timetable assignments for a semester with full class session data.
 *
 * @param semester_id
 */
export async function getTimetableAssignments(
  semester_id: string
): Promise<HydratedTimetableAssignment[]> {
  const { data, error } = await supabase
    .from('timetable_assignments')
    .select(
      `
      *,
      class_session:class_sessions!inner (
        *,
        course:courses (*),
        group:class_groups (*),
        instructor:instructors (*),
        classroom:classrooms (*)
      )
    `
    )
    .eq('semester_id', semester_id);

  if (error) {
    console.error('Error fetching hydrated timetable assignments:', error);
    throw error;
  }

  return (data || []).map((assignment) => ({
    ...assignment,
    status: (assignment.status as 'pending' | 'confirmed' | undefined) || 'confirmed',
  })) as HydratedTimetableAssignment[];
}

/**
 * Assign a class session to a group/period (insert or upsert).
 *
 * @param assignment
 * @param status
 */
export async function assignClassSessionToTimetable(
  assignment: TimetableAssignmentInsert,
  status: 'pending' | 'confirmed' = 'confirmed'
): Promise<TimetableAssignment> {
  const assignmentWithStatus = { ...assignment, status };
  const { data, error } = await supabase
    .from('timetable_assignments')
    .upsert([assignmentWithStatus], {
      onConflict: 'user_id,class_group_id,period_index,semester_id',
    })
    .select('*')
    .single();
  if (error) throw error;
  return data as TimetableAssignment;
}

/**
 * Remove a class session from a group/period.
 *
 * @param class_group_id
 * @param period_index
 * @param semester_id
 */
export async function removeClassSessionFromTimetable(
  class_group_id: string,
  period_index: number,
  semester_id: string
): Promise<void> {
  const { error } = await supabase
    .from('timetable_assignments')
    .delete()
    .eq('class_group_id', class_group_id)
    .eq('period_index', period_index)
    .eq('semester_id', semester_id);
  if (error) throw error;
}

/**
 * Move a class session from one cell to another (upsert new, then delete old).
 *
 * @param from
 * @param from.class_group_id
 * @param from.period_index
 * @param from.semester_id
 * @param to
 * @param to.class_group_id
 * @param to.period_index
 * @param to.semester_id
 * @param class_session_id
 * @param user_id
 * @param status
 */
export async function moveClassSession(
  from: { class_group_id: string; period_index: number; semester_id: string },
  to: { class_group_id: string; period_index: number; semester_id: string },
  class_session_id: string,
  user_id: string,
  status: 'pending' | 'confirmed' = 'confirmed'
): Promise<void> {
  // Upsert new assignment first
  await assignClassSessionToTimetable(
    {
      user_id,
      class_group_id: to.class_group_id,
      period_index: to.period_index,
      class_session_id,
      semester_id: to.semester_id,
    },
    status
  );

  // Delete old assignment
  await removeClassSessionFromTimetable(from.class_group_id, from.period_index, from.semester_id);
}

/**
 * Handle cross-department session move using database function.
 *
 * @param class_session_id
 * @param old_period_index
 * @param old_class_group_id
 * @param new_period_index
 * @param new_class_group_id
 * @param semester_id
 */
export async function handleCrossDeptSessionMove(
  class_session_id: string,
  old_period_index: number,
  old_class_group_id: string,
  new_period_index: number,
  new_class_group_id: string,
  semester_id: string
): Promise<{ success: boolean; requires_approval: boolean; request_id?: string }> {
  const { data, error } = await supabase.rpc(
    'handle_cross_dept_session_move' as never,
    {
      _class_session_id: class_session_id,
      _old_period_index: old_period_index,
      _old_class_group_id: old_class_group_id,
      _new_period_index: new_period_index,
      _new_class_group_id: new_class_group_id,
      _semester_id: semester_id,
    } as never
  );

  if (error) {
    console.error('handle_cross_dept_session_move failed:', error);
    throw error;
  }

  return data as { success: boolean; requires_approval: boolean; request_id?: string };
}

/**
 * Delete a timetable assignment by class session ID.
 *
 * @param class_session_id
 * @param semester_id
 */
export async function deleteAssignmentBySession(
  class_session_id: string,
  semester_id: string
): Promise<void> {
  const { error } = await supabase
    .from('timetable_assignments')
    .delete()
    .eq('class_session_id', class_session_id)
    .eq('semester_id', semester_id);
  if (error) throw error;
}

/**
 * Update assignment status (pending/confirmed).
 *
 * @param class_session_id
 * @param semester_id
 * @param status
 */
export async function updateAssignmentStatus(
  class_session_id: string,
  semester_id: string,
  status: 'pending' | 'confirmed'
): Promise<void> {
  const { error } = await supabase
    .from('timetable_assignments')
    .update({ status })
    .eq('class_session_id', class_session_id)
    .eq('semester_id', semester_id);
  if (error) throw error;
}

/**
 * Get timetable assignments by class session ID.
 *
 * @param class_session_id
 * @param semester_id
 */
export async function getAssignmentsBySession(
  class_session_id: string,
  semester_id: string
): Promise<TimetableAssignment[]> {
  const { data, error } = await supabase
    .from('timetable_assignments')
    .select('*')
    .eq('class_session_id', class_session_id)
    .eq('semester_id', semester_id);
  if (error) throw error;
  return data || [];
}
