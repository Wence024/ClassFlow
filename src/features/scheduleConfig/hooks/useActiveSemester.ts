// src/features/scheduleConfig/hooks/useActiveSemester.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import type { Semester } from '../types/semesters';

/**
 * Fetches the single currently active semester from the database.
 *
 * @returns The React Query result for the active semester.
 */
export function useActiveSemester() {
  const queryKey = ['activeSemester'];

  const queryFn = async () => {
    const { data, error } = await supabase
      .from('semesters')
      .select('*')
      .eq('is_active', true)
      .single();

    if (error) {
      throw new Error('Could not fetch the active semester. Please ensure one is set.');
    }
    return data;
  };

  return useQuery<Semester>({ queryKey, queryFn });
}
