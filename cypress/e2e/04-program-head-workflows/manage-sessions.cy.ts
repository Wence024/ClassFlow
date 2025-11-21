/**
 * E2E tests for Program Head: Manage Class Sessions workflow.
 * Tests the complete user journey for managing class sessions.
 */

describe('Program Head: Manage Class Sessions', () => {
  beforeEach(() => {
    // Login as program head
    cy.visit('/login');
    cy.get('[data-cy="email-input"]').type('programhead@test.com');
    cy.get('[data-cy="password-input"]').type('testpass123');
    cy.get('[data-cy="login-button"]').click();
    
    // Wait for redirect and navigate to sessions page
    cy.url().should('include', '/dashboard');
    cy.get('[data-cy="nav-class-sessions"]').click();
  });

  it('should display list of class sessions', () => {
    cy.get('[data-cy="class-sessions-list"]').should('be.visible');
    cy.get('[data-cy="session-card"]').should('have.length.greaterThan', 0);
  });

  it('should create a new class session', () => {
    // Open add dialog
    cy.get('[data-cy="add-session-button"]').click();
    cy.get('[data-cy="session-dialog"]').should('be.visible');

    // Fill in session details
    cy.get('[data-cy="course-select"]').click();
    cy.get('[data-cy="course-option"]').first().click();

    cy.get('[data-cy="group-select"]').click();
    cy.get('[data-cy="group-option"]').first().click();

    cy.get('[data-cy="instructor-select"]').click();
    cy.get('[data-cy="instructor-option"]').first().click();

    cy.get('[data-cy="classroom-select"]').click();
    cy.get('[data-cy="classroom-option"]').first().click();

    cy.get('[data-cy="period-count-input"]').clear().type('2');

    // Submit
    cy.get('[data-cy="submit-session"]').click();

    // Verify success
    cy.get('[data-cy="toast-success"]').should('contain', 'Session created');
    cy.get('[data-cy="session-card"]').should('contain', 'MATH101'); // Assuming first course is MATH101
  });

  it('should edit an existing class session', () => {
    // Click edit on first session
    cy.get('[data-cy="session-card"]').first().find('[data-cy="edit-session"]').click();
    cy.get('[data-cy="session-dialog"]').should('be.visible');

    // Change period count
    cy.get('[data-cy="period-count-input"]').clear().type('3');

    // Submit
    cy.get('[data-cy="submit-session"]').click();

    // Verify success
    cy.get('[data-cy="toast-success"]').should('contain', 'Session updated');
  });

  it('should delete a class session', () => {
    const initialCount = Cypress.$('[data-cy="session-card"]').length;

    // Click delete on first session
    cy.get('[data-cy="session-card"]').first().find('[data-cy="delete-session"]').click();

    // Confirm deletion
    cy.get('[data-cy="confirm-delete"]').click();

    // Verify success
    cy.get('[data-cy="toast-success"]').should('contain', 'Session deleted');
    cy.get('[data-cy="session-card"]').should('have.length', initialCount - 1);
  });

  it('should search and filter sessions', () => {
    // Type in search
    cy.get('[data-cy="search-sessions"]').type('MATH');

    // Verify filtered results
    cy.get('[data-cy="session-card"]').each(($card) => {
      cy.wrap($card).should('contain', 'MATH');
    });
  });

  it('should show validation errors', () => {
    // Open add dialog
    cy.get('[data-cy="add-session-button"]').click();

    // Try to submit without filling required fields
    cy.get('[data-cy="submit-session"]').click();

    // Verify validation messages
    cy.get('[data-cy="course-error"]').should('be.visible');
    cy.get('[data-cy="group-error"]').should('be.visible');
    cy.get('[data-cy="instructor-error"]').should('be.visible');
  });
});
