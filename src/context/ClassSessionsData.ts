export type Course = { id: number; name: string };
export type ClassGroup = { id: number; name: string };
export type Classroom = { id: number; name: string };
export type Instructor = { id: number; name: string };

export type ClassSession = {
  id: number;
  course: Course;
  group: ClassGroup;
  instructor: Instructor;
  classroom: Classroom;
};

export const courses: Course[] = [
  { id: 1, name: 'Math 101' },
  { id: 2, name: 'Physics 101' },
  { id: 3, name: 'Chemistry 101' },
];
export const classGroups: ClassGroup[] = [
  { id: 1, name: 'Group 1' },
  { id: 2, name: 'Group 2' },
  { id: 3, name: 'Group 3' },
];
export const classrooms: Classroom[] = [
  { id: 1, name: 'Room A' },
  { id: 2, name: 'Room B' },
  { id: 3, name: 'Room C' },
];
export const instructors: Instructor[] = [
  { id: 1, name: 'Prof. A' },
  { id: 2, name: 'Prof. B' },
  { id: 3, name: 'Prof. C' },
]; 