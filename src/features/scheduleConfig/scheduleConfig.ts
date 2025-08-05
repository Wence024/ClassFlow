import type { Database } from '../../lib/supabase.types';

// The raw database row for academic settings
export type ScheduleConfig = Database['public']['Tables']['schedule_configuration']['Row'];

// The type for updating the settings (all fields are optional)
export type ScheduleConfigInsert = Database['public']['Tables']['schedule_configuration']['Update'];
export type ScheduleConfigUpdate = Database['public']['Tables']['schedule_configuration']['Update'];
