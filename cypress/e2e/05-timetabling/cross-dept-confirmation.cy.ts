/**
 * E2E tests for Timetabling: Cross-Department Confirmation Dialogs.
 */

describe('Timetabling: Cross-Department Confirmation', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('[data-cy="email-input"]').type('programhead@test.com');
     
    cy.get('[data-cy="password-input"]').type('testpass123');
    cy.get('[data-cy="login-button"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('should show confirmation when moving confirmed cross-dept session', () => {
    // Navigate to timetable
    cy.get('[data-cy="nav-timetable"]').click();
    cy.url().should('include', '/scheduler');
    
    // Check if there are confirmed cross-dept sessions
    cy.get('[data-cy^="session-cell-"]').then($sessions => {
      // Filter for cross-dept sessions (they have a special indicator)
      const crossDeptSessions = $sessions.filter((_, el) => {
        return Cypress.$(el).find('[data-cy="cross-dept-indicator"]').length > 0;
      });
      
      if (crossDeptSessions.length > 0) {
        // Drag the cross-dept session
        cy.wrap(crossDeptSessions.first())
          .trigger('dragstart');
        
        // Drop to a different time slot
        cy.get('[data-cy^="cell-"]').eq(10)
          .trigger('drop');
        
        // Should show confirmation dialog
        cy.get('[role="dialog"]').should('be.visible');
        cy.get('[role="dialog"]').should('contain', 'Move Confirmed Session');
        cy.get('[role="dialog"]').should('contain', 'cross-department resources');
        cy.get('[role="dialog"]').should('contain', 'require department head approval');
        
        // Test cancel
        cy.get('[role="dialog"]').contains('button', 'Cancel').click();
        cy.get('[role="dialog"]').should('not.exist');
      }
    });
  });

  it('should move session and change status to pending after confirmation', () => {
    cy.get('[data-cy="nav-timetable"]').click();
    
    cy.get('[data-cy^="session-cell-"]').then($sessions => {
      const crossDeptSessions = $sessions.filter((_, el) => {
        return Cypress.$(el).find('[data-cy="cross-dept-indicator"]').length > 0 &&
               Cypress.$(el).find('[data-cy="status-confirmed"]').length > 0;
      });
      
      if (crossDeptSessions.length > 0) {
        // Drag and drop
        cy.wrap(crossDeptSessions.first())
          .trigger('dragstart');
        
        cy.get('[data-cy^="cell-"]').eq(15)
          .trigger('drop');
        
        // Confirm the dialog
        cy.get('[role="dialog"]').contains('button', 'Continue').click();
        
        // Should show success toast
        cy.get('[role="status"]').should('contain', 'moved');
        
        // Session should now have pending status
        cy.get('[data-cy^="session-cell-"]').first()
          .find('[data-cy="status-pending"]').should('exist');
      }
    });
  });

  it('should show confirmation when removing cross-dept session to drawer', () => {
    cy.get('[data-cy="nav-timetable"]').click();
    
    cy.get('[data-cy^="session-cell-"]').then($sessions => {
      const crossDeptSessions = $sessions.filter((_, el) => {
        return Cypress.$(el).find('[data-cy="cross-dept-indicator"]').length > 0;
      });
      
      if (crossDeptSessions.length > 0) {
        // Drag to drawer
        cy.wrap(crossDeptSessions.first())
          .trigger('dragstart');
        
        cy.get('[data-cy="timetable-drawer"]')
          .trigger('drop');
        
        // Should show removal confirmation
        cy.get('[role="dialog"]').should('be.visible');
        cy.get('[role="dialog"]').should('contain', 'Remove');
        cy.get('[role="dialog"]').should('contain', 'cross-department');
        cy.get('[role="dialog"]').should('contain', 'cancel the approval');
        
        // Confirm removal
        cy.get('[role="dialog"]').contains('button', 'Continue').click();
        
        // Session should appear in drawer
        cy.get('[data-cy="timetable-drawer"]')
          .find('[data-cy^="unassigned-session-"]')
          .should('have.length.at.least', 1);
      }
    });
  });

  it('should NOT show confirmation for own-department sessions', () => {
    cy.get('[data-cy="nav-timetable"]').click();
    
    cy.get('[data-cy^="session-cell-"]').then($sessions => {
      // Find own-department session (no cross-dept indicator)
      const ownDeptSessions = $sessions.filter((_, el) => {
        return Cypress.$(el).find('[data-cy="cross-dept-indicator"]').length === 0;
      });
      
      if (ownDeptSessions.length > 0) {
        // Drag and drop
        cy.wrap(ownDeptSessions.first())
          .trigger('dragstart');
        
        cy.get('[data-cy^="cell-"]').eq(8)
          .trigger('drop');
        
        // Should NOT show confirmation dialog
        cy.get('[role="dialog"]').should('not.exist');
        
        // Should move immediately (if no conflicts)
        cy.get('[role="status"]').should('be.visible');
      }
    });
  });

  it('should handle cancel action correctly in confirmation dialog', () => {
    cy.get('[data-cy="nav-timetable"]').click();
    
    cy.get('[data-cy^="session-cell-"]').then($sessions => {
      const crossDeptSessions = $sessions.filter((_, el) => {
        return Cypress.$(el).find('[data-cy="cross-dept-indicator"]').length > 0;
      });
      
      if (crossDeptSessions.length > 0) {
        const originalPeriod = crossDeptSessions.first().attr('data-period');
        
        // Attempt to move
        cy.wrap(crossDeptSessions.first())
          .trigger('dragstart');
        
        cy.get('[data-cy^="cell-"]').eq(12)
          .trigger('drop');
        
        // Cancel the dialog
        cy.get('[role="dialog"]').contains('button', 'Cancel').click();
        
        // Dialog should close
        cy.get('[role="dialog"]').should('not.exist');
        
        // Session should remain in original position
        cy.get(`[data-period="${originalPeriod}"]`)
          .find('[data-cy^="session-cell-"]')
          .should('exist');
      }
    });
  });
});
