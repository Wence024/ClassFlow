/**
 * Database helper functions for Cypress E2E tests.
 * Provides utilities for creating, managing, and cleaning up test data.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = Cypress.env('VITE_SUPABASE_URL') || Cypress.env('supabaseUrl');
const supabaseKey = Cypress.env('VITE_SUPABASE_ANON_KEY') || Cypress.env('supabaseKey');

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and key must be configured in cypress.config.ts');
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Creates a test department and returns its ID.
 */
export const createTestDepartment = async (data: { name: string; code: string }) => {
  const { data: dept, error } = await supabase
    .from('departments')
    .insert(data)
    .select('id')
    .single();
  
  if (error) throw error;
  return dept.id;
};

/**
 * Creates a test program and returns its ID.
 */
export const createTestProgram = async (data: {
  name: string;
  code: string;
  department_id: string;
}) => {
  const { data: program, error } = await supabase
    .from('programs')
    .insert(data)
    .select('id')
    .single();
  
  if (error) throw error;
  return program.id;
};

/**
 * Creates a test user via Supabase auth and profile.
 */
export const createTestUser = async (data: {
  email: string;
  password: string;
  name: string;
  role: string;
  department_id?: string | null;
  program_id?: string | null;
}) => {
  // This would require admin privileges or service role key
  // For now, this is a placeholder - actual implementation depends on your auth setup
  console.warn('createTestUser: Implement using service role or admin API');
  return { id: 'test-user-id' };
};

/**
 * Deletes all test data created during the test run.
 * Uses TEST_* prefix to identify and remove test entities.
 */
export const cleanupTestData = async () => {
  try {
    // Delete test departments (cascades to programs, courses, etc.)
    await supabase.from('departments').delete().like('name', 'TEST_%CYPRESS%');
    
    // Delete test classrooms
    await supabase.from('classrooms').delete().like('name', 'TEST_ROOM%');
    
    // Delete test instructors
    await supabase.from('instructors').delete().like('email', 'test_instructor%@cypress.test');
    
    console.log('Test data cleanup completed');
  } catch (error) {
    console.error('Error cleaning up test data:', error);
  }
};

/**
 * Gets a specific resource by ID.
 */
export const getResourceById = async (table: string, id: string) => {
  const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

/**
 * Checks if a resource exists.
 */
export const resourceExists = async (table: string, id: string): Promise<boolean> => {
  const { data } = await supabase.from(table).select('id').eq('id', id).maybeSingle();
  return data !== null;
};

/**
 * Backs up production data before tests (optional safety measure).
 */
export const backupProductionData = async (table: string, filter?: Record<string, unknown>) => {
  let query = supabase.from(table).select('*');
  
  if (filter) {
    Object.entries(filter).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
  }
  
  const { data, error } = await query;
  if (error) throw error;
  
  // Store in localStorage or return for later restoration
  return data;
};

/**
 * Restores production data after tests.
 */
export const restoreProductionData = async (table: string, data: unknown[]) => {
  if (!data || data.length === 0) return;
  
  const { error } = await supabase.from(table).upsert(data);
  if (error) throw error;
};
