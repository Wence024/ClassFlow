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
  return (data || []).map(assignment => ({
    ...assignment,
    status: (assignment as any).status as 'pending' | 'confirmed',
  })) as HydratedTimetableAssignment[];
}

/**
 * Assign a class session to a group/period (insert or upsert) in Supabase.
 * The assignment object MUST include the semester_id.
 *
 * @param assignment TimetableAssignmentInsert object.
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
 * @returns The upserted timetable assignment object for the new cell.
 */
export async function moveClassSessionInTimetable(
  from: { class_group_id: string; period_index: number },
  _to: { class_group_id: string; period_index: number },
  assignment: TimetableAssignmentInsert // This is the payload for the new location
): Promise<TimetableAssignment> {
  // Step 1: Create the new assignment first (safer order)
  const newAssignment = await assignClassSessionToTimetable(assignment);
  
  // Step 2: Remove the old assignment only after the new one is successfully created
  await removeClassSessionFromTimetable(from.class_group_id, from.period_index, assignment.semester_id);
  
  return newAssignment;
}
