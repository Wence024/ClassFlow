// Import the generated Database type. This is the single source of truth.
import type { Database } from '../../../lib/supabase.types';

// --- Base Entity Types (from Supabase) ---
// These types are directly derived from the database schema.
// We export them to be used throughout the application.

export type Course = Database['public']['Tables']['courses']['Row'];
export type ClassGroup = Database['public']['Tables']['class_groups']['Row'];
export type Classroom = Database['public']['Tables']['classrooms']['Row'];
export type Instructor = Database['public']['Tables']['instructors']['Row'];

// This represents the raw database row for a class session, containing foreign keys.
export type ClassSessionRow = Database['public']['Tables']['class_sessions']['Row'];

// This represents the raw database row for a timetable assignment.
export type TimetableAssignment =
  Database['public']['Tables']['timetable_assignments']['Row'];

// --- Hydrated/Composite Types for Frontend ---
// These types are composed for easier use in the UI, replacing foreign keys with nested objects.

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
};
