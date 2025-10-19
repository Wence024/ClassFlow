# Cypress E2E Testing Guide

This directory contains end-to-end tests for the ClassFlow application using Cypress.

## Setup

Cypress has been added as a dev dependency. To use it, add these scripts to your `package.json`:

```json
{
  "scripts": {
    "cypress:open": "cypress open",
    "cypress:run": "cypress run",
    "cypress:run:chrome": "cypress run --browser chrome",
    "test:e2e": "start-server-and-test dev http://localhost:8080 cypress:run"
  }
}
```

You'll also need to install `start-server-and-test`:

```bash
npm install --save-dev start-server-and-test
```

## Running Tests

### Interactive Mode (Cypress Test Runner)

```bash
# First, start your dev server
npm run dev

# In another terminal, open Cypress
npm run cypress:open
```

### Headless Mode

```bash
# Runs tests in headless mode
npm run cypress:run

# Or with Chrome browser
npm run cypress:run:chrome
```

### Combined (Start Server + Run Tests)

```bash
npm run test:e2e
```

## Test Structure

### Main Test Suite

`cypress/e2e/multi-program-timetabling.cy.ts` - Comprehensive E2E tests covering:

1. **Scenario 1**: Core ownership and permissions (Program Head A creates and schedules sessions)
2. **Scenario 2**: Read-only view and permission boundaries (Program Head B cannot modify)
3. **Scenario 3**: Cross-program conflict detection (Resource conflicts are detected)
4. **Scenario 4**: Class merging functionality (Sessions merge correctly without duplication)
5. **Scenario 5**: End-to-end workflow integration (Complete workflow verification)

### Custom Commands

Located in `cypress/support/commands.ts`:

- `cy.login(email, password)` - Authenticate a user
- `cy.logout()` - Log out current user
- `cy.navigateTo(page)` - Navigate to a specific page
- `cy.dragAndDrop(source, target)` - Perform drag-and-drop operations
- `cy.waitForPageLoad()` - Wait for page to fully load

## Test Prerequisites

Before running the E2E tests, ensure your test database has:

1. **Admin User**: For initial setup
2. **Two Program Head Users**:
   - `cs.head@test.local` (Computer Science Program Head)
   - `bus.head@test.local` (Business Program Head)
3. **Two Departments**: Computer Science (CS) and Business (BUS)
4. **Two Programs**:
   - BSCS (BS in Computer Science) - assigned to CS department
   - BSBA (BS in Business Administration) - assigned to BUS department
5. **Shared Resources**:
   - Instructor: "Dr. Ada Lovelace" (CS Department)
   - Classroom: "Main Auditorium"
   - Course: "General Elective" (GEN101)

### Setting Up Test Data

You can set up test data manually through the admin interface, or use the Supabase `create_test_user` function:

```sql
-- Create test users (as admin)
SELECT create_test_user(
  'cs.head@test.local',
  '12345678',
  'CS Program Head',
  'program_head',
  (SELECT id FROM programs WHERE short_code = 'BSCS'),
  (SELECT id FROM departments WHERE code = 'CS')
);

SELECT create_test_user(
  'bus.head@test.local',
  'password123',
  'Business Program Head',
  'program_head',
  (SELECT id FROM programs WHERE short_code = 'BSBA'),
  (SELECT id FROM departments WHERE code = 'BUS')
);
```

## Configuration

### Environment Variables

Create a `cypress.env.json` file in the root directory (it is ignored by git) for sensitive data:

```json
{
  "SUPABASE_URL": "your-supabase-url",
  "SUPABASE_ANON_KEY": "your-anon-key"
}
```

### Base Configuration

The main configuration is in `cypress.config.ts`:
- Base URL: `http://localhost:8080`
- Viewport: 1280x720
- Videos and screenshots are saved in `cypress/videos` and `cypress/screenshots`

## CI/CD Integration

A GitHub Actions workflow file is provided at `.cypress-ci.yml`. To use it:

1. Move it to `.github/workflows/cypress.yml`
2. Add `CYPRESS_RECORD_KEY` to your GitHub secrets (if using Cypress Dashboard)
3. Tests will run on push/PR to main and develop branches

## Troubleshooting

### Tests Failing Due to Timing Issues

If tests fail due to elements not being ready:
- Increase timeouts in custom commands
- Use `cy.waitForPageLoad()` more liberally
- Check that `data-testid` attributes are correctly placed in components

### Drag-and-Drop Not Working

If drag-and-drop operations fail:
- Verify that draggable elements have correct event handlers
- Check browser console for JavaScript errors
- Ensure `dataTransfer` object is properly set up

### Authentication Issues

If login fails:
- Verify test user credentials match fixture data
- Check that Supabase auth is working correctly
- Clear cookies and localStorage between tests

## Best Practices

1. **Use data-testid attributes** for stable selectors
2. **Keep tests independent** - each test should set up and clean up its own data
3. **Use custom commands** for repeated actions
4. **Test user flows**, not implementation details
5. **Add meaningful assertions** at each step
6. **Use fixtures** for test data

## Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Testing Library Cypress](https://testing-library.com/docs/cypress-testing-library/intro/)
