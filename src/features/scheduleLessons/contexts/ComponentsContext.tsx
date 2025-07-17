import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Course, ClassGroup, Classroom, Instructor } from '../types/scheduleLessons';
import * as coursesService from '../services/coursesService';
import * as classGroupsService from '../services/classGroupsService';
import * as classroomsService from '../services/classroomsService';
import * as instructorsService from '../services/instructorsService';
import type { ComponentsContextType } from '../types/ComponentsContextType';

const ComponentsContext = createContext<ComponentsContextType | undefined>(undefined);

export const useComponents = () => {
  const ctx = useContext(ComponentsContext);
  if (!ctx) throw new Error('useComponents must be used within a ComponentsProvider');
  return ctx;
};

export const ComponentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>(() => coursesService.getCourses());
  const [classGroups, setClassGroups] = useState<ClassGroup[]>(() =>
    classGroupsService.getClassGroups()
  );
  const [classrooms, setClassrooms] = useState<Classroom[]>(() =>
    classroomsService.getClassrooms()
  );
  const [instructors, setInstructors] = useState<Instructor[]>(() =>
    instructorsService.getInstructors()
  );

  useEffect(() => {
    coursesService.setCourses(courses);
  }, [courses]);
  useEffect(() => {
    classGroupsService.setClassGroups(classGroups);
  }, [classGroups]);
  useEffect(() => {
    classroomsService.setClassrooms(classrooms);
  }, [classrooms]);
  useEffect(() => {
    instructorsService.setInstructors(instructors);
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
