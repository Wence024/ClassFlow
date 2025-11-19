/**
 * Centralized service for all classroom database operations.
 * Consolidates operations from features/classSessionComponents/services/classroomsService.ts
 */

import { supabase } from '../supabase';
import type { Classroom, ClassroomInsert, ClassroomUpdate } from '../../types/classroom';

const TABLE = 'classrooms';

/**
 * Fetches classrooms for CRUD/management views (admin-only access).
 */
export async function getClassrooms(params?: {
  role?: string | null;
  department_id?: string | null;
}): Promise<Classroom[]> {
  let query = supabase.from(TABLE).select('*').order('name');
  const role = params?.role ?? null;
  const departmentId = params?.department_id ?? null;
  if (role !== 'admin' && departmentId) {
    query = query.eq('department_id', departmentId);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

/**
 * Fetches ALL classrooms with department information for selection workflows.
 */
export async function getAllClassrooms(): Promise<Classroom[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select(
      `
      *,
      departments:preferred_department_id (
        name
      )
    `
    )
    .order('name');

  if (error) throw error;

  return (data || []).map((classroom) => ({
    ...classroom,
    preferred_department_name: classroom.departments?.name || null,
    departments: undefined,
  })) as Classroom[];
}

/**
 * Adds a new classroom to the database.
 */
export async function addClassroom(classroom: ClassroomInsert): Promise<Classroom> {
  const { data, error } = await supabase.from(TABLE).insert([classroom]).select().single();
  if (error) throw error;
  return data;
}

/**
 * Updates an existing classroom in the database.
 */
export async function updateClassroom(id: string, classroom: ClassroomUpdate): Promise<Classroom> {
  const { data, error } = await supabase.from(TABLE).update(classroom).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

/**
 * Removes a classroom from the database.
 */
export async function removeClassroom(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}
