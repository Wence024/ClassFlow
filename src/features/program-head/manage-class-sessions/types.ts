/**
 * Types for managing class sessions (create, read, update, delete).
 */

import type { ClassSession, ClassSessionInsert } from '@/types/classSession';
import type { Database } from '@/lib/supabase.types';

export type { ClassSession, ClassSessionInsert };
export type ClassSessionUpdate = Database['public']['Tables']['class_sessions']['Update'];

/**
 * Filters for browsing class sessions.
 */
export type SessionFilters = {
  courseId?: string;
  classGroupId?: string;
  instructorId?: string;
  searchTerm?: string;
};

/**
 * Cross-department resource information for approval workflows.
 */
export type CrossDepartmentInfo = {
  resourceType: 'instructor' | 'classroom' | null;
  resourceId: string | null;
  departmentId: string | null;
  resourceName: string;
};
