/**
 * @file This service module provides functions for interacting with the `courses` table in the database.
 * It abstracts the Supabase client calls for creating, reading, updating, and deleting courses.
 */

import { supabase } from '../../../lib/supabase';
import type { Course, CourseInsert, CourseUpdate } from '../types/course';

const TABLE = 'courses';

/**
 * Fetches courses from the database, optionally filtered by program and role.
 * Admins see all courses; program heads see only their program's courses.
 *
 * @param params - Optional filtering parameters.
 * @param params.program_id - The program ID to filter by (for non-admin users).
 * @param params.role - The user's role (determines filtering behavior).
 * @returns A promise that resolves to an array of Course objects.
 * @throws An error if the Supabase query fails.
 */
export async function getCourses(params?: {
  program_id?: string | null;
  role?: string | null;
}): Promise<Course[]> {
  let query = supabase.from(TABLE).select('*').order('name');

  // Only admins see all courses; others see their program's courses
  if (params?.role !== 'admin' && params?.program_id) {
    query = query.eq('program_id', params.program_id);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

/**
 * Fetches ALL courses from the database with program metadata.
 * Used for cross-program workflows like class session authoring.
 *
 * @returns A promise that resolves to an array of Course objects with program info.
 * @throws An error if the Supabase query fails.
 */
export async function getAllCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select(
      `
      *,
      programs:program_id (
        name,
        short_code
      )
    `
    )
    .order('name');

  if (error) throw error;

  return (
    data?.map((course) => ({
      ...course,
      program_name: course.programs?.name || null,
      program_short_code: course.programs?.short_code || null,
      programs: undefined,
    })) || []
  ) as Course[];
}

/**
 * Adds a new course to the database.
 * The input object must include `created_by` (user_id) and `program_id`.
 *
 * @param course - The CourseInsert object containing the data for the new course.
 * @returns A promise that resolves to the newly created Course object.
 * @throws An error if the Supabase insert fails or required fields are missing.
 */
export async function addCourse(course: CourseInsert): Promise<Course> {
  const { data, error } = await supabase.from(TABLE).insert([course]).select().single();
  if (error) throw error;
  return data;
}

/**
 * Updates an existing course in the database.
 * Relies on Supabase's Row-Level Security (RLS) to ensure users can only update their own records.
 *
 * @param id - The unique identifier of the course to update.
 * @param course - The CourseUpdate object containing the fields to update.
 * @returns A promise that resolves to the updated Course object.
 * @throws An error if the Supabase update fails or the record is not found.
 */
export async function updateCourse(id: string, course: CourseUpdate): Promise<Course> {
  const { data, error } = await supabase.from(TABLE).update(course).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

/**
 * Removes a course from the database.
 * This operation is protected by RLS policies in the database, ensuring a user can only delete their own records.
 *
 * @param id - The unique identifier of the course to remove.
 * @param user_id - The ID of the user, used here for an explicit check.
 * @returns A promise that resolves when the operation is complete.
 * @throws An error if the Supabase delete fails.
 */
export async function removeCourse(id: string, user_id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id).eq('created_by', user_id);
  if (error) throw error;
}
