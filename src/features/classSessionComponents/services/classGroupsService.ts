/**
 * @file This service module provides functions for interacting with the `class_groups` table in the database.
 * It abstracts the Supabase client calls for creating, reading, updating, and deleting class groups.
 */

import { supabase } from '../../../lib/supabase';
import type { ClassGroup, ClassGroupInsert, ClassGroupUpdate } from '../types/classGroup';

const TABLE = 'class_groups';

/**
 * Fetches all class groups for a specific user from the database.
 *
 * @param user_id - The ID of the user whose class groups to retrieve.
 * @returns A promise that resolves to an array of ClassGroup objects.
 * @throws An error if the Supabase query fails.
 */
export async function getClassGroups(user_id: string): Promise<ClassGroup[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', user_id)
    .order('name');
  if (error) throw error;
  return data || [];
}

/**
 * Fetches ALL class groups from the database, regardless of owner.
 * This is used for the shared timetable view.
 * @returns A promise that resolves to an array of all ClassGroup objects.
 */
export async function getAllClassGroups(): Promise<ClassGroup[]> {
  const { data, error } = await supabase.from('class_groups').select('*').order('name');
  if (error) throw error;
  return data || [];
}

/**
 * Adds a new class group to the database.
 * The input object must include the `user_id` of the owner.
 *
 * @param group - The ClassGroupInsert object containing the data for the new group.
 * @returns A promise that resolves to the newly created ClassGroup object.
 * @throws An error if the Supabase insert fails.
 */
export async function addClassGroup(group: ClassGroupInsert): Promise<ClassGroup> {
  const { data, error } = await supabase.from(TABLE).insert([group]).select().single();
  if (error) throw error;
  return data;
}

/**
 * Updates an existing class group in the database.
 * Relies on Supabase's Row-Level Security (RLS) to ensure users can only update their own records.
 *
 * @param id - The unique identifier of the class group to update.
 * @param group - The ClassGroupUpdate object containing the fields to update.
 * @returns A promise that resolves to the updated ClassGroup object.
 * @throws An error if the Supabase update fails or the record is not found.
 */
export async function updateClassGroup(id: string, group: ClassGroupUpdate): Promise<ClassGroup> {
  const { data, error } = await supabase.from(TABLE).update(group).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

/**
 * Removes a class group from the database.
 * This operation is protected by RLS policies in the database, ensuring a user can only delete their own records.
 *
 * @param id - The unique identifier of the class group to remove.
 * @param user_id - The ID of the user, used here for an explicit check.
 * @returns A promise that resolves when the operation is complete.
 * @throws An error if the Supabase delete fails.
 */
export async function removeClassGroup(id: string, user_id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id).eq('user_id', user_id);
  if (error) throw error;
}
