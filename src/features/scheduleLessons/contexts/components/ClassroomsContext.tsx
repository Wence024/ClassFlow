import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Classroom } from '../../types/scheduleLessons';
import * as classroomsService from '../../services/classroomsService';

// Context for managing classrooms state and CRUD operations.
// TODO: Support multi-user (sync with backend, not just localStorage).
// TODO: Add aggregation/stats for classrooms.
export interface ClassroomsContextType {
  classrooms: Classroom[];
  addClassroom: (data: Omit<Classroom, 'id'>) => void;
  updateClassroom: (id: string, data: Omit<Classroom, 'id'>) => void;
  removeClassroom: (id: string) => void;
}

export const ClassroomsContext = createContext<ClassroomsContextType | undefined>(undefined);

export const ClassroomsProvider = ({ children }: { children: ReactNode }) => {
  const [classrooms, setClassrooms] = useState<Classroom[]>(() =>
    classroomsService.getClassrooms()
  );

  useEffect(() => {
    classroomsService.setClassrooms(classrooms);
  }, [classrooms]);

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

  return (
    <ClassroomsContext.Provider
      value={{ classrooms, addClassroom, updateClassroom, removeClassroom }}
    >
      {children}
    </ClassroomsContext.Provider>
  );
};
