/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to log in a user
       * @param email - User email
       * @param password - User password
       * @example cy.login('cs.head@test.local', 'password123')
       */
      login(email: string, password: string): Chainable<void>;

      /**
       * Custom command to log out the current user
       * @example cy.logout()
       */
      logout(): Chainable<void>;

      /**
       * Custom command to navigate to a specific page
       * @param page - Page name
       * @example cy.navigateTo('timetable')
       */
      navigateTo(page: string): Chainable<void>;

      /**
       * Custom command to drag and drop an element
       * @param sourceSelector - Source element selector
       * @param targetSelector - Target element selector
       * @example cy.dragAndDrop('[data-testid="session-1"]', '[data-testid="cell-0-0"]')
       */
      dragAndDrop(sourceSelector: string, targetSelector: string): Chainable<void>;

      /**
       * Custom command to wait for the page to be fully loaded
       * @example cy.waitForPageLoad()
       */
      waitForPageLoad(): Chainable<void>;
    }
  }
}

/**
 * Login command - authenticates a user via the login form
 */
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.waitForPageLoad(); // Wait for any initial loading to complete
  cy.findByLabelText(/email/i).should('be.enabled').type(email);
  cy.findByLabelText(/password/i).type(password);
  cy.findByRole('button', { name: /login/i }).click();
  cy.waitForPageLoad();
});

/**
 * Logout command - logs out the current user
 */
Cypress.Commands.add('logout', () => {
  // Click user avatar/menu
  cy.get('[data-testid="user-avatar"]').click();
  // Click logout button
  cy.findByRole('button', { name: /logout|sign out/i }).click();
  cy.url().should('include', '/login');
});

/**
 * Navigate to a specific page
 */
Cypress.Commands.add('navigateTo', (page: string) => {
  const pageMap: Record<string, string> = {
    timetable: '/timetable',
    'class-sessions': '/class-sessions',
    courses: '/manage-resources',
    classrooms: '/manage-resources',
    instructors: '/manage-resources',
    groups: '/manage-resources',
    programs: '/programs',
    departments: '/departments',
    users: '/users',
  };

  const url = pageMap[page.toLowerCase()] || `/${page}`;
  cy.visit(url);
  cy.waitForPageLoad();
});

/**
 * Drag and drop utility
 */
Cypress.Commands.add('dragAndDrop', (sourceSelector: string, targetSelector: string) => {
  const dataTransfer = new DataTransfer();

  cy.get(sourceSelector).trigger('dragstart', { dataTransfer });
  cy.get(targetSelector).trigger('dragenter', { dataTransfer });
  cy.get(targetSelector).trigger('dragover', { dataTransfer });
  cy.get(targetSelector).trigger('drop', { dataTransfer });
  cy.get(sourceSelector).trigger('dragend', { dataTransfer });
});

/**
 * Wait for page to be fully loaded
 */
Cypress.Commands.add('waitForPageLoad', () => {
  // Wait for initial loading states to complete
  cy.get('body').should('be.visible');
  // Wait for any loading spinners to disappear
  cy.get('[data-testid="loading-spinner"]', { timeout: 10000 }).should('not.exist');
});

export {};
