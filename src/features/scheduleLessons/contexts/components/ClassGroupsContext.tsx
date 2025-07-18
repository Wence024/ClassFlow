import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ClassGroup } from '../../types/scheduleLessons';
import * as classGroupsService from '../../services/classGroupsService';

// Context for managing class groups state and CRUD operations.
// TODO: Support multi-user (sync with backend, not just localStorage).
// TODO: Add aggregation/stats for class groups.
export interface ClassGroupsContextType {
  classGroups: ClassGroup[];
  addClassGroup: (data: Omit<ClassGroup, 'id'>) => void;
  updateClassGroup: (id: string, data: Omit<ClassGroup, 'id'>) => void;
  removeClassGroup: (id: string) => void;
}

export const ClassGroupsContext = createContext<ClassGroupsContextType | undefined>(undefined);

export const ClassGroupsProvider = ({ children }: { children: ReactNode }) => {
  const [classGroups, setClassGroups] = useState<ClassGroup[]>(() =>
    classGroupsService.getClassGroups()
  );

  useEffect(() => {
    classGroupsService.setClassGroups(classGroups);
  }, [classGroups]);

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

  return (
    <ClassGroupsContext.Provider
      value={{ classGroups, addClassGroup, updateClassGroup, removeClassGroup }}
    >
      {children}
    </ClassGroupsContext.Provider>
  );
};
