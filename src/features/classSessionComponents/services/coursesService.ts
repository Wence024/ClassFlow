/**
 * @file This service module provides functions for interacting with the `courses` table in the database.
 * It abstracts the Supabase client calls for creating, reading, updating, and deleting courses.
 */

import { supabase } from '../../../lib/supabase';
import type { Course, CourseInsert, CourseUpdate } from '../types/course';

const TABLE = 'courses';

/**
 * Fetches all courses from the database.
 *
 * @returns A promise that resolves to an array of Course objects.
 * @throws An error if the Supabase query fails.
 */
export async function getCourses(): Promise<Course[]> {
  const { data, error } = await supabase.from(TABLE).select('*').order('name');
  if (error) throw error;
  return data || [];
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
