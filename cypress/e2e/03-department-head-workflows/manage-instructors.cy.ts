/**
 * E2E tests for Department Head: Manage Instructors workflow.
 */

describe('Department Head: Manage Instructors', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('[data-cy="email-input"]').type('depthead@test.com');
    cy.get('[data-cy="password-input"]').type('deptpass123');
    cy.get('[data-cy="login-button"]').click();
    cy.url().should('include', '/dashboard');
    cy.get('[data-cy="nav-instructors"]').click();
  });

  it('should display department instructors', () => {
    cy.get('[data-cy="instructors-list"]').should('be.visible');
    cy.get('[data-cy="instructor-row"]').should('have.length.greaterThan', 0);
  });

  it('should create a new instructor in department', () => {
    cy.get('[data-cy="add-instructor-button"]').click();
    cy.get('[data-cy="instructor-dialog"]').should('be.visible');
    
    cy.get('[data-cy="instructor-first-name"]').type('John');
    cy.get('[data-cy="instructor-last-name"]').type('Doe');
    cy.get('[data-cy="instructor-email"]').type('john.doe@test.com');
    
    cy.get('[data-cy="submit-instructor"]').click();
    cy.get('[data-cy="toast-success"]').should('contain', 'Instructor created');
  });

  it('should edit instructor details', () => {
    cy.get('[data-cy="instructor-row"]').first().find('[data-cy="edit-instructor"]').click();
    cy.get('[data-cy="instructor-first-name"]').clear().type('Jane');
    cy.get('[data-cy="submit-instructor"]').click();
    cy.get('[data-cy="toast-success"]').should('contain', 'Instructor updated');
  });

  it('should delete an instructor', () => {
    cy.get('[data-cy="instructor-row"]').first().find('[data-cy="delete-instructor"]').click();
    cy.get('[data-cy="confirm-delete"]').click();
    cy.get('[data-cy="toast-success"]').should('contain', 'Instructor deleted');
  });

  it('should show department instructors first', () => {
    // Verify prioritization: department instructors at top
    cy.get('[data-cy="instructor-row"]').first().should('have.attr', 'data-priority', 'own');
  });
});
