import { supabase } from '../../../lib/supabase';
import type { Database } from '../../../lib/supabase.types';

const TABLE = 'courses';

type Course = Database['public']['Tables']['courses']['Row'];
type CourseInsert = Database['public']['Tables']['courses']['Insert'];
type CourseUpdate = Database['public']['Tables']['courses']['Update'];

export async function getCourses(user_id: string): Promise<Course[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', user_id)
    .order('name');
  if (error) throw error;
  return data || [];
}

export async function addCourse(course: CourseInsert): Promise<Course> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([course])
    .select()
    .single();
  if (error) throw error;
  return data;
}

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

export async function removeCourse(id: string, user_id: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id)
    .eq('user_id', user_id);
  if (error) throw error;
}
