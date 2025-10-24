// Import the generated Database type. This is the single source of truth.
import type { Database } from '../../../lib/supabase.types';

// --- Base Entity Types (from Supabase) ---
export type Course = Database['public']['Tables']['courses']['Row'];

// --- Insert/Update Types for CRUD Operations ---
// program_id is now required (NOT NULL constraint added)
export type CourseInsert = Database['public']['Tables']['courses']['Insert'];
export type CourseUpdate = Database['public']['Tables']['courses']['Update'];
