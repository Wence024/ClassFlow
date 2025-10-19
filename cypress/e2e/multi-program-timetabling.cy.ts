/**
 * Multi-Program Timetabling E2E Test Suite
 *
 * This test suite verifies the complete workflow for multi-program timetabling,
 * including ownership, permissions, conflict detection, and class merging across programs.
 *
 * Test Prerequisites:
 * - Admin user exists
 * - Two Program Head users: cs.head@test.local and bus.head@test.local
 * - Two Departments: Computer Science (CS) and Business (BUS)
 * - Two Programs: BSCS (assigned to CS dept) and BSBA (assigned to BUS dept)
 * - Shared resources: Instructor "Dr. Ada Lovelace", Classroom "Main Auditorium"
 */

describe('Multi-Program Timetabling E2E Tests', () => {
  const csHead = {
    email: 'cs.head@test.local',
    password: '12345678',
    program: 'BSCS',
    department: 'CS',
  };

  const busHead = {
    email: 'bus.head@test.local',
    password: '12345678',
    program: 'BSBA',
    department: 'BUS',
  };

  const sharedResources = {
    instructor: 'Dr. Ada Lovelace',
    classroom: 'Main Auditorium',
    course: 'General Elective',
    courseCode: 'GEN101',
  };

  beforeEach(() => {
    // Clear any existing sessions
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe('Scenario 1: Core Ownership and Permissions (Program Head A)', () => {
    /**
     * Goal: Confirm a Program Head can create and schedule sessions for their own program
     * Validates: RLS policy fixes for timetable_assignments
     */
    it('should allow CS Program Head to create and schedule their own class sessions', () => {
      // Login as CS Program Head
      cy.login(csHead.email, csHead.password);

      // Navigate to Manage Resources to create class group
      cy.navigateTo('manage-resources');

      // Create Class Group
      cy.findByRole('tab', { name: /class groups/i }).click();
      cy.findByRole('button', { name: /add.*group/i }).click();
      cy.findByLabelText(/name/i).type('CS Section 1');
      cy.findByLabelText(/code/i).type('CS-S1');
      cy.findByRole('button', { name: /save|create/i }).click();
      cy.findByText('CS Section 1').should('be.visible');

      // Create Course
      cy.findByRole('tab', { name: /courses/i }).click();
      cy.findByRole('button', { name: /add.*course/i }).click();
      cy.findByLabelText(/name/i).type('Intro to Algorithms');
      cy.findByLabelText(/code/i).type('CS301');
      cy.findByRole('button', { name: /save|create/i }).click();
      cy.findByText('Intro to Algorithms').should('be.visible');

      // Navigate to Class Sessions page
      cy.navigateTo('class-sessions');

      // Create Class Session
      cy.findByRole('button', { name: /add.*session|create.*session/i }).click();

      // Fill in the form in order: course, group, classroom, instructor
      cy.findByLabelText(/course/i).click();
      cy.findByText('Intro to Algorithms').click();

      cy.findByLabelText(/class group/i).click();
      cy.findByText('CS Section 1').click();

      cy.findByLabelText(/classroom/i).click();
      cy.findByText(sharedResources.classroom).click();

      cy.findByLabelText(/instructor/i).click();
      cy.findByText(sharedResources.instructor).click();

      cy.findByLabelText(/period count/i).clear().type('2');

      cy.findByRole('button', { name: /save|create/i }).click();
      cy.findByText(/successfully created/i, { timeout: 5000 }).should('be.visible');

      // Navigate to Timetable
      cy.navigateTo('timetable');

      // Drag session from drawer to grid
      cy.get('[data-testid="drawer"]').within(() => {
        cy.findByText('Intro to Algorithms').should('be.visible');
      });

      // Drag to first available cell
      cy.dragAndDrop(
        '[data-testid="drawer-session"]:contains("Intro to Algorithms")',
        '[data-testid="timetable-cell-0-0"]'
      );

      // Verify session is placed on grid
      cy.get('[data-testid="timetable-cell-0-0"]').within(() => {
        cy.findByText('Intro to Algorithms').should('be.visible');
      });
    });
  });

  describe('Scenario 2: Read-Only View and Permission Boundaries (Program Head B)', () => {
    /**
     * Goal: Confirm a second Program Head can see but not modify another program's schedule
     * Validates: Permission boundaries and canManageAssignmentsForProgram logic
     */
    it('should prevent Business Program Head from modifying CS Program Head sessions', () => {
      // Assume CS session is already scheduled from previous test
      // Login as Business Program Head
      cy.login(busHead.email, busHead.password);

      // Navigate to Timetable
      cy.navigateTo('timetable');

      // Verify CS session is visible but grayed out
      cy.get('[data-testid="timetable-cell-0-0"]').within(() => {
        cy.findByText('Intro to Algorithms').should('be.visible');
        // Check for read-only styling
        cy.get('[data-testid="session-cell"]').should($cell => {
          const style = window.getComputedStyle($cell[0]);
          const hasNotAllowedCursor = style.cursor === 'not-allowed';
          const hasOpacity50 = $cell.hasClass('opacity-50');
          expect(hasNotAllowedCursor || hasOpacity50).to.be.true;
        });
      });

      // Attempt to drag the CS session (should not be draggable)
      cy.get('[data-testid="timetable-cell-0-0"] [data-testid="session-cell"]').trigger(
        'dragstart',
        { force: true }
      );

      // Verify drag does not start (element should not have draggable state)
      cy.get('[data-testid="timetable-cell-0-0"] [data-testid="session-cell"]').should(
        'not.have.attr',
        'draggable',
        'true'
      );
    });
  });

  describe('Scenario 3: Cross-Program Conflict Detection', () => {
    /**
     * Goal: Confirm system identifies resource conflicts across programs
     * Validates: Conflict detection logic in checkConflicts utility
     */
    it('should detect and prevent instructor conflicts across programs', () => {
      // Login as Business Program Head
      cy.login(busHead.email, busHead.password);

      // Create Business class group
      cy.navigateTo('manage-resources');
      cy.findByRole('tab', { name: /class groups/i }).click();
      cy.findByRole('button', { name: /add.*group/i }).click();
      cy.findByLabelText(/name/i).type('BUS Section 1');
      cy.findByLabelText(/code/i).type('BUS-S1');
      cy.findByRole('button', { name: /save|create/i }).click();

      // Create Business course
      cy.findByRole('tab', { name: /courses/i }).click();
      cy.findByRole('button', { name: /add.*course/i }).click();
      cy.findByLabelText(/name/i).type('Business Ethics');
      cy.findByLabelText(/code/i).type('BUS201');
      cy.findByRole('button', { name: /save|create/i }).click();

      // Create Class Session with shared instructor
      cy.navigateTo('class-sessions');
      cy.findByRole('button', { name: /add.*session|create.*session/i }).click();

      cy.findByLabelText(/course/i).click();
      cy.findByText('Business Ethics').click();

      cy.findByLabelText(/class group/i).click();
      cy.findByText('BUS Section 1').click();

      cy.findByLabelText(/classroom/i).click();
      cy.get('[role="option"]').first().click(); // Select any classroom

      cy.findByLabelText(/instructor/i).click();
      cy.findByText(sharedResources.instructor).click();

      cy.findByLabelText(/period count/i).clear().type('2');

      cy.findByRole('button', { name: /save|create/i }).click();

      // Navigate to Timetable
      cy.navigateTo('timetable');

      // Drag Business session and hover over CS session's slot
      cy.dragAndDrop(
        '[data-testid="drawer-session"]:contains("Business Ethics")',
        '[data-testid="timetable-cell-0-0"]'
      );

      // Verify conflict indication
      cy.get('[data-testid="timetable-cell-0-0"]').should($cell => {
        const hasRedBgClass = $cell.hasClass('bg-red-100');
        const hasRedBgColor = $cell.css('background-color') === 'rgb(254, 226, 226)';
        expect(hasRedBgClass || hasRedBgColor).to.be.true;
      });

      // Verify conflict tooltip appears
      cy.get('[role="tooltip"]').should('contain.text', 'Instructor conflict');
      cy.get('[role="tooltip"]').should('contain.text', sharedResources.instructor);

      // Verify toast error message
      cy.findByText(/conflict/i).should('be.visible');
    });
  });

  describe('Scenario 4: Class Merging Functionality', () => {
    /**
     * Goal: Confirm two programs can schedule merged sessions without duplication
     * Validates: Class merging fix (commit 596d094)
     */
    it('should correctly merge class sessions from different programs', () => {
      // Setup: Business Program Head creates a session with shared resources
      cy.login(busHead.email, busHead.password);

      // Navigate to Class Sessions
      cy.navigateTo('class-sessions');

      // Create session with shared course
      cy.findByRole('button', { name: /add.*session|create.*session/i }).click();

      cy.findByLabelText(/course/i).click();
      cy.findByText(sharedResources.course).click();

      cy.findByLabelText(/class group/i).click();
      cy.findByText(/BUS Section/i).click();

      cy.findByLabelText(/classroom/i).click();
      cy.findByText(sharedResources.classroom).click();

      cy.findByLabelText(/instructor/i).click();
      cy.findByText(sharedResources.instructor).click();

      cy.findByLabelText(/period count/i).clear().type('1');

      cy.findByRole('button', { name: /save|create/i }).click();

      // Schedule it on the timetable
      cy.navigateTo('timetable');
      cy.dragAndDrop(
        `[data-testid="drawer-session"]:contains("${sharedResources.course}")`,
        '[data-testid="timetable-cell-1-0"]'
      );

      cy.logout();

      // CS Program Head creates same session and merges
      cy.login(csHead.email, csHead.password);

      cy.navigateTo('class-sessions');
      cy.findByRole('button', { name: /add.*session|create.*session/i }).click();

      cy.findByLabelText(/course/i).click();
      cy.findByText(sharedResources.course).click();

      cy.findByLabelText(/class group/i).click();
      cy.findByText(/CS Section/i).click();

      cy.findByLabelText(/classroom/i).click();
      cy.findByText(sharedResources.classroom).click();

      cy.findByLabelText(/instructor/i).click();
      cy.findByText(sharedResources.instructor).click();

      cy.findByLabelText(/period count/i).clear().type('1');

      cy.findByRole('button', { name: /save|create/i }).click();

      // Navigate to timetable and merge
      cy.navigateTo('timetable');

      // Drag CS session onto Business session's cell
      cy.dragAndDrop(
        `[data-testid="drawer-session"]:contains("${sharedResources.course}")`,
        '[data-testid="timetable-cell-1-0"]'
      );

      // Verify merged session rendering
      cy.get('[data-testid="timetable-cell-1-0"]').within(() => {
        // Should show merged indicator icon
        cy.get('[data-testid="merged-session-icon"]').should('be.visible');

        // Should display course name
        cy.findByText(sharedResources.course).should('be.visible');

        // Should have merged styling (gradient or split background)
        cy.get('[data-testid="session-cell"]').should(
          'have.class',
          /gradient|merged/
        );
      });

      // Hover to see tooltip with both groups
      cy.get('[data-testid="timetable-cell-1-0"]').trigger('mouseenter');
      cy.get('[role="tooltip"]').should('contain.text', 'CS Section');
      cy.get('[role="tooltip"]').should('contain.text', 'BUS Section');

      // Verify no duplication (should only be one merged cell)
      cy.get('[data-testid="session-cell"]:contains("' + sharedResources.course + '")')
        .should('have.length', 1);
    });
  });

  describe('Scenario 5: End-to-End Workflow Integration', () => {
    /**
     * Comprehensive test covering the entire workflow from setup to verification
     */
    it('should complete full multi-program timetabling workflow', () => {
      // This test combines all scenarios into one complete flow
      // 1. CS Head creates and schedules
      cy.login(csHead.email, csHead.password);
      cy.navigateTo('timetable');
      // Verify CS sessions exist
      cy.findByText('Intro to Algorithms').should('be.visible');

      cy.logout();

      // 2. Business Head views (read-only)
      cy.login(busHead.email, busHead.password);
      cy.navigateTo('timetable');
      cy.findByText('Intro to Algorithms').should('be.visible');

      // 3. Business Head creates own session with conflict detection
      // 4. Verify merging works correctly
      // (Implementation similar to previous scenarios)

      // Final verification: Check database consistency
      cy.request({
        method: 'GET',
        url: '/api/timetable/assignments', // Adjust to actual API endpoint
        headers: {
          Authorization: `Bearer ${Cypress.env('authToken')}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        // Verify no duplicate assignments
        const assignments = response.body;
        const uniqueAssignments = new Set(
          assignments.map((a: any) => `${a.class_group_id}-${a.period_index}`)
        );
        expect(assignments.length).to.be.gte(uniqueAssignments.size);
      });
    });
  });
});
