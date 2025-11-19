// Import the generated Database type. This is the single source of truth.
import type { Database } from '../lib/supabase.types';
import type { ClassSession } from './classSession';

// --- Base Entity Types (from Supabase) ---
// This represents the raw database row for a timetable assignment.
export type TimetableAssignment = Database['public']['Tables']['timetable_assignments']['Row'];

// --- Insert/Update Types for CRUD Operations ---
export type TimetableAssignmentInsert =
  Database['public']['Tables']['timetable_assignments']['Insert'];
export type TimetableAssignmentUpdate =
  Database['public']['Tables']['timetable_assignments']['Update'];

// --- Hydrated/Composite Type for Frontend ---
/**
 * Represents a timetable assignment that includes the full, nested ClassSession object.
 * This is the data structure returned by the updated `getTimetableAssignments` service.
 */
export type HydratedTimetableAssignment = Omit<TimetableAssignment, 'class_session_id'> & {
  class_session: ClassSession;
  status: 'pending' | 'confirmed';
};

// --- View Mode System ---
/**
 * Defines the available view modes for the timetable display.
 */
export type TimetableViewMode = 'class-group' | 'classroom' | 'instructor';

/**
 * Configuration for a timetable view mode.
 */
export interface TimetableViewConfig {
  mode: TimetableViewMode;
  label: string;
  description: string;
}
