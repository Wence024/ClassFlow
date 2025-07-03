export type Course = { id: number; name: string; code: string };
export type ClassGroup = { id: number; name: string };
export type Classroom = { id: number; name: string; location: string };
export type Instructor = { id: number; name: string; email: string };

export type ClassSession = {
  id: number;
  course: Course;
  group: ClassGroup;
  instructor: Instructor;
  classroom: Classroom;
};
