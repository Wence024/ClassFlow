/**
 * @file This service module provides functions for interacting with the `classrooms` table in the database.
 * It abstracts the Supabase client calls for creating, reading, updating, and deleting classrooms.
 */

import { supabase } from '../../../lib/supabase';
import type { Classroom, ClassroomInsert, ClassroomUpdate } from '../types/classroom';

const TABLE = 'classrooms';

/**
 * Fetches classrooms for CRUD/management views (admin-only access).
 *
 * **Use this for:**
 * - ClassroomTab (create/edit/delete classrooms)
 * - Any management interface for classroom administration.
 *
 * **Filtering logic:**
 * - Admins see all classrooms
 * - Non-admins are restricted (currently returns empty array).
 *
 * **Do NOT use for selection workflows** - use `getAllClassrooms()` instead.
 *
 * @param params - Optional parameters for filtering classrooms.
 * @param params.role - The role of the user requesting the classrooms.
 * @param params.department_id - The department ID to filter by for non-admin users.
 * @returns A promise that resolves to an array of Classroom objects.
 */
export async function getClassrooms(params?: {
  role?: string | null;
  department_id?: string | null;
}): Promise<Classroom[]> {
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
 * Fetches ALL classrooms with department information for selection/browsing workflows.
 *
 * **Use this for:**
 * - ClassSessionForm (selecting classrooms for class sessions)
 * - TimetablePage (viewing classroom assignments)
 * - Any interface where users need to SELECT from all available classrooms.
 *
 * **Key differences from `getClassrooms()`:**
 * - Returns ALL classrooms regardless of user's role (no filtering)
 * - Includes `preferred_department_name` field for display and prioritization
 * - Used for selection workflows where users can see all resources but get prioritized results
 * - Supports cross-department resource selection with conflict detection.
 *
 * **Department prioritization:**
 * The selector components (ClassroomSelector, ResourceSelectorModal) handle grouping:
 * - "From Your Department" - classrooms with preferred_department_id matching user's department
 * - "From Other Departments" - all other classrooms.
 *
 * @returns A promise that resolves to an array of all Classroom objects with preferred_department_name included.
 */
export async function getAllClassrooms(): Promise<Classroom[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select(
      `
      *,
      departments:preferred_department_id (
        name
      )
    `
    )
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
  const { data, error } = await supabase.from(TABLE).insert([classroom]).select().single();
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
 * **Edge Case Handling:**
 * - Cancels all active resource requests for this classroom before deletion
 * - Notifies department heads if requests are cancelled.
 *
 * @param id - The unique identifier of the classroom to remove.
 * @param _user_id - The user ID, kept for API consistency but unused due to RLS.
 * @returns A promise that resolves when the operation is complete.
 * @throws An error if the Supabase delete fails.
 */
export async function removeClassroom(id: string, _user_id: string): Promise<void> {
  // Cancel any active requests for this classroom before deletion
  const { cancelActiveRequestsForResource } = await import(
    '@/lib/services/resourceRequestService'
  );
  try {
    await cancelActiveRequestsForResource('classroom', id);
  } catch (err) {
    console.error('Failed to cancel requests for classroom:', err);
  }

  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}
