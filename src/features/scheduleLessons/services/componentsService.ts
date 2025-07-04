import type { Course, ClassGroup, Classroom, Instructor } from '../types/classSessions';

export function getCourses(): Course[] {
  const stored = localStorage.getItem('courses');
  return stored ? JSON.parse(stored) : [];
}
export function setCourses(courses: Course[]): void {
  localStorage.setItem('courses', JSON.stringify(courses));
}

export function getClassGroups(): ClassGroup[] {
  const stored = localStorage.getItem('classGroups');
  return stored ? JSON.parse(stored) : [];
}
export function setClassGroups(groups: ClassGroup[]): void {
  localStorage.setItem('classGroups', JSON.stringify(groups));
}

export function getClassrooms(): Classroom[] {
  const stored = localStorage.getItem('classrooms');
  return stored ? JSON.parse(stored) : [];
}
export function setClassrooms(classrooms: Classroom[]): void {
  localStorage.setItem('classrooms', JSON.stringify(classrooms));
}

export function getInstructors(): Instructor[] {
  const stored = localStorage.getItem('instructors');
  return stored ? JSON.parse(stored) : [];
}
export function setInstructors(instructors: Instructor[]): void {
  localStorage.setItem('instructors', JSON.stringify(instructors));
}
