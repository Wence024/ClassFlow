import type { ClassSession } from '../types/scheduleLessons';

const TIMETABLE_KEY = 'timetable';

// The data is stored as an array of [groupId, sessions[]] tuples for JSON compatibility.
type StoredTimetable = [string, (ClassSession | null)[]][];

/**
 * Retrieves the timetable data from localStorage.
 */
export const getTimetable = (): StoredTimetable => {
  try {
    const data = localStorage.getItem(TIMETABLE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading timetable from localStorage', error);
    return [];
  }
};

/**
 * Saves the timetable data to localStorage.
 */
export const setTimetable = (timetable: StoredTimetable): void => {
  localStorage.setItem(TIMETABLE_KEY, JSON.stringify(timetable));
};

