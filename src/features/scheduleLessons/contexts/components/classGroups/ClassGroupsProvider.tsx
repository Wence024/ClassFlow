import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ClassGroup, ClassGroupInsert, ClassGroupUpdate } from '../../../types/classGroup';
import * as classGroupsService from '../../../services/classGroupsService';
import { ClassGroupsContext } from './ClassGroupsContext';
import { useAuth } from '../../../../auth/hooks/useAuth';

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
  addClassGroup: (data: ClassGroupInsert) => Promise<void>;
  updateClassGroup: (id: string, data: ClassGroupUpdate) => Promise<void>;
  removeClassGroup: (id: string) => Promise<void>;
}

export const ClassGroupsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [classGroups, setClassGroups] = useState<ClassGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Fetches class groups from the service when the user is authenticated.
     * Clears existing class groups if the user logs out.
     */
    if (!user) {
      setClassGroups([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    classGroupsService
      .getClassGroups(user.id)
      .then((data) => setClassGroups(data))
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [user]);

  /**
   * Adds a new class group to the database and updates the local state.
   * It constructs the full `ClassGroupInsert` object with the current user's ID.
   * @param data - The class group data to be added, excluding `id` and `user_id`.
   * @returns A promise that resolves when the operation is complete.
   */
  const addClassGroup = async (data: ClassGroupInsert) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const newGroup = await classGroupsService.addClassGroup({ ...data, user_id: user.id });
      setClassGroups((prev: ClassGroup[]) => [...prev, newGroup]);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Updates an existing class group in the database and updates the local state.
   * @param id - The ID of the class group to update.
   * @param data - An object containing the class group fields to update.
   * @returns A promise that resolves when the operation is complete.
   */
  const updateClassGroup = async (id: string, data: ClassGroupUpdate) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const updated = await classGroupsService.updateClassGroup(id, data);
      setClassGroups((prev: ClassGroup[]) => prev.map((g) => (g.id === id ? updated : g)));
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Removes a class group from the database and updates the local state.
   * @param id - The ID of the class group to remove.
   * @returns A promise that resolves when the operation is complete.
   */
  const removeClassGroup = async (id: string) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      await classGroupsService.removeClassGroup(id, user.id);
      setClassGroups((prev: ClassGroup[]) => prev.filter((g) => g.id !== id));
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClassGroupsContext.Provider
      value={{ classGroups, loading, error, addClassGroup, updateClassGroup, removeClassGroup }}
    >
      {children}
    </ClassGroupsContext.Provider>
  );
};
