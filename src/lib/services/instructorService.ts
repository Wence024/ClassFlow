/**
 * Centralized service for all instructor database operations.
 * Consolidates operations from features/classSessionComponents/services/instructorsService.ts.
 */

import { supabase } from '../supabase';
import type { Instructor, InstructorInsert, InstructorUpdate } from '../../types/instructor';

const TABLE = 'instructors';

/**
 * Fetches instructors for CRUD/management views (filtered by department for non-admins).
 *
 * @param params
 * @param params.role
 * @param params.department_id
 */
export async function getInstructors(params?: {
  role?: string | null;
  department_id?: string | null;
}): Promise<Instructor[]> {
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
 * Fetches ALL instructors with department information for selection workflows.
 */
export async function getAllInstructors(): Promise<Instructor[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select(
      `
      *,
      departments:department_id (
        name
      )
    `
    )
    .order('first_name');

  if (error) throw error;

  return (data || []).map((instructor) => ({
    ...instructor,
    department_name: instructor.departments?.name || null,
    departments: undefined,
  })) as Instructor[];
}

/**
 * Adds a new instructor to the database.
 *
 * @param instructor
 */
export async function addInstructor(instructor: InstructorInsert): Promise<Instructor> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('User not authenticated');

  const instructorWithCreator = { ...instructor, created_by: user.id };
  const { data, error } = await supabase
    .from(TABLE)
    .insert([instructorWithCreator])
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * Updates an existing instructor in the database.
 *
 * @param id
 * @param instructor
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
 *
 * @param id
 */
export async function removeInstructor(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}

/**
 * Fetches instructors by department ID.
 *
 * @param departmentId
 */
export async function getInstructorsByDepartment(departmentId: string): Promise<Instructor[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('department_id', departmentId)
    .order('first_name');
  if (error) throw error;
  return data || [];
}
