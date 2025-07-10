import React, { createContext, useContext, useState, useEffect } from "react";
import type { Course, ClassGroup, Classroom, Instructor } from "../types/classSessions";

// Utility to load from localStorage or fallback to empty array
function loadOrDefault<T>(key: string): T {
  try {
    const data = localStorage.getItem(key);
    if (data) return JSON.parse(data);
  } catch {}
  return [] as unknown as T;
}

interface ComponentsContextType {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  classGroups: ClassGroup[];
  setClassGroups: React.Dispatch<React.SetStateAction<ClassGroup[]>>;
  classrooms: Classroom[];
  setClassrooms: React.Dispatch<React.SetStateAction<Classroom[]>>;
  instructors: Instructor[];
  setInstructors: React.Dispatch<React.SetStateAction<Instructor[]>>;
}

const ComponentsContext = createContext<ComponentsContextType | undefined>(undefined);

export const useComponents = () => {
  const ctx = useContext(ComponentsContext);
  if (!ctx) throw new Error("useComponents must be used within a ComponentsProvider");
  return ctx;
};

export const ComponentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>(() => loadOrDefault<Course[]>("courses"));
  const [classGroups, setClassGroups] = useState<ClassGroup[]>(() => loadOrDefault<ClassGroup[]>("classGroups"));
  const [classrooms, setClassrooms] = useState<Classroom[]>(() => loadOrDefault<Classroom[]>("classrooms"));
  const [instructors, setInstructors] = useState<Instructor[]>(() => loadOrDefault<Instructor[]>("instructors"));

  useEffect(() => { localStorage.setItem('courses', JSON.stringify(courses)); }, [courses]);
  useEffect(() => { localStorage.setItem('classGroups', JSON.stringify(classGroups)); }, [classGroups]);
  useEffect(() => { localStorage.setItem('classrooms', JSON.stringify(classrooms)); }, [classrooms]);
  useEffect(() => { localStorage.setItem('instructors', JSON.stringify(instructors)); }, [instructors]);

  return (
    <ComponentsContext.Provider value={{ courses, setCourses, classGroups, setClassGroups, classrooms, setClassrooms, instructors, setInstructors }}>
      {children}
    </ComponentsContext.Provider>
  );
};
