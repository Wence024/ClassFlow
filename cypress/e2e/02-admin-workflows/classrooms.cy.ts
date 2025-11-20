/// <reference types="cypress" />

import { cleanupTestData } from '../../support/testDataCleanup';
import { setupProgramHeadEnvironment } from '../../support/testSetup';

/**
 * E2E Tests for Admin Classroom Management.
 *
 * Tests full CRUD workflow for classrooms including:
 * - Creating classrooms with department preferences
 * - Viewing all classrooms
 * - Editing classroom details
 * - Deleting classrooms (and handling foreign key constraints)
 */

describe('Admin: Manage Classrooms', () => {
  let testEnv: Awaited<ReturnType<typeof setupProgramHeadEnvironment>>;
  let adminUser: { userId: string; email: string };

  before(async () => {
    // Setup test environment
    testEnv = await setupProgramHeadEnvironment({
      email: `admin_classrooms_${Date.now()}@cypress.test`,
      password: 'TestPassword123!',
    });

    // Create admin user
    const { seedTestUser } = await import('../../support/seedTestData');
    adminUser = await seedTestUser({
      email: `admin_${Date.now()}@cypress.test`,
      password: 'AdminPassword123!',
      fullName: 'Admin User',
      role: 'admin',
    });
  });

  after(async () => {
    await cleanupTestData();
  });

  beforeEach(() => {
    // Login as admin
    cy.visit('/login');
    cy.get('[data-cy="email-input"]').type(adminUser.email);
    cy.get('[data-cy="password-input"]').type('AdminPassword123!');
    cy.get('[data-cy="login-button"]').click();
    cy.url().should('not.include', '/login');
  });

  it('should display classrooms page for admin', () => {
    cy.visit('/classrooms');
    cy.contains('Classrooms').should('be.visible');
  });

  it('should create a new classroom', () => {
    cy.visit('/classrooms');

    // Open create dialog
    cy.get('[data-cy="add-classroom-button"]').click();

    // Fill in classroom details
    cy.get('[data-cy="classroom-name-input"]').type('Test Classroom 101');
    cy.get('[data-cy="classroom-code-input"]').type('TC101');
    cy.get('[data-cy="classroom-capacity-input"]').type('30');
    cy.get('[data-cy="classroom-location-input"]').type('Building A');

    // Select preferred department
    cy.get('[data-cy="classroom-department-select"]').click();
    cy.contains(testEnv.department.name).click();

    // Submit
    cy.get('[data-cy="save-classroom-button"]').click();

    // Verify success message
    cy.contains('Classroom created successfully').should('be.visible');

    // Verify classroom appears in list
    cy.contains('Test Classroom 101').should('be.visible');
    cy.contains('TC101').should('be.visible');
  });

  it('should edit an existing classroom', () => {
    cy.visit('/classrooms');

    // Find and click edit button for test classroom
    cy.contains('Test Classroom 101')
      .parents('[data-cy="classroom-row"]')
      .find('[data-cy="edit-classroom-button"]')
      .click();

    // Update capacity
    cy.get('[data-cy="classroom-capacity-input"]').clear().type('35');

    // Update location
    cy.get('[data-cy="classroom-location-input"]').clear().type('Building A - Floor 2');

    // Save changes
    cy.get('[data-cy="save-classroom-button"]').click();

    // Verify success message
    cy.contains('Classroom updated successfully').should('be.visible');

    // Verify updated values
    cy.contains('35').should('be.visible');
  });

  it('should show department-prioritized list', () => {
    cy.visit('/classrooms');

    // Admin should see their department's classrooms first
    // Then a separator
    // Then other departments' classrooms
    cy.get('[data-cy="classroom-list"]').should('be.visible');

    // Verify department name appears for classrooms
    cy.contains(testEnv.department.name).should('be.visible');
  });

  it('should prevent deletion of classroom in use', () => {
    // First, create a class session that uses the test classroom
    cy.visit('/timetable');

    // The test environment already has a class session
    // Try to delete the classroom used by that session
    cy.visit('/classrooms');

    cy.contains(testEnv.classroom.name)
      .parents('[data-cy="classroom-row"]')
      .find('[data-cy="delete-classroom-button"]')
      .click();

    // Confirm deletion
    cy.get('[data-cy="confirm-delete-button"]').click();

    // Should show error message about foreign key constraint
    cy.contains('This classroom is being used').should('be.visible');

    // Classroom should still be in the list
    cy.contains(testEnv.classroom.name).should('be.visible');
  });

  it('should successfully delete unused classroom', () => {
    cy.visit('/classrooms');

    // Find test classroom that's not in use
    cy.contains('Test Classroom 101')
      .parents('[data-cy="classroom-row"]')
      .find('[data-cy="delete-classroom-button"]')
      .click();

    // Confirm deletion
    cy.get('[data-cy="confirm-delete-button"]').click();

    // Verify success message
    cy.contains('Classroom removed successfully').should('be.visible');

    // Verify classroom is removed from list
    cy.contains('Test Classroom 101').should('not.exist');
  });

  it('should validate required fields', () => {
    cy.visit('/classrooms');

    // Open create dialog
    cy.get('[data-cy="add-classroom-button"]').click();

    // Try to submit without filling required fields
    cy.get('[data-cy="save-classroom-button"]').click();

    // Should show validation errors
    cy.contains('required').should('be.visible');
  });

  it('should filter classrooms by search', () => {
    cy.visit('/classrooms');

    // Type in search box
    cy.get('[data-cy="classroom-search-input"]').type(testEnv.classroom.name);

    // Should only show matching classrooms
    cy.contains(testEnv.classroom.name).should('be.visible');

    // Clear search
    cy.get('[data-cy="classroom-search-input"]').clear();

    // All classrooms should be visible again
    cy.get('[data-cy="classroom-row"]').should('have.length.greaterThan', 0);
  });
});
