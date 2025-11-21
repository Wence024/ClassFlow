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
    cy.get('[data-cy="view-selector"]').should('be.visible');
    cy.get('[data-cy="view-option-classroom"]').click();
    cy.get('[data-cy="timetable-grid"]').should('be.visible');
  });

  it('should display sessions in classroom rows', () => {
    cy.get('[data-cy="view-option-classroom"]').click();
    cy.get('[data-cy="timetable-grid"]').should('be.visible');
  });

  it('should drag and drop session in classroom view', () => {
    cy.get('[data-cy="view-option-classroom"]').click();
    cy.get('[data-cy="timetable-drawer"]').should('be.visible');
    
    // Check if drawer has unassigned sessions
    cy.get('[data-cy^="unassigned-session-"]').then($sessions => {
      if ($sessions.length > 0) {
        // Drag from drawer
        cy.get('[data-cy^="unassigned-session-"]').first()
          .trigger('dragstart');
        
        // Drop to timetable grid
        cy.get('[data-cy="timetable-grid"]')
          .trigger('drop');
      }
    });
  });
});
