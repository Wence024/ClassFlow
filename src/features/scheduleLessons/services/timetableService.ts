/**
 * Service for managing the timetable in localStorage.
 */
import type { ClassSession } from '../types/classSessions';

const TIMETABLE_KEY = 'timetable';
const GROUPS = ['Group 1', 'Group 2', 'Group 3', 'Group 4'];
const defaultTimetable: (ClassSession | null)[][] = Array.from({ length: GROUPS.length }, () =>
  Array(16).fill(null)
);

/**
 * Get the timetable from localStorage, or return the default timetable.
 * @returns 2D array of ClassSession or null
 */
export function getTimetable(): (ClassSession | null)[][] {
  const stored = localStorage.getItem(TIMETABLE_KEY);
  return stored ? JSON.parse(stored) : defaultTimetable;
}

/**
 * Save the timetable to localStorage.
 * @param timetable - 2D array of ClassSession or null
 */
export function setTimetable(timetable: (ClassSession | null)[][]): void {
  localStorage.setItem(TIMETABLE_KEY, JSON.stringify(timetable));
}
