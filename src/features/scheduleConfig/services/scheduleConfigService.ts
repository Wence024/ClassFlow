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
 * ✅ CURRENT BEHAVIOR:
 * Updates the user's personal schedule configuration. If a record doesn't exist for the user,
 * it is created using an UPSERT (based on a unique constraint on `user_id`).
 *
 * 🛠️ FUTURE PLAN:
 * This will be converted to a singleton configuration update (where id = 1),
 * only accessible by admin users. Non-admins will no longer be able to update their own configs.
 * Supabase RLS will enforce this restriction.
 *
 * @param userId The ID of the user (currently required).
 * @param settings The configuration settings to persist.
 * @returns The updated schedule configuration.
 */
export async function updateScheduleConfig(
  userId: string,
  settings: ScheduleConfigUpdate
): Promise<ScheduleConfig> {
  const { data, error } = await supabase
    .from('schedule_configuration')
    .upsert({ ...settings, user_id: userId }, { onConflict: 'user_id' }) // 🛠️ Will be changed to { id: 1 }
    .select()
    .single();

  if (error || !data) {
    console.error('Error updating schedule configuration:', error);
    throw new Error('Could not update schedule configuration.');
  }
  return data;
}
