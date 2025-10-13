import { supabase } from '../../../integrations/supabase/client';
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
 * Safely updates the single, global schedule configuration by calling a database RPC.
 * The RPC first checks for orphaned assignments before applying the update.
 *
 * @param configId The unique ID of the single configuration row to update.
 * @param settings The configuration settings to persist.
 * @returns The updated schedule configuration.
 * @throws An error if the update fails or if conflicts are found.
 */
export async function updateScheduleConfig(
  configId: string,
  settings: ScheduleConfigUpdate
): Promise<ScheduleConfig> {
  const { data: rpcResponse, error: rpcError } = await supabase.rpc(
    'update_schedule_configuration_safely',
    {
      config_id: configId,
      new_periods_per_day: settings.periods_per_day ?? 8,
      new_class_days_per_week: settings.class_days_per_week ?? 5,
      new_start_time: settings.start_time ?? '09:00',
      new_period_duration_mins: settings.period_duration_mins ?? 60,
    }
  );

  if (rpcError) {
    console.error('Error calling update RPC:', rpcError);
    throw new Error('A database error occurred while trying to save settings.');
  }

  // Handle the custom response from our RPC function
  const result = rpcResponse as { success: boolean; conflict_count: number };
  if (result && !result.success) {
    const count = result.conflict_count;
    throw new Error(
      `Cannot save: ${count} class(es) are scheduled outside the new time slots. Please move them before reducing the schedule size.`
    );
  }

  // If successful, we need to fetch the updated settings to return the full object
  const updatedSettings = await getScheduleConfig();
  if (!updatedSettings) {
    throw new Error('Failed to re-fetch settings after update.');
  }

  return updatedSettings;
}
