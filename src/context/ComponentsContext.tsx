import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Course, ClassGroup, Classroom, Instructor } from '../types/classSessions';
import type { ComponentsContextType } from './types';
import { apiCourses } from '../api/courses';
import { apiClassGroups } from '../api/classGroups';
import { apiClassrooms } from '../api/classrooms';
import { apiInstructors } from '../api/instructors';

const ComponentsContext = createContext<ComponentsContextType>(undefined);

export const useComponents = () => {
  const ctx = useContext(ComponentsContext);
  if (!ctx) throw new Error('useComponents must be used within a ComponentsProvider');
  return ctx;
};

export const ComponentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [classGroups, setClassGroups] = useState<ClassGroup[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const [coursesData, classGroupsData, classroomsData, instructorsData] = await Promise.all([
          apiCourses.list(),
          apiClassGroups.list(),
          apiClassrooms.list(),
          apiInstructors.list(),
        ]);
        setCourses(
          coursesData.map((item) => ({
            ...item,
            id: item.id ?? item._id,
          }))
        );
        setClassGroups(
          classGroupsData.map((item) => ({
            ...item,
            id: item.id ?? item._id,
          }))
        );
        setClassrooms(
          classroomsData.map((item) => ({
            ...item,
            id: item.id ?? item._id,
          }))
        );
        setInstructors(
          instructorsData.map((item) => ({
            ...item,
            id: item.id ?? item._id,
          }))
        );
      } catch (err: any) {
        setError(err.message || 'Failed to fetch components');
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  // Optionally, you can wrap set* functions to also call the API for CRUD

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
        loading,
        error,
      }}
    >
      {children}
    </ComponentsContext.Provider>
  );
};
