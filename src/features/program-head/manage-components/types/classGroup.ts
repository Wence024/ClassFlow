// Import the generated Database type. This is the single source of truth.
import type { Database } from '../../../../lib/supabase.types';

// --- Base Entity Types (from Supabase) ---
export type ClassGroup = Database['public']['Tables']['class_groups']['Row'];

// --- Insert/Update Types for CRUD Operations ---
export type ClassGroupInsert = Database['public']['Tables']['class_groups']['Insert'];
export type ClassGroupUpdate = Database['public']['Tables']['class_groups']['Update'];
