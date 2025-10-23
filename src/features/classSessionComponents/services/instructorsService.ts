/**
 * @file This service module provides functions for interacting with the `instructors` table in the database.
 * It abstracts the Supabase client calls for creating, reading, updating, and deleting instructors.
 */

import { supabase } from '../../../lib/supabase';
import type { Instructor, InstructorInsert, InstructorUpdate } from '../types/instructor';

const TABLE = 'instructors';

/**
 * Returns instructors for the caller's own class session components workflow.
 *
 * Non-admins are filtered by their `department_id`. Admins receive all.
 * This is intended for the Instructor management views (CRUD) owned by department heads/admins.
 *
 * @param params - Optional parameters for filtering instructors.
 * @param params.role - The role of the user requesting the instructors.
 * @param params.department_id - The department ID to filter by for non-admin users.
 * @returns A promise that resolves to an array of Instructor objects.
 */
export async function getInstructors(params?: { role?: string | null; department_id?: string | null }): Promise<Instructor[]> {
  let query = supabase.from(TABLE).select('*').order('first_name');
  const role = params?.role ?? null;
  const departmentId = params?.department_id ?? null;
  if (role !== 'admin' && departmentId) {
    query = query.eq('department_id', departmentId);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

/**
 * Returns all instructors for class session authoring and timetabling workflows.
 *
 * This function does not filter by department, as timetabling may need
 * to view cross-department resources (with conflicts/requests enforced elsewhere).
 * 
 * @returns A promise that resolves to an array of all Instructor objects.
 */
export async function getAllInstructors(): Promise<Instructor[]> {
  const { data, error } = await supabase.from(TABLE).select('*').order('first_name');
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
  // Get current user ID for created_by field
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('User not authenticated');
  
  // Ensure created_by is set
  const instructorWithCreator = {
    ...instructor,
    created_by: user.id,
  };
  
  const { data, error } = await supabase.from(TABLE).insert([instructorWithCreator]).select().single();
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
 * This operation is protected by RLS policies in the database.
 *
 * @param id - The unique identifier of the instructor to remove.
 * @param _user_id - The user ID, kept for API consistency but unused due to RLS.
 * @returns A promise that resolves when the operation is complete.
 * @throws An error if the Supabase delete fails.
 */
export async function removeInstructor(id: string, _user_id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}