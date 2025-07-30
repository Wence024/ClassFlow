import type { ReactNode } from 'react';
import type {
  ClassSession,
  ClassSessionInsert,
  ClassSessionUpdate,
} from '../../types/classSession';
import * as classSessionsService from '../../services/classSessionsService';
import { ClassSessionsContext } from './ClassSessionsContext';
import { useAuth } from '../../../auth/hooks/useAuth';
import { useCourses, useClassGroups, useClassrooms, useInstructors } from '../../hooks/useComponents';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Defines the shape of the context provided by ClassSessionsProvider.
 * @property classSessions - An array of hydrated session objects for the current user.
 * @property loading - A boolean indicating if an operation is in progress.
 * @property error - A string containing an error message if an operation failed, otherwise null.
 * @property addClassSession - Function to add a new session.
 * @property updateClassSession - Function to update an existing session.
 * @property removeClassSession - Function to remove a session.
 */
export interface ClassSessionsContextType {
  classSessions: ClassSession[];
  loading: boolean;
  error: string | null;
  addClassSession: (data: ClassSessionInsert) => Promise<ClassSession>;
  updateClassSession: (id: string, data: ClassSessionUpdate) => Promise<ClassSession>;
  removeClassSession: (id: string) => Promise<void>;
}

/**
 * Provides class session-related state and CRUD operations to its children.
 * It handles fetching data from the `classSessionsService`, manages loading and error states,
 * and exposes functions to add, update, and remove class sessions.
 *
 * @param {object} props - The component props.
 * @param {ReactNode} props.children - The child components that will consume the context.
 */
export const ClassSessionsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { courses } = useCourses();
  const { classGroups } = useClassGroups();
  const { classrooms } = useClassrooms();
  const { instructors } = useInstructors();
  const queryClient = useQueryClient();

  // Fetch class sessions, refetch when dependencies change
  const {
    data: classSessions = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: [
      'classSessions',
      user?.id,
      courses?.length,
      classGroups?.length,
      classrooms?.length,
      instructors?.length,
    ],
    queryFn: () => (user ? classSessionsService.getClassSessions(user.id) : Promise.resolve([])),
    enabled: !!user,
  });

  /**
   * Adds a new class session to the database and updates the local state.
   * @param data - The session data containing foreign keys.
   */
  const addClassSessionMutation = useMutation({
    mutationFn: (data: ClassSessionInsert) => classSessionsService.addClassSession({ ...data, user_id: user!.id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['classSessions', user?.id] }),
  });
  const addClassSession = (data: ClassSessionInsert) => addClassSessionMutation.mutateAsync(data);

  /**
   * Updates an existing class session in the database and updates the local state.
   * @param id - The ID of the session to update.
   * @param data - The updated session data.
   */
  const updateClassSessionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ClassSessionUpdate }) => classSessionsService.updateClassSession(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['classSessions', user?.id] }),
  });
  const updateClassSession = (id: string, data: ClassSessionUpdate) => updateClassSessionMutation.mutateAsync({ id, data });

  /**
   * Removes a class session from the database and updates the local state.
   * @param id - The ID of the session to remove.
   */
  const removeClassSessionMutation = useMutation({
    mutationFn: (id: string) => classSessionsService.removeClassSession(id, user!.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['classSessions', user?.id] }),
  });
  const removeClassSession = (id: string) => removeClassSessionMutation.mutateAsync(id);

  return (
    <ClassSessionsContext.Provider
      value={{
        classSessions,
        loading,
        error: error ? (error as Error).message : null,
        addClassSession,
        updateClassSession,
        removeClassSession,
      }}
    >
      {children}
    </ClassSessionsContext.Provider>
  );
};
