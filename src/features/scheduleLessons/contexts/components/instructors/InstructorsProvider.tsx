import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type {
  Instructor,
  InstructorInsert,
  InstructorUpdate,
} from '../../../types/instructor';
import * as instructorsService from '../../../services/instructorsService';
import { InstructorsContext } from './InstructorsContext';
import { useAuth } from '../../../../auth/hooks/useAuth';

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
  addInstructor: (data: InstructorInsert) => Promise<void>;
  updateInstructor: (id: string, data: InstructorUpdate) => Promise<void>;
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
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Fetches instructors from the service when the user is authenticated.
     * Clears existing instructors if the user logs out.
     */
    if (!user) {
      setInstructors([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    instructorsService
      .getInstructors(user.id)
      .then((data) => setInstructors(data))
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [user]);

  /**
   * Adds a new instructor to the database and updates the local state.
   * It constructs the full `InstructorInsert` object with the current user's ID.
   * @param data - The instructor data to be added, excluding `id` and `user_id`.
   * @returns A promise that resolves when the operation is complete.
   */
  const addInstructor = async (data: InstructorInsert) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const newInstructor = await instructorsService.addInstructor({ ...data, user_id: user.id });
      setInstructors((prev) => [...prev, newInstructor]);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Updates an existing instructor in the database and updates the local state.
   * @param id - The ID of the instructor to update.
   * @param data - An object containing the instructor fields to update.
   * @returns A promise that resolves when the operation is complete.
   */
  const updateInstructor = async (id: string, data: InstructorUpdate) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const updated = await instructorsService.updateInstructor(id, data);
      setInstructors((prev) => prev.map((i) => (i.id === id ? updated : i)));
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Removes an instructor from the database and updates the local state.
   * @param id - The ID of the instructor to remove.
   * @returns A promise that resolves when the operation is complete.
   */
  const removeInstructor = async (id: string) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      await instructorsService.removeInstructor(id, user.id);
      setInstructors((prev) => prev.filter((i) => i.id !== id));
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <InstructorsContext.Provider
      value={{ instructors, loading, error, addInstructor, updateInstructor, removeInstructor }}
    >
      {children}
    </InstructorsContext.Provider>
  );
};
