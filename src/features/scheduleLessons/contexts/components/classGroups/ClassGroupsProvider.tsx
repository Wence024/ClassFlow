import type { ReactNode } from 'react';
import type { ClassGroup, ClassGroupInsert, ClassGroupUpdate } from '../../../types/classGroup';
import * as classGroupsService from '../../../services/classGroupsService';
import { ClassGroupsContext } from './ClassGroupsContext';
import { useAuth } from '../../../../auth/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Provides class group-related state and CRUD operations to its children.
 * It handles fetching data from the `classGroupsService`, manages loading and error states,
 * and exposes functions to add, update, and remove class groups.
 *
 * @param {object} props - The component props.
 * @param {ReactNode} props.children - The child components that will consume the context.
 */
export interface ClassGroupsContextType {
  classGroups: ClassGroup[];
  loading: boolean;
  error: string | null;
  addClassGroup: (data: ClassGroupInsert) => Promise<ClassGroup>;
  updateClassGroup: (id: string, data: ClassGroupUpdate) => Promise<ClassGroup>;
  removeClassGroup: (id: string) => Promise<void>;
}

export const ClassGroupsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: classGroups = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['classGroups', user?.id],
    queryFn: () => (user ? classGroupsService.getClassGroups(user.id) : Promise.resolve([])),
    enabled: !!user,
  });

  /**
   * Adds a new class group to the database and updates the local state.
   * It constructs the full `ClassGroupInsert` object with the current user's ID.
   * @param data - The class group data to be added, excluding `id` and `user_id`.
   * @returns A promise that resolves when the operation is complete.
   */
  const addClassGroupMutation = useMutation({
    mutationFn: (data: ClassGroupInsert) =>
      classGroupsService.addClassGroup({ ...data, user_id: user!.id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['classGroups', user?.id] }),
  });
  const addClassGroup = (data: ClassGroupInsert) => addClassGroupMutation.mutateAsync(data);

  /**
   * Updates an existing class group in the database and updates the local state.
   * @param id - The ID of the class group to update.
   * @param data - The updated class group data.
   * @returns A promise that resolves when the operation is complete.
   */
  const updateClassGroupMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ClassGroupUpdate }) =>
      classGroupsService.updateClassGroup(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['classGroups', user?.id] }),
  });
  const updateClassGroup = (id: string, data: ClassGroupUpdate) =>
    updateClassGroupMutation.mutateAsync({ id, data });

  /**
   * Removes a class group from the database and updates the local state.
   * @param id - The ID of the class group to remove.
   * @returns A promise that resolves when the operation is complete.
   */
  const removeClassGroupMutation = useMutation({
    mutationFn: (id: string) => classGroupsService.removeClassGroup(id, user!.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['classGroups', user?.id] }),
  });
  const removeClassGroup = (id: string) => removeClassGroupMutation.mutateAsync(id);

  return (
    <ClassGroupsContext.Provider
      value={{
        classGroups,
        loading,
        error: error ? (error as Error).message : null,
        addClassGroup,
        updateClassGroup,
        removeClassGroup,
      }}
    >
      {children}
    </ClassGroupsContext.Provider>
  );
};
