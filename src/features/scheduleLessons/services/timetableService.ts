import type { ClassSession, ClassGroup } from '../types/scheduleLessons';

const TIMETABLE_KEY = 'timetable';
const TIMETABLE_VERSION_KEY = 'timetable_version';
const CURRENT_DATA_VERSION = 2; // 1: old array[][], 2: new Map-like [id, sessions[]][]

// The data format we store in localStorage
export type StoredTimetable = [string, (ClassSession | null)[]][];

/**
 * Migrates the old array-based timetable data to the new Map-compatible format.
 * @param oldData The old timetable data, expected to be (ClassSession | null)[][]
 * @param classGroups The current list of class groups to map indices to IDs.
 * @returns The migrated data in the new StoredTimetable format.
 */
const migrateV1ToV2 = (oldData: unknown, classGroups: ClassGroup[]): StoredTimetable => {
  // Ensure oldData is in the expected format before trying to migrate
  if (!Array.isArray(oldData) || (oldData.length > 0 && !Array.isArray(oldData[0]))) {
    console.error('Old timetable data is not in the expected format. Cannot migrate.');
    return [];
  }

  console.log('Migrating timetable data from v1 to v2...');
  return classGroups.map((group, index) => {
    const rowData = (oldData as (ClassSession | null)[][])[index] || [];
    return [group.id, rowData];
  });
};

/**
 * Retrieves timetable data from localStorage, performing migration if necessary.
 * @param classGroups The current list of class groups, required for migration.
 * @returns The timetable data in the current, valid format.
 */
export const getTimetable = (classGroups: ClassGroup[]): StoredTimetable => {
  try {
    const storedVersion = parseInt(localStorage.getItem(TIMETABLE_VERSION_KEY) || '1', 10);
    const dataStr = localStorage.getItem(TIMETABLE_KEY);

    if (!dataStr) return [];

    const data = JSON.parse(dataStr);

    if (storedVersion < CURRENT_DATA_VERSION) {
      const migratedData = migrateV1ToV2(data, classGroups);
      setTimetable(migratedData); // Persist the migrated data immediately
      return migratedData;
    }

    return data;
  } catch (error) {
    console.error('Error reading timetable from localStorage', error);
    localStorage.removeItem(TIMETABLE_KEY);
    localStorage.removeItem(TIMETABLE_VERSION_KEY);
    return [];
  }
};

/**
 * Saves the timetable data to localStorage, tagging it with the current version.
 */
export const setTimetable = (timetable: StoredTimetable): void => {
  localStorage.setItem(TIMETABLE_KEY, JSON.stringify(timetable));
  localStorage.setItem(TIMETABLE_VERSION_KEY, String(CURRENT_DATA_VERSION));
};
