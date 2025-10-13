import { supabase } from '../../../lib/supabase';
import type { ScheduleConfig, ScheduleConfigUpdate } from '../types/scheduleConfig';

/**
 * ✅ CURRENT BEHAVIOR:
 * Fetches the schedule configuration associated with a specific user.
 * This assumes each user can manage their own timetable configuration, stored in a separate row.
 *
 * 🛠️ FUTURE PLAN:
 * This will be replaced by a single global configuration row (id = 1),
 * centrally managed by admin users only. All user schedules will reference this shared configuration.
 *
 * @returns The user's schedule configuration (currently), or global config (in future).
 */
export async function getScheduleConfig(): Promise<ScheduleConfig | null> {
  const { data, error } = await supabase
    .from('schedule_configuration')
    .select('*')
    // .eq('user_id', userId)
    //  // 🛠️ To be removed in future
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching schedule configuration:', error);
    throw error;
  }
  return data;
}

/**
 * Updates the single, global schedule configuration.
 * This operation is protected by RLS and should only be callable by an 'admin' role.
 *
 * @param id The unique ID of the single configuration row to update.
 * @param settings The configuration settings to persist.
 * @returns The updated schedule configuration.
 */
export async function updateScheduleConfig(
  id: string, // Changed from userId
  settings: ScheduleConfigUpdate
): Promise<ScheduleConfig> {
  const { data, error } = await supabase
    .from('schedule_configuration')
    .update(settings) // Changed from upsert
    .eq('id', id)     // Target the row by its actual primary key
    .select()
    .single();

  if (error || !data) {
    console.error('Error updating schedule configuration:', error);
    throw new Error('Could not update schedule configuration.');
  }
  return data;
}
