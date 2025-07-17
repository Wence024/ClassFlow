/**
 * Service for managing instructors in localStorage.
 *
 * Responsibilities:
 * - Abstracts all localStorage access for instructors
 * - Provides CRUD operations (create, read, update, delete)
 * - Handles ID generation and data persistence
 */
import type { Instructor } from '../types/scheduleLessons';

/** Get all instructors from localStorage. */
export function getInstructors(): Instructor[] {
  const stored = localStorage.getItem('instructors');
  return stored ? JSON.parse(stored) : [];
}
/** Save all instructors to localStorage. */
export function setInstructors(instructors: Instructor[]): void {
  localStorage.setItem('instructors', JSON.stringify(instructors));
}
/**
 * Add a new instructor and save to localStorage.
 * @param data - Instructor data without id
 * @returns The new Instructor
 */
export function addInstructor(data: Omit<Instructor, 'id'>): Instructor {
  const instructors = getInstructors();
  const newId = instructors.length ? Math.max(...instructors.map((i) => i.id)) + 1 : 1;
  const newInstructor: Instructor = { ...data, id: newId };
  setInstructors([...instructors, newInstructor]);
  return newInstructor;
}
/**
 * Update an existing instructor by id.
 * @param updated - Instructor with updated data
 * @returns Updated array of Instructor
 */
export function updateInstructor(updated: Instructor): Instructor[] {
  const instructors = getInstructors();
  const next = instructors.map((i) => (i.id === updated.id ? updated : i));
  setInstructors(next);
  return next;
}
/**
 * Remove an instructor by id.
 * @param id - ID of the instructor to remove
 * @returns Updated array of Instructor
 */
export function removeInstructor(id: number): Instructor[] {
  const instructors = getInstructors();
  const next = instructors.filter((i) => i.id !== id);
  setInstructors(next);
  return next;
}
