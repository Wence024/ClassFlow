import type { ClassSession } from '../types/classSessions';

const STORAGE_KEY = 'classSessions';

export function getClassSessions(): ClassSession[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function setClassSessions(sessions: ClassSession[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}
