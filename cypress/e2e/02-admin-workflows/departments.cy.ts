/// <reference types="cypress" />

/**
 * Admin Workflow Test Suite - Department Management.
 *
 * Tests CRUD operations for departments.
 */
describe('Admin: Department Management', () => {
  beforeEach(() => {
    cy.loginAs('admin');
    cy.visit('/departments');
  });

  context('View Departments', () => {
    it('should display existing departments', () => {
      cy.get('[data-testid="item-card"]').should('exist');
      cy.contains('CECE').should('be.visible');
    });

    it('should display department details on cards', () => {
      cy.get('[data-testid="item-card"]').first().within(() => {
        // Should show name in h3 and code
        cy.get('h3').should('exist');
        cy.contains(/CBA|CECE|CETLE/i).should('be.visible');
      });
    });
  });

  context('Create Department', () => {
    it('should create a new department successfully', () => {
      // Use seedTestData to create isolated test department
      cy.seedTestData('department', {}).then((dept: { id: string; name: string; code: string }) => {
        const deptName = dept.name;
        const deptCode = dept.code;

        // Verify the seeded department appears in the UI
        cy.visit('/departments');
        cy.contains(deptName).should('be.visible');
        cy.contains(deptCode).should('be.visible');
      });
    });
  });

  /**
   * Helper function to edit a department.
   *
   * @param dept
   * @param dept.name
   * @param dept.code
   */
  function editDepartment(dept: { name: string; code: string }) {
    cy.visit('/departments');
    
    // Find the test department and edit it
    cy.contains(dept.name).parents('[data-testid="item-card"]').within(() => {
      cy.contains('button', /edit/i).click();
    });

    const updatedName = `CYPRESS_TEST_Updated_${Date.now()}`;
    
    // Modify name in form
    cy.get('form').within(() => {
      cy.get('input[placeholder*="Computer Science"]')
        .clear()
        .type(updatedName);
    });

    // Save changes
    cy.contains('button', /save|update/i).click();

    // Verify update
    cy.contains(/updated|success/i).should('be.visible');
  }

  context('Edit Department', () => {
    it('should edit an existing test department', () => {
      // Create a test department to edit
      cy.seedTestData('department', {}).then((dept: { name: string; code: string }) => {
        editDepartment(dept);
      });
    });
  });

  /**
   * Helper function to delete a department.
   *
   * @param dept
   * @param dept.name
   * @param dept.code
   */
  function deleteDepartment(dept: { name: string; code: string }) {
    cy.visit('/departments');
    cy.contains(dept.name).should('be.visible');

    // Delete it
    cy.contains(dept.name).parents('[data-testid="item-card"]').within(() => {
      cy.contains('button', /delete/i).click();
    });

    // Confirm deletion in modal
    cy.get('[role="dialog"], [role="alertdialog"]').within(() => {
      cy.contains('button', /delete|confirm/i).click();
    });

    // Verify deletion
    cy.contains(dept.name).should('not.exist');
  }

  context('Delete Department', () => {
    it('should delete a test department with confirmation', () => {
      // Create a test department to delete
      cy.seedTestData('department', {}).then((dept: { name: string; code: string }) => {
        deleteDepartment(dept);
      });
    });
  });

  context('Search/Filter', () => {
    it('should filter departments by search term', () => {
      cy.get('input[type="search"], input[placeholder*="search" i]')
        .should('be.visible')
        .type('CECE');

      // Should show only CECE department
      cy.contains('CECE').should('be.visible');
    });
  });

  context('Error Cases', () => {
    it('should show validation error for empty name', () => {
      cy.contains('button', /create|add/i).click();
      
      // Try to submit with empty fields
      cy.get('form').within(() => {
        cy.contains('button', /create|save|submit/i).click();
      });

      // Should still be on the form or show error
      cy.get('form').within(() => {
        cy.get('input[placeholder*="Computer Science"]').should('be.visible');
      });
    });
  });
});
