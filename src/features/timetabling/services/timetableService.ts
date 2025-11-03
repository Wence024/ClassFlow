// src/features/scheduleLessons/services/timetableService.ts

import { supabase } from '../../../lib/supabase';
import type {
  TimetableAssignment,
  TimetableAssignmentInsert,
  HydratedTimetableAssignment,
} from '../types/timetable';

// DELETED: Obsolete data versioning constant.
// export const CURRENT_TIMETABLE_VERSION = 2;

// DELETED: Obsolete migration template comments.

/**
 * Fetch all timetable assignments for a semester from Supabase, with the full
 * class session data embedded.
 *
 * @param semester_id - The ID of the semester to fetch timetable assignments for.
 * @returns An array of timetable assignment objects.
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
    .eq('semester_id', semester_id); // Filter by the active semester instead of the user

  if (error) {
    console.error('Error fetching hydrated timetable assignments:', error);
    throw error;
  }

  // Map the data to include the status field explicitly
  // Default to 'confirmed' if status is not present
  return (data || []).map(assignment => ({
    ...assignment,
    status: (assignment.status as 'pending' | 'confirmed' | undefined) || 'confirmed',
  })) as HydratedTimetableAssignment[];
}

/**
 * Assign a class session to a group/period (insert or upsert) in Supabase.
 * The assignment object MUST include the semester_id.
 *
 * @param assignment TimetableAssignmentInsert object.
 * @param status The status of the assignment ('pending' or 'confirmed').
 * @returns The upserted timetable assignment object.
 */
export async function assignClassSessionToTimetable(
  assignment: TimetableAssignmentInsert,
  status: 'pending' | 'confirmed' = 'confirmed'
): Promise<TimetableAssignment> {
  const assignmentWithStatus = { ...assignment, status };
  const { data, error } = await supabase
    .from('timetable_assignments')
    .upsert([assignmentWithStatus], { onConflict: 'user_id,class_group_id,period_index,semester_id' })
    .select('*')
    .single();
  if (error) throw error;
  return data as TimetableAssignment;
}

/**
 * Remove a class session from a group/period in Supabase.
 * Authorization is handled by RLS policies based on program/department ownership.
 *
 * @param class_group_id The class group ID.
 * @param period_index The period index.
 * @param semester_id The semester ID to ensure we only delete from the current semester.
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
 * Move a class session from one cell to another (upsert new first, then delete old) in Supabase.
 * The new assignment object MUST include the semester_id.
 * Authorization is handled by RLS policies based on program/department ownership.
 * 
 * This approach (upsert first, delete second) is safer than delete-first because:
 * - If the upsert fails, the original assignment remains intact
 * - If the delete fails, we have a duplicate but the data is preserved
 * - The client can handle duplicate cleanup through refetch/invalidation.
 * 
 * NOTE: This is not fully atomic. A future improvement would be to wrap this in a
 * Postgres function that performs both operations within a single transaction.
 *
 * @param from The source cell.
 * @param from.class_group_id The class group ID of the source cell.
 * @param from.period_index The period index of the source cell.
 * @param _to The destination cell.
 * @param _to.class_group_id The class group ID of the destination cell.
 * @param _to.period_index The period index of the destination cell.
 * @param assignment TimetableAssignmentInsert for the new cell.
 * @param status The status of the assignment ('pending' or 'confirmed').
 * @returns The upserted timetable assignment object for the new cell.
 */
export async function moveClassSessionInTimetable(
  from: { class_group_id: string; period_index: number },
  _to: { class_group_id: string; period_index: number },
  assignment: TimetableAssignmentInsert,
  status: 'pending' | 'confirmed' = 'confirmed'
): Promise<TimetableAssignment> {
  // Step 1: Create the new assignment first (safer order)
  const newAssignment = await assignClassSessionToTimetable(assignment, status);
  
  // Step 2: Remove the old assignment only after the new one is successfully created
  await removeClassSessionFromTimetable(from.class_group_id, from.period_index, assignment.semester_id);
  
  return newAssignment;
}

/**
 * Update the status of all timetable assignments for a specific class session.
 * 
 * @deprecated This function is kept for backward compatibility but should not be used
 * for approving resource requests. Use the `approve_resource_request` database function
 * via the `approveRequest` service function instead for atomic updates.
 *
 * @param classSessionId The class session ID.
 * @param semesterId The semester ID.
 * @param status The new status ('pending' or 'confirmed').
 */
export async function updateAssignmentStatusBySession(
  classSessionId: string,
  semesterId: string,
  status: 'pending' | 'confirmed'
): Promise<void> {
  console.warn('updateAssignmentStatusBySession is deprecated. Use approveRequest service function instead.');
  
  const { data, error } = await supabase
    .from('timetable_assignments')
    .update({ status })
    .eq('class_session_id', classSessionId)
    .eq('semester_id', semesterId)
    .select();

  if (error) {
    console.error('Failed to update timetable assignment status:', error);
    throw error;
  }

  console.log(`Updated ${data?.length || 0} assignment(s) to status '${status}'`);
}
