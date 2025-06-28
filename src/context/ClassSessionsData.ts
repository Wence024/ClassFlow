import type { Course, ClassGroup, Classroom, Instructor } from '../types/classSessions';

export const courses: Course[] = [
  { id: 1, name: 'Math 101', code: 'MTH101' },
  { id: 2, name: 'Physics 101', code: 'PHY101' },
  { id: 3, name: 'Chemistry 101', code: 'CHM101' },
];
export const classGroups: ClassGroup[] = [
  { id: 1, name: 'Group 1' },
  { id: 2, name: 'Group 2' },
  { id: 3, name: 'Group 3' },
];
export const classrooms: Classroom[] = [
  { id: 1, name: 'Room A', location: 'Building 1' },
  { id: 2, name: 'Room B', location: 'Building 2' },
  { id: 3, name: 'Room C', location: 'Building 3' },
];
export const instructors: Instructor[] = [
  { id: 1, name: 'Prof. A', email: 'a@univ.edu' },
  { id: 2, name: 'Prof. B', email: 'b@univ.edu' },
  { id: 3, name: 'Prof. C', email: 'c@univ.edu' },
];