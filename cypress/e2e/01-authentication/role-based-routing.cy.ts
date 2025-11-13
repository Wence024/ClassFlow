/// <reference types="cypress" />

/**
 * Authentication Test Suite - Role-Based Routing
 * Tests access control and route permissions for different user roles
 */
describe('Authentication: Role-Based Routing', () => {
  
  context('Admin Access', () => {
    beforeEach(() => {
      cy.loginAs('admin');
    });

    it('should allow access to all admin routes', () => {
      const adminRoutes = [
        '/departments',
        '/programs',
        '/user-management',
        '/component-management',
        '/scheduler',
        '/schedule-configuration',
        '/reports/instructors',
        '/class-sessions'
      ];

      adminRoutes.forEach(route => {
        cy.visit(route);
        cy.url().should('include', route);
        cy.get('main').should('be.visible');
      });
    });
  });

  context('Department Head Access', () => {
    beforeEach(() => {
      cy.loginAs('department_head');
    });

    it('should allow access to department head routes', () => {
      const allowedRoutes = [
        '/department-head',
        '/scheduler',
        '/reports/instructors'
      ];

      allowedRoutes.forEach(route => {
        cy.visit(route);
        cy.url().should('include', route);
        cy.get('main').should('be.visible');
      });
    });

    it('should deny access to admin-only routes', () => {
      const deniedRoutes = [
        '/departments',
        '/programs',
        '/user-management',
        '/schedule-configuration'
      ];

      deniedRoutes.forEach(route => {
        cy.visit(route, { failOnStatusCode: false });
        // Should redirect to /scheduler instead of staying on denied page
        cy.url().should('not.include', route);
        cy.url().should('include', '/scheduler');
      });
    });
  });

  context('Program Head Access', () => {
    beforeEach(() => {
      cy.loginAs('program_head');
    });

    it('should allow access to program head routes', () => {
      const allowedRoutes = [
        '/component-management',
        '/scheduler',
        '/class-sessions',
        '/reports/instructors'
      ];

      allowedRoutes.forEach(route => {
        cy.visit(route);
        cy.url().should('include', route);
        cy.get('main').should('be.visible');
      });
    });

    it('should deny access to admin routes', () => {
      const deniedRoutes = [
        '/departments',
        '/programs',
        '/user-management',
        '/schedule-configuration',
        '/department-head'
      ];

      deniedRoutes.forEach(route => {
        cy.visit(route, { failOnStatusCode: false });
        // Should redirect to /scheduler instead of staying on denied page
        cy.url().should('not.include', route);
        cy.url().should('include', '/scheduler');
      });
    });
  });

  context('Unauthenticated Access', () => {
    it('should redirect to login when accessing protected routes', () => {
      const protectedRoutes = [
        '/departments',
        '/scheduler',
        '/class-sessions'
      ];

      protectedRoutes.forEach(route => {
        cy.visit(route);
        cy.url().should('include', '/login');
      });
    });
  });
});
