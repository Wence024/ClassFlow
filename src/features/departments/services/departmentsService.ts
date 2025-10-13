import { supabase } from '../../../lib/supabase';
import type { Department, DepartmentInsert, DepartmentUpdate } from '../types/department';

const TABLE = 'departments';

/**
 * Lists all departments, ordered by name.
 *
 * @returns A promise that resolves to an array of Department objects.
 */
export async function listDepartments(): Promise<Department[]> {
  const { data, error } = await supabase.from(TABLE).select('*').order('name');
  if (error) throw error;
  return data || [];
}

/**
 * Creates a new department (admin only via RLS).
 *
 * @param payload - The data for the new department.
 * @returns A promise that resolves to the newly created Department object.
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
 * @param update - The new data for the department.
 * @returns A promise that resolves to the updated Department object.
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
