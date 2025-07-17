import { v4 as uuidv4 } from 'uuid';

/**
 * Service for managing class groups in localStorage.
 *
 * Responsibilities:
 * - Abstracts all localStorage access for class groups
 * - Provides CRUD operations (create, read, update, delete)
 * - Handles ID generation and data persistence
 */
import type { ClassGroup } from '../types/scheduleLessons';

/** Get all class groups from localStorage. */
export function getClassGroups(): ClassGroup[] {
  const stored = localStorage.getItem('classGroups');
  return stored ? JSON.parse(stored) : [];
}
/** Save all class groups to localStorage. */
export function setClassGroups(groups: ClassGroup[]): void {
  localStorage.setItem('classGroups', JSON.stringify(groups));
}
/**
 * Add a new class group and save to localStorage.
 * @param data - ClassGroup data without id
 * @returns The new ClassGroup
 */
export function addClassGroup(data: Omit<ClassGroup, 'id'>): ClassGroup {
  const groups = getClassGroups();
  const newGroup: ClassGroup = { ...data, id: uuidv4() };
  setClassGroups([...groups, newGroup]);
  return newGroup;
}
/**
 * Update an existing class group by id.
 * @param updated - ClassGroup with updated data
 * @returns Updated array of ClassGroup
 */
export function updateClassGroup(updated: ClassGroup): ClassGroup[] {
  const groups = getClassGroups();
  const next = groups.map((g) => (g.id === updated.id ? updated : g));
  setClassGroups(next);
  return next;
}
/**
 * Remove a class group by id.
 * @param id - ID of the group to remove
 * @returns Updated array of ClassGroup
 */
export function removeClassGroup(id: number): ClassGroup[] {
  const groups = getClassGroups();
  const next = groups.filter((g) => g.id !== id);
  setClassGroups(next);
  return next;
}
