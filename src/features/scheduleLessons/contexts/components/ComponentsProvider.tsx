// Context for managing all component entities (courses, groups, classrooms, instructors).
// All CRUD logic is delegated to the respective service modules for maintainability.
//
// TODO: Support multi-user (sync with backend, not just localStorage).
// TODO: Add aggregated views (e.g., show stats or summaries of components).
import React, { useState, useEffect } from 'react';
import type { Course, ClassGroup, Classroom, Instructor } from '../../types/scheduleLessons';
import * as coursesService from '../../services/coursesService';
import * as classGroupsService from '../../services/classGroupsService';
import * as classroomsService from '../../services/classroomsService';
import * as instructorsService from '../../services/instructorsService';
import { ComponentsContext } from './ComponentsContext';

export interface ManagementContextType {
  courses: Course[];
  classGroups: ClassGroup[];
  classrooms: Classroom[];
  instructors: Instructor[];
  addCourse: (data: Omit<Course, 'id'>) => void;
  updateCourse: (id: string, data: Omit<Course, 'id'>) => void;
  removeCourse: (id: string) => void;
  addClassGroup: (data: Omit<ClassGroup, 'id'>) => void;
  updateClassGroup: (id: string, data: Omit<ClassGroup, 'id'>) => void;
  removeClassGroup: (id: string) => void;
  addClassroom: (data: Omit<Classroom, 'id'>) => void;
  updateClassroom: (id: string, data: Omit<Classroom, 'id'>) => void;
  removeClassroom: (id: string) => void;
  addInstructor: (data: Omit<Instructor, 'id'>) => void;
  updateInstructor: (id: string, data: Omit<Instructor, 'id'>) => void;
  removeInstructor: (id: string) => void;
}

export const ComponentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State is initialized from localStorage via the service.
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

  // Persist state to localStorage on every change.
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

  // CRUD for courses
  const addCourse = (data: Omit<Course, 'id'>) => {
    const newCourse = coursesService.addCourse(data);
    setCourses((prev) => [...prev, newCourse]);
  };
  const updateCourse = (id: string, data: Omit<Course, 'id'>) => {
    const updatedCourse = { id, ...data };
    const updatedList = coursesService.updateCourse(updatedCourse);
    setCourses(updatedList);
  };
  const removeCourse = (id: string) => {
    const updatedList = coursesService.removeCourse(id);
    setCourses(updatedList);
  };

  // CRUD for classGroups
  const addClassGroup = (data: Omit<ClassGroup, 'id'>) => {
    const newGroup = classGroupsService.addClassGroup(data);
    setClassGroups((prev) => [...prev, newGroup]);
  };
  const updateClassGroup = (id: string, data: Omit<ClassGroup, 'id'>) => {
    const updatedGroup = { id, ...data };
    const updatedList = classGroupsService.updateClassGroup(updatedGroup);
    setClassGroups(updatedList);
  };
  const removeClassGroup = (id: string) => {
    const updatedList = classGroupsService.removeClassGroup(id);
    setClassGroups(updatedList);
  };

  // CRUD for classrooms
  const addClassroom = (data: Omit<Classroom, 'id'>) => {
    const newClassroom = classroomsService.addClassroom(data);
    setClassrooms((prev) => [...prev, newClassroom]);
  };
  const updateClassroom = (id: string, data: Omit<Classroom, 'id'>) => {
    const updatedClassroom = { id, ...data };
    const updatedList = classroomsService.updateClassroom(updatedClassroom);
    setClassrooms(updatedList);
  };
  const removeClassroom = (id: string) => {
    const updatedList = classroomsService.removeClassroom(id);
    setClassrooms(updatedList);
  };

  // CRUD for instructors
  const addInstructor = (data: Omit<Instructor, 'id'>) => {
    const newInstructor = instructorsService.addInstructor(data);
    setInstructors((prev) => [...prev, newInstructor]);
  };
  const updateInstructor = (id: string, data: Omit<Instructor, 'id'>) => {
    const updatedInstructor = { id, ...data };
    const updatedList = instructorsService.updateInstructor(updatedInstructor);
    setInstructors(updatedList);
  };
  const removeInstructor = (id: string) => {
    const updatedList = instructorsService.removeInstructor(id);
    setInstructors(updatedList);
  };

  return (
    <ComponentsContext.Provider
      value={{
        courses,
        classGroups,
        classrooms,
        instructors,
        addCourse,
        updateCourse,
        removeCourse,
        addClassGroup,
        updateClassGroup,
        removeClassGroup,
        addClassroom,
        updateClassroom,
        removeClassroom,
        addInstructor,
        updateInstructor,
        removeInstructor,
      }}
    >
      {children}
    </ComponentsContext.Provider>
  );
};
