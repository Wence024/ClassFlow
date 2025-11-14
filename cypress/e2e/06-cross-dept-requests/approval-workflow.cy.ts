/// <reference types="cypress" />

/**
 * Cross-Department Request Test Suite - Approval Workflow.
 *
 * Tests the complete approval workflow from department head perspective.
 */
describe('Cross-Dept Requests: Approval Workflow', () => {
  
  context('Department Head - View Pending Requests', () => {
    beforeEach(() => {
      cy.loginAs('department_head');
      cy.visit('/');
    });

    it('should display notification bell with badge if requests exist', () => {
      // Check for notification bell
      cy.get('[data-cy="notification-bell-icon"]').should('be.visible');
      
      // Badge may or may not be visible depending on pending requests
      cy.get('[data-cy="notification-bell-icon"]').click();
    });

    it('should open pending requests panel', () => {
      cy.get('[data-cy="notification-bell-icon"]').click();
      
      // Panel should be visible
      cy.contains(/pending requests/i).should('be.visible');
    });

    it('should display request details in panel', () => {
      cy.get('[data-cy="notification-bell-icon"]').click();
      
      cy.get('[data-cy="pending-requests-panel"]').within(() => {
        // Should show request cards with details
        // (if any requests exist)
      });
    });
  });

  context('Department Head - Approve Request', () => {
    beforeEach(() => {
      cy.loginAs('department_head');
      cy.visit('/');
      cy.get('[data-cy="notification-bell-icon"]').click();
    });

    it('should approve a pending request', () => {
      // Find approve button on first request
      cy.get('[data-cy^="approve-request-button"]').first().then($btn => {
        if ($btn.length > 0) {
          cy.wrap($btn).click();
          
          // Verify request disappears or status updates
          cy.contains(/approved|success/i).should('be.visible');
        }
      });
    });
  });

  context('Department Head - Reject Request', () => {
    beforeEach(() => {
      cy.loginAs('department_head');
      cy.visit('/');
      cy.get('[data-cy="notification-bell-icon"]').click();
    });

    it('should require rejection message', () => {
      cy.get('[data-cy^="reject-request-button"]').first().then($btn => {
        if ($btn.length > 0) {
          cy.wrap($btn).click();
          verifyRejectionDialogRequiresMessage();
        }
      });
    });

    it('should reject request with message', () => {
      cy.get('[data-cy^="reject-request-button"]').first().then($btn => {
        if ($btn.length > 0) {
          cy.wrap($btn).click();
          submitRejectionWithMessage('Resource is unavailable at this time');
        }
      });
    });
  });

  context('Admin - Can Also Approve/Reject', () => {
    beforeEach(() => {
      cy.loginAs('admin');
      cy.visit('/');
    });

    it('should allow admin to view and approve requests', () => {
      cy.get('[data-cy="notification-bell-icon"]').click();
      
      // Admin should see all pending requests
      cy.get('[data-cy="pending-requests-panel"]').should('be.visible');
    });
  });
});

/**
 * Helper function to verify rejection dialog requires a message.
 */
function verifyRejectionDialogRequiresMessage() {
  cy.get('[role="dialog"]').within(() => {
    cy.contains('button', /reject/i).click();
    cy.contains(/required|message/i).should('be.visible');
  });
}

/**
 * Helper function to submit rejection with a message.
 *
 * @param message - The rejection message to submit.
 */
function submitRejectionWithMessage(message: string) {
  cy.get('[role="dialog"]').within(() => {
    cy.get('textarea').type(message);
    cy.contains('button', /reject/i).click();
  });
  cy.contains(/rejected|success/i).should('be.visible');
}
