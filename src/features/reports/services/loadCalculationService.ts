import { supabase } from '@/integrations/supabase/client';
import type { LoadCalculationConfig, LoadCalculationResult } from '../types/instructorReport';

/**
 * Fetches the load calculation configuration for a specific semester and optional department.
 *
 * @param semesterId The semester to fetch configuration for.
 * @param _departmentId Optional department override (currently unused).
 * @returns The load calculation configuration.
 */
export async function getLoadConfig(
  semesterId: string,
  _departmentId?: string
): Promise<LoadCalculationConfig> {
  const { data, error } = await supabase
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
 *
 * @param totalUnits The accumulated course units.
 * @param config The load calculation configuration.
 * @returns The computed teaching load value.
 */
export function calculateLoad(
  totalUnits: number,
  config: LoadCalculationConfig
): number {
  return totalUnits / config.unitsPerLoad;
}

/**
 * Determines load status based on total load and standard load.
 *
 * @param totalLoad The computed load value.
 * @param standardLoad The standard recommended load.
 * @returns Whether the load is under, at, or over the standard.
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
 *
 * @param totalUnits The accumulated course units.
 * @param config The load calculation configuration.
 * @returns The load value, status, and standard reference.
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
