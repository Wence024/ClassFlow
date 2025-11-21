/**
 * Centralized service for all department database operations.
 * Consolidates operations from features/departments/services/departmentsService.ts.
 */

import { supabase } from '../supabase';
import type { Department, DepartmentInsert, DepartmentUpdate } from '../../types/department';

const TABLE = 'departments';

/**
 * Lists all departments, ordered by name.
 *
 * @returns Array of all departments.
 */
export async function listDepartments(): Promise<Department[]> {
  const { data, error } = await supabase.from(TABLE).select('*').order('name');
  if (error) throw error;
  return data || [];
}

/**
 * Creates a new department (admin only via RLS).
 *
 * @param payload - The department data to create.
 * @returns The newly created department object.
 */
export async function createDepartment(payload: DepartmentInsert): Promise<Department> {
  const { data, error } = await supabase.from(TABLE).insert([payload]).select().single();
  if (error) throw error;
  return data as Department;
}

/**
 * Updates a department (admin only via RLS).
 *
 * @param id - The ID of the department to update.
 * @param update - The updated department data.
 * @returns The updated department object.
 */
export async function updateDepartment(id: string, update: DepartmentUpdate): Promise<Department> {
  const { data, error } = await supabase.from(TABLE).update(update).eq('id', id).select().single();
  if (error) throw error;
  return data as Department;
}

/**
 * Deletes a department (admin only via RLS).
 *
 * @param id - The ID of the department to delete.
 */
export async function deleteDepartment(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}
