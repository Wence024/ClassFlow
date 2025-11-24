import { test, expect } from '@playwright/test';

test.describe('Dynamic Resource Timetabling E2E Tests', () => {
  test('create and place incomplete session', async ({ page }) => {
    // 1. Create incomplete session
    await page.goto('/manage-classes');
    await page.click('[data-cy="create-session-btn"]');
    await page.selectOption('[data-cy="course-select"]', 'Math 101');
    await page.selectOption('[data-cy="group-select"]', 'Group A');
    // Leave resources empty
    await page.click('[data-cy="submit-btn"]');

    await expect(page.locator('.toast-success')).toBeVisible();

    // 2. Navigate to timetable
    await page.goto('/scheduler');

    // 3. Find incomplete session in drawer
    const drawer = page.locator('[data-cy="drawer"]');
    const incompleteSession = drawer.locator('[data-cy^="unassigned-session-"]').first();
    await expect(incompleteSession).toHaveClass(/border-dashed/);

    // 4. Drag to timetable
    await incompleteSession.dragTo(page.locator('[data-cy="cell-0-0"]'));

    // 5. Resource modal appears
    await expect(page.locator('[data-cy="resource-modal"]')).toBeVisible();
    await page.selectOption('[data-cy="instructor-select"]', 'Dr. Smith');
    await page.selectOption('[data-cy="classroom-select"]', 'Room 101');
    await page.click('[data-cy="confirm-btn"]');

    // 6. Session appears in timetable
    const cell = page.locator('[data-cy="cell-0-0"]');
    await expect(cell).toContainText('Math 101');
    await expect(cell).not.toHaveClass(/border-dashed/);
  });

  test('drag incomplete session to instructor view for assignment', async ({ page }) => {
    // 1. Create incomplete session
    await page.goto('/manage-classes');
    await page.click('[data-cy="create-session-btn"]');
    await page.selectOption('[data-cy="course-select"]', 'Physics 101');
    await page.selectOption('[data-cy="group-select"]', 'Group B');
    // Leave resources empty
    await page.click('[data-cy="submit-btn"]');

    // 2. Navigate to timetable and switch to instructor view
    await page.goto('/scheduler');
    await page.click('[data-cy="view-mode-toggle"]');
    await page.click('[data-cy="instructor-view-option"]');

    // 3. Find incomplete session in drawer
    const drawer = page.locator('[data-cy="drawer"]');
    const incompleteSession = drawer.locator('[data-cy^="unassigned-session-"]').first();
    
    // 4. Drag to specific instructor row
    const instructorRow = page.locator('[data-cy="instructor-row-Dr-Smith"]');
    await incompleteSession.dragTo(instructorRow.locator('[data-cy="period-2"]'));

    // 5. Resource modal appears to select classroom
    await expect(page.locator('[data-cy="resource-modal"]')).toBeVisible();
    await page.selectOption('[data-cy="classroom-select"]', 'Room 202');
    await page.click('[data-cy="confirm-btn"]');

    // 6. Session appears in timetable with assigned instructor
    await expect(instructorRow.locator('[data-cy="period-2"]')).toContainText('Physics 101');
    await expect(instructorRow.locator('[data-cy="period-2"]')).toContainText('Dr. Smith');
  });

  test('reassign instructor via drag-and-drop', async ({ page }) => {
    // 1. Create a session with instructor assigned
    await page.goto('/manage-classes');
    await page.click('[data-cy="create-session-btn"]');
    await page.selectOption('[data-cy="course-select"]', 'Chemistry 101');
    await page.selectOption('[data-cy="group-select"]', 'Group C');
    await page.selectOption('[data-cy="instructor-select"]', 'Dr. Smith');
    await page.selectOption('[data-cy="classroom-select"]', 'Room 101');
    await page.click('[data-cy="submit-btn"]');

    // 2. Navigate to timetable and switch to instructor view
    await page.goto('/scheduler');
    await page.click('[data-cy="view-mode-toggle"]');
    await page.click('[data-cy="instructor-view-option"]');

    // 3. Find session assigned to Dr. Smith
    const smithRow = page.locator('[data-cy="instructor-row-Dr-Smith"]');
    const sessionCell = smithRow.locator('[data-cy^="session-cell-"]').first();

    // 4. Drag to different instructor (Dr. Jones)
    const jonesRow = page.locator('[data-cy="instructor-row-Dr-Jones"]');
    await sessionCell.dragTo(jonesRow.locator('[data-cy="period-3"]'));

    // 5. Confirmation dialog appears
    await expect(page.locator('[data-cy="confirmation-dialog"]')).toBeVisible();
    await expect(page.locator('[data-cy="confirmation-dialog"]')).toContainText('Dr. Smith');
    await expect(page.locator('[data-cy="confirmation-dialog"]')).toContainText('Dr. Jones');
    await page.click('[data-cy="confirm-btn"]');

    // 6. Session now appears in Dr. Jones' row
    await expect(jonesRow.locator('[data-cy="period-3"]')).toContainText('Chemistry 101');
    await expect(jonesRow.locator('[data-cy="period-3"]')).toContainText('Dr. Jones');
    // And no longer in Dr. Smith's row
    await expect(smithRow.locator('[data-cy^="session-cell-"]')).not.toContainText('Chemistry 101');
  });

  test('reassign classroom via drag-and-drop', async ({ page }) => {
    // 1. Create a session with classroom assigned
    await page.goto('/manage-classes');
    await page.click('[data-cy="create-session-btn"]');
    await page.selectOption('[data-cy="course-select"]', 'Biology 101');
    await page.selectOption('[data-cy="group-select"]', 'Group D');
    await page.selectOption('[data-cy="instructor-select"]', 'Dr. Wilson');
    await page.selectOption('[data-cy="classroom-select"]', 'Room 101');
    await page.click('[data-cy="submit-btn"]');

    // 2. Navigate to timetable and switch to classroom view
    await page.goto('/scheduler');
    await page.click('[data-cy="view-mode-toggle"]');
    await page.click('[data-cy="classroom-view-option"]');

    // 3. Find session assigned to Room 101
    const room101Row = page.locator('[data-cy="classroom-row-Room-101"]');
    const sessionCell = room101Row.locator('[data-cy^="session-cell-"]').first();

    // 4. Drag to different classroom (Room 203)
    const room203Row = page.locator('[data-cy="classroom-row-Room-203"]');
    await sessionCell.dragTo(room203Row.locator('[data-cy="period-4"]'));

    // 5. Confirmation dialog appears
    await expect(page.locator('[data-cy="confirmation-dialog"]')).toBeVisible();
    await expect(page.locator('[data-cy="confirmation-dialog"]')).toContainText('Room 101');
    await expect(page.locator('[data-cy="confirmation-dialog"]')).toContainText('Room 203');
    await page.click('[data-cy="confirm-btn"]');

    // 6. Session now appears in Room 203
    await expect(room203Row.locator('[data-cy="period-4"]')).toContainText('Biology 101');
    await expect(room203Row.locator('[data-cy="period-4"]')).toContainText('Room 203');
    // And no longer in Room 101
    await expect(room101Row.locator('[data-cy^="session-cell-"]')).not.toContainText('Biology 101');
  });

  test('department head sees incomplete sessions in approval queue', async ({ page }) => {
    // 1. Create incomplete session as program head
    await page.goto('/manage-classes');
    await page.click('[data-cy="create-session-btn"]');
    await page.selectOption('[data-cy="course-select"]', 'History 101');
    await page.selectOption('[data-cy="group-select"]', 'Group E');
    // Leave resources empty
    await page.click('[data-cy="submit-btn"]');
    
    // Submit for approval
    await page.click('[data-cy="submit-approval-btn"]');

    // 2. Switch to department head account
    await page.goto('/auth/login');
    await page.fill('[data-cy="email"]', 'dept-head@example.com');
    await page.fill('[data-cy="password"]', 'password');
    await page.click('[data-cy="login-btn"]');

    // 3. Navigate to approval queue
    await page.goto('/approvals');

    // 4. Find incomplete session
    const approvalRequests = page.locator('[data-cy="approval-request"]');
    const incompleteRequest = approvalRequests.filter({ hasText: 'History 101' }).first();
    
    // 5. Verify incomplete session shows appropriate indicators
    await expect(incompleteRequest).toContainText('Needs resources');
    await expect(incompleteRequest.locator('[data-cy="missing-resources-badge"]')).toBeVisible();

    // 6. Approve the request
    await incompleteRequest.locator('[data-cy="approve-btn"]').click();
    await expect(page.locator('.toast-success')).toBeVisible();
  });
});