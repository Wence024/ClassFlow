// Import the generated Database type. This is the single source of truth.
import type { Database } from '../../../lib/supabase.types';

// --- Base Entity Types (from Supabase) ---
export type Instructor = Database['public']['Tables']['instructors']['Row'];

// --- Insert/Update Types for CRUD Operations ---
export type InstructorInsert = Database['public']['Tables']['instructors']['Insert'];
export type InstructorUpdate = Database['public']['Tables']['instructors']['Update']; 