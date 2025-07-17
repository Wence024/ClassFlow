/**
 * Service for managing courses in localStorage.
 *
 * Responsibilities:
 * - Abstracts all localStorage access for courses
 * - Provides CRUD operations (create, read, update, delete)
 * - Handles ID generation and data persistence
 */
import type { Course } from '../types/scheduleLessons';

/** Get all courses from localStorage. */
export function getCourses(): Course[] {
  const stored = localStorage.getItem('courses');
  return stored ? JSON.parse(stored) : [];
}
/** Save all courses to localStorage. */
export function setCourses(courses: Course[]): void {
  localStorage.setItem('courses', JSON.stringify(courses));
}
/**
 * Add a new course and save to localStorage.
 * @param courseData - Course data without id
 * @returns The new Course
 */
export function addCourse(courseData: Omit<Course, 'id'>): Course {
  const courses = getCourses();
  const newId = courses.length ? Math.max(...courses.map((c) => c.id)) + 1 : 1;
  const newCourse: Course = { ...courseData, id: newId };
  setCourses([...courses, newCourse]);
  return newCourse;
}
/**
 * Update an existing course by id.
 * @param updated - Course with updated data
 * @returns Updated array of Course
 */
export function updateCourse(updated: Course): Course[] {
  const courses = getCourses();
  const next = courses.map((c) => (c.id === updated.id ? updated : c));
  setCourses(next);
  return next;
}
/**
 * Remove a course by id.
 * @param id - ID of the course to remove
 * @returns Updated array of Course
 */
export function removeCourse(id: number): Course[] {
  const courses = getCourses();
  const next = courses.filter((c) => c.id !== id);
  setCourses(next);
  return next;
}
