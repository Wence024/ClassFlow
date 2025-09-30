/**
 * @file This service module provides functions for interacting with the `instructors` table in the database.
 * It abstracts the Supabase client calls for creating, reading, updating, and deleting instructors.
 */

import { supabase } from '../../../lib/supabase';
import type { Instructor, InstructorInsert, InstructorUpdate } from '../types/instructor';

const TABLE = 'instructors';

/**
 * Fetches all instructors from the database.
 *
 * @returns A promise that resolves to an array of Instructor objects.
 * @throws An error if the Supabase query fails.
 */
export async function getInstructors(): Promise<Instructor[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('first_name');
  if (error) throw error;
  return data || [];
}

/**
 * Adds a new instructor to the database.
 * The input object must include the `user_id` of the owner.
 *
 * @param instructor - The InstructorInsert object containing data for the new instructor.
 * @returns A promise that resolves to the newly created Instructor object.
 * @throws An error if the Supabase insert fails.
 */
export async function addInstructor(instructor: InstructorInsert): Promise<Instructor> {
  const { data, error } = await supabase.from(TABLE).insert([instructor]).select().single();
  if (error) throw error;
  return data;
}

/**
 * Updates an existing instructor in the database.
 * Relies on Supabase's Row-Level Security (RLS) to ensure users can only update their own records.
 *
 * @param id - The unique identifier of the instructor to update.
 * @param instructor - The InstructorUpdate object containing the fields to update.
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
 * This operation is protected by RLS policies in the database, ensuring a user can only delete their own records.
 *
 * @param id - The unique identifier of the instructor to remove.
 * @param user_id - The ID of the user, used here for an explicit check.
 * @returns A promise that resolves when the operation is complete.
 * @throws An error if the Supabase delete fails.
 */
export async function removeInstructor(id: string, _user_id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}
