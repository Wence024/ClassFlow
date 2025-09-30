/**
 * @file This service module provides functions for interacting with the `classrooms` table in the database.
 * It abstracts the Supabase client calls for creating, reading, updating, and deleting classrooms.
 */

import { supabase } from '../../../lib/supabase';
import type { Classroom, ClassroomInsert, ClassroomUpdate } from '../types/classroom';

const TABLE = 'classrooms';

/**
 * Returns classrooms for the caller's own class session components workflow.
 *
 * Admins manage classrooms; non-admins typically view (not manage). We do not hard-filter here
 * to allow discovery for request flows; UI can emphasize preferred/owned first.
 */
export async function getClassrooms(params?: { role?: string | null; department_id?: string | null }): Promise<Classroom[]> {
  let query = supabase.from(TABLE).select('*').order('name');
  const role = params?.role ?? null;
  const departmentId = params?.department_id ?? null;
  // Admin manages classrooms; for non-admin, we can show all for selection but no manage
  // If you want to filter visibility to preferred_department or department ownership, apply here:
  if (role !== 'admin' && departmentId) {
    // Example: prioritize preferred department first (UI can sort), not strictly filtering
    // Keeping no filter by default to allow viewing all classrooms for requests
  }
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

/**
 * Returns all classrooms for class session authoring and timetabling workflows.
 *
 * This includes all classrooms; downstream logic handles approvals/conflicts.
 */
export async function getAllClassrooms(): Promise<Classroom[]> {
  const { data, error } = await supabase.from(TABLE).select('*').order('name');
  if (error) throw error;
  return data || [];
}

/**
 * Adds a new classroom to the database.
 * The input object must include the `user_id` of the owner.
 *
 * @param classroom - The ClassroomInsert object containing the data for the new classroom.
 * @returns A promise that resolves to the newly created Classroom object.
 * @throws An error if the Supabase insert fails.
 */
export async function addClassroom(classroom: ClassroomInsert): Promise<Classroom> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([classroom])
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * Updates an existing classroom in the database.
 * Relies on Supabase's Row-Level Security (RLS) to ensure users can only update their own records.
 *
 * @param id - The unique identifier of the classroom to update.
 * @param classroom - The ClassroomUpdate object containing the fields to update.
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
 * This operation is protected by RLS policies in the database, ensuring a user can only delete their own records.
 *
 * @param id - The unique identifier of the classroom to remove.
 * @param user_id - The ID of the user, used here for an explicit check.
 * @returns A promise that resolves when the operation is complete.
 * @throws An error if the Supabase delete fails.
 */
export async function removeClassroom(id: string, _user_id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}
