/**
 * Service layer for managing departments (CRUD operations).
 */

import {
  listDepartments as infraListDepartments,
  createDepartment as infraCreateDepartment,
  updateDepartment as infraUpdateDepartment,
  deleteDepartment as infraDeleteDepartment,
} from '@/lib/services/departmentService';
import type { Department, DepartmentInsert, DepartmentUpdate } from '@/types/department';

/**
 * Fetches all departments.
 *
 * @returns A promise resolving to an array of departments.
 */
export async function fetchDepartments(): Promise<Department[]> {
  return infraListDepartments();
}

/**
 * Creates a new department.
 *
 * @param data - The department data to create.
 * @returns A promise resolving to the created department.
 */
export async function createNewDepartment(data: DepartmentInsert): Promise<Department> {
  return infraCreateDepartment(data);
}

/**
 * Updates an existing department.
 *
 * @param departmentId - The ID of the department to update.
 * @param data - The department data to update.
 * @returns A promise resolving to the updated department.
 */
export async function updateDepartmentData(departmentId: string, data: DepartmentUpdate): Promise<Department> {
  return infraUpdateDepartment(departmentId, data);
}

/**
 * Removes a department.
 *
 * @param departmentId - The ID of the department to remove.
 * @returns A promise that resolves when the department is removed.
 */
export async function removeDepartment(departmentId: string): Promise<void> {
  return infraDeleteDepartment(departmentId);
}