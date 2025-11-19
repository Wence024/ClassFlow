/**
 * Service layer for managing class sessions.
 * Thin wrapper over infrastructure services.
 */

import {
  getClassSessions,
  removeClassSession,
  updateClassSession,
} from '@/lib/services/classSessionService';
import type { ClassSession, ClassSessionUpdate } from '@/types/classSession';

/**
 * Fetches all class sessions for the current user.
 */
export async function fetchSessions(userId: string): Promise<ClassSession[]> {
  return getClassSessions(userId);
}

/**
 * Updates a class session.
 */
export async function updateSession(
  sessionId: string,
  update: ClassSessionUpdate
): Promise<ClassSession> {
  return updateClassSession(sessionId, update);
}

/**
 * Deletes a class session.
 */
export async function deleteSession(sessionId: string, userId: string): Promise<void> {
  return removeClassSession(sessionId, userId);
}
