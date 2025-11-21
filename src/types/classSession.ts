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
 * Resources (instructor/classroom) can be null for incomplete sessions
 * that will be assigned resources later via timetable drag-and-drop.
 */
export type ClassSession = {
  id: ClassSessionRow['id'];
  course: Course;
  group: ClassGroup;
  instructor: Instructor | null;  // ← Now nullable for dynamic assignment
  classroom: Classroom | null;     // ← Now nullable for dynamic assignment
  period_count: number;
  program_id: string | null;
};

// --- Utility Types for Incomplete Sessions ---

/**
 * A class session with no resources assigned yet.
 * Created when user wants to assign resources via timetable.
 */
export type IncompleteClassSession = ClassSession & {
  instructor: null;
  classroom: null;
};

/**
 * A class session with only one resource assigned.
 */
export type PartiallyCompleteClassSession = ClassSession & (
  | { instructor: Instructor; classroom: null }
  | { instructor: null; classroom: Classroom }
);

/**
 * A class session with both resources fully assigned.
 */
export type CompleteClassSession = ClassSession & {
  instructor: Instructor;
  classroom: Classroom;
};
