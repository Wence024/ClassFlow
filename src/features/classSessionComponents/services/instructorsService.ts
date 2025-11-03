/**
 * @file This service module provides functions for interacting with the `instructors` table in the database.
 * It abstracts the Supabase client calls for creating, reading, updating, and deleting instructors.
 */

import { supabase } from '../../../lib/supabase';
import type { Instructor, InstructorInsert, InstructorUpdate } from '../types/instructor';

const TABLE = 'instructors';

/**
 * Fetches instructors for CRUD/management views (filtered by department for non-admins).
 *
 * **Use this for:**
 * - InstructorTab (create/edit/delete instructors)
 * - AdminInstructorManagement
 * - Any management interface where users should only see instructors they can manage.
 *
 * **Filtering logic:**
 * - Admins see all instructors
 * - Department heads see only instructors in their department
 * - Program heads see only instructors in their department (via program relationship).
 *
 * **Do NOT use for selection workflows** - use `getAllInstructors()` instead.
 *
 * @param params - Optional parameters for filtering instructors.
 * @param params.role - The role of the user requesting the instructors.
 * @param params.department_id - The department ID to filter by for non-admin users.
 * @returns A promise that resolves to an array of Instructor objects filtered by role and department.
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
 * Fetches ALL instructors with department information for selection/browsing workflows.
 *
 * **Use this for:**
 * - ClassSessionForm (selecting instructors for class sessions)
 * - TimetablePage (drag-and-drop instructor assignment)
 * - ProgramHeadInstructors (browsing all instructors by department)
 * - Any interface where users need to SELECT from all available instructors.
 *
 * **Key differences from `getInstructors()`:**
 * - Returns ALL instructors regardless of user's department (no filtering)
 * - Includes `department_name` field for display and prioritization
 * - Used for selection workflows where users can see all resources but get prioritized results
 * - Supports cross-department resource selection with conflict detection.
 *
 * **Department prioritization:**
 * The selector components (InstructorSelector, ResourceSelectorModal) handle grouping:
 * - "From Your Department" - instructors matching user's department
 * - "From Other Departments" - all other instructors.
 *
 * @returns A promise that resolves to an array of all Instructor objects with department_name included.
 */
export async function getAllInstructors(): Promise<Instructor[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select(`
      *,
      departments:department_id (
        name
      )
    `)
    .order('first_name');
  
  if (error) throw error;
  
  // Transform the nested department object to a flat department_name field
  return (data || []).map((instructor) => ({
    ...instructor,
    department_name: instructor.departments?.name || null,
    departments: undefined, // Remove the nested object
  })) as Instructor[];
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
  
  if (error) {
    // Provide more context for RLS policy violations
    if (error.code === '42501') {
      throw new Error(
        `Permission denied: Unable to create instructor. This may be due to: \n` +
        `1. Missing department assignment (department_id: ${instructorWithCreator.department_id})\n` +
        `2. Insufficient permissions for this operation\n` +
        `3. Row-level security policy violation\n` +
        `Original error: ${error.message}`
      );
    }
    throw error;
  }
  
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
 * **Edge Case Handling:**
 * - Cancels all active resource requests for this instructor before deletion
 * - Notifies department heads if requests are cancelled.
 *
 * @param id - The unique identifier of the instructor to remove.
 * @param _user_id - The user ID, kept for API consistency but unused due to RLS.
 * @returns A promise that resolves when the operation is complete.
 * @throws An error if the Supabase delete fails.
 */
export async function removeInstructor(id: string, _user_id: string): Promise<void> {
  // Cancel any active requests for this instructor before deletion
  const { cancelActiveRequestsForResource } = await import('../../resourceRequests/services/resourceRequestService');
  try {
    await cancelActiveRequestsForResource('instructor', id);
  } catch (err) {
    console.error('Failed to cancel requests for instructor:', err);
  }
  
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}