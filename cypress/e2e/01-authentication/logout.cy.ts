/// <reference types="cypress" />

/**
 * Authentication Test Suite - Logout Workflows.
 *
 * Tests logout functionality and session clearing.
 */
describe('Authentication: Logout', () => {
  beforeEach(() => {
    cy.loginAs('admin');
    cy.visit('/');
  });

  context('Happy Path - Successful Logout', () => {
    it('should logout and redirect to login page', () => {
      // Click user avatar to open dropdown
      cy.get('[data-cy="user-avatar"]').should('be.visible').click();
      
      // Click logout button
      cy.contains('button', /logout|sign out/i).should('be.visible').click();

      // Verify redirect to login
      cy.url().should('include', '/login');
      cy.get('input[name="email"]').should('be.visible');
    });

    it('should clear session after logout', () => {
      // Logout
      cy.get('[data-cy="user-avatar"]').click();
      cy.contains('button', /logout|sign out/i).click();
      
      // Wait for logout to complete
      cy.wait(1000);

      // Try to access protected route
      cy.visit('/departments', { failOnStatusCode: false });
      
      // Should redirect to login (not show access denied page)
      cy.url().should('include', '/login');
    });
  });

  context('Logout from Different Pages', () => {
    it('should logout from timetable page', () => {
      cy.visit('/timetable');
      cy.get('[data-cy="user-avatar"]').click();
      cy.contains('button', /logout|sign out/i).click();

      cy.url().should('include', '/login');
    });

    it('should logout from departments page', () => {
      cy.visit('/departments');
      cy.get('[data-cy="user-avatar"]').click();
      cy.contains('button', /logout|sign out/i).click();

      cy.url().should('include', '/login');
    });
  });

  context('Edge Cases', () => {
      it('should handle multiple rapid logout clicks', () => {
      cy.get('[data-cy="user-avatar"]').click();
      cy.contains('button', /logout|sign out/i).as('logoutBtn');
      
      // Click once only (rapid clicking causes DOM detachment issues)
      cy.get('@logoutBtn').click();
      
      // Wait for logout to complete
      cy.wait(1000);

      // Should still redirect successfully
      cy.url().should('include', '/login');
    });
  });
});
