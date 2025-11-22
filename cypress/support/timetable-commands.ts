/// <reference types="cypress" />
/* eslint-disable @typescript-eslint/no-namespace */

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Creates an incomplete class session (without instructor/classroom).
       *
       * @param data - Session data including course code, group name, and period count.
       * @param data.courseCode - Course code to select.
       * @param data.groupName - Group name to select.
       * @param data.periodCount - Number of periods for the session.
       */
      createIncompleteSession(data: {
        courseCode: string;
        groupName: string;
        periodCount: number;
      }): Chainable<void>;

      /**
       * Drags a session to a specific cell in the timetable.
       *
       * @param sessionSelector - CSS selector for the session element.
       * @param rowIndex - Row index in the timetable (0-based).
       * @param cellIndex - Cell index in the row (0-based).
       */
      dragSessionToCell(
        sessionSelector: string,
        rowIndex: number,
        cellIndex: number
      ): Chainable<void>;

      /**
       * Verifies that a conflict warning is displayed for a session.
       *
       * @param sessionId - The ID of the session to check.
       */
      verifyConflictWarning(sessionId: string): Chainable<void>;
    }
  }
}

export {};

Cypress.Commands.add('createIncompleteSession', (data) => {
  cy.visit('/manage-classes');
  cy.get('[data-cy="add-class-session-btn"]').click();
  
  cy.get('[data-cy="course-selector"]').click();
  cy.contains(data.courseCode).click();
  
  cy.get('[data-cy="class-group-selector"]').click();
  cy.contains(data.groupName).click();
  
  cy.get('[data-cy="period-count-input"]').clear().type(String(data.periodCount));
  cy.get('[data-cy="submit-session-btn"]').click();
});

Cypress.Commands.add('dragSessionToCell', (sessionSelector, rowIndex, cellIndex) => {
  cy.get(sessionSelector).trigger('dragstart');
  cy.get('table tbody tr').eq(rowIndex).within(() => {
    cy.get('td').eq(cellIndex).trigger('drop');
  });
});

Cypress.Commands.add('verifyConflictWarning', (sessionId) => {
  cy.get(`[data-testid="session-card-${sessionId}"]`).within(() => {
    cy.get('[data-testid="conflict-warning"]').should('exist');
  });
});

export {};
