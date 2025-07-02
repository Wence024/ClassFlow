import type { ClassGroup, Classroom, ClassSession, Course, Instructor } from '../types/classSessions';

export type ClassSessionsContextType = {
  classSessions: ClassSession[];
  setClassSessions: React.Dispatch<React.SetStateAction<ClassSession[]>>;
} | undefined;

export type ComponentsContextType = {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  classGroups: ClassGroup[];
  setClassGroups: React.Dispatch<React.SetStateAction<ClassGroup[]>>;
  classrooms: Classroom[];
  setClassrooms: React.Dispatch<React.SetStateAction<Classroom[]>>;
  instructors: Instructor[];
  setInstructors: React.Dispatch<React.SetStateAction<Instructor[]>>;
} | undefined;

export type TimetableContextType = {
  timetable: (ClassSession | null)[][];
  setTimetable: React.Dispatch<React.SetStateAction<(ClassSession | null)[][]>>;
} | undefined;