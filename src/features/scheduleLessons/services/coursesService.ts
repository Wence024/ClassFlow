import { supabase } from '../../../lib/supabase';
import type { Course, CourseInsert, CourseUpdate } from '../types/course';

const TABLE = 'courses';

/**
 * Fetches all courses for a specific user from the database.
 * @param user_id The ID of the user whose courses to retrieve.
 * @returns A promise that resolves to an array of Course objects.
 * @throws An error if the Supabase query fails.
 */
export async function getCourses(user_id: string): Promise<Course[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', user_id)
    .order('name');
  if (error) throw error;
  return data || [];
}

/**
 * Adds a new course to the database.
 * The input object must include the `user_id` of the owner.
 * @param course The CourseInsert object containing the data for the new course.
 * @returns A promise that resolves to the newly created Course object, including its database-generated id.
 * @throws An error if the Supabase insert fails.
 */
export async function addCourse(course: CourseInsert): Promise<Course> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([course])
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * Updates an existing course in the database.
 * This function relies on Supabase's Row-Level Security (RLS) to ensure
 * that users can only update their own records. The RLS policy should
 * check that `auth.uid() = user_id`.
 * @param id The unique identifier of the course to update.
 * @param course The CourseUpdate object containing the fields to update.
 * @returns A promise that resolves to the updated Course object.
 * @throws An error if the Supabase update fails or the record is not found.
 */
export async function updateCourse(id: string, course: CourseUpdate): Promise<Course> {
  const { data, error } = await supabase
    .from(TABLE)
    .update(course)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * Removes a course from the database.
 * @param id The unique identifier of the course to remove.
 * @param user_id The ID of the user, to ensure they own the record being deleted.
 * @returns A promise that resolves when the operation is complete.
 * @throws An error if the Supabase delete fails.
 */
export async function removeCourse(id: string, user_id: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id)
    .eq('user_id', user_id);
  if (error) throw error;
}
