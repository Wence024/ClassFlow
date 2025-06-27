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