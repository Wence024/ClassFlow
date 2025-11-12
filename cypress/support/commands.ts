/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

/// <reference types="cypress" />

/**
 * Custom command to log in a user through the UI.
 * Encapsulates the process of navigating to login, filling credentials,
 * and submitting the form.
 *
 * @param role - The role of the user to log in as ('program_head', 'admin', etc.).
 *
 * @example
 * cy.loginAs('program_head')
 */
Cypress.Commands.add('loginAs', (role: 'program_head' | 'admin' | 'department_head') => {
  cy.session([role], () => {
    const username = Cypress.env(`${role}_username`);
    const password = Cypress.env(`${role}_password`);

    if (!username || !password) {
      throw new Error(`Missing username or password for role: ${role}. Check cypress.env.json.`);
    }

    cy.visit('/login');

        // Wait for the form to be interactive by asserting that the
    // email input is not disabled before typing.
    // Cypress will retry this assertion for its default timeout period (e.g., 4 seconds).

    cy.get('input[name="email"]').should('not.be.disabled').type(username, { log: false });
    cy.get('input[name="password"]').should('not.be.disabled').type(password, { log: false });
    cy.get('button[type="submit"]').should('not.be.disabled').click();
    
    // Wait for the main app layout to ensure login was successful
    cy.get('main').should('be.visible');
    cy.url().should('not.include', '/login');
  });
});

// Add the command to Cypress's global namespace for TypeScript support
declare global {
  namespace Cypress {
    interface Chainable {
      loginAs(role: 'program_head' | 'admin' | 'department_head'): Chainable<void>;
    }
  }
}