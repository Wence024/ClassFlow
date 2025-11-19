/**
 * Centralized service for all class group database operations.
 * Consolidates operations from features/classSessionComponents/services/classGroupsService.ts
 */

import { supabase } from '../supabase';
import type { ClassGroup, ClassGroupInsert, ClassGroupUpdate } from '../../types/classGroup';

const TABLE = 'class_groups';

/**
 * Fetches all class groups for a specific program.
 */
export async function getClassGroupsByProgram(program_id: string): Promise<ClassGroup[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('program_id', program_id)
    .order('name');
  if (error) throw error;
  return data || [];
}

/**
 * Fetches ALL class groups from the database.
 */
export async function getAllClassGroups(): Promise<ClassGroup[]> {
  const { data, error } = await supabase.from('class_groups').select('*').order('name');
  if (error) throw error;
  return data || [];
}

/**
 * Adds a new class group to the database.
 */
export async function addClassGroup(group: ClassGroupInsert): Promise<ClassGroup> {
  const { data, error } = await supabase.from(TABLE).insert([group]).select().single();
  if (error) throw error;
  return data;
}

/**
 * Updates an existing class group in the database.
 */
export async function updateClassGroup(id: string, group: ClassGroupUpdate): Promise<ClassGroup> {
  const { data, error } = await supabase.from(TABLE).update(group).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

/**
 * Removes a class group from the database.
 */
export async function removeClassGroup(id: string, user_id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id).eq('user_id', user_id);
  if (error) throw error;
}
