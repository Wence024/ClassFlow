/// <reference types="cypress" />

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../src/integrations/supabase/types';

/**
 * Test Data Cleanup System.
 *
 * Removes all test data created during E2E tests by tracking created records
 * and deleting them in reverse order to respect foreign key constraints.
 */

export const TEST_DATA_PREFIX = 'CYPRESS_TEST_';

const supabaseUrl = 'https://wkfgcroybuuefaulqsru.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZmdjcm95YnV1ZWZhdWxxc3J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MjgxNzEsImV4cCI6MjA3OTAwNDE3MX0.OmmXnxzeGspJJgPr8r0yiYXXbwEtaIBmkT-KIZdE4Mg';

/**
 * Creates a Supabase client for cleanup operations.
 */
function getSupabaseClient() {
  return createClient<Database>(supabaseUrl, supabaseKey);
}

/**
 * Cleanup all test data created during E2E tests.
 *
 * Deletes records in reverse order of creation to respect foreign key constraints.
 */
export async function cleanupTestData() {
  const records = Cypress.env('testDataRecords') || [];
  
  if (records.length === 0) {
    cy.log('No test data to clean up');
    return;
  }

  cy.log(`Cleaning up ${records.length} test records`);

  const supabase = getSupabaseClient();

  // Delete in reverse order to handle foreign key constraints
  const reversedRecords = [...records].reverse();

  for (const record of reversedRecords) {
    await deleteRecord(supabase, record);
  }

  // Clear the tracking array
  Cypress.env('testDataRecords', []);
  cy.log('Test data cleanup complete');
}

/**
 * Helper function to delete a single record.
 *
 * @param supabase
 * @param record
 * @param record.table
 * @param record.id
 */
async function deleteRecord(supabase: SupabaseClient<Database>, record: {table: string, id: string}) {
  try {
    if (record.table === 'auth.users') {
      // Use the delete_test_user function for auth users
      const { error } = await supabase.rpc('delete_test_user', {
        email: record.id, // For users, we store email as id
      });
      if (error && !error.message.includes('not found')) {
        cy.log(`Warning: Failed to delete user ${record.id}: ${error.message}`);
      }
    } else {
      // For all other tables, use standard delete
      const { error } = await supabase
        .from(record.table as keyof Database['public']['Tables'])
        .delete()
        .eq('id', record.id);

      if (error && !error.message.includes('No rows found')) {
        cy.log(`Warning: Failed to delete ${record.table} record ${record.id}: ${error.message}`);
      }
    }
  } catch (error) {
    cy.log(`Error during cleanup of ${record.table}: ${error}`);
  }
}

/**
 * Cleanup all records with TEST_DATA_PREFIX in their names/codes.
 *
 * Fallback cleanup for any orphaned test data.
 */
export async function cleanupOrphanedTestData() {
  const supabase = getSupabaseClient();

  cy.log('Cleaning up orphaned test data...');

  // Tables that have name or code fields with test prefix
  const tablesToClean = [
    'departments',
    'programs',
    'classrooms',
    'instructors',
    'courses',
    'class_groups',
  ];

  for (const table of tablesToClean) {
    try {
      // Try cleaning by name
      await supabase
        .from(table as keyof Database['public']['Tables'])
        .delete()
        .ilike('name', `${TEST_DATA_PREFIX}%`);

      // Try cleaning by code
      await supabase
        .from(table as keyof Database['public']['Tables'])
        .delete()
        .ilike('code', `${TEST_DATA_PREFIX}%`);
    } catch (error) {
      cy.log(`Note: Could not clean ${table}: ${error}`);
    }
  }

  cy.log('Orphaned test data cleanup complete');
}

/**
 * Creates a unique test identifier with timestamp.
 *
 * @deprecated Use seedTestData functions instead.
 * @returns A unique test identifier string with prefix and timestamp.
 */
export function getTestId(): string {
  return `${TEST_DATA_PREFIX}${Date.now()}`;
}

/**
 * Tracks a created test record for cleanup.
 *
 * @deprecated This is handled automatically by seed functions.
 * @param tableName - The name of the table where the record was created.
 * @param id - The ID of the created record.
 */
export function trackTestRecord(tableName: string, id: string) {
  const records = Cypress.env('testDataRecords') || [];
  records.push({ table: tableName, id });
  Cypress.env('testDataRecords', records);
}

/**
 * Creates a test department with cleanup tracking.
 *
 * @deprecated Use seedTestDepartment from seedTestData instead.
 * @param name - Optional custom department name.
 * @param code - Optional custom department code.
 * @returns Test department object with name and code.
 */
export function createTestDepartment(name?: string, code?: string) {
  const testName = name || `${TEST_DATA_PREFIX}Dept_${Date.now()}`;
  const testCode = code || `TD${Date.now().toString().slice(-4)}`;
  
  return {
    name: testName,
    code: testCode,
  };
}
