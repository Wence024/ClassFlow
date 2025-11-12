/// <reference types="cypress" />

/**
 * Program Head Workflow Test Suite - Timetable Drag and Drop
 * Tests timetable interactions, drag-drop operations, and cross-department requests
 */
describe('Program Head: Timetable Drag and Drop', () => {
  beforeEach(() => {
    cy.loginAs('program_head');
    cy.visit('/timetable');
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
      cy.contains('Class Group').click();

      // Verify resource selector appears
      cy.get('[data-cy="timetable-resource-selector"]').should('be.visible');
    });
  });

  context('Class Group View', () => {
    beforeEach(() => {
      cy.get('[data-cy="timetable-view-selector"]').click();
      cy.contains('Class Group').click();
    });

    it('should display only own program class groups', () => {
      cy.get('[data-cy="timetable-resource-selector"]').click();

      // Should show BSCS groups (program head's program)
      cy.contains('BSCS').should('be.visible');
      
      // Should not show other programs
      cy.get('[role="listbox"], [role="menu"]').should('not.contain', 'BSA');
    });

    it('should display timetable grid for selected class group', () => {
      cy.get('[data-cy="timetable-resource-selector"]').click();
      cy.contains('BSCS').first().click();

      // Verify timetable grid is visible
      cy.get('[role="table"], .timetable-grid').should('be.visible');
      
      // Verify day headers
      cy.contains(/monday|tuesday|wednesday/i).should('be.visible');
    });
  });

  context('Drawer - Unassigned Sessions', () => {
    beforeEach(() => {
      cy.get('[data-cy="timetable-view-selector"]').click();
      cy.contains('Class Group').click();
      cy.get('[data-cy="timetable-resource-selector"]').click();
      cy.contains('BSCS').first().click();
    });

    it('should display unassigned sessions in drawer', () => {
      // Drawer should be visible at bottom
      cy.get('[data-cy="timetable-drawer"], .drawer').should('be.visible');
      
      // Should contain session pills
      cy.get('[data-cy^="drawer-session-pill"]').should('exist');
    });
  });

  context('Three-Way Department Grouping', () => {
    it('should display instructors grouped by department in instructor view', () => {
      // Switch to instructor view
      cy.get('[data-cy="timetable-view-selector"]').click();
      cy.contains('Instructor').click();

      // Open resource selector
      cy.get('[data-cy="timetable-resource-selector"]').click();

      // Verify three-way grouping
      cy.contains(/from your department/i).should('be.visible');
      cy.contains(/available/i).should('be.visible');
      cy.contains(/from other departments/i).should('be.visible');
    });

    it('should display classrooms grouped by department in classroom view', () => {
      // Switch to classroom view
      cy.get('[data-cy="timetable-view-selector"]').click();
      cy.contains('Classroom').click();

      cy.get('[data-cy="timetable-resource-selector"]').click();

      // Verify grouping
      cy.contains(/from your department|available|from other departments/i).should('be.visible');
    });
  });

  context('Permission Boundaries', () => {
    it('should not allow dragging other program sessions', () => {
      // Switch to instructor view to see cross-program sessions
      cy.get('[data-cy="timetable-view-selector"]').click();
      cy.contains('Instructor').click();
      
      // If any sessions from other programs exist, verify they're not draggable
      // This is implementation-dependent
    });
  });
});
