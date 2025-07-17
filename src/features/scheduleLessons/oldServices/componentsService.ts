/**
 * Service for managing courses, class groups, classrooms, and instructors in localStorage.
 */
import type { Course, ClassGroup, Classroom, Instructor } from '../types/classSessions';

/** Get all courses from localStorage. */
export function getCourses(): Course[] {
  const stored = localStorage.getItem('courses');
  return stored ? JSON.parse(stored) : [];
}
/** Save all courses to localStorage. */
export function setCourses(courses: Course[]): void {
  localStorage.setItem('courses', JSON.stringify(courses));
}

/** Get all class groups from localStorage. */
export function getClassGroups(): ClassGroup[] {
  const stored = localStorage.getItem('classGroups');
  return stored ? JSON.parse(stored) : [];
}
/** Save all class groups to localStorage. */
export function setClassGroups(groups: ClassGroup[]): void {
  localStorage.setItem('classGroups', JSON.stringify(groups));
}

/** Get all classrooms from localStorage. */
export function getClassrooms(): Classroom[] {
  const stored = localStorage.getItem('classrooms');
  return stored ? JSON.parse(stored) : [];
}
/** Save all classrooms to localStorage. */
export function setClassrooms(classrooms: Classroom[]): void {
  localStorage.setItem('classrooms', JSON.stringify(classrooms));
}

/** Get all instructors from localStorage. */
export function getInstructors(): Instructor[] {
  const stored = localStorage.getItem('instructors');
  return stored ? JSON.parse(stored) : [];
}
/** Save all instructors to localStorage. */
export function setInstructors(instructors: Instructor[]): void {
  localStorage.setItem('instructors', JSON.stringify(instructors));
}
