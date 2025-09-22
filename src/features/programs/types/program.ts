import type { Database } from '../../../lib/supabase.types';

export type Program = Database['public']['Tables']['programs']['Row'];
