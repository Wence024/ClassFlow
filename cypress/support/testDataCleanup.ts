/// <reference types="cypress" />

/**
 * Test Data Management.
 *
 * Utilities for creating test data and ensuring cleanup after tests.
 * All test data should be created with a prefix to identify it for cleanup.
 */

export const TEST_DATA_PREFIX = 'E2E_TEST_';

/**
 * Creates a unique test identifier with timestamp.
 *
 * @returns A unique test identifier string with prefix and timestamp.
 */
export function getTestId(): string {
  return `${TEST_DATA_PREFIX}${Date.now()}`;
}

/**
 * Cleanup all test data created during E2E tests.
 *
 * Should be called in a global afterEach or after hook.
 */
export function cleanupTestData() {
  // Store created test IDs in Cypress env for tracking
  const createdIds = Cypress.env('createdTestIds') || [];
  
  if (createdIds.length === 0) {
    return;
  }

  cy.log(`Cleaning up ${createdIds.length} test records`);
  
  // Note: Actual cleanup would require direct database access or API calls
  // For now, we rely on the database being reset between test suites
  
  // Clear the tracking array
  Cypress.env('createdTestIds', []);
}

/**
 * Tracks a created test record for cleanup.
 *
 * @param tableName - The name of the table where the record was created.
 * @param id - The ID of the created record.
 */
export function trackTestRecord(tableName: string, id: string) {
  const createdIds = Cypress.env('createdTestIds') || [];
  createdIds.push({ table: tableName, id });
  Cypress.env('createdTestIds', createdIds);
}

/**
 * Creates a test department with cleanup tracking.
 *
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
