import { supabase } from '../../../lib/supabase';
import type { Instructor, InstructorInsert, InstructorUpdate } from '../types/instructor';

const TABLE = 'instructors';

/**
 * Fetches all instructors for a specific user from the database.
 * @param user_id The ID of the user whose instructors to retrieve.
 * @returns A promise that resolves to an array of Instructor objects.
 * @throws An error if the Supabase query fails.
 */
export async function getInstructors(user_id: string): Promise<Instructor[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', user_id)
    .order('name');
  if (error) throw error;
  return data || [];
}

/**
 * Adds a new instructor to the database.
 * The input object must include the `user_id` of the owner.
 * @param instructor The InstructorInsert object containing the data for the new instructor.
 * @returns A promise that resolves to the newly created Instructor object, including its database-generated id.
 * @throws An error if the Supabase insert fails.
 */
export async function addInstructor(instructor: InstructorInsert): Promise<Instructor> {
  const { data, error } = await supabase.from(TABLE).insert([instructor]).select().single();
  if (error) throw error;
  return data;
}

/**
 * Updates an existing instructor in the database.
 * This function relies on Supabase's Row-Level Security (RLS) to ensure
 * that users can only update their own records. The RLS policy should
 * check that `auth.uid() = user_id`.
 * @param id The unique identifier of the instructor to update.
 * @param instructor The InstructorUpdate object containing the fields to update.
 * @returns A promise that resolves to the updated Instructor object.
 * @throws An error if the Supabase update fails or the record is not found.
 */
export async function updateInstructor(
  id: string,
  instructor: InstructorUpdate
): Promise<Instructor> {
  const { data, error } = await supabase
    .from(TABLE)
    .update(instructor)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * Removes an instructor from the database.
 * @param id The unique identifier of the instructor to remove.
 * @param user_id The ID of the user, to ensure they own the record being deleted.
 * @returns A promise that resolves when the operation is complete.
 * @throws An error if the Supabase delete fails.
 */
export async function removeInstructor(id: string, user_id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id).eq('user_id', user_id);
  if (error) throw error;
}
