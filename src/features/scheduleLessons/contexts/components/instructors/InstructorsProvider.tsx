import type { ReactNode } from 'react';
import type { Instructor, InstructorInsert, InstructorUpdate } from '../../../types/instructor';
import * as instructorsService from '../../../services/instructorsService';
import { InstructorsContext } from './InstructorsContext';
import { useAuth } from '../../../../auth/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Defines the shape of the context provided by InstructorsProvider.
 * @property instructors - An array of instructor objects for the current user.
 * @property loading - A boolean indicating if an operation is in progress.
 * @property error - A string containing an error message if an operation failed, otherwise null.
 * @property addInstructor - Function to add a new instructor.
 * @property updateInstructor - Function to update an existing instructor.
 * @property removeInstructor - Function to remove an instructor.
 */
export interface InstructorsContextType {
  instructors: Instructor[];
  loading: boolean;
  error: string | null;
  addInstructor: (data: InstructorInsert) => Promise<Instructor>;
  updateInstructor: (id: string, data: InstructorUpdate) => Promise<Instructor>;
  removeInstructor: (id: string) => Promise<void>;
}

/**
 * Provides instructor-related state and CRUD operations to its children.
 * It handles fetching data from the `instructorsService`, manages loading and error states,
 * and exposes functions to add, update, and remove instructors.
 *
 * @param {object} props - The component props.
 * @param {ReactNode} props.children - The child components that will consume the context.
 */
export const InstructorsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: instructors = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['instructors', user?.id],
    queryFn: () => (user ? instructorsService.getInstructors(user.id) : Promise.resolve([])),
    enabled: !!user,
  });

  /**
   * Adds a new instructor to the database and updates the local state.
   * It constructs the full `InstructorInsert` object with the current user's ID.
   * @param data - The instructor data to be added, excluding `id` and `user_id`.
   * @returns A promise that resolves when the operation is complete.
   */
  const addInstructorMutation = useMutation({
    mutationFn: (data: InstructorInsert) =>
      instructorsService.addInstructor({ ...data, user_id: user!.id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['Instructors', user?.id] }),
  });
  const addInstructor = (data: InstructorInsert) => addInstructorMutation.mutateAsync(data);

  /**
   * Updates an existing instructor in the database and updates the local state.
   * @param id - The ID of the instructor to update.
   * @param data - An object containing the instructor fields to update.
   * @returns A promise that resolves when the operation is complete.
   */
  const updateInstructorMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: InstructorUpdate }) =>
      instructorsService.updateInstructor(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['Instructors', user?.id] }),
  });
  const updateInstructor = (id: string, data: InstructorUpdate) =>
    updateInstructorMutation.mutateAsync({ id, data });

  /**
   * Removes an instructor from the database and updates the local state.
   * @param id - The ID of the instructor to remove.
   * @returns A promise that resolves when the operation is complete.
   */
  const removeInstructorMutation = useMutation({
      mutationFn: (id: string) => instructorsService.removeInstructor(id, user!.id),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['Instructors', user?.id] }),
    });
    const removeInstructor = (id: string) => removeInstructorMutation.mutateAsync(id);

  return (
    <InstructorsContext.Provider
      value={{
        instructors,
        loading,
        error: error ? (error as Error).message : null,
        addInstructor,
        updateInstructor,
        removeInstructor,
      }}
    >
      {children}
    </InstructorsContext.Provider>
  );
};
