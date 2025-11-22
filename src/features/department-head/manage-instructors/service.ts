/**
 * Service layer for managing instructors (CRUD operations).
 */

import {
  getAllInstructors as infraGetAllInstructors,
  addInstructor as infraAddInstructor,
  updateInstructor as infraUpdateInstructor,
  removeInstructor as infraRemoveInstructor,
} from '@/lib/services/instructorService';
import type { Instructor, InstructorInsert, InstructorUpdate } from '@/types/instructor';

/**
 * Fetches all instructors.
 */
export async function fetchInstructors(filters: { role?: string; departmentId?: string | null }): Promise<Instructor[]> {
  // The function may need to filter based on department ID for department heads
  const allInstructors = await infraGetAllInstructors();
  if (filters.departmentId) {
    return allInstructors.filter(inst => inst.department_id === filters.departmentId);
  }
  return allInstructors;
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