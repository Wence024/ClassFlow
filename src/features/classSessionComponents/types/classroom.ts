// Import the generated Database type. This is the single source of truth.
import type { Database } from '../../../lib/supabase.types';

// --- Base Entity Types (from Supabase) ---
export type Classroom = Database['public']['Tables']['classrooms']['Row'];

// --- Insert/Update Types for CRUD Operations ---
export type ClassroomInsert = Database['public']['Tables']['classrooms']['Insert'];
export type ClassroomUpdate = Database['public']['Tables']['classrooms']['Update'];
