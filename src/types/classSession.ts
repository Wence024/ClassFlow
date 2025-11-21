// Import the generated Database type. This is the single source of truth.
import type { Database } from '../lib/supabase.types';
import type { Course } from './course';
import type { ClassGroup } from './classGroup';
import type { Instructor } from './instructor';
import type { Classroom } from './classroom';

// --- Base Entity Types (from Supabase) ---
// This represents the raw database row for a class session, containing foreign keys.
export type ClassSessionRow = Database['public']['Tables']['class_sessions']['Row'];

// --- Insert/Update Types for CRUD Operations ---
export type ClassSessionInsert = Database['public']['Tables']['class_sessions']['Insert'];
export type ClassSessionUpdate = Database['public']['Tables']['class_sessions']['Update'];

// --- Hydrated/Composite Types for Frontend ---
/**
 * Represents a fully-hydrated Class Session object for use in the UI.
 * It contains the full objects for course, group, instructor, and classroom.
 * This is the primary type that components will interact with.
 */
export type ClassSession = {
  // The ID comes from the raw ClassSessionRow.
  id: ClassSessionRow['id'];
  course: Course;
  group: ClassGroup;
  instructor: Instructor;
  classroom: Classroom;
  period_count: number;
  program_id: string | null;
};
