import { supabase } from '@/integrations/supabase/client';
import type { LoadCalculationConfig, LoadCalculationResult } from '../types/instructorReport';

/**
 * Fetches the load calculation configuration for a specific semester and optional department.
 */
export async function getLoadConfig(
  semesterId: string,
  _departmentId?: string
): Promise<LoadCalculationConfig> {
  const { data, error } = await (supabase as any)
    .from('teaching_load_config')
    .select('*')
    .eq('semester_id', semesterId)
    .maybeSingle();

  if (error || !data) {
    return {
      unitsPerLoad: 3.0,
      standardLoad: 7.0,
    };
  }

  return {
    unitsPerLoad: Number(data.units_per_load),
    standardLoad: Number(data.standard_load),
  };
}

/**
 * Calculates teaching load based on total units and configuration.
 */
export function calculateLoad(
  totalUnits: number,
  config: LoadCalculationConfig
): number {
  return totalUnits / config.unitsPerLoad;
}

/**
 * Determines load status based on total load and standard load.
 */
export function getLoadStatus(
  totalLoad: number,
  standardLoad: number
): 'UNDERLOADED' | 'AT_STANDARD' | 'OVERLOADED' {
  const lowerBound = standardLoad * 0.9;
  const upperBound = standardLoad * 1.1;

  if (totalLoad < lowerBound) return 'UNDERLOADED';
  if (totalLoad > upperBound) return 'OVERLOADED';
  return 'AT_STANDARD';
}

/**
 * Calculates complete load information including status.
 */
export function calculateInstructorLoad(
  totalUnits: number,
  config: LoadCalculationConfig
): LoadCalculationResult {
  const load = calculateLoad(totalUnits, config);
  const status = getLoadStatus(load, config.standardLoad);

  return {
    load,
    status,
    standardLoad: config.standardLoad,
  };
}
