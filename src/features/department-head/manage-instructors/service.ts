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
 */
export async function createInstructor(data: InstructorInsert): Promise<Instructor> {
  return infraAddInstructor(data);
}

/**
 * Updates an existing instructor.
 */
export async function modifyInstructor(id: string, data: InstructorUpdate): Promise<Instructor> {
  return infraUpdateInstructor(id, data);
}

/**
 * Deletes an instructor.
 */
export async function deleteInstructor(id: string): Promise<void> {
  return infraRemoveInstructor(id);
}