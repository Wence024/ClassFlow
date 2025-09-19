/**
 * @file This service module provides functions for interacting with the `class_sessions` table.
 * It handles all CRUD operations and is responsible for fetching "hydrated" session objects,
 * where foreign keys (e.g., `course_id`) are replaced with their full corresponding objects
 * (e.g., the `Course` object).
 */

import { supabase } from '../../../lib/supabase';
import type { ClassSession, ClassSessionInsert, ClassSessionUpdate } from '../types/classSession';

const TABLE = 'class_sessions';

/**
 * Defines the Supabase query string for selecting a class session and all its related data.
 * This syntax tells Supabase to perform a join-like operation, fetching the full records
 * from the `courses`, `class_groups`, `instructors`, and `classrooms` tables.
 * The column names (`course`, `group`, etc.) become the keys in the resulting JavaScript object.
 */
// Step 1a: Create ONE reliable constant
const SELECT_COLUMNS = `
  *,
  course:courses(*),
  group:class_groups(*),
  instructor:instructors(*),
  classroom:classrooms(*)
`;

// Step 1b: Make ALL functions use the reliable constant
export async function getAllClassSessions(): Promise<ClassSession[]> {
  const { data, error } = await supabase.from('class_sessions').select(SELECT_COLUMNS);
  if (error) throw error;
  return (data as unknown as ClassSession[]) || [];
}

export async function getClassSessions(user_id: string): Promise<ClassSession[]> {
  const { data, error } = await supabase.from(TABLE).select(SELECT_COLUMNS).eq('user_id', user_id);
  if (error) throw error;
  return (data as unknown as ClassSession[]) || [];
}
/**
 * Fetches a single, fully-hydrated class session by its ID.
 * This includes all related data such as course, class group, instructor, and classroom.
 *
 * Note: Relies on Supabase RLS to restrict access by `user_id`.
 *
 * @param id - The unique identifier of the class session to retrieve.
 * @returns A promise that resolves to the fully-hydrated ClassSession object.
 * @throws An error if the class session is not found or if the Supabase query fails.
 */
export async function getClassSession(id: string): Promise<ClassSession> {
  const { data, error } = await supabase.from(TABLE).select(SELECT_COLUMNS).eq('id', id).single();

  if (error) throw error;
  return data as unknown as ClassSession;
}

/**
 * Adds a new class session to the database.
 * The input object should contain the foreign keys (e.g., `course_id`) for the related components.
 *
 * @param classSession - The data for the new class session.
 * @returns A promise that resolves to the newly created, fully-hydrated ClassSession object.
 * @throws An error if the Supabase insert fails.
 */
export async function addClassSession(classSession: ClassSessionInsert): Promise<ClassSession> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([classSession])
    .select(SELECT_COLUMNS) // Fetches the hydrated object immediately after insertion.
    .single();

  if (error) throw error;
  return data as unknown as ClassSession;
}

/**
 * Updates an existing class session in the database.
 * Relies on Supabase's Row-Level Security (RLS) to ensure users can only update their own records.
 *
 * @param id - The unique identifier of the class session to update.
 * @param classSession - The fields to update.
 * @returns A promise that resolves to the updated, fully-hydrated ClassSession object.
 * @throws An error if the Supabase update fails or the record is not found.
 */
export async function updateClassSession(
  id: string,
  classSession: ClassSessionUpdate
): Promise<ClassSession> {
  const { data, error } = await supabase
    .from(TABLE)
    .update(classSession)
    .eq('id', id)
    .select(SELECT_COLUMNS) // Fetches the hydrated object immediately after update.
    .single();
  if (error) throw error;
  return data as unknown as ClassSession;
}

/**
 * Removes a class session from the database.
 *
 * @param id - The unique identifier of the class session to remove.
 * @param user_id - The ID of the user, to ensure they own the record being deleted.
 * @returns A promise that resolves when the operation is complete.
 * @throws An error if the Supabase delete fails.
 */
export async function removeClassSession(id: string, user_id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id).eq('user_id', user_id);
  if (error) throw error;
}
