import type { Database } from '../../../lib/supabase.types';

export type Semester = Database['public']['Tables']['semesters']['Row'];
export type SemesterInsert = Database['public']['Tables']['semesters']['Insert'];
export type SemesterUpdate = Database['public']['Tables']['semesters']['Update'];
