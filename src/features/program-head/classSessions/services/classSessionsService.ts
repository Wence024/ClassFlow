/**
 * Service layer for class sessions.
 */

import {
  getClassSessions as infraGetClassSessions,
  addClassSession as infraAddClassSession,
  updateClassSession as infraUpdateClassSession,
  removeClassSession as infraRemoveClassSession,
} from '@/lib/services/classSessionService';
import type { ClassSession, ClassSessionInsert, ClassSessionUpdate } from '@/types/classSession';

/**
 * Gets class sessions for a user.
 */
export async function getClassSessions(userId: string): Promise<ClassSession[]> {
  return infraGetClassSessions(userId);
}

/**
 * Adds a class session.
 */
export async function addClassSession(data: ClassSessionInsert): Promise<ClassSession> {
  return infraAddClassSession(data);
}

/**
 * Updates a class session.
 */
export async function updateClassSession(id: string, data: ClassSessionUpdate): Promise<ClassSession> {
  return infraUpdateClassSession(id, data);
}

/**
 * Removes a class session.
 */
export async function removeClassSession(id: string): Promise<void> {
  return infraRemoveClassSession(id);
}