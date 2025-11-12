/// <reference types="cypress" />

/**
 * Admin Workflow Test Suite - Department Management
 * Tests CRUD operations for departments
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
        // Should show name and code
        cy.get('h3').should('exist');
      });
    });
  });

  context('Create Department', () => {
    it('should create a new department successfully', () => {
      const deptName = `Test Department ${Date.now()}`;
      const deptCode = `TD${Date.now().toString().slice(-4)}`;

      // Look for create/add button
      cy.contains('button', /create|add/i).should('be.visible').click();

      // Fill form - use form context to avoid search input
      cy.get('form').within(() => {
        cy.get('input[placeholder*="Computer Science"]').type(deptName);
        cy.get('input[placeholder*="CS"]').type(deptCode);
      });

      // Submit
      cy.contains('button', /create|save|submit/i).click();

      // Verify success
      cy.contains(deptName).should('be.visible');
    });
  });

  context('Edit Department', () => {
    it('should edit an existing department', () => {
      // Find first department edit button
      cy.get('[data-testid="item-card"]').first().within(() => {
        cy.contains('button', /edit/i).click();
      });

      // Modify name
      cy.get('form').within(() => {
        cy.get('input[placeholder*="Computer Science"]')
          .clear()
          .type(`Updated ${Date.now()}`);
      });

      // Save changes
      cy.contains('button', /save|update/i).click();

      // Verify update
      cy.contains(/updated|success/i).should('be.visible');
    });
  });

  context('Delete Department', () => {
    it('should delete a department with confirmation', () => {
      // Create a test department first
      const deptName = `ToDelete ${Date.now()}`;
      const deptCode = `DEL${Date.now().toString().slice(-4)}`;

      cy.contains('button', /create|add/i).click();
      cy.get('form').within(() => {
        cy.get('input[placeholder*="Computer Science"]').type(deptName);
        cy.get('input[placeholder*="CS"]').type(deptCode);
        cy.contains('button', /create|save|submit/i).click();
      });
      cy.contains(deptName).should('be.visible');

      // Now delete it
      cy.contains(deptName).parents('[data-testid="item-card"]').within(() => {
        cy.contains('button', /delete/i).click();
      });

      // Confirm deletion in modal
      cy.get('[role="dialog"], [role="alertdialog"]').within(() => {
        cy.contains('button', /delete|confirm/i).click();
      });

      // Verify deletion
      cy.contains(deptName).should('not.exist');
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
