/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/// <reference types="cypress" />

import { cleanupTestData, cleanupOrphanedTestData } from './testDataCleanup';
import {
  seedTestDepartment,
  seedTestProgram,
  seedTestUser,
  seedTestClassroom,
  seedTestInstructor,
  seedTestCourse,
  seedTestClassGroup,
  seedTestClassSession,
  seedTestEnvironment,
} from './seedTestData';

/**
 * Custom command to log in a user through the UI.
 * Encapsulates the process of navigating to login, filling credentials,
 * and submitting the form.
 *
 * @param role - The role of the user to log in as ('program_head', 'admin', etc.).
 *
 * @example
 * cy.loginAs('program_head')
 */
Cypress.Commands.add('loginAs', (role: 'program_head' | 'admin' | 'department_head') => {
  cy.session([role], () => {
    const username = Cypress.env(`${role}_username`);
    const password = Cypress.env(`${role}_password`);

    if (!username || !password) {
      throw new Error(`Missing username or password for role: ${role}. Check cypress.env.json.`);
    }

    cy.visit('/login');

    // Wait for the form to be interactive by asserting that the
    // email input is not disabled before typing.
    // Cypress will retry this assertion for its default timeout period (e.g., 4 seconds).

    cy.get('input[name="email"]').should('not.be.disabled').type(username, { log: false });
    cy.get('input[name="password"]').should('not.be.disabled').type(password, { log: false });
    cy.get('button[type="submit"]').should('not.be.disabled').click();
    
    // Wait for the main app layout to ensure login was successful
    cy.get('main').should('be.visible');
    cy.url().should('not.include', '/login');
  });
});

/**
 * Seeds test data into the database.
 *
 * @param dataType - The type of data to seed.
 * @param data - The data to seed.
 *
 * @example
 * cy.seedTestData('department', { name: 'CS Department', code: 'CS' })
 * cy.seedTestData('environment', { role: 'program_head', email: 'test@test.com' })
 */
Cypress.Commands.add('seedTestData', (dataType, data) => {
  return cy.wrap(null).then(async () => {
    switch (dataType) {
      case 'department':
        return seedTestDepartment(data);
      case 'program':
        return seedTestProgram(data);
      case 'user':
        return seedTestUser(data);
      case 'classroom':
        return seedTestClassroom(data);
      case 'instructor':
        return seedTestInstructor(data);
      case 'course':
        return seedTestCourse(data);
      case 'classGroup':
        return seedTestClassGroup(data);
      case 'classSession':
        return seedTestClassSession(data);
      case 'environment':
        return seedTestEnvironment(data);
      default:
        throw new Error(`Unknown data type: ${dataType}`);
    }
  });
});

/**
 * Cleans up all test data created during the test.
 *
 * @example
 * cy.cleanupTestData()
 */
Cypress.Commands.add('cleanupTestData', () => {
  return cy.wrap(cleanupTestData());
});

/**
 * Cleans up orphaned test data (fallback cleanup).
 *
 * @example
 * cy.cleanupOrphanedTestData()
 */
Cypress.Commands.add('cleanupOrphanedTestData', () => {
  return cy.wrap(cleanupOrphanedTestData());
});

// Global after hook for cleanup
afterEach(() => {
  cy.cleanupTestData();
});

// Add type definitions for Cypress custom commands
// Use namespace as required by Cypress type extension system
declare global {
  /* eslint-disable @typescript-eslint/no-namespace */
  namespace Cypress {
    interface Chainable {
      loginAs(role: 'program_head' | 'admin' | 'department_head'): Chainable<void>;
      seedTestData(dataType: string, data: Record<string, unknown>): Chainable<Record<string, unknown>>;
      cleanupTestData(): Chainable<void>;
      cleanupOrphanedTestData(): Chainable<void>;
    }
  }
  /* eslint-enable @typescript-eslint/no-namespace */
}