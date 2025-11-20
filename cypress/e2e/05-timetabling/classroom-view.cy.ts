/**
 * E2E tests for Timetabling: Classroom View.
 */

describe('Timetabling: Classroom View', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('[data-cy="email-input"]').type('programhead@test.com');
    cy.get('[data-cy="password-input"]').type('testpass123');
    cy.get('[data-cy="login-button"]').click();
    cy.url().should('include', '/dashboard');
    cy.get('[data-cy="nav-timetable"]').click();
  });

  it('should switch to classroom view', () => {
    cy.get('[data-cy="view-mode-select"]').click();
    cy.get('[data-cy="view-mode-classroom"]').click();
    cy.get('[data-cy="timetable-grid"]').should('be.visible');
    cy.get('[data-cy="classroom-row"]').should('have.length.greaterThan', 0);
  });

  it('should display sessions in classroom rows', () => {
    cy.get('[data-cy="view-mode-select"]').click();
    cy.get('[data-cy="view-mode-classroom"]').click();
    cy.get('[data-cy="session-cell"]').should('exist');
  });

  it('should drag and drop session in classroom view', () => {
    cy.get('[data-cy="view-mode-select"]').click();
    cy.get('[data-cy="view-mode-classroom"]').click();
    
    // Drag from drawer
    cy.get('[data-cy="drawer-session"]').first()
      .trigger('dragstart');
    
    // Drop to cell
    cy.get('[data-cy="timetable-cell"]').first()
      .trigger('drop');
    
    cy.get('[data-cy="toast-success"]').should('be.visible');
  });
});
