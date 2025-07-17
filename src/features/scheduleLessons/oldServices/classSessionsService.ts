/**
 * Service for managing class sessions in localStorage.
 */
import type { ClassSession } from '../types/classSessions';

const STORAGE_KEY = 'classSessions';

/**
 * Get all class sessions from localStorage.
 * @returns Array of ClassSession
 */
export function getClassSessions(): ClassSession[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

/**
 * Save all class sessions to localStorage.
 * @param sessions - Array of ClassSession
 */
export function setClassSessions(sessions: ClassSession[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}
