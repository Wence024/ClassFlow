/**
 * Service layer for managing departments.
 * Thin wrapper over infrastructure services.
 */

import {
  listDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '@/lib/services/departmentService';
import type { Department, DepartmentInsert, DepartmentUpdate } from '@/types/department';

/**
 * Fetches all departments.
 *
 * @returns A promise that resolves to an array of Department objects.
 */
export async function fetchDepartments(): Promise<Department[]> {
  return listDepartments();
}

/**
 * Creates a new department.
 *
 * @param data The department data to create.
 * @returns A promise that resolves to the created Department object.
 */
export async function createNewDepartment(data: DepartmentInsert): Promise<Department> {
  return createDepartment(data);
}

/**
 * Updates a department.
 *
 * @param departmentId The ID of the department to update.
 * @param data The updated department data.
 * @returns A promise that resolves to the updated Department object.
 */
export async function updateDepartmentData(
  departmentId: string,
  data: DepartmentUpdate
): Promise<Department> {
  return updateDepartment(departmentId, data);
}

/**
 * Deletes a department.
 *
 * @param departmentId The ID of the department to delete.
 */
export async function removeDepartment(departmentId: string): Promise<void> {
  return deleteDepartment(departmentId);
}
