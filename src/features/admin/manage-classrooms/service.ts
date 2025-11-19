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
 */
export async function fetchAllClassrooms(): Promise<Classroom[]> {
  return getAllClassrooms();
}

/**
 * Creates a new classroom.
 */
export async function createClassroom(data: ClassroomInsert): Promise<Classroom> {
  return addClassroomService(data);
}

/**
 * Updates an existing classroom.
 */
export async function modifyClassroom(id: string, data: ClassroomUpdate): Promise<Classroom> {
  return updateClassroomService(id, data);
}

/**
 * Deletes a classroom.
 */
export async function deleteClassroom(id: string): Promise<void> {
  return removeClassroomService(id);
}
