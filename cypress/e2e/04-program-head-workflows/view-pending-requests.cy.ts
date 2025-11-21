/// <reference types="cypress" />

import { cleanupTestData } from '../../support/testDataCleanup';
import { setupCrossDeptRequest } from '../../support/testSetup';

/**
 * E2E Tests for Program Head: View Pending Requests.
 *
 * Tests the pending requests dashboard including:
 * - Viewing outgoing cross-department requests.
 * - Checking request status.
 * - Canceling pending requests.
 * - Seeing approval/rejection notifications.
 */

describe('Program Head: View Pending Requests', () => {
  let testEnv: Awaited<ReturnType<typeof setupCrossDeptRequest>>;

  before(async () => {
    testEnv = await setupCrossDeptRequest();
  });

  after(async () => {
    await cleanupTestData();
  });

  beforeEach(() => {
    // Login as program head A (requester)
    cy.visit('/login');
    cy.get('[data-cy="email-input"]').type(testEnv.userA.email);
    cy.get('[data-cy="password-input"]').type('TestPassword123!');
    cy.get('[data-cy="login-button"]').click();
    cy.url().should('not.include', '/login');
  });

  it('should display pending requests page', () => {
    cy.visit('/pending-requests');
    cy.contains('Pending Requests').should('be.visible');
  });

  it('should show outgoing cross-department request', () => {
    cy.visit('/pending-requests');

    // Should see the request to department B
    cy.contains('pending').should('be.visible');
    cy.contains(testEnv.deptB.name).should('be.visible');
  });

  it('should show request details', () => {
    cy.visit('/pending-requests');

    // Click on request to see details
    cy.get('[data-cy="request-row"]').first().click();

    // Should show full request details
    cy.get('[data-cy="request-details"]').should('be.visible');
    cy.contains('Instructor').should('be.visible');
    cy.contains(testEnv.instructorB.first_name).should('be.visible');
    cy.contains('Classroom').should('be.visible');
    cy.contains(testEnv.classroomB.name).should('be.visible');
  });

  it('should allow canceling a pending request', () => {
    cy.visit('/pending-requests');

    // Click cancel on the request
    cy.get('[data-cy="request-row"]')
      .first()
      .find('[data-cy="cancel-request-button"]')
      .click();

    // Confirm cancellation
    cy.get('[data-cy="confirm-cancel-button"]').click();

    // Should show success message
    cy.contains('Request canceled').should('be.visible');

    // Request should be removed from list
    cy.get('[data-cy="request-row"]').should('have.length', 0);
    cy.contains('No pending requests').should('be.visible');
  });

  it('should show notification when request is approved', () => {
    // First, have department head B approve the request
    cy.visit('/login');
    cy.get('[data-cy="email-input"]').clear().type(testEnv.userB.email);
    cy.get('[data-cy="password-input"]').clear().type('TestPassword123!');
    cy.get('[data-cy="login-button"]').click();

    cy.visit('/department-requests');
    cy.get('[data-cy="request-row"]')
      .first()
      .find('[data-cy="approve-button"]')
      .click();
    cy.get('[data-cy="confirm-approve-button"]').click();

    // Logout and login back as program head A
    cy.get('[data-cy="user-menu"]').click();
    cy.get('[data-cy="logout-button"]').click();

    cy.visit('/login');
    cy.get('[data-cy="email-input"]').type(testEnv.userA.email);
    cy.get('[data-cy="password-input"]').type('TestPassword123!');
    cy.get('[data-cy="login-button"]').click();

    // Should see notification about approval
    cy.visit('/pending-requests');
    cy.contains('approved').should('be.visible');
  });

  it('should show notification when request is rejected', () => {
    // First, have department head B reject the request
    cy.visit('/login');
    cy.get('[data-cy="email-input"]').clear().type(testEnv.userB.email);
    cy.get('[data-cy="password-input"]').clear().type('TestPassword123!');
    cy.get('[data-cy="login-button"]').click();

    cy.visit('/department-requests');
    cy.get('[data-cy="request-row"]')
      .first()
      .find('[data-cy="reject-button"]')
      .click();
    cy.get('[data-cy="rejection-message-input"]').type('Resource not available');
    cy.get('[data-cy="confirm-reject-button"]').click();

    // Logout and login back as program head A
    cy.get('[data-cy="user-menu"]').click();
    cy.get('[data-cy="logout-button"]').click();

    cy.visit('/login');
    cy.get('[data-cy="email-input"]').type(testEnv.userA.email);
    cy.get('[data-cy="password-input"]').type('TestPassword123!');
    cy.get('[data-cy="login-button"]').click();

    // Should see notification about rejection
    cy.visit('/pending-requests');
    cy.contains('rejected').should('be.visible');
    cy.contains('Resource not available').should('be.visible');
  });

  it('should filter requests by status', () => {
    cy.visit('/pending-requests');

    // Filter to pending only
    cy.get('[data-cy="status-filter"]').click();
    cy.contains('Pending').click();

    // Should see pending requests
    cy.get('[data-cy="request-row"]').should('exist');
  });

  it('should show request count badge in header', () => {
    cy.visit('/dashboard');

    // Should see badge with pending request count
    cy.get('[data-cy="pending-requests-badge"]').should('be.visible');
    cy.get('[data-cy="pending-requests-badge"]').should('contain', '1');
  });

  it('should update badge count after canceling', () => {
    cy.visit('/pending-requests');

    // Note initial badge count
    cy.get('[data-cy="pending-requests-badge"]').then(($badge) => {
      const initialCount = parseInt($badge.text());

      // Cancel a request
      cy.get('[data-cy="request-row"]')
        .first()
        .find('[data-cy="cancel-request-button"]')
        .click();
      cy.get('[data-cy="confirm-cancel-button"]').click();

      // Badge count should decrease
      cy.get('[data-cy="pending-requests-badge"]').should(
        'contain',
        (initialCount - 1).toString()
      );
    });
  });

  it('should dismiss notification after viewing', () => {
    cy.visit('/pending-requests');

    // Click dismiss on a notification
    cy.get('[data-cy="dismiss-notification-button"]').first().click();

    // Notification should be removed
    cy.contains('No new notifications').should('be.visible');
  });

  it('should show empty state when no requests', () => {
    cy.visit('/pending-requests');

    // Cancel all requests first
    cy.get('[data-cy="request-row"]').each(() => {
      cy.get('[data-cy="cancel-request-button"]').first().click();
      cy.get('[data-cy="confirm-cancel-button"]').click();
    });

    // Should show empty state
    cy.contains('No pending requests').should('be.visible');
    cy.contains('create a class session').should('be.visible');
  });
});
