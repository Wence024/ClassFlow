import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Instructor } from '../../types/scheduleLessons';
import * as instructorsService from '../../services/instructorsService';

// Context for managing instructors state and CRUD operations.
// TODO: Support multi-user (sync with backend, not just localStorage).
// TODO: Add aggregation/stats for instructors.
export interface InstructorsContextType {
  instructors: Instructor[];
  addInstructor: (data: Omit<Instructor, 'id'>) => void;
  updateInstructor: (id: string, data: Omit<Instructor, 'id'>) => void;
  removeInstructor: (id: string) => void;
}

export const InstructorsContext = createContext<InstructorsContextType | undefined>(undefined);

export const InstructorsProvider = ({ children }: { children: ReactNode }) => {
  const [instructors, setInstructors] = useState<Instructor[]>(() =>
    instructorsService.getInstructors()
  );

  useEffect(() => {
    instructorsService.setInstructors(instructors);
  }, [instructors]);

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
    <InstructorsContext.Provider
      value={{ instructors, addInstructor, updateInstructor, removeInstructor }}
    >
      {children}
    </InstructorsContext.Provider>
  );
};
