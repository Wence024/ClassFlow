/// <reference types="cypress" />

/**
 * E2E Test Suite: Resource Reassignment Workflow
 * 
 * Tests:
 * - Dragging sessions between instructor rows
 * - Confirmation dialogs for instructor changes
 * - Conflict detection and warnings
 * - Incomplete session handling
 */

describe('Timetable: Resource Reassignment', () => {
  beforeEach(() => {
    cy.loginAs('program_head');
    cy.visit('/scheduler');
  });

  context('Instructor Reassignment', () => {
    it('should show confirmation when moving session to different instructor', () => {
      // Switch to instructor view
      cy.get('[data-cy="timetable-view-selector"]').click();
      cy.get('[data-cy="view-mode-instructor"]').click();
      
      // Find a session and drag it to another instructor row
      cy.get('[data-testid^="session-card-"]').first().as('session');
      cy.get('table tbody tr').eq(1).as('targetRow');
      
      // Drag and drop
      cy.get('@session').trigger('dragstart');
      cy.get('@targetRow').trigger('dragover');
      cy.get('@targetRow').trigger('drop');
      
      // Should show confirmation dialog
      cy.contains(/change instructor|confirm|expertise/i).should('be.visible');
      cy.get('[data-cy="confirm-button"]').should('be.visible');
      cy.get('[data-cy="cancel-button"]').should('be.visible');
    });

    it('should update session when instructor change is confirmed', () => {
      // Perform drag operation (same as above)
      cy.get('[data-cy="timetable-view-selector"]').click();
      cy.get('[data-cy="view-mode-instructor"]').click();

      cy.get('[data-testid^="session-card-"]').first().as('session');

      // Extract the session ID first
      cy.get('@session').invoke('attr', 'data-testid').then((sessionId) => {
        // Store in an alias
        cy.wrap(sessionId).as('savedSessionId');
      });

      // Then perform the drag operation
      cy.get('@session').trigger('dragstart');
      cy.get('table tbody tr').eq(1).as('targetRow');
      cy.get('@targetRow').trigger('dragover');
      cy.get('@targetRow').trigger('drop');

      // Confirm the change
      cy.get('[data-cy="confirm-button"]').click();

      // Should show success toast
      cy.contains(/instructor assigned|updated/i).should('be.visible');

      // Session should now appear in the new instructor's row
      cy.get('@savedSessionId').then((sessionId) => {
        cy.get('@targetRow').within(() => {
          cy.get(`[data-testid="${sessionId}"]`).should('exist');
        });
      });
    });

    it('should not update session when instructor change is cancelled', () => {
      cy.get('[data-cy="timetable-view-selector"]').click();
      cy.get('[data-cy="view-mode-instructor"]').click();
      
      // Get original position
      cy.get('[data-testid^="session-card-"]').first().as('session');
      cy.get('@session').parents('tr').as('originalRow');
      
      cy.get('table tbody tr').eq(1).as('targetRow');
      
      cy.get('@session').trigger('dragstart');
      cy.get('@targetRow').trigger('dragover');
      cy.get('@targetRow').trigger('drop');
      
      // Cancel the change
      cy.get('[data-cy="cancel-button"]').click();
      
      // Session should remain in original position
      cy.get('@originalRow').within(() => {
        cy.get('@session').should('exist');
      });
    });
  });

  context('Classroom Reassignment', () => {
    it('should allow moving session to different classroom without confirmation', () => {
      cy.get('[data-cy="timetable-view-selector"]').click();
      cy.get('[data-cy="view-mode-classroom"]').click();
      
      cy.get('[data-testid^="session-card-"]').first().as('session');
      cy.get('table tbody tr').eq(1).as('targetRow');
      
      cy.get('@session').trigger('dragstart');
      cy.get('@targetRow').trigger('dragover');
      cy.get('@targetRow').trigger('drop');
      
      // Should NOT show confirmation (classrooms are more flexible)
      cy.contains(/change instructor|confirm|expertise/i).should('not.exist');
      
      // Should show success toast immediately
      cy.contains(/classroom assigned|updated/i, { timeout: 3000 }).should('be.visible');
    });
  });

  context('Conflict Detection', () => {
    it('should show warning when dropping session creates time conflict', () => {
      cy.get('[data-cy="timetable-view-selector"]').click();
      cy.get('[data-cy="view-mode-instructor"]').click();
      
      // Create scenario where instructor has overlapping session
      // (requires test data setup)
      cy.get('[data-testid^="session-card-"]').first().as('session');
      
      // Drop into occupied slot
      cy.get('table tbody tr').first().within(() => {
        cy.get('td[data-testid^="cell-"]').eq(5).as('targetCell');
      });
      
      cy.get('@session').trigger('dragstart');
      cy.get('@targetCell').trigger('dragover');
      
      // Should show red indicator (conflict)
      cy.get('@targetCell').should('have.class', 'bg-red-200');
      
      cy.get('@targetCell').trigger('drop');
      
      // Should show error toast
      cy.contains(/conflict|already scheduled/i).should('be.visible');
    });

    it('should display soft conflict warnings for same period assignments', () => {
      // Test scenario where instructor teaches multiple groups same time
      cy.get('[data-cy="timetable-view-selector"]').click();
      cy.get('[data-cy="view-mode-instructor"]').click();
      
      cy.get('[data-testid^="session-card-"]').first().as('session');
      
      // Drop into slot that creates soft conflict
      cy.get('table tbody tr').first().within(() => {
        cy.get('td[data-testid^="cell-"]').eq(3).trigger('drop');
      });
      
      // Should show warning icon on the session cell
      cy.get('[data-testid^="session-card-"]').within(() => {
        cy.get('[data-testid="conflict-warning"]').should('exist');
      });
      
      // Hover to see warning details
      cy.get('[data-testid="conflict-warning"]').trigger('mouseenter');
      cy.contains(/same period|multiple groups/i).should('be.visible');
    });
  });

  context('Incomplete Session Handling', () => {
    beforeEach(() => {
      // Create an incomplete session via API or UI
      cy.visit('/manage-classes');
      cy.get('[data-cy="add-class-session-btn"]').click();
      
      // Fill only required fields (course, group)
      cy.get('[data-cy="course-selector"]').click();
      cy.contains('CS 101').click();
      cy.get('[data-cy="class-group-selector"]').click();
      cy.contains('Group A').click();
      cy.get('[data-cy="period-count-input"]').clear().type('2');
      
      // Submit without instructor/classroom
      cy.get('[data-cy="submit-session-btn"]').click();
      
      // Navigate to timetable
      cy.visit('/scheduler');
    });

    it('should display incomplete session in drawer', () => {
      cy.get('[data-cy="timetable-view-selector"]').click();
      cy.get('[data-cy="view-mode-class-group"]').click();
      
      cy.get('[data-cy="timetable-drawer"]').should('be.visible');
      cy.get('[data-cy^="drawer-session-pill"]').first().within(() => {
        // Should show warning indicator
        cy.get('[data-testid="incomplete-badge"]').should('exist');
      });
    });

    it('should assign instructor when dropping incomplete session to instructor view', () => {
      cy.get('[data-cy="timetable-view-selector"]').click();
      cy.get('[data-cy="view-mode-instructor"]').click();
      
      // Drag incomplete session from drawer
      cy.get('[data-cy^="drawer-session-pill"]').first().as('incompleteSession');
      
      cy.get('@incompleteSession').trigger('dragstart');
      cy.get('table tbody tr').first().within(() => {
        cy.get('td[data-testid^="cell-"]').first().as('targetCell');
      });
      
      cy.get('@targetCell').trigger('drop');
      
      // Should show success with resource assignment message
      cy.contains(/instructor assigned|both resources assigned/i).should('be.visible');
      
      // Session should now appear in timetable
      cy.get('table').within(() => {
        cy.get('[data-testid^="session-card-"]').should('exist');
      });
    });

    it('should show incomplete indicator in class-group view', () => {
      cy.get('[data-cy="timetable-view-selector"]').click();
      cy.get('[data-cy="view-mode-class-group"]').click();
      
      // Drag and drop incomplete session
      cy.get('[data-cy^="drawer-session-pill"]').first().trigger('dragstart');
      cy.get('table tbody tr').first().within(() => {
        cy.get('td[data-testid^="cell-"]').first().trigger('drop');
      });
      
      // Session should appear with visual warning
      cy.get('[data-testid^="session-card-"]').first().within(() => {
        cy.get('[data-testid="incomplete-warning"]').should('exist');
      });
    });

    it('should filter incomplete sessions in instructor view appropriately', () => {
      cy.get('[data-cy="timetable-view-selector"]').click();
      cy.get('[data-cy="view-mode-instructor"]').click();
      
      // Drawer should NOT show incomplete sessions without instructor
      cy.get('[data-cy="timetable-drawer"]').within(() => {
        cy.get('[data-cy^="drawer-session-pill"]').should('have.length', 0);
      });
      
      // Or show with clear "needs assignment" message
      cy.contains(/assign instructor first|incomplete/i).should('exist');
    });
  });

  context('Multi-Period Session Handling', () => {
    it('should correctly handle 2-period session drops', () => {
      // Create and drop a 2-period session
      cy.get('[data-cy="timetable-view-selector"]').click();
      cy.get('[data-cy="view-mode-class-group"]').click();
      
      // Assuming a 2-period session exists in drawer
      cy.get('[data-cy^="drawer-session-pill"]')
        .contains(/2 periods|period_count: 2/i)
        .trigger('dragstart');
      
      cy.get('table tbody tr').first().within(() => {
        cy.get('td[data-testid^="cell-"]').eq(2).trigger('drop');
      });
      
      // Should occupy 2 cells
      cy.get('table tbody tr').first().within(() => {
        cy.get('td[colspan="2"]').should('exist');
      });
    });
  });
});
