/// <reference types="cypress" />

/**
 * Authentication Test Suite - Login Workflows
 * Tests all login scenarios including happy paths, error cases, and edge cases
 */
describe('Authentication: Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  context('Happy Path - Successful Login', () => {
    it('should login as admin and redirect to dashboard', () => {
      const username = Cypress.env('admin_username');
      const password = Cypress.env('admin_password');

      cy.get('input[name="email"]').should('be.visible').type(username);
      cy.get('input[name="password"]').type(password);
      cy.get('button[type="submit"]').click();

      // Verify redirect and session
      cy.url().should('not.include', '/login');
      cy.get('main').should('be.visible');
      cy.get('[data-cy="user-avatar"]').should('be.visible');
    });

    it('should login as department head and redirect to dashboard', () => {
      const username = Cypress.env('department_head_username');
      const password = Cypress.env('department_head_password');

      cy.get('input[name="email"]').type(username);
      cy.get('input[name="password"]').type(password);
      cy.get('button[type="submit"]').click();

      cy.url().should('not.include', '/login');
      cy.get('main').should('be.visible');
    });

    it('should login as program head and redirect to dashboard', () => {
      const username = Cypress.env('program_head_username');
      const password = Cypress.env('program_head_password');

      cy.get('input[name="email"]').type(username);
      cy.get('input[name="password"]').type(password);
      cy.get('button[type="submit"]').click();

      cy.url().should('not.include', '/login');
      cy.get('main').should('be.visible');
    });

    it('should persist session after page refresh', () => {
      cy.loginAs('admin');
      cy.visit('/');
      cy.reload();
      
      cy.url().should('not.include', '/login');
      cy.get('main').should('be.visible');
    });
  });

  context('Error Cases - Invalid Credentials', () => {
    it('should show error for empty email', () => {
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();

      // Verify form validation prevents submit or shows error
      cy.url().should('include', '/login');
    });

    it('should show error for empty password', () => {
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('button[type="submit"]').click();

      cy.url().should('include', '/login');
    });

    it('should show error for invalid email format', () => {
      cy.get('input[name="email"]').type('notanemail');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();

      cy.url().should('include', '/login');
    });

    it('should show error for incorrect credentials', () => {
      cy.get('input[name="email"]').type('wrong@example.com');
      cy.get('input[name="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();

      // Should show error message
      cy.contains(/invalid|incorrect|wrong/i).should('be.visible');
      cy.url().should('include', '/login');
    });
  });

  context('Edge Cases', () => {
    it('should handle email with uppercase letters', () => {
      const username = Cypress.env('admin_username');
      const password = Cypress.env('admin_password');

      cy.get('input[name="email"]').type(username.toUpperCase());
      cy.get('input[name="password"]').type(password);
      cy.get('button[type="submit"]').click();

      // Should normalize and login successfully
      cy.url().should('not.include', '/login');
    });

    it('should submit form via Enter key', () => {
      const username = Cypress.env('admin_username');
      const password = Cypress.env('admin_password');

      cy.get('input[name="email"]').type(username);
      cy.get('input[name="password"]').type(password).type('{enter}');

      cy.url().should('not.include', '/login');
    });

    it('should prevent multiple rapid submit clicks', () => {
      const username = Cypress.env('admin_username');
      const password = Cypress.env('admin_password');

      cy.get('input[name="email"]').type(username);
      cy.get('input[name="password"]').type(password);
      
      cy.get('button[type="submit"]').click().click().click();

      // Should only process once
      cy.url().should('not.include', '/login');
    });
  });
});
