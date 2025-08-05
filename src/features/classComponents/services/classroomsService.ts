import { supabase } from '../../../lib/supabase';
import type { Classroom, ClassroomInsert, ClassroomUpdate } from '../types/classroom';

const TABLE = 'classrooms';

/**
 * Fetches all classrooms for a specific user from the database.
 * @param user_id The ID of the user whose classrooms to retrieve.
 * @returns A promise that resolves to an array of Classroom objects.
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
 * @param classroom The ClassroomInsert object containing the data for the new classroom.
 * @returns A promise that resolves to the newly created Classroom object, including its database-generated id.
 * @throws An error if the Supabase insert fails.
 */
export async function addClassroom(classroom: ClassroomInsert): Promise<Classroom> {
  const { data, error } = await supabase.from(TABLE).insert([classroom]).select().single();
  if (error) throw error;
  return data;
}

/**
 * Updates an existing classroom in the database.
 * This function relies on Supabase's Row-Level Security (RLS) to ensure
 * that users can only update their own records. The RLS policy should
 * check that `auth.uid() = user_id`.
 * @param id The unique identifier of the classroom to update.
 * @param classroom The ClassroomUpdate object containing the fields to update.
 * @returns A promise that resolves to the updated Classroom object.
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
 * @param id The unique identifier of the classroom to remove.
 * @param user_id The ID of the user, to ensure they own the record being deleted.
 * @returns A promise that resolves when the operation is complete.
 * @throws An error if the Supabase delete fails.
 */
export async function removeClassroom(id: string, user_id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id).eq('user_id', user_id);
  if (error) throw error;
}
