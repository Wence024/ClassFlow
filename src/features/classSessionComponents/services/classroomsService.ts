/**
 * @file This service module provides functions for interacting with the `classrooms` table in the database.
 * It abstracts the Supabase client calls for creating, reading, updating, and deleting classrooms.
 */

import { supabase } from '../../../lib/supabase';
import type { Classroom, ClassroomInsert, ClassroomUpdate } from '../types/classroom';

const TABLE = 'classrooms';

/**
 * Fetches all classrooms for a specific user from the database.
 * @param {string} user_id - The ID of the user whose classrooms to retrieve.
 * @returns {Promise<Classroom[]>} A promise that resolves to an array of Classroom objects.
 * @throws An error if the Supabase query fails.
 */
export async function getClassrooms(user_id: string): Promise<Classroom[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', user_id)
    .order('name');
  if (error) throw error;
  return data || [];
}

/**
 * Adds a new classroom to the database.
 * The input object must include the `user_id` of the owner.
 * @param {ClassroomInsert} classroom - The ClassroomInsert object containing the data for the new classroom.
 * @returns {Promise<Classroom>} A promise that resolves to the newly created Classroom object.
 * @throws An error if the Supabase insert fails.
 */
export async function addClassroom(classroom: ClassroomInsert): Promise<Classroom> {
  const { data, error } = await supabase.from(TABLE).insert([classroom]).select().single();
  if (error) throw error;
  return data;
}

/**
 * Updates an existing classroom in the database.
 * Relies on Supabase's Row-Level Security (RLS) to ensure users can only update their own records.
 * @param {string} id - The unique identifier of the classroom to update.
 * @param {ClassroomUpdate} classroom - The ClassroomUpdate object containing the fields to update.
 * @returns {Promise<Classroom>} A promise that resolves to the updated Classroom object.
 * @throws An error if the Supabase update fails or the record is not found.
 */
export async function updateClassroom(id: string, classroom: ClassroomUpdate): Promise<Classroom> {
  const { data, error } = await supabase
    .from(TABLE)
    .update(classroom)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * Removes a classroom from the database.
 * This operation is protected by RLS policies in the database, ensuring a user can only delete their own records.
 * @param {string} id - The unique identifier of the classroom to remove.
 * @param {string} user_id - The ID of the user, used here for an explicit check.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 * @throws An error if the Supabase delete fails.
 */
export async function removeClassroom(id: string, user_id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id).eq('user_id', user_id);
  if (error) throw error;
}
