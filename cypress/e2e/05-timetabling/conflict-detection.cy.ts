/**
 * E2E tests for Timetabling: Conflict Detection.
 */

describe('Timetabling: Conflict Detection', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('[data-cy="email-input"]').type('programhead@test.com');
    cy.get('[data-cy="password-input"]').type('testpass123');
    cy.get('[data-cy="login-button"]').click();
    cy.url().should('include', '/dashboard');
    cy.get('[data-cy="nav-timetable"]').click();
  });

  it('should prevent dropping session with instructor conflict', () => {
    // Try to drop a session where the instructor already has a class
    cy.get('[data-cy="drawer-session"]').first()
      .trigger('dragstart');
    
    cy.get('[data-cy="timetable-cell-conflict"]')
      .trigger('drop');
    
    cy.get('[data-cy="toast-error"]').should('contain', 'conflict');
  });

  it('should prevent dropping session with classroom conflict', () => {
    // Try to drop a session where the classroom is already occupied
    cy.get('[data-cy="drawer-session"]').first()
      .trigger('dragstart');
    
    cy.get('[data-cy="timetable-cell-occupied"]')
      .trigger('drop');
    
    cy.get('[data-cy="toast-error"]').should('contain', 'conflict');
  });

  it('should allow dropping to available slot', () => {
    cy.get('[data-cy="drawer-session"]').first()
      .trigger('dragstart');
    
    cy.get('[data-cy="timetable-cell-available"]')
      .trigger('drop');
    
    cy.get('[data-cy="toast-success"]').should('be.visible');
  });
});
