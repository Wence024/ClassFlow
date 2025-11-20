/**
 * E2E tests for Admin: User Management workflow.
 */

describe('Admin: User Management', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('[data-cy="email-input"]').type('admin@test.com');
    cy.get('[data-cy="password-input"]').type('adminpass123');
    cy.get('[data-cy="login-button"]').click();
    cy.url().should('include', '/dashboard');
    cy.get('[data-cy="nav-users"]').click();
  });

  it('should display list of users', () => {
    cy.get('[data-cy="users-list"]').should('be.visible');
    cy.get('[data-cy="user-row"]').should('have.length.greaterThan', 0);
  });

  it('should create a new user', () => {
    cy.get('[data-cy="add-user-button"]').click();
    cy.get('[data-cy="user-dialog"]').should('be.visible');
    
    cy.get('[data-cy="user-name-input"]').type('New User');
    cy.get('[data-cy="user-email-input"]').type('newuser@test.com');
    cy.get('[data-cy="user-role-select"]').click();
    cy.get('[data-cy="role-program_head"]').click();
    cy.get('[data-cy="user-program-select"]').click();
    cy.get('[data-cy="program-option"]').first().click();
    
    cy.get('[data-cy="submit-user"]').click();
    cy.get('[data-cy="toast-success"]').should('contain', 'User created');
  });

  it('should update user role', () => {
    cy.get('[data-cy="user-row"]').first().find('[data-cy="edit-user"]').click();
    cy.get('[data-cy="user-role-select"]').click();
    cy.get('[data-cy="role-department_head"]').click();
    cy.get('[data-cy="submit-user"]').click();
    cy.get('[data-cy="toast-success"]').should('contain', 'User updated');
  });

  it('should delete a user', () => {
    cy.get('[data-cy="user-row"]').first().find('[data-cy="delete-user"]').click();
    cy.get('[data-cy="confirm-delete"]').click();
    cy.get('[data-cy="toast-success"]').should('contain', 'User deleted');
  });

  it('should filter users by role', () => {
    cy.get('[data-cy="role-filter"]').click();
    cy.get('[data-cy="filter-admin"]').click();
    cy.get('[data-cy="user-row"]').each(($row) => {
      cy.wrap($row).should('contain', 'Admin');
    });
  });
});
