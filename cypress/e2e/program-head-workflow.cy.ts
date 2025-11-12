/// <reference types="cypress" />

describe('Program Head Workflow', () => {
  beforeEach(() => {
    // Log in as a program head before each test
    cy.loginAs('program_head');
  });

  context('Resource Management Read-Only View', () => {
    it('should display instructors in a read-only "browse" mode', () => {
      cy.visit('/component-management/');
      cy.contains('[role="tab"]', 'Instructors').click();

      // 1. Verify the UI indicates a read-only view
      cy.contains('h2', 'Browse Instructors').should('be.visible');
      cy.get('[role="alert"]').should('contain.text', 'You can browse instructors from all departments');

      // 2. Assert that management forms and buttons are not present
      cy.get('form').should('not.exist');
      cy.contains('button', 'Create Instructor').should('not.exist');
      cy.get('[data-testid="item-card"]').first().within(() => {
        cy.contains('button', 'Edit').should('not.exist');
        cy.contains('button', 'Delete').should('not.exist');
      });
    });

    it('should display classrooms in a read-only "browse" mode', () => {
      cy.visit('/component-management/');
      cy.contains('[role="tab"]', 'Classrooms').click();

      // 1. Verify the UI indicates a read-only view
      cy.contains('h2', 'Classrooms').should('be.visible');
      cy.get('[role="alert"]').should('contain.text', 'You are viewing all available classrooms');

      // 2. Assert that management forms and buttons are not present
      cy.get('form').should('not.exist');
      cy.contains('button', 'Create Classroom').should('not.exist');
      cy.get('[data-testid="item-card"]').first().within(() => {
        cy.contains('button', 'Edit').should('not.exist');
        cy.contains('button', 'Delete').should('not.exist');
      });
    });
  });

  context('Class Session Creation', () => {
    beforeEach(() => {
      // Navigate to the page to create a new class session
      cy.visit('/class-sessions');
      // Assuming a button exists to open the creation form/modal
      // cy.contains('button', /add class session/i).should('not.be.disabled').click();
    });

    it('should correctly prioritize and select resources using selector modals', () => {
      // --- 1. Test Classroom Selector ---
      cy.get('button#classroom_id').should('not.be.disabled').click();
      cy.get('[role="dialog"]').within(() => {
        cy.contains('h3', 'From Your Department').should('be.visible');
        // This assumes seed data exists for "B-205" in the program head's dept
        cy.contains('div', 'B-205').click();
      });
      cy.get('button#classroom_id').should('contain.text', 'B-205');

      // --- 2. Test Instructor Selector ---
      cy.get('button#instructor_id').click();
      cy.get('[role="dialog"]').within(() => {
        cy.contains('h3', 'From Your Department').should('be.visible');
        // This assumes seed data exists for a "CECE Instructor"
        cy.contains('div', 'Instructor 1 CECE').click();
      });
      cy.get('button#instructor_id').should('contain.text', 'Instructor 1 CECE');

      // --- 3. Test Course Selector ---
      cy.get('button#course_id').click();
      cy.get('[role="dialog"]').within(() => {
        // Courses are prioritized by program, which corresponds to "From Your Department"
        cy.contains('h3', 'From Your Department').should('be.visible');
        // This assumes a course named "Advanced Programming" exists in the program
        cy.contains('div', 'CS Course 1').click();
      });
      cy.get('button#course_id').should('contain.text', 'CS Course 1');

      // --- 4. Fill remaining fields and submit ---
      // (Selector for Class Group would follow the same pattern)
      cy.get('button#class_group_id').click();
      cy.get('[role="dialog"]').contains('div', 'CS Class 1').click();

      cy.get('input#period_count').type('2{leftArrow}{backspace}');
      cy.contains('button', 'Add Class Session').click();

      // --- 5. Verify Success ---
      cy.contains('Class session created successfully').should('be.visible');
    });
  });
});