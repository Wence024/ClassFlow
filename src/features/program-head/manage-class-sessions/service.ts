/**
 * Service layer for managing class sessions (CRUD operations).
 */

import * as classSessionService from '@/lib/services/classSessionService';
import * as instructorService from '@/lib/services/instructorService';
import * as classroomService from '@/lib/services/classroomService';
import type { ClassSession, ClassSessionInsert, ClassSessionUpdate, CrossDepartmentInfo } from './types';

/**
 * Fetches all class sessions for a user.
 *
 * @param userId - The ID of the user whose class sessions to fetch.
 * @returns A promise resolving to an array of class sessions.
 */
export async function getClassSessions(userId: string): Promise<ClassSession[]> {
  return classSessionService.getClassSessions(userId);
}

/**
 * Alternative function name for fetchSessions.
 *
 * @param userId - The ID of the user whose class sessions to fetch.
 * @returns A promise resolving to an array of class sessions.
 */
export async function fetchSessions(userId: string): Promise<ClassSession[]> {
  return getClassSessions(userId);
}

/**
 * Fetches class sessions for a program.
 *
 * @param programId - The ID of the program whose class sessions to fetch.
 * @returns A promise resolving to an array of class sessions.
 */
export async function getClassSessionsForProgram(programId: string): Promise<ClassSession[]> {
  return classSessionService.getClassSessionsByProgram(programId);
}

/**
 * Creates a new class session.
 *
 * @param data - The data for creating the class session.
 * @param programId - The ID of the program for the session.
 * @param userId - The ID of the user creating the session.
 * @returns A promise resolving to the created class session.
 */
export async function createClassSession(data: ClassSessionInsert, programId: string, userId: string): Promise<ClassSession> {
  return classSessionService.addClassSession({ ...data, program_id: programId, user_id: userId });
}

/**
 * Updates an existing class session.
 *
 * @param sessionId - The ID of the session to update.
 * @param data - The update data for the class session.
 * @returns A promise resolving to the updated class session.
 */
export async function updateClassSession(sessionId: string, data: ClassSessionUpdate): Promise<ClassSession> {
  return classSessionService.updateClassSession(sessionId, data);
}

/**
 * Deletes a class session.
 *
 * @param sessionId - The ID of the session to delete.
 * @param userId - The ID of the user deleting the session.
 * @returns A promise that resolves when the session is deleted.
 */
export async function deleteClassSession(sessionId: string, userId: string): Promise<void> {
  return classSessionService.removeClassSession(sessionId, userId);
}

/**
 * Alternative function name for deleteClassSession (for test compatibility).
 *
 * @param sessionId - The ID of the session to remove.
 * @param userId - The ID of the user removing the session.
 * @returns A promise that resolves when the session is removed.
 */
export async function removeClassSession(sessionId: string, userId: string): Promise<void> {
  return deleteClassSession(sessionId, userId);
}

/**
 * Creates a new class session (alternative function name).
 *
 * @param data - The data for creating the class session.
 * @returns A promise resolving to the created class session.
 */
export async function createSession(data: ClassSessionInsert): Promise<ClassSession> {
  return classSessionService.addClassSession(data);
}

/**
 * Updates an existing class session (alternative function name).
 *
 * @param sessionId - The ID of the session to update.
 * @param data - The update data for the class session.
 * @returns A promise resolving to the updated class session.
 */
export async function updateSession(
  sessionId: string,
  data: ClassSessionUpdate
): Promise<ClassSession> {
  return classSessionService.updateClassSession(sessionId, data);
}

/**
 * Deletes a class session (alternative function name).
 *
 * @param sessionId - The ID of the session to delete.
 * @param userId - The ID of the user deleting the session.
 * @returns A promise that resolves when the session is deleted.
 */
export async function deleteSession(sessionId: string, userId: string): Promise<void> {
  return classSessionService.removeClassSession(sessionId, userId);
}

/**
 * Checks if resources belong to a different department (cross-department).
 *
 * @param instructorId - Optional instructor ID to check.
 * @param classroomId - Optional classroom ID to check.
 * @returns A promise resolving to cross-department info or null.
 */
export async function checkCrossDepartmentResources(
  instructorId?: string,
  classroomId?: string
): Promise<CrossDepartmentInfo | null> {
  // Skip if no resources provided
  if (!instructorId && !classroomId) return null;

  // Check instructor
  if (instructorId) {
    const instructors = await instructorService.getAllInstructors();
    const instructor = instructors.find((i) => i.id === instructorId);

    if (instructor && instructor.department_id) {
      return {
        resourceType: 'instructor',
        resourceId: instructorId,
        departmentId: instructor.department_id,
        resourceName: `${instructor.first_name} ${instructor.last_name}`,
      };
    }
  }

  // Check classroom if provided
  if (classroomId) {
    const classrooms = await classroomService.getAllClassrooms();
    const classroom = classrooms.find((c) => c.id === classroomId);

    if (classroom?.preferred_department_id) {
      return {
        resourceType: 'classroom',
        resourceId: classroomId,
        departmentId: classroom.preferred_department_id,
        resourceName: classroom.name,
      };
    }
  }

  return null;
}
