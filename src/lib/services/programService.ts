/**
 * Centralized service for all program database operations.
 * Consolidates operations from features/programs/services/programsService.ts.
 */

import { supabase } from '../supabase';
import type { Program, ProgramInsert, ProgramUpdate } from '../../types/program';

const TABLE = 'programs';

/**
 * Lists all programs, ordered by name.
 */
export async function listPrograms(): Promise<Program[]> {
  const { data, error } = await supabase.from(TABLE).select('*').order('name');
  if (error) throw error;
  return data || [];
}

/**
 * Creates a new program (admin only via RLS).
 *
 * @param payload
 */
export async function createProgram(payload: ProgramInsert): Promise<Program> {
  const { data, error } = await supabase.from(TABLE).insert([payload]).select().single();
  if (error) throw error;
  return data as Program;
}

/**
 * Updates a program (admin only via RLS).
 *
 * @param id
 * @param update
 */
export async function updateProgram(id: string, update: ProgramUpdate): Promise<Program> {
  const { data, error } = await supabase.from(TABLE).update(update).eq('id', id).select().single();
  if (error) throw error;
  return data as Program;
}

/**
 * Deletes a program (admin only via RLS).
 *
 * @param id
 */
export async function deleteProgram(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}
