/**
 * Service layer for managing classrooms.
 * Thin wrapper over infrastructure services.
 */

import {
  getAllClassrooms,
  addClassroom as addClassroomService,
  updateClassroom as updateClassroomService,
  removeClassroom as removeClassroomService,
} from '@/lib/services/classroomService';
import type { Classroom, ClassroomInsert, ClassroomUpdate } from '@/types/classroom';

/**
 * Fetches all classrooms with department information.
 *
 * @returns A promise that resolves to an array of Classroom objects.
 */
export async function fetchAllClassrooms(): Promise<Classroom[]> {
  return getAllClassrooms();
}

/**
 * Creates a new classroom.
 *
 * @param data The classroom data to create.
 * @returns A promise that resolves to the created Classroom object.
 */
export async function createClassroom(data: ClassroomInsert): Promise<Classroom> {
  return addClassroomService(data);
}

/**
 * Updates an existing classroom.
 *
 * @param id The ID of the classroom to update.
 * @param data The updated classroom data.
 * @returns A promise that resolves to the updated Classroom object.
 */
export async function modifyClassroom(id: string, data: ClassroomUpdate): Promise<Classroom> {
  return updateClassroomService(id, data);
}

/**
 * Deletes a classroom.
 *
 * @param id The ID of the classroom to delete.
 * @returns A promise that resolves when the classroom is deleted.
 */
export async function deleteClassroom(id: string): Promise<void> {
  return removeClassroomService(id);
}
