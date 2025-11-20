/// <reference types="cypress" />

import { cleanupTestData } from '../../support/testDataCleanup';
import { setupCrossDeptRequest } from '../../support/testSetup';

/**
 * E2E Tests for Department Head: View Department Requests.
 *
 * Tests the department requests dashboard including:
 * - Viewing all incoming requests for the department.
 * - Filtering requests by status.
 * - Seeing request details.
 * - Quick approval/rejection from the dashboard.
 */

describe('Department Head: View Department Requests', () => {
  let testEnv: Awaited<ReturnType<typeof setupCrossDeptRequest>>;

  before(async () => {
    // Setup cross-department request scenario
    testEnv = await setupCrossDeptRequest();
  });

  after(async () => {
    await cleanupTestData();
  });

  beforeEach(() => {
    // Login as department head B (resource owner)
    cy.visit('/login');
    cy.get('[data-cy="email-input"]').type(testEnv.userB.email);
    cy.get('[data-cy="password-input"]').type('TestPassword123!');
    cy.get('[data-cy="login-button"]').click();
    cy.url().should('not.include', '/login');
  });

  it('should display department requests page', () => {
    cy.visit('/department-requests');
    cy.contains('Department Requests').should('be.visible');
  });

  it('should show incoming cross-department request', () => {
    cy.visit('/department-requests');

    // Should see the request from program A
    cy.contains('pending').should('be.visible');
    cy.contains(testEnv.programA.name).should('be.visible');
  });

  it('should filter requests by status', () => {
    cy.visit('/department-requests');

    // Filter to pending only
    cy.get('[data-cy="status-filter"]').click();
    cy.contains('Pending').click();

    // Should see pending requests
    cy.get('[data-cy="request-row"]').should('have.length.at.least', 1);

    // Filter to approved
    cy.get('[data-cy="status-filter"]').click();
    cy.contains('Approved').click();

    // Should see no requests (none approved yet)
    cy.contains('No requests found').should('be.visible');
  });

  it('should show request details when clicking on a request', () => {
    cy.visit('/department-requests');

    // Click on the first request
    cy.get('[data-cy="request-row"]').first().click();

    // Should show request details
    cy.get('[data-cy="request-details"]').should('be.visible');
    cy.contains('Course').should('be.visible');
    cy.contains('Instructor').should('be.visible');
    cy.contains('Classroom').should('be.visible');
  });

  it('should approve request from dashboard', () => {
    cy.visit('/department-requests');

    // Click approve on the first pending request
    cy.get('[data-cy="request-row"]')
      .first()
      .find('[data-cy="approve-button"]')
      .click();

    // Confirm approval
    cy.get('[data-cy="confirm-approve-button"]').click();

    // Should show success message
    cy.contains('Request approved').should('be.visible');

    // Request should now show as approved
    cy.contains('approved').should('be.visible');
  });

  it('should reject request from dashboard with message', () => {
    cy.visit('/department-requests');

    // Create another request for rejection
    // (First login as program head A to create another request)
    cy.visit('/login');
    cy.get('[data-cy="email-input"]').clear().type(testEnv.userA.email);
    cy.get('[data-cy="password-input"]').clear().type('TestPassword123!');
    cy.get('[data-cy="login-button"]').click();

    // Create a new session requesting cross-dept resource
    // (This would be a full workflow, simplified here)

    // Login back as department head B
    cy.visit('/login');
    cy.get('[data-cy="email-input"]').clear().type(testEnv.userB.email);
    cy.get('[data-cy="password-input"]').clear().type('TestPassword123!');
    cy.get('[data-cy="login-button"]').click();

    cy.visit('/department-requests');

    // Click reject on a pending request
    cy.get('[data-cy="request-row"]')
      .first()
      .find('[data-cy="reject-button"]')
      .click();

    // Enter rejection message
    cy.get('[data-cy="rejection-message-input"]').type(
      'Instructor not available for this time slot'
    );

    // Confirm rejection
    cy.get('[data-cy="confirm-reject-button"]').click();

    // Should show success message
    cy.contains('Request rejected').should('be.visible');
  });

  it('should show request count badge', () => {
    cy.visit('/dashboard');

    // Should see notification badge with pending request count
    cy.get('[data-cy="requests-badge"]').should('be.visible');
    cy.get('[data-cy="requests-badge"]').should('contain', '1');
  });

  it('should show different views for different departments', () => {
    // Department head should only see requests for their department
    cy.visit('/department-requests');

    // All visible requests should be for department B
    cy.get('[data-cy="request-row"]').each(($row) => {
      cy.wrap($row).should('contain', testEnv.deptB.name);
      cy.wrap($row).should('not.contain', testEnv.deptA.name);
    });
  });

  it('should update request count after approval', () => {
    cy.visit('/department-requests');

    // Note initial count
    cy.get('[data-cy="pending-count"]').then(($count) => {
      const initialCount = parseInt($count.text());

      // Approve a request
      cy.get('[data-cy="request-row"]')
        .first()
        .find('[data-cy="approve-button"]')
        .click();
      cy.get('[data-cy="confirm-approve-button"]').click();

      // Count should decrease
      cy.get('[data-cy="pending-count"]').should('contain', (initialCount - 1).toString());
    });
  });

  it('should sort requests by date', () => {
    cy.visit('/department-requests');

    // Click sort by date
    cy.get('[data-cy="sort-by-date"]').click();

    // Verify requests are in date order
    cy.get('[data-cy="request-row"]')
      .first()
      .should('contain', 'Most recent');
  });
});
