export type Course = { id: string; name: string; code: string };
export type ClassGroup = { id: string; name: string };
export type Classroom = { id: string; name: string; location: string };
export type Instructor = { id: string; name: string; email: string };

export type ClassSession = {
  id: string;
  course: Course;
  group: ClassGroup;
  instructor: Instructor;
  classroom: Classroom;
};
