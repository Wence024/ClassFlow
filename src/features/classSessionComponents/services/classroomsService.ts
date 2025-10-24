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
 *
 * @param params - Optional parameters for filtering classrooms.
 * @param params.role - The role of the user requesting the classrooms.
 * @param params.department_id - The department ID to filter by for non-admin users.
 * @returns A promise that resolves to an array of Classroom objects.
 */
export async function getClassrooms(params?: { role?: string | null; department_id?: string | null }): Promise<Classroom[]> {
  let query = supabase.from(TABLE).select('*').order('name');
  const role = params?.role ?? null;
  const departmentId = params?.department_id ?? null;
  // Admin sees all; for non-admin management views, scope to user's department
  if (role !== 'admin' && departmentId) {
    query = query.eq('department_id', departmentId);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

/**
 * Returns all classrooms for class session authoring and timetabling workflows.
 *
 * This includes all classrooms; downstream logic handles approvals/conflicts.
 * Includes preferred department name via join for display purposes.
 * 
 * @returns A promise that resolves to an array of all Classroom objects with department info.
 */
export async function getAllClassrooms(): Promise<Classroom[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select(`
      *,
      departments:preferred_department_id (
        name
      )
    `)
    .order('name');
  
  if (error) throw error;
  
  // Transform the nested department object to a flat preferred_department_name field
  return (data || []).map((classroom) => ({
    ...classroom,
    preferred_department_name: classroom.departments?.name || null,
    departments: undefined, // Remove the nested object
  })) as Classroom[];
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
 * This operation is protected by RLS policies in the database.
 *
 * @param id - The unique identifier of the classroom to remove.
 * @param _user_id - The user ID, kept for API consistency but unused due to RLS.
 * @returns A promise that resolves when the operation is complete.
 * @throws An error if the Supabase delete fails.
 */
export async function removeClassroom(id: string, _user_id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}