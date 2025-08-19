import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../auth/hooks/useAuth';
import * as classSessionsService from '../services/classSessionsService';
import type { ClassSession, ClassSessionInsert, ClassSessionUpdate } from '../types/classSession';

/**
 * Custom hook to manage class sessions data.
 *
 * This hook provides a reactive interface to the user's class sessions. It handles
 * fetching, creating, updating, and deleting sessions using React Query for robust
 * server state management, including caching and automatic data refetching.
 *
 * @returns An object containing the class sessions data, loading and error states, and mutation functions.
 *
 * @example
 * const { classSessions, loading, addClassSession } = useClassSessions();
 *
 * const handleCreate = () => {
 *   addClassSession({
 *     course_id: '...',
 *     instructor_id: '...',
 *     // ... other foreign keys
 *   });
 * };
 */
export function useClassSessions() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  /**
   * The React Query key for this data. It includes the user's ID to ensure
   * that each user's data is cached separately.
   */
  const queryKey = ['classSessions', user?.id];

  const {
    data: classSessions = [],
    isLoading,
    isFetching,
    error,
  } = useQuery<ClassSession[]>({
    queryKey,
    // The query function is only called if the user is authenticated.
    queryFn: () => (user ? classSessionsService.getClassSessions(user.id) : Promise.resolve([])),
    enabled: !!user, // The query will not execute until a user is available.
  });

  // Mutation for adding a new class session.
  const addMutation = useMutation({
    mutationFn: (data: ClassSessionInsert) =>
      classSessionsService.addClassSession({ ...data, user_id: user!.id }),
    // When this mutation succeeds, invalidate the `classSessions` query to trigger a refetch.
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  // Mutation for updating an existing class session.
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ClassSessionUpdate }) =>
      classSessionsService.updateClassSession(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  // Mutation for removing a class session.
  const removeMutation = useMutation({
    mutationFn: (id: string) => classSessionsService.removeClassSession(id, user!.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  /** A consolidated loading state that is true if any query or mutation is in progress. */
  const loading =
    isLoading ||
    isFetching ||
    addMutation.isPending ||
    updateMutation.isPending ||
    removeMutation.isPending;

  return {
    /** The cached array of the user's class sessions. Defaults to an empty array. */
    classSessions,
    /** A boolean indicating if any data fetching or mutation is currently active. */
    loading,
    /** An error message string if the query fails, otherwise null. */
    error: error ? (error as Error).message : null,
    /** An async function to add a new class session. Requires an object with foreign keys. */
    addClassSession: addMutation.mutateAsync,
    /** An async function to update a class session. Requires the session ID and the update data. */
    updateClassSession: (id: string, data: ClassSessionUpdate) =>
      updateMutation.mutateAsync({ id, data }),
    /** An async function to remove a class session by its ID. */
    removeClassSession: removeMutation.mutateAsync,
  };
}
