/**
 * E2E tests for Program Head: Manage Courses workflow.
 */

describe('Program Head: Manage Courses', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('[data-cy="email-input"]').type('programhead@test.com');
    cy.get('[data-cy="password-input"]').type('testpass123');
    cy.get('[data-cy="login-button"]').click();
    cy.url().should('include', '/dashboard');
    cy.get('[data-cy="nav-courses"]').click();
  });

  it('should display list of courses', () => {
    cy.get('[data-cy="courses-list"]').should('be.visible');
    cy.get('[data-cy="course-card"]').should('have.length.greaterThan', 0);
  });

  it('should create a new course', () => {
    cy.get('[data-cy="add-course-button"]').click();
    cy.get('[data-cy="course-name-input"]').type('New Course');
    cy.get('[data-cy="course-code-input"]').type('NC101');
    cy.get('[data-cy="submit-course"]').click();
    cy.get('[data-cy="toast-success"]').should('contain', 'Course created');
  });

  it('should edit a course', () => {
    cy.get('[data-cy="course-card"]').first().find('[data-cy="edit-course"]').click();
    cy.get('[data-cy="course-name-input"]').clear().type('Updated Course');
    cy.get('[data-cy="submit-course"]').click();
    cy.get('[data-cy="toast-success"]').should('contain', 'Course updated');
  });

  it('should delete a course', () => {
    cy.get('[data-cy="course-card"]').first().find('[data-cy="delete-course"]').click();
    cy.get('[data-cy="confirm-delete"]').click();
    cy.get('[data-cy="toast-success"]').should('contain', 'Course deleted');
  });
});
