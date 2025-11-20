/// <reference types="cypress" />

import { cleanupTestData } from '../../support/testDataCleanup';
import { setupProgramHeadEnvironment } from '../../support/testSetup';

/**
 * E2E Tests for Program Head: Manage Class Groups.
 *
 * Tests full CRUD workflow for class groups including:
 * - Creating class groups with name, code, student count.
 * - Viewing all class groups for the program.
 * - Editing class group details.
 * - Deleting class groups.
 * - Assigning colors to class groups.
 */

describe('Program Head: Manage Class Groups', () => {
  let testEnv: Awaited<ReturnType<typeof setupProgramHeadEnvironment>>;

  before(async () => {
    testEnv = await setupProgramHeadEnvironment({
      email: `prog_head_groups_${Date.now()}@cypress.test`,
      // eslint-disable-next-line sonarjs/no-hardcoded-passwords
      password: 'TestPassword123!',
    });
  });

  after(async () => {
    await cleanupTestData();
  });

  beforeEach(() => {
    // Login as program head
    cy.visit('/login');
    cy.get('[data-cy="email-input"]').type(testEnv.user.email);
    // eslint-disable-next-line sonarjs/no-hardcoded-passwords
    cy.get('[data-cy="password-input"]').type('TestPassword123!');
    cy.get('[data-cy="login-button"]').click();
    cy.url().should('not.include', '/login');
  });

  it('should display class groups management page', () => {
    cy.visit('/class-groups');
    cy.contains('Class Groups').should('be.visible');
  });

  it('should show existing class group', () => {
    cy.visit('/class-groups');
    cy.contains(testEnv.classGroup.name).should('be.visible');
  });

  it('should create a new class group', () => {
    cy.visit('/class-groups');

    // Open create dialog
    cy.get('[data-cy="add-class-group-button"]').click();

    // Fill in class group details
    cy.get('[data-cy="class-group-name-input"]').type('BSCS 2-A');
    cy.get('[data-cy="class-group-code-input"]').type('CS2A');
    cy.get('[data-cy="student-count-input"]').type('35');

    // Select a color
    cy.get('[data-cy="color-picker"]').click();
    cy.get('[data-cy="color-blue"]').click();

    // Submit
    cy.get('[data-cy="save-class-group-button"]').click();

    // Verify success message
    cy.contains('Class group created successfully').should('be.visible');

    // Verify class group appears in list
    cy.contains('BSCS 2-A').should('be.visible');
    cy.contains('CS2A').should('be.visible');
    cy.contains('35').should('be.visible');
  });

  it('should edit an existing class group', () => {
    cy.visit('/class-groups');

    // Find and click edit button for test class group
    cy.contains('BSCS 2-A')
      .parents('[data-cy="class-group-row"]')
      .find('[data-cy="edit-class-group-button"]')
      .click();

    // Update student count
    cy.get('[data-cy="student-count-input"]').clear().type('40');

    // Update name
    cy.get('[data-cy="class-group-name-input"]').clear().type('BSCS 2-A (Expanded)');

    // Save changes
    cy.get('[data-cy="save-class-group-button"]').click();

    // Verify success message
    cy.contains('Class group updated successfully').should('be.visible');

    // Verify updated values
    cy.contains('BSCS 2-A (Expanded)').should('be.visible');
    cy.contains('40').should('be.visible');
  });

  it('should validate required fields', () => {
    cy.visit('/class-groups');

    // Open create dialog
    cy.get('[data-cy="add-class-group-button"]').click();

    // Try to submit without filling required fields
    cy.get('[data-cy="save-class-group-button"]').click();

    // Should show validation errors
    cy.contains('Name is required').should('be.visible');
  });

  it('should validate student count as positive number', () => {
    cy.visit('/class-groups');

    cy.get('[data-cy="add-class-group-button"]').click();

    // Enter negative student count
    cy.get('[data-cy="class-group-name-input"]').type('Test Group');
    cy.get('[data-cy="student-count-input"]').type('-5');
    cy.get('[data-cy="save-class-group-button"]').click();

    // Should show validation error
    cy.contains('must be a positive number').should('be.visible');
  });

  it('should prevent duplicate codes', () => {
    cy.visit('/class-groups');

    cy.get('[data-cy="add-class-group-button"]').click();

    // Use existing code
    cy.get('[data-cy="class-group-name-input"]').type('Duplicate Group');
    cy.get('[data-cy="class-group-code-input"]').type(testEnv.classGroup.code);
    cy.get('[data-cy="student-count-input"]').type('25');
    cy.get('[data-cy="save-class-group-button"]').click();

    // Should show error about duplicate code
    cy.contains('already exists').should('be.visible');
  });

  it('should show class group color in timetable', () => {
    cy.visit('/timetable');

    // The class group assigned to a session should show its color
    cy.get('[data-cy="class-session-cell"]')
      .first()
      .should('have.css', 'background-color');
  });

  it('should delete an unused class group', () => {
    cy.visit('/class-groups');

    // Find test class group that's not in use
    cy.contains('BSCS 2-A (Expanded)')
      .parents('[data-cy="class-group-row"]')
      .find('[data-cy="delete-class-group-button"]')
      .click();

    // Confirm deletion
    cy.get('[data-cy="confirm-delete-button"]').click();

    // Verify success message
    cy.contains('Class group deleted successfully').should('be.visible');

    // Verify class group is removed from list
    cy.contains('BSCS 2-A (Expanded)').should('not.exist');
  });

  it('should prevent deletion of class group in use', () => {
    cy.visit('/class-groups');

    // Try to delete the class group that has sessions
    cy.contains(testEnv.classGroup.name)
      .parents('[data-cy="class-group-row"]')
      .find('[data-cy="delete-class-group-button"]')
      .click();

    // Confirm deletion
    cy.get('[data-cy="confirm-delete-button"]').click();

    // Should show error about foreign key constraint
    cy.contains('cannot be deleted').should('be.visible');
    cy.contains('class sessions').should('be.visible');

    // Class group should still be in the list
    cy.contains(testEnv.classGroup.name).should('be.visible');
  });

  it('should filter class groups by search', () => {
    cy.visit('/class-groups');

    // Type in search box
    cy.get('[data-cy="class-group-search-input"]').type(testEnv.classGroup.name);

    // Should only show matching class groups
    cy.contains(testEnv.classGroup.name).should('be.visible');

    // Clear search
    cy.get('[data-cy="class-group-search-input"]').clear();

    // All class groups should be visible again
    cy.get('[data-cy="class-group-row"]').should('have.length.at.least', 1);
  });

  it('should show class group in session creation', () => {
    cy.visit('/class-sessions');

    // Open create session dialog
    cy.get('[data-cy="add-session-button"]').click();

    // Class group dropdown should include our test group
    cy.get('[data-cy="class-group-select"]').click();
    cy.contains(testEnv.classGroup.name).should('be.visible');
  });
});
