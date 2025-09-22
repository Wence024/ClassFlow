import { supabase } from '../../../lib/supabase';
import type { Program } from '../types/program';

const TABLE = 'programs';

/**
 * Retrieves all programs
 *
 * @returns Promise resolving to an array of Program objects
 */
export async function getPrograms(): Promise<Program[]> {
  const { data, error } = await supabase.from(TABLE).select('*');
  if (error) throw error;
  return data || [];
}
