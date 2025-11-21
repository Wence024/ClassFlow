/**
 * Service layer for managing class sessions (CRUD operations).
 */

import * as classSessionService from '@/lib/services/classSessionService';
import * as instructorService from '@/lib/services/instructorService';
import * as classroomService from '@/lib/services/classroomService';
import type { ClassSession, ClassSessionInsert, ClassSessionUpdate, ClassSessionUpsert, CrossDepartmentInfo } from './types';

/**
 * Fetches all class sessions for a user.
 *
 * @param userId
 */
export async function getClassSessions(userId: string): Promise<ClassSession[]> {
  return classSessionService.getClassSessions(userId);
}

/**
 * Alternative function name for fetchSessions.
 *
 * @param userId
 */
export async function fetchSessions(userId: string): Promise<ClassSession[]> {
  return getClassSessions(userId);
}

/**
 * Fetches class sessions for a program.
 *
 * @param programId
 */
export async function getClassSessionsForProgram(programId: string): Promise<ClassSession[]> {
  return classSessionService.getClassSessionsByProgram(programId);
}

/**
 * Creates a new class session.
 *
 * @param data
 * @param programId
 * @param userId
 */
export async function createClassSession(data: ClassSessionUpsert, programId: string, userId: string): Promise<ClassSession> {
  return classSessionService.addClassSession({ ...data, program_id: programId, user_id: userId });
}

/**
 * Updates an existing class session.
 *
 * @param sessionId
 * @param data
 */
export async function updateClassSession(sessionId: string, data: ClassSessionUpdate): Promise<ClassSession> {
  return classSessionService.updateClassSession(sessionId, data);
}

/**
 * Deletes a class session.
 *
 * @param sessionId
 * @param userId
 */
export async function deleteClassSession(sessionId: string, userId: string): Promise<void> {
  return classSessionService.removeClassSession(sessionId, userId);
}

/**
 * Alternative function name for deleteClassSession (for test compatibility).
 *
 * @param sessionId
 * @param userId
 */
export async function removeClassSession(sessionId: string, userId: string): Promise<void> {
  return deleteClassSession(sessionId, userId);
}

/**
 * Creates a new class session (alternative function name).
 *
 * @param data
 */
export async function createSession(data: ClassSessionInsert): Promise<ClassSession> {
  return classSessionService.addClassSession(data);
}

/**
 * Updates an existing class session (alternative function name).
 *
 * @param sessionId
 * @param data
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
 * @param sessionId
 * @param userId
 */
export async function deleteSession(sessionId: string, userId: string): Promise<void> {
  return classSessionService.removeClassSession(sessionId, userId);
}

/**
 * Checks if resources belong to a different department (cross-department).
 *
 * @param instructorId
 * @param classroomId
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
