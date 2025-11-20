/**
 * E2E tests for Department Head: Reject Requests workflow.
 */

describe('Department Head: Reject Requests', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('[data-cy="email-input"]').type('depthead@test.com');
    cy.get('[data-cy="password-input"]').type('deptpass123');
    cy.get('[data-cy="login-button"]').click();
    cy.url().should('include', '/dashboard');
    cy.get('[data-cy="nav-requests"]').click();
  });

  it('should reject a request with message', () => {
    cy.get('[data-cy="request-card"]').first().find('[data-cy="reject-request"]').click();
    cy.get('[data-cy="rejection-dialog"]').should('be.visible');
    
    cy.get('[data-cy="rejection-message"]').type('Resource not available during this period');
    cy.get('[data-cy="confirm-reject"]').click();
    
    cy.get('[data-cy="toast-success"]').should('contain', 'Request rejected');
  });

  it('should require rejection message', () => {
    cy.get('[data-cy="request-card"]').first().find('[data-cy="reject-request"]').click();
    cy.get('[data-cy="confirm-reject"]').click();
    
    cy.get('[data-cy="message-error"]').should('contain', 'required');
  });

  it('should show rejection reason to requester', () => {
    // Reject as department head
    cy.get('[data-cy="request-card"]').first().find('[data-cy="reject-request"]').click();
    cy.get('[data-cy="rejection-message"]').type('Not available');
    cy.get('[data-cy="confirm-reject"]').click();
    
    // Switch to program head view
    cy.get('[data-cy="user-menu"]').click();
    cy.get('[data-cy="logout"]').click();
    
    cy.visit('/login');
    cy.get('[data-cy="email-input"]').type('programhead@test.com');
    cy.get('[data-cy="password-input"]').type('testpass123');
    cy.get('[data-cy="login-button"]').click();
    cy.get('[data-cy="nav-requests"]').click();
    
    cy.get('[data-cy="request-rejected"]').should('contain', 'Not available');
  });
});
