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

  // DELETED: Obsolete check for data migration.

  return data as HydratedTimetableAssignment[];
}

/**
 * Assign a class session to a group/period (insert or upsert) in Supabase.
 * The assignment object MUST include the semester_id.
 *
 * @param assignment TimetableAssignmentInsert object.
 * @returns The upserted timetable assignment object.
 */
export async function assignClassSessionToTimetable(
  assignment: TimetableAssignmentInsert // This type already allows semester_id
): Promise<TimetableAssignment> {
  // The logic here doesn't need to change, as long as the incoming
  // 'assignment' object contains the semester_id.
  const { data, error } = await supabase
    .from('timetable_assignments')
    .upsert([assignment], { onConflict: 'user_id,class_group_id,period_index,semester_id' }) // IMPORTANT: Add semester_id to the conflict check
    .select('*')
    .single();
  if (error) throw error;
  return data as TimetableAssignment;
}

/**
 * Remove a class session from a group/period in Supabase.
 *
 * @param user_id The user's unique ID.
 * @param class_group_id The class group ID.
 * @param period_index The period index.
 */
export async function removeClassSessionFromTimetable(
  user_id: string,
  class_group_id: string,
  period_index: number
): Promise<void> {
  const { error } = await supabase
    .from('timetable_assignments')
    .delete()
    .eq('user_id', user_id)
    .eq('class_group_id', class_group_id)
    .eq('period_index', period_index);
  if (error) throw error;
}

/**
 * Move a class session from one cell to another (delete old, upsert new) in Supabase.
 * The new assignment object MUST include the semester_id.
 *
 * @param user_id The user's unique ID.
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
  user_id: string,
  from: { class_group_id: string; period_index: number },
  _to: { class_group_id: string; period_index: number },
  assignment: TimetableAssignmentInsert // This is the payload for the new location
): Promise<TimetableAssignment> {
  await removeClassSessionFromTimetable(user_id, from.class_group_id, from.period_index);
  // The assign function will handle the rest correctly.
  return assignClassSessionToTimetable(assignment);
}
