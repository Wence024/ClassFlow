/**
 * E2E tests for Department Head: Approve Requests workflow.
 */

describe('Department Head: Approve Requests', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('[data-cy="email-input"]').type('depthead@test.com');
    cy.get('[data-cy="password-input"]').type('deptpass123');
    cy.get('[data-cy="login-button"]').click();
    cy.url().should('include', '/dashboard');
    cy.get('[data-cy="nav-requests"]').click();
  });

  it('should display pending requests for department', () => {
    cy.get('[data-cy="requests-list"]').should('be.visible');
    cy.get('[data-cy="request-card"]').should('have.length.greaterThan', 0);
  });

  it('should approve a resource request', () => {
    cy.get('[data-cy="request-card"]').first().find('[data-cy="approve-request"]').click();
    cy.get('[data-cy="confirm-approve"]').click();
    cy.get('[data-cy="toast-success"]').should('contain', 'Request approved');
  });

  it('should show request details', () => {
    cy.get('[data-cy="request-card"]').first().click();
    cy.get('[data-cy="request-details"]').should('be.visible');
    cy.get('[data-cy="request-resource"]').should('exist');
    cy.get('[data-cy="request-program"]').should('exist');
  });

  it('should filter requests by status', () => {
    cy.get('[data-cy="status-filter"]').click();
    cy.get('[data-cy="filter-pending"]').click();
    cy.get('[data-cy="request-card"]').each(($card) => {
      cy.wrap($card).should('contain', 'Pending');
    });
  });
});
