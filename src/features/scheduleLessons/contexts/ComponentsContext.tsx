import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Course, ClassGroup, Classroom, Instructor } from '../types/classSessions';
import * as componentsService from '../oldServices/componentsService';

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
  if (!ctx) throw new Error('useComponents must be used within a ComponentsProvider');
  return ctx;
};

export const ComponentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>(() => componentsService.getCourses());
  const [classGroups, setClassGroups] = useState<ClassGroup[]>(() =>
    componentsService.getClassGroups()
  );
  const [classrooms, setClassrooms] = useState<Classroom[]>(() =>
    componentsService.getClassrooms()
  );
  const [instructors, setInstructors] = useState<Instructor[]>(() =>
    componentsService.getInstructors()
  );

  useEffect(() => {
    componentsService.setCourses(courses);
  }, [courses]);
  useEffect(() => {
    componentsService.setClassGroups(classGroups);
  }, [classGroups]);
  useEffect(() => {
    componentsService.setClassrooms(classrooms);
  }, [classrooms]);
  useEffect(() => {
    componentsService.setInstructors(instructors);
  }, [instructors]);

  return (
    <ComponentsContext.Provider
      value={{
        courses,
        setCourses,
        classGroups,
        setClassGroups,
        classrooms,
        setClassrooms,
        instructors,
        setInstructors,
      }}
    >
      {children}
    </ComponentsContext.Provider>
  );
};
