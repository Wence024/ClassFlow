import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type {
  ClassSession,
  ClassSessionInsert,
  ClassSessionUpdate,
} from '../../types/classSession';
import * as classSessionsService from '../../services/classSessionsService';
import { ClassSessionsContext } from './ClassSessionsContext';
import { useAuth } from '../../../auth/hooks/useAuth';

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
  addClassSession: (data: ClassSessionInsert) => Promise<void>;
  updateClassSession: (id: string, data: ClassSessionUpdate) => Promise<void>;
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
  const [classSessions, setClassSessions] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Fetches class sessions from the service when the user is authenticated.
     * Clears existing sessions if the user logs out.
     */
    if (!user) {
      setClassSessions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    classSessionsService
      .getClassSessions(user.id)
      .then((data) => setClassSessions(data))
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [user]);

  /**
   * Adds a new class session to the database and updates the local state.
   * @param data - The session data containing foreign keys.
   */
  const addClassSession = async (data: ClassSessionInsert) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const newSession = await classSessionsService.addClassSession({ ...data, user_id: user.id });
      setClassSessions((prev) => [...prev, newSession]);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Updates an existing class session in the database and updates the local state.
   * @param id - The ID of the session to update.
   * @param data - An object containing the session fields to update.
   */
  const updateClassSession = async (id: string, data: ClassSessionUpdate) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const updated = await classSessionsService.updateClassSession(id, data);
      setClassSessions((prev) => prev.map((s) => (s.id === id ? updated : s)));
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Removes a class session from the database and updates the local state.
   * @param id - The ID of the session to remove.
   */
  const removeClassSession = async (id: string) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      await classSessionsService.removeClassSession(id, user.id);
      setClassSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClassSessionsContext.Provider
      value={{
        classSessions,
        loading,
        error,
        addClassSession,
        updateClassSession,
        removeClassSession,
      }}
    >
      {children}
    </ClassSessionsContext.Provider>
  );
};
