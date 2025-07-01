import React, { createContext, useContext } from "react";
import type { Course, ClassGroup, Classroom, Instructor } from "../types/classSessions";
import { usePersistentState } from "../hooks/usePersistentState";

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
  const [courses, setCourses] = usePersistentState<Course[]>("courses", []);
  const [classGroups, setClassGroups] = usePersistentState<ClassGroup[]>("classGroups", []);
  const [classrooms, setClassrooms] = usePersistentState<Classroom[]>("classrooms", []);
  const [instructors, setInstructors] = usePersistentState<Instructor[]>("instructors", []);

  return (
    <ComponentsContext.Provider 
      value={{ 
        courses, setCourses,
        classGroups, setClassGroups,
        classrooms, setClassrooms,
        instructors, setInstructors
      }}
    >
      {children}
    </ComponentsContext.Provider>
  );
};