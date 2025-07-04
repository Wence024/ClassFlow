import type { ClassSession } from '../types/classSessions';

const TIMETABLE_KEY = 'timetable';
const GROUPS = ['Group 1', 'Group 2', 'Group 3', 'Group 4'];
const defaultTimetable: (ClassSession | null)[][] = Array.from({ length: GROUPS.length }, () =>
  Array(16).fill(null)
);

export function getTimetable(): (ClassSession | null)[][] {
  const stored = localStorage.getItem(TIMETABLE_KEY);
  return stored ? JSON.parse(stored) : defaultTimetable;
}

export function setTimetable(timetable: (ClassSession | null)[][]): void {
  localStorage.setItem(TIMETABLE_KEY, JSON.stringify(timetable));
}
