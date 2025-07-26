import { supabase } from '../../../lib/supabase';
import type {
  ClassSession,
  ClassSessionInsert,
  ClassSessionUpdate,
} from '../types/classSession';

const TABLE = 'class_sessions';

// The columns to select to get the fully hydrated session object.
const SELECT_COLUMNS = `
  id,
  course:courses(*),
  group:class_groups(*),
  instructor:instructors(*),
  classroom:classrooms(*)
`;

/**
 * Fetches all class sessions for a specific user from the database.
 * This performs a "join" to get the full related objects for course, group, etc.
 * @param user_id The ID of the user whose class sessions to retrieve.
 * @returns A promise that resolves to an array of fully-hydrated ClassSession objects.
 * @throws An error if the Supabase query fails.
 */
export async function getClassSessions(user_id: string): Promise<ClassSession[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select(SELECT_COLUMNS)
    .eq('user_id', user_id);

  if (error) throw error;
  // The data from Supabase should match our hydrated ClassSession type.
  return (data as unknown as ClassSession[]) || [];
}

/**
 * Adds a new class session to the database.
 * The input object must contain the foreign keys for the related components.
 * @param session The ClassSessionInsert object containing the foreign keys for the new session.
 * @returns A promise that resolves to the newly created, fully-hydrated ClassSession object.
 * @throws An error if the Supabase insert fails.
 */
export async function addClassSession(session: ClassSessionInsert): Promise<ClassSession> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([session])
    .select(SELECT_COLUMNS)
    .single();

  if (error) throw error;
  return data as unknown as ClassSession;
}

/**
 * Updates an existing class session in the database.
 * This function relies on Supabase's Row-Level Security (RLS) to ensure
 * that users can only update their own records.
 * @param id The unique identifier of the class session to update.
 * @param session The ClassSessionUpdate object containing the fields to update.
 * @returns A promise that resolves to the updated, fully-hydrated ClassSession object.
 * @throws An error if the Supabase update fails or the record is not found.
 */
export async function updateClassSession(id: string, session: ClassSessionUpdate): Promise<ClassSession> {
  const { data, error } = await supabase
    .from(TABLE)
    .update(session)
    .eq('id', id)
    .select(SELECT_COLUMNS)
    .single();
  if (error) throw error;
  return data as unknown as ClassSession;
}

/**
 * Removes a class session from the database.
 * @param id The unique identifier of the class session to remove.
 * @param user_id The ID of the user, to ensure they own the record being deleted.
 * @returns A promise that resolves when the operation is complete.
 * @throws An error if the Supabase delete fails.
 */
export async function removeClassSession(id: string, user_id: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id)
    .eq('user_id', user_id);
  if (error) throw error;
}
