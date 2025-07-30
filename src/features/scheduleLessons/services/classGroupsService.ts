import { supabase } from '../../../lib/supabase';
import type { ClassGroup, ClassGroupInsert, ClassGroupUpdate } from '../types/classGroup';

const TABLE = 'class_groups';

/**
 * Fetches all class groups for a specific user from the database.
 * @param user_id The ID of the user whose class groups to retrieve.
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
 * Adds a new class group to the database.
 * The input object must include the `user_id` of the owner.
 * @param group The ClassGroupInsert object containing the data for the new group.
 * @returns A promise that resolves to the newly created ClassGroup object, including its database-generated id.
 * @throws An error if the Supabase insert fails.
 */
export async function addClassGroup(group: ClassGroupInsert): Promise<ClassGroup> {
  const { data, error } = await supabase.from(TABLE).insert([group]).select().single();
  if (error) throw error;
  return data;
}

/**
 * Updates an existing class group in the database.
 * This function relies on Supabase's Row-Level Security (RLS) to ensure
 * that users can only update their own records. The RLS policy should
 * check that `auth.uid() = user_id`.
 * @param id The unique identifier of the class group to update.
 * @param group The ClassGroupUpdate object containing the fields to update.
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
 * @param id The unique identifier of the class group to remove.
 * @param user_id The ID of the user, to ensure they own the record being deleted.
 * @returns A promise that resolves when the operation is complete.
 * @throws An error if the Supabase delete fails.
 */
export async function removeClassGroup(id: string, user_id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id).eq('user_id', user_id);
  if (error) throw error;
}
