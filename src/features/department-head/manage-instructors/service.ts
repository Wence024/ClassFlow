/**
 * Service layer for managing instructors (CRUD operations).
 */

import {
  getInstructors as infraGetInstructors,
  addInstructor as infraAddInstructor,
  updateInstructor as infraUpdateInstructor,
  removeInstructor as infraRemoveInstructor,
} from '@/lib/services/instructorService';
import type { Instructor, InstructorInsert, InstructorUpdate } from '@/types/instructor';

/**
 * Fetches instructors based on filters.
 *
 * @param filters - The filters to apply when fetching instructors.
 * @param filters.role - The role to filter by.
 * @param filters.departmentId - The department ID to filter by.
 * @returns A promise that resolves to an array of instructors.
 */
export async function fetchInstructors(filters: { role?: string; departmentId?: string | null }): Promise<Instructor[]> {
  // Convert camelCase to snake_case for the infrastructure function
  const infraFilters: any = {};
  if (filters.role !== undefined) infraFilters.role = filters.role;
  if (filters.departmentId !== undefined) infraFilters.department_id = filters.departmentId;

  return infraGetInstructors(infraFilters);
}

/**
 * Creates a new instructor.
 *
 * @param data - The data for the new instructor.
 * @returns A promise that resolves to the created instructor.
 */
export async function createInstructor(data: InstructorInsert): Promise<Instructor> {
  return infraAddInstructor(data);
}

/**
 * Updates an existing instructor.
 *
 * @param id - The ID of the instructor to update.
 * @param data - The update data for the instructor.
 * @returns A promise that resolves to the updated instructor.
 */
export async function modifyInstructor(id: string, data: InstructorUpdate): Promise<Instructor> {
  return infraUpdateInstructor(id, data);
}

/**
 * Deletes an instructor.
 *
 * @param id - The ID of the instructor to delete.
 * @returns A promise that resolves when the instructor is deleted.
 */
export async function deleteInstructor(id: string): Promise<void> {
  return infraRemoveInstructor(id);
}