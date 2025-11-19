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
 */
export async function fetchDepartments(): Promise<Department[]> {
  return listDepartments();
}

/**
 * Creates a new department.
 */
export async function createNewDepartment(data: DepartmentInsert): Promise<Department> {
  return createDepartment(data);
}

/**
 * Updates a department.
 */
export async function updateDepartmentData(
  departmentId: string,
  data: DepartmentUpdate
): Promise<Department> {
  return updateDepartment(departmentId, data);
}

/**
 * Deletes a department.
 */
export async function removeDepartment(departmentId: string): Promise<void> {
  return deleteDepartment(departmentId);
}
