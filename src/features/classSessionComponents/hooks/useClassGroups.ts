import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../auth/hooks/useAuth';
import * as classGroupsService from '../services/classGroupsService';
import type { ClassGroup, ClassGroupInsert, ClassGroupUpdate } from '../types/classGroup';

/**
 * Custom hook to manage class groups data.
 *
 * This hook abstracts the logic for fetching, adding, updating, and removing class groups
 * for the currently authenticated user. It uses React Query for server state management,
 * providing caching, automatic refetching, and mutation handling.
 *
 * @returns An object containing the class groups data, loading and error states, and mutation functions.
 * @example
 * const { classGroups, loading, addClassGroup, removeClassGroup } = useClassGroups();
 *
 * if (loading) return <p>Loading...</p>;
 *
 * return (
 *   <div>
 *     <button onClick={() => addClassGroup({ name: 'New Group' })}>Add Group</button>
 *     <ul>
 *       {classGroups.map(group => (
 *         <li key={group.id}>{group.name}</li>
 *       ))}
 *     </ul>
 *   </div>
 * );
 */
export function useClassGroups() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // The query key is an array that uniquely identifies this query.
  // It includes the user's ID to ensure data is fetched on a per-user basis.
  const queryKey = ['classGroups', user?.id];

  const {
    data: classGroups = [],
    isLoading: isListLoading, // isLoading is for the initial fetch
    isFetching, // isFetching is for any fetch, including background refetches
    error,
  } = useQuery<ClassGroup[]>({
    queryKey,
    queryFn: () => (user ? classGroupsService.getClassGroups(user.id) : Promise.resolve([])),
    enabled: !!user, // The query will not run until the user object is available.
  });

  // Mutation for adding a new class group.
  const addMutation = useMutation({
    mutationFn: (data: ClassGroupInsert) =>
      classGroupsService.addClassGroup({ ...data, user_id: user!.id }),
    // After a successful mutation, invalidate the query to refetch the latest data.
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  // Mutation for updating an existing class group.
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ClassGroupUpdate }) =>
      classGroupsService.updateClassGroup(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  // Mutation for removing a class group.
  const removeMutation = useMutation({
    mutationFn: (id: string) => classGroupsService.removeClassGroup(id, user!.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    /** The cached array of class groups for the current user. */
    classGroups,

    /** A boolean indicating if the list of class groups is currently being fetched. */
    isLoading: isListLoading || isFetching,

    /** A boolean indicating if a create or update operation is in progress. */
    isSubmitting: addMutation.isPending || updateMutation.isPending,

    /** A boolean indicating if a delete operation is in progress. */
    isRemoving: removeMutation.isPending,

    /** An error message string if the query fails, otherwise null. */
    error: error ? (error as Error).message : null,

    /** An async function to add a new class group. */
    addClassGroup: addMutation.mutateAsync,

    /**
     * An async function to update a class group.
     *
     * @param id The ID of the class group to update.
     * @param data The data to update the class group with.
     * @returns A Promise that resolves when the update is complete.
     */
    updateClassGroup: (id: string, data: ClassGroupUpdate) =>
      updateMutation.mutateAsync({ id, data }),

    /** An async function to remove a class group. */
    removeClassGroup: removeMutation.mutateAsync,
  };
}
