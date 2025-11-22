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
 * @param semester_id - The ID of the semester to fetch assignments for.
 * @returns A promise that resolves to an array of hydrated timetable assignments.
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
 * @param assignment - The assignment data to insert or upsert.
 * @param status - The status of the assignment (pending or confirmed).
 * @returns A promise that resolves to the assigned timetable assignment.
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
 * @param class_group_id - The ID of the class group.
 * @param period_index - The index of the period.
 * @param semester_id - The ID of the semester.
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
 * @param from - The source location of the class session.
 * @param from.class_group_id - The class group ID of the source location.
 * @param from.period_index - The period index of the source location.
 * @param from.semester_id - The semester ID of the source location.
 * @param to - The destination location of the class session.
 * @param to.class_group_id - The class group ID of the destination location.
 * @param to.period_index - The period index of the destination location.
 * @param to.semester_id - The semester ID of the destination location.
 * @param class_session_id - The ID of the class session to move.
 * @param user_id - The ID of the user performing the move.
 * @param status - The status of the moved assignment.
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
 * @param class_session_id - The ID of the class session to move.
 * @param old_period_index - The old period index.
 * @param old_class_group_id - The old class group ID.
 * @param new_period_index - The new period index.
 * @param new_class_group_id - The new class group ID.
 * @param semester_id - The ID of the semester.
 * @returns A promise that resolves to an object with the result of the cross-department session move.
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
 * @param class_session_id - The ID of the class session.
 * @param semester_id - The ID of the semester.
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
 * @param class_session_id - The ID of the class session.
 * @param semester_id - The ID of the semester.
 * @param status - The new status of the assignment.
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
 * Move session with resource reassignment.
 * Used when dragging to different instructor/classroom row.
 *
 * @param from - The source location of the class session.
 * @param from.class_group_id - The class group ID of the source location.
 * @param from.period_index - The period index of the source location.
 * @param from.semester_id - The semester ID of the source location.
 * @param to - The destination location of the class session.
 * @param to.class_group_id - The class group ID of the destination location.
 * @param to.period_index - The period index of the destination location.
 * @param to.semester_id - The semester ID of the destination location.
 * @param class_session_id - The ID of the class session to move.
 * @param user_id - The ID of the user performing the move.
 * @param resourceType - The type of resource being changed (instructor or classroom).
 * @param newResourceId - The ID of the new resource.
 * @param status - The status of the moved assignment.
 */
export async function moveSessionWithResourceChange(
  from: { class_group_id: string; period_index: number; semester_id: string },
  to: { class_group_id: string; period_index: number; semester_id: string },
  class_session_id: string,
  user_id: string,
  resourceType: 'instructor' | 'classroom',
  newResourceId: string,
  status: 'pending' | 'confirmed' = 'confirmed'
): Promise<void> {
  // Import to avoid circular dependency
  const { reassignSessionResource } = await import('./classSessionService');

  // First, reassign the resource
  await reassignSessionResource(class_session_id, resourceType, newResourceId);

  // Only move the timetable assignment if the time slot is actually changing
  const isSameSlot = 
    from.class_group_id === to.class_group_id && 
    from.period_index === to.period_index &&
    from.semester_id === to.semester_id;

  if (!isSameSlot) {
    // Move the session to new time slot
    await moveClassSession(from, to, class_session_id, user_id, status);
  }
}

/**
 * Get timetable assignments by class session ID.
 *
 * @param class_session_id - The ID of the class session.
 * @param semester_id - The ID of the semester.
 * @returns A promise that resolves to an array of timetable assignments.
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
