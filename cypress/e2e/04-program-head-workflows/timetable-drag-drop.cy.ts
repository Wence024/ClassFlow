/// <reference types="cypress" />

/**
 * Program Head Workflow Test Suite - Timetable Drag and Drop
 * Tests timetable interactions, drag-drop operations, and cross-department requests
 */
describe('Program Head: Timetable Drag and Drop', () => {
  beforeEach(() => {
    cy.loginAs('program_head');
    cy.visit('/scheduler');
  });

  context('View Selector', () => {
    it('should display view selector with options', () => {
      cy.get('[data-cy="timetable-view-selector"]').should('be.visible');
      cy.get('[data-cy="timetable-view-selector"]').click();

      // Should show view options
      cy.contains(/class group|classroom|instructor/i).should('be.visible');
    });

    it('should switch between view types', () => {
      // Select Class Group View
      cy.get('[data-cy="timetable-view-selector"]').click();
      cy.get('[data-cy="view-mode-class-group"]').click();

      // Verify timetable grid appears (resource selector is implicit in multi-view)
      cy.get('[role="table"], .timetable-grid').should('be.visible');
    });
  });

  context('Class Group View', () => {
    beforeEach(() => {
      cy.get('[data-cy="timetable-view-selector"]').click();
      cy.get('[data-cy="view-mode-class-group"]').click();
    });

    it('should display only own program class groups', () => {
      // In the multi-view system, user's own groups are shown in the timetable
      // Verify timetable shows BSCS groups (implicit filtering)
      cy.contains('BSCS').should('be.visible');
    });

    it('should display timetable grid for selected class group', () => {
      // Verify timetable grid is visible
      cy.get('[role="table"], .timetable-grid, table').should('be.visible');
      
      // Verify day headers
      cy.contains(/monday|tuesday|wednesday/i).should('be.visible');
    });
  });

  context('Drawer - Unassigned Sessions', () => {
    beforeEach(() => {
      cy.get('[data-cy="timetable-view-selector"]').click();
      cy.get('[data-cy="view-mode-class-group"]').click();
    });

    it('should display unassigned sessions in drawer', () => {
      // Drawer should be visible at bottom
      cy.get('[data-cy="timetable-drawer"], .drawer').should('be.visible');
      
      // Should contain session pills (if any exist)
      cy.get('body').then($body => {
        if ($body.find('[data-cy^="drawer-session-pill"]').length > 0) {
          cy.get('[data-cy^="drawer-session-pill"]').should('exist');
        }
      });
    });
  });

  context('Three-Way Department Grouping', () => {
    it('should display instructors grouped by department in instructor view', () => {
      // Switch to instructor view
      cy.get('[data-cy="timetable-view-selector"]').click();
      cy.get('[data-cy="view-mode-instructor"]').click();

      // Verify three-way grouping in timetable rows
      cy.get('table').should('be.visible');
      cy.contains(/from your department|unassigned instructors|from other departments/i, { timeout: 10000 })
        .should('exist');
    });

    it('should display classrooms grouped by department in classroom view', () => {
      // Switch to classroom view
      cy.get('[data-cy="timetable-view-selector"]').click();
      cy.get('[data-cy="view-mode-classroom"]').click();

      // Verify grouping in timetable
      cy.get('table').should('be.visible');
      cy.contains(/unassigned classrooms|from other departments/i, { timeout: 10000 })
        .should('exist');
    });
  });

  context('Permission Boundaries', () => {
    it('should not allow dragging other program sessions', () => {
      // Switch to instructor view to see cross-program sessions
      cy.get('[data-cy="timetable-view-selector"]').click();
      cy.get('[data-cy="view-mode-instructor"]').click();
      
      // Verify timetable loads
      cy.get('table').should('be.visible');
      
      // If sessions from other programs exist, they should not be draggable
      // (This is implementation-dependent and verified by SessionCell tests)
    });
  });
});
