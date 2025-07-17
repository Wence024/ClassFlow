import { v4 as uuidv4 } from 'uuid';

/**
 * Service for managing classrooms in localStorage.
 *
 * Responsibilities:
 * - Abstracts all localStorage access for classrooms
 * - Provides CRUD operations (create, read, update, delete)
 * - Handles ID generation and data persistence
 */
import type { Classroom } from '../types/scheduleLessons';

/** Get all classrooms from localStorage. */
export function getClassrooms(): Classroom[] {
  const stored = localStorage.getItem('classrooms');
  return stored ? JSON.parse(stored) : [];
}
/** Save all classrooms to localStorage. */
export function setClassrooms(classrooms: Classroom[]): void {
  localStorage.setItem('classrooms', JSON.stringify(classrooms));
}
/**
 * Add a new classroom and save to localStorage.
 * @param data - Classroom data without id
 * @returns The new Classroom
 */
export function addClassroom(data: Omit<Classroom, 'id'>): Classroom {
  const rooms = getClassrooms();
  const newRoom: Classroom = { ...data, id: uuidv4() };
  setClassrooms([...rooms, newRoom]);
  return newRoom;
}
/**
 * Update an existing classroom by id.
 * @param updated - Classroom with updated data
 * @returns Updated array of Classroom
 */
export function updateClassroom(updated: Classroom): Classroom[] {
  const rooms = getClassrooms();
  const next = rooms.map((r) => (r.id === updated.id ? updated : r));
  setClassrooms(next);
  return next;
}
/**
 * Remove a classroom by id.
 * @param id - ID of the classroom to remove
 * @returns Updated array of Classroom
 */
export function removeClassroom(id: number): Classroom[] {
  const rooms = getClassrooms();
  const next = rooms.filter((r) => r.id !== id);
  setClassrooms(next);
  return next;
}
