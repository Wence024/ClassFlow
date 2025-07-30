import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Classroom, ClassroomInsert, ClassroomUpdate } from '../../../types/classroom';
import * as classroomsService from '../../../services/classroomsService';
import { ClassroomsContext } from './ClassroomsContext';
import { useAuth } from '../../../../auth/hooks/useAuth';

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
  addClassroom: (data: ClassroomInsert) => Promise<void>;
  updateClassroom: (id: string, data: ClassroomUpdate) => Promise<void>;
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
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Fetches classrooms from the service when the user is authenticated.
     * Clears existing classrooms if the user logs out.
     */
    if (!user) {
      setClassrooms([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    classroomsService
      .getClassrooms(user.id)
      .then((data) => setClassrooms(data))
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [user]);

  /**
   * Adds a new classroom to the database and updates the local state.
   * It constructs the full `ClassroomInsert` object with the current user's ID.
   * @param data - The classroom data to be added, excluding `id` and `user_id`.
   * @returns A promise that resolves when the operation is complete.
   */
  const addClassroom = async (data: ClassroomInsert) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const newClassroom = await classroomsService.addClassroom({ ...data, user_id: user.id });
      setClassrooms((prev) => [...prev, newClassroom]);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Updates an existing classroom in the database and updates the local state.
   * @param id - The ID of the classroom to update.
   * @param data - An object containing the classroom fields to update.
   * @returns A promise that resolves when the operation is complete.
   */
  const updateClassroom = async (id: string, data: ClassroomUpdate) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const updated = await classroomsService.updateClassroom(id, data);
      setClassrooms((prev) => prev.map((c) => (c.id === id ? updated : c)));
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Removes a classroom from the database and updates the local state.
   * @param id - The ID of the classroom to remove.
   * @returns A promise that resolves when the operation is complete.
   */
  const removeClassroom = async (id: string) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      await classroomsService.removeClassroom(id, user.id);
      setClassrooms((prev) => prev.filter((c) => c.id !== id));
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClassroomsContext.Provider
      value={{ classrooms, loading, error, addClassroom, updateClassroom, removeClassroom }}
    >
      {children}
    </ClassroomsContext.Provider>
  );
};
