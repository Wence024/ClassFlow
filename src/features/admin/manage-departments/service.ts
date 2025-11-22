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
 */
export async function fetchDepartments(): Promise<Department[]> {
  return infraListDepartments();
}

/**
 * Creates a new department.
 */
export async function createNewDepartment(data: DepartmentInsert): Promise<Department> {
  return infraCreateDepartment(data);
}

/**
 * Updates an existing department.
 */
export async function updateDepartmentData(departmentId: string, data: DepartmentUpdate): Promise<Department> {
  return infraUpdateDepartment(departmentId, data);
}

/**
 * Removes a department.
 */
export async function removeDepartment(departmentId: string): Promise<void> {
  return infraDeleteDepartment(departmentId);
}