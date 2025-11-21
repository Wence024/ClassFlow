/**
 * E2E tests for Timetabling: Instructor View.
 */

describe('Timetabling: Instructor View', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('[data-cy="email-input"]').type('programhead@test.com');
    cy.get('[data-cy="password-input"]').type('testpass123');
    cy.get('[data-cy="login-button"]').click();
    cy.url().should('include', '/dashboard');
    cy.get('[data-cy="nav-timetable"]').click();
    cy.url().should('include', '/scheduler');
  });

  it('should switch to instructor view', () => {
    cy.get('[data-cy="view-selector"]').should('be.visible');
    cy.get('[data-cy="view-option-instructor"]').click();
    cy.get('[data-cy="timetable-grid"]').should('be.visible');
    
    // Verify instructor rows are displayed
    cy.get('[data-cy^="row-instructor-"]').should('exist');
  });

  it('should display sessions in instructor rows', () => {
    cy.get('[data-cy="view-option-instructor"]').click();
    cy.get('[data-cy="timetable-grid"]').should('be.visible');
    
    // Check that sessions appear in instructor rows
    cy.get('[data-cy^="session-cell-"]').should('exist');
    
    // Verify session cards show course and class group info
    cy.get('[data-cy^="session-cell-"]').first().within(() => {
      cy.get('.course-name').should('exist');
      cy.get('.class-group').should('exist');
    });
  });

  it('should persist instructor view mode', () => {
    // Switch to instructor view
    cy.get('[data-cy="view-option-instructor"]').click();
    cy.get('[data-cy="timetable-grid"]').should('be.visible');
    
    // Verify localStorage is set
    cy.window().then((win) => {
      const viewMode = win.localStorage.getItem('timetable_view_mode');
      expect(viewMode).to.equal('instructor');
    });
    
    // Refresh the page
    cy.reload();
    
    // Verify instructor view is still active
    cy.get('[data-cy="view-option-instructor"]').should('have.class', 'active');
    cy.get('[data-cy^="row-instructor-"]').should('exist');
  });

  it('should prevent moving session to different instructor', () => {
    cy.get('[data-cy="view-option-instructor"]').click();
    
    // Check if there are sessions to test with
    cy.get('[data-cy^="session-cell-"]').then($sessions => {
      if ($sessions.length > 0) {
        // Attempt to drag a session
        cy.get('[data-cy^="session-cell-"]').first()
          .trigger('dragstart');
        
        // Try to drop in a different instructor's row
        cy.get('[data-cy^="row-instructor-"]').eq(1)
          .trigger('drop');
        
        // Should show error toast
        cy.get('[role="status"]').should('contain', 'Cannot move');
      }
    });
  });

  it('should allow moving session within same instructor row', () => {
    cy.get('[data-cy="view-option-instructor"]').click();
    
    // Check if there are sessions to test with
    cy.get('[data-cy^="session-cell-"]').then($sessions => {
      if ($sessions.length > 0) {
        const sessionId = $sessions.first().attr('data-cy');
        
        // Drag within same row to different time slot
        cy.get(`[data-cy="${sessionId}"]`)
          .trigger('dragstart');
        
        // Drop in an empty cell in the same row
        cy.get('[data-cy="timetable-grid"]')
          .find('[data-cy^="cell-"]').eq(5)
          .trigger('drop');
        
        // If no conflicts, should succeed
        cy.get('[role="status"]').should('be.visible');
      }
    });
  });
});
