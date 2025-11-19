/**
 * Centralized service for all course database operations.
 * Consolidates operations from features/classSessionComponents/services/coursesService.ts
 */

import { supabase } from '../supabase';
import type { Course, CourseInsert, CourseUpdate } from '../../types/course';

const TABLE = 'courses';

/**
 * Fetches all courses for a specific program.
 */
export async function getCoursesByProgram(program_id: string): Promise<Course[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('program_id', program_id)
    .order('name');
  if (error) throw error;
  return data || [];
}

/**
 * Fetches ALL courses with program metadata for cross-program workflows.
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

  return (data?.map((course) => ({
    ...course,
    program_name: course.programs?.name || null,
    program_short_code: course.programs?.short_code || null,
    programs: undefined,
  })) || []) as Course[];
}

/**
 * Adds a new course to the database.
 */
export async function addCourse(course: CourseInsert): Promise<Course> {
  const { data, error } = await supabase.from(TABLE).insert([course]).select().single();
  if (error) throw error;
  return data;
}

/**
 * Updates an existing course in the database.
 */
export async function updateCourse(id: string, course: CourseUpdate): Promise<Course> {
  const { data, error } = await supabase.from(TABLE).update(course).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

/**
 * Removes a course from the database.
 */
export async function removeCourse(id: string, user_id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id).eq('created_by', user_id);
  if (error) throw error;
}
