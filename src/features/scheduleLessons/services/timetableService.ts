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
 * Fetch all timetable assignments for a user from Supabase, with the full
 * class session data embedded.
 * @param user_id The user's unique ID.
 * @returns Array of HydratedTimetableAssignment objects.
 */
export async function getTimetableAssignments(
  user_id: string
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
    .eq('user_id', user_id);

  if (error) {
    console.error('Error fetching hydrated timetable assignments:', error);
    throw error;
  }

  // DELETED: Obsolete check for data migration.

  return data as HydratedTimetableAssignment[];
}

/**
 * Assign a session to a group/period (insert or upsert) in Supabase.
 * @param assignment TimetableAssignmentInsert object.
 * @returns The upserted TimetableAssignment object.
 */
export async function assignSessionToTimetable(
  assignment: TimetableAssignmentInsert
): Promise<TimetableAssignment> {
  // REMOVED: data_version logic is no longer needed.
  const { data, error } = await supabase
    .from('timetable_assignments')
    .upsert([assignment], { onConflict: 'user_id,class_group_id,period_index' })
    .select('*')
    .single();
  if (error) throw error;
  return data as TimetableAssignment;
}

/**
 * Remove a session from a group/period in Supabase.
 * @param user_id The user's unique ID.
 * @param class_group_id The class group ID.
 * @param period_index The period index.
 */
export async function removeSessionFromTimetable(
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
 * Move a session from one cell to another (delete old, upsert new) in Supabase.
 * @param user_id The user's unique ID.
 * @param from The source cell ({ class_group_id, period_index }).
 * @param to The destination cell ({ class_group_id, period_index }).
 * @param assignment TimetableAssignmentInsert for the new cell.
 * @returns The upserted TimetableAssignment object for the new cell.
 */
export async function moveSessionInTimetable(
  user_id: string,
  from: { class_group_id: string; period_index: number },
  to: { class_group_id: string; period_index: number },
  assignment: TimetableAssignmentInsert
): Promise<TimetableAssignment> {
  await removeSessionFromTimetable(user_id, from.class_group_id, from.period_index);
  // REMOVED: data_version logic is no longer needed.
  return assignSessionToTimetable(assignment);
}
