import { useContext } from 'react';
import {
  CoursesContext,
  ClassGroupsContext,
  ClassroomsContext,
  InstructorsContext,
} from '../contexts';

export const useCourses = () => {
  const ctx = useContext(CoursesContext);
  if (!ctx) throw new Error('useCourses must be used within a CoursesProvider');
  return ctx;
};
export const useClassGroups = () => {
  const ctx = useContext(ClassGroupsContext);
  if (!ctx) throw new Error('useClassGroups must be used within a ClassGroupsProvider');
  return ctx;
};
export const useClassrooms = () => {
  const ctx = useContext(ClassroomsContext);
  if (!ctx) throw new Error('useClassrooms must be used within a ClassroomsProvider');
  return ctx;
};
export const useInstructors = () => {
  const ctx = useContext(InstructorsContext);
  if (!ctx) throw new Error('useInstructors must be used within a InstructorsProvider');
  return ctx;
};
