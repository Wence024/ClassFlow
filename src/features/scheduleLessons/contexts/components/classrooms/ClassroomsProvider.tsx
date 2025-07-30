import type { ReactNode } from 'react';
import type { Classroom, ClassroomInsert, ClassroomUpdate } from '../../../types/classroom';
import * as classroomsService from '../../../services/classroomsService';
import { ClassroomsContext } from './ClassroomsContext';
import { useAuth } from '../../../../auth/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Defines the shape of the context provided by ClassroomsProvider.
 * @property classrooms - An array of classroom objects for the current user.
 * @property loading - A boolean indicating if an operation is in progress.
 * @property error - A string containing an error message if an operation failed, otherwise null.
 * @property addClassroom - Function to add a new classroom.
 * @property updateClassroom - Function to update an existing classroom.
 * @property removeClassroom - Function to remove a classroom.
 */
export interface ClassroomsContextType {
  classrooms: Classroom[];
  loading: boolean;
  error: string | null;
  addClassroom: (data: ClassroomInsert) => Promise<Classroom>;
  updateClassroom: (id: string, data: ClassroomUpdate) => Promise<Classroom>;
  removeClassroom: (id: string) => Promise<void>;
}

/**
 * Provides classroom-related state and CRUD operations to its children.
 * It handles fetching data from the `classroomsService`, manages loading and error states,
 * and exposes functions to add, update, and remove classrooms.
 *
 * @param {object} props - The component props.
 * @param {ReactNode} props.children - The child components that will consume the context.
 */
export const ClassroomsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: classrooms = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['classrooms', user?.id],
    queryFn: () => (user ? classroomsService.getClassrooms(user.id) : Promise.resolve([])),
    enabled: !!user,
  });

  /**
   * Adds a new classroom to the database and updates the local state.
   * It constructs the full `ClassroomInsert` object with the current user's ID.
   * @param data - The classroom data to be added, excluding `id` and `user_id`.
   * @returns A promise that resolves when the operation is complete.
   */
  const addClassroomMutation = useMutation({
    mutationFn: (data: ClassroomInsert) =>
      classroomsService.addClassroom({ ...data, user_id: user!.id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['classrooms', user?.id] }),
  });
  const addClassroom = (data: ClassroomInsert) => addClassroomMutation.mutateAsync(data);

  /**
   * Updates an existing classroom in the database and updates the local state.
   * @param id - The ID of the classroom to update.
   * @param data - An object containing the classroom fields to update.
   * @returns A promise that resolves when the operation is complete.
   */
  const updateClassroomMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ClassroomUpdate }) =>
      classroomsService.updateClassroom(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['classrooms', user?.id] }),
  });
  const updateClassroom = (id: string, data: ClassroomUpdate) =>
    updateClassroomMutation.mutateAsync({ id, data });

  /**
   * Removes a classroom from the database and updates the local state.
   * @param id - The ID of the classroom to remove.
   * @returns A promise that resolves when the operation is complete.
   */
  const removeClassroomMutation = useMutation({
    mutationFn: (id: string) => classroomsService.removeClassroom(id, user!.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['classrooms', user?.id] }),
  });
  const removeClassroom = (id: string) => removeClassroomMutation.mutateAsync(id);

  return (
    <ClassroomsContext.Provider
      value={{
        classrooms,
        loading,
        error: error ? (error as Error).message : null,
        addClassroom,
        updateClassroom,
        removeClassroom,
      }}
    >
      {children}
    </ClassroomsContext.Provider>
  );
};
