// Import the generated Database type. This is the single source of truth.
import type { Database } from '../../../lib/supabase.types';

// --- Base Entity Types (from Supabase) ---
// This represents the raw database row for a timetable assignment.
export type TimetableAssignment = Database['public']['Tables']['timetable_assignments']['Row'];

// --- Insert/Update Types for CRUD Operations ---
export type TimetableAssignmentInsert = Database['public']['Tables']['timetable_assignments']['Insert'];
export type TimetableAssignmentUpdate = Database['public']['Tables']['timetable_assignments']['Update']; 