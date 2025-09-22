import { supabase } from '../../../lib/supabase';
import type { Program } from '../types/program';

const TABLE = 'programs';

export async function getPrograms(): Promise<Program[]> {
  const { data, error } = await supabase.from(TABLE).select('*');
  if (error) throw error;
  return data || [];
}
