/**
 * Service for managing class sessions in localStorage.
 *
 * Responsibilities:
 * - Abstracts all localStorage access for class sessions
 * - Provides CRUD operations (create, read, update, delete)
 * - Handles ID generation and data persistence
 */
import type { ClassSession } from '../types/scheduleLessons';

const STORAGE_KEY = 'classSessions';

/**
 * Get all class sessions from localStorage.
 * @returns Array of ClassSession
 *
 * Reads and parses the stored array, or returns an empty array if none found.
 */
export function getClassSessions(): ClassSession[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

/**
 * Save all class sessions to localStorage.
 * @param sessions - Array of ClassSession
 *
 * Overwrites the entire stored array with the new data.
 */
export function setClassSessions(sessions: ClassSession[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

/**
 * Add a new class session and save to localStorage.
 * @param sessionData - ClassSession data without id
 * @returns The new ClassSession
 *
 * Generates a unique ID for the new session, appends it to the array, and persists.
 */
export function addClassSession(sessionData: Omit<ClassSession, 'id'>): ClassSession {
  const sessions = getClassSessions();
  const newId = sessions.length ? Math.max(...sessions.map((s) => s.id)) + 1 : 1;
  const newSession: ClassSession = { ...sessionData, id: newId };
  const updated = [...sessions, newSession];
  setClassSessions(updated);
  return newSession;
}

/**
 * Update an existing class session by id.
 * @param updatedSession - ClassSession with updated data
 * @returns Updated array of ClassSession
 *
 * Finds the session by ID and replaces it with the updated data.
 */
export function updateClassSession(updatedSession: ClassSession): ClassSession[] {
  const sessions = getClassSessions();
  const updated = sessions.map((s) => (s.id === updatedSession.id ? updatedSession : s));
  setClassSessions(updated);
  return updated;
}

/**
 * Remove a class session by id.
 * @param id - ID of the session to remove
 * @returns Updated array of ClassSession
 *
 * Filters out the session with the given ID and persists the new array.
 */
export function removeClassSession(id: number): ClassSession[] {
  const sessions = getClassSessions();
  const updated = sessions.filter((s) => s.id !== id);
  setClassSessions(updated);
  return updated;
}
