/**
 * E2E tests for Timetabling: Unassigned Sessions Drawer.
 */

describe('Timetabling: Unassigned Sessions Drawer', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('[data-cy="email-input"]').type('programhead@test.com');
    cy.get('[data-cy="password-input"]').type('testpass123');
    cy.get('[data-cy="login-button"]').click();
    cy.url().should('include', '/dashboard');
    cy.get('[data-cy="nav-timetable"]').click();
    cy.url().should('include', '/scheduler');
  });

  it('should display drawer with unassigned sessions', () => {
    // Verify drawer is visible
    cy.get('[data-cy="timetable-drawer"]').should('be.visible');
    
    // Verify drawer has label
    cy.get('[aria-label*="Available"]').should('exist');
    
    // Check for unassigned session pills
    cy.get('[data-cy="timetable-drawer"]').within(() => {
      cy.get('[data-cy^="unassigned-session-"]').should('exist');
    });
  });

  it('should toggle drawer collapse/expand', () => {
    // Initial state - drawer should be expanded
    cy.get('[data-cy="timetable-drawer"]').should('be.visible');
    
    // Find and click collapse button
    cy.get('[data-cy="drawer-toggle"]').click();
    
    // Drawer should collapse (content hidden)
    cy.get('[data-cy="timetable-drawer"]')
      .should('have.class', 'collapsed');
    
    // Verify localStorage is set
    cy.window().then((win) => {
      const isCollapsed = win.localStorage.getItem('timetable-drawer-collapsed');
      expect(isCollapsed).to.equal('true');
    });
    
    // Click expand button
    cy.get('[data-cy="drawer-toggle"]').click();
    
    // Drawer should expand
    cy.get('[data-cy="timetable-drawer"]')
      .should('not.have.class', 'collapsed');
  });

  it('should show only own program sessions in drawer', () => {
    // Get program ID from user profile
    cy.window().then((win) => {
      const user = JSON.parse(win.localStorage.getItem('classflow_user') || '{}');
      const programId = user.program_id;
      
      // All unassigned sessions should belong to the user's program
      cy.get('[data-cy^="unassigned-session-"]').each(($el) => {
        const sessionProgramId = $el.attr('data-program-id');
        expect(sessionProgramId).to.equal(programId);
      });
    });
  });

  it('should drag session from drawer to timetable', () => {
    // Check if drawer has sessions
    cy.get('[data-cy="timetable-drawer"]')
      .find('[data-cy^="unassigned-session-"]')
      .then($sessions => {
        if ($sessions.length > 0) {
          const sessionId = $sessions.first().attr('data-cy');
          const initialCount = $sessions.length;
          
          // Drag session from drawer
          cy.get(`[data-cy="${sessionId}"]`)
            .trigger('dragstart');
          
          // Drop onto timetable grid
          cy.get('[data-cy="timetable-grid"]')
            .find('[data-cy^="cell-"]').first()
            .trigger('drop');
          
          // Should show success toast (if no conflicts)
          cy.get('[role="status"]').should('be.visible');
          
          // Session count in drawer should decrease
          cy.get('[data-cy="timetable-drawer"]')
            .find('[data-cy^="unassigned-session-"]')
            .should('have.length', initialCount - 1);
          
          // Session should appear on timetable
          cy.get('[data-cy="timetable-grid"]')
            .find('[data-cy^="session-cell-"]')
            .should('exist');
        }
      });
  });

  it('should drag session from timetable to drawer (unassign)', () => {
    // Check if timetable has sessions
    cy.get('[data-cy^="session-cell-"]').then($sessions => {
      if ($sessions.length > 0) {
        // Count initial drawer sessions
        cy.get('[data-cy="timetable-drawer"]')
          .find('[data-cy^="unassigned-session-"]')
          .then($drawerSessions => {
            const initialDrawerCount = $drawerSessions.length;
            const sessionId = $sessions.first().attr('data-cy');
            
            // Drag from timetable
            cy.get(`[data-cy="${sessionId}"]`)
              .trigger('dragstart');
            
            // Drop onto drawer
            cy.get('[data-cy="timetable-drawer"]')
              .trigger('drop');
            
            // Should show success toast
            cy.get('[role="status"]').should('be.visible');
            
            // Session should disappear from timetable
            cy.get(`[data-cy="${sessionId}"]`).should('not.exist');
            
            // Drawer count should increase
            cy.get('[data-cy="timetable-drawer"]')
              .find('[data-cy^="unassigned-session-"]')
              .should('have.length', initialDrawerCount + 1);
          });
      }
    });
  });

  it('should highlight pending placement session in drawer', () => {
    // Create a scenario with pending session parameter
    // This would typically come from approving a cross-dept request
    const mockSessionId = 'test-session-123';
    const mockResourceType = 'instructor';
    const mockResourceId = 'instructor-456';
    const mockDepartmentId = 'dept-789';
    
    cy.visit(`/scheduler?pendingSessionId=${mockSessionId}&resourceType=${mockResourceType}&resourceId=${mockResourceId}&departmentId=${mockDepartmentId}`);
    
    // Should show info toast about placing the session
    cy.get('[role="status"]').should('contain', 'Place the session');
    
    // Check if pending session has highlighting
    cy.get(`[data-cy="unassigned-session-${mockSessionId}"]`).then($el => {
      if ($el.length > 0) {
        // Should have pulsing border or highlight class
        cy.wrap($el).should('have.class', 'pending-placement');
      }
    });
  });

  it('should remove highlighting after placing pending session', () => {
    const mockSessionId = 'test-session-123';
    
    cy.visit(`/scheduler?pendingSessionId=${mockSessionId}&resourceType=instructor&resourceId=test&departmentId=test`);
    
    // Find and drag the pending session
    cy.get(`[data-cy="unassigned-session-${mockSessionId}"]`).then($el => {
      if ($el.length > 0) {
        // Drag to timetable
        cy.wrap($el).trigger('dragstart');
        
        cy.get('[data-cy="timetable-grid"]')
          .find('[data-cy^="cell-"]').first()
          .trigger('drop');
        
        // After placement, highlighting should be removed
        cy.get('[data-cy^="unassigned-session-"]')
          .should('not.have.class', 'pending-placement');
      }
    });
  });

  it('should show empty state when no unassigned sessions', () => {
    // Check if drawer has sessions
    cy.get('[data-cy="timetable-drawer"]')
      .find('[data-cy^="unassigned-session-"]')
      .then($sessions => {
        if ($sessions.length === 0) {
          // Should show empty state message
          cy.get('[data-cy="timetable-drawer"]')
            .should('contain', 'No unassigned');
          
          // Should mention Manage Classes page
          cy.get('[data-cy="timetable-drawer"]')
            .should('contain', 'Manage Classes');
        }
      });
  });

  it('should persist drawer collapsed state across page reloads', () => {
    // Collapse drawer
    cy.get('[data-cy="drawer-toggle"]').click();
    cy.get('[data-cy="timetable-drawer"]').should('have.class', 'collapsed');
    
    // Reload page
    cy.reload();
    
    // Drawer should still be collapsed
    cy.get('[data-cy="timetable-drawer"]').should('have.class', 'collapsed');
    
    // Expand it
    cy.get('[data-cy="drawer-toggle"]').click();
    cy.get('[data-cy="timetable-drawer"]').should('not.have.class', 'collapsed');
    
    // Reload again
    cy.reload();
    
    // Should be expanded
    cy.get('[data-cy="timetable-drawer"]').should('not.have.class', 'collapsed');
  });
});
