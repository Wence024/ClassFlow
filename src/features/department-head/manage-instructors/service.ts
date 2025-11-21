/**
 * Service layer for managing instructors.
 * Thin wrapper over infrastructure services.
 */

import {
  getInstructors,
  addInstructor as addInstructorService,
  updateInstructor as updateInstructorService,
  removeInstructor as removeInstructorService,
} from '@/lib/services/instructorService';
import type { Instructor, InstructorInsert, InstructorUpdate } from '@/types/instructor';

/**
 * Fetches instructors based on role and department.
 *
 * @param params
 * @param params.role
 * @param params.departmentId
 */
export async function fetchInstructors(params: {
  role: string;
  departmentId: string | null;
}): Promise<Instructor[]> {
  return getInstructors({
    role: params.role,
    department_id: params.departmentId,
  });
}

/**
 * Creates a new instructor.
 *
 * @param data
 */
export async function createInstructor(data: InstructorInsert): Promise<Instructor> {
  return addInstructorService(data);
}

/**
 * Updates an existing instructor.
 *
 * @param id
 * @param data
 */
export async function modifyInstructor(
  id: string,
  data: InstructorUpdate
): Promise<Instructor> {
  return updateInstructorService(id, data);
}

/**
 * Deletes an instructor.
 *
 * @param id
 */
export async function deleteInstructor(id: string): Promise<void> {
  return removeInstructorService(id);
}
