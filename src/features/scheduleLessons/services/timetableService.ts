
import { supabase } from '../../../lib/supabase';
import type { TimetableAssignment, TimetableAssignmentInsert } from '../types/timetable';

// --- Data Versioning ---
export const CURRENT_TIMETABLE_VERSION = 2;

// --- Data Migration Template ---
// If you change the timetable data structure in the future, add migration helpers here.
// Example:
// export async function migrateTimetableV2ToV3(user_id: string): Promise<void> {
//   // Fetch all assignments for user
//   // Transform and upsert with new version
// }

/**
 * Fetch all timetable assignments for a user from Supabase.
 * Checks for version mismatches and logs a warning if migration is needed.
 * @param user_id The user's unique ID.
 * @returns Array of TimetableAssignment objects.
 */
export async function getTimetableAssignments(user_id: string): Promise<TimetableAssignment[]> {
  const { data, error } = await supabase
    .from('timetable_assignments')
    .select('*')
    .eq('user_id', user_id);
  if (error) throw error;
  const needsMigration = (data ?? []).some(row => row.data_version !== CURRENT_TIMETABLE_VERSION);
  if (needsMigration) {
    // Optionally: trigger migration logic here or notify the user/admin
    console.warn('Some timetable assignments are not at the current data version. Migration may be needed.');
  }
  return data as TimetableAssignment[];
}

/**
 * Assign a session to a group/period (insert or upsert) in Supabase.
 * Always sets data_version to the current version.
 * @param assignment TimetableAssignmentInsert object.
 * @returns The upserted TimetableAssignment object.
 */
export async function assignSessionToTimetable(assignment: TimetableAssignmentInsert): Promise<TimetableAssignment> {
  const assignmentWithVersion = { ...assignment, data_version: CURRENT_TIMETABLE_VERSION };
  const { data, error } = await supabase
    .from('timetable_assignments')
    .upsert([assignmentWithVersion], { onConflict: 'user_id,class_group_id,period_index' })
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
export async function removeSessionFromTimetable(user_id: string, class_group_id: string, period_index: number): Promise<void> {
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
 * Always sets data_version to the current version.
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
  const assignmentWithVersion = { ...assignment, data_version: CURRENT_TIMETABLE_VERSION };
  return assignSessionToTimetable(assignmentWithVersion);
}

