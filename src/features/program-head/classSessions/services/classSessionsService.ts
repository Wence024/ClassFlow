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
 *
 * @param userId - The ID of the user to get class sessions for.
 * @returns A promise that resolves to an array of class sessions.
 */
export async function getClassSessions(userId: string): Promise<ClassSession[]> {
  return infraGetClassSessions(userId);
}

/**
 * Adds a class session.
 *
 * @param data - The data for the new class session.
 * @returns A promise that resolves to the added class session.
 */
export async function addClassSession(data: ClassSessionInsert): Promise<ClassSession> {
  return infraAddClassSession(data);
}

/**
 * Updates a class session.
 *
 * @param id - The ID of the class session to update.
 * @param data - The update data for the class session.
 * @returns A promise that resolves to the updated class session.
 */
export async function updateClassSession(id: string, data: ClassSessionUpdate): Promise<ClassSession> {
  return infraUpdateClassSession(id, data);
}

/**
 * Removes a class session.
 *
 * @param id - The ID of the class session to remove.
 */
export async function removeClassSession(id: string): Promise<void> {
  return infraRemoveClassSession(id);
}