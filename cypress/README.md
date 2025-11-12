# Cypress E2E Testing Documentation

## Test Data Isolation Strategy

All E2E tests **MUST** use isolated test data to prevent modifications to production/real data. This is enforced through:

### Naming Convention

All test data uses the `TEST_*_CYPRESS_` prefix pattern:
- Departments: `TEST_DEPT_CYPRESS_<timestamp>`
- Programs: `TEST_PROG_CYPRESS_<timestamp>`
- Courses: `TEST_COURSE_<timestamp>`
- Classrooms: `TEST_ROOM_<timestamp>`
- Instructors: `test_instructor_<timestamp>@cypress.test`

### Test Fixtures

Use the fixtures in `cypress/fixtures/testData.ts` to generate test entities:

```typescript
import { generateTestDepartment, generateTestProgram } from '../fixtures/testData';

const deptData = generateTestDepartment();
const progData = generateTestProgram(departmentId);
```

### Database Helpers

Use `cypress/support/dbHelpers.ts` for database operations:

```typescript
import { createTestDepartment, cleanupTestData } from '../support/dbHelpers';

// In beforeEach
const deptId = await createTestDepartment({ name: 'TEST_DEPT_...', code: 'TD...' });

// In afterEach
await cleanupTestData();
```

### Test Structure

Every test file should follow this pattern:

```typescript
describe('Feature Name', () => {
  let testDepartmentId: string;
  
  beforeEach(() => {
    // Create test data
    cy.task('createTestDepartment', generateTestDepartment()).then((id) => {
      testDepartmentId = id;
    });
  });
  
  afterEach(() => {
    // Clean up test data
    cy.task('cleanupTestData');
  });
  
  it('should test feature', () => {
    // Use testDepartmentId in your test
  });
});
```

## Data-cy Selectors

All interactive elements have `data-cy` attributes for reliable selection:

### Notification Components
- `data-cy="resource-requests-bell"` - Department head notification bell
- `data-cy="pending-requests-bell"` - Program head pending requests bell
- `data-cy="request-updates-bell"` - Program head request updates bell
- `data-cy="approve-request-button-{id}"` - Approve button for specific request
- `data-cy="reject-request-button-{id}"` - Reject button for specific request
- `data-cy="dismiss-request-button-{id}"` - Dismiss button for specific request
- `data-cy="cancel-request-button-{id}"` - Cancel button for pending request
- `data-cy="dismiss-notification-button-{id}"` - Dismiss notification button

### Timetable Components
- `data-cy="timetable-page"` - Main timetable page container
- `data-cy="timetable-grid"` - Timetable grid container
- `data-cy="timetable-table"` - Table element with role="table"
- `data-cy="timetable-body"` - Table body
- `data-cy="timetable-drawer"` - Drawer container (also has `.drawer` class)
- `data-cy="unassigned-session-{id}"` - Unassigned session in drawer
- `data-cy="view-selector"` - View mode selector
- `data-cy="view-option-class-group"` - Class group view button
- `data-cy="view-option-classroom"` - Classroom view button
- `data-cy="view-option-instructor"` - Instructor view button

### Usage Example

```typescript
// Find notification bell
cy.get('[data-cy="resource-requests-bell"]').click();

// Approve a specific request
cy.get('[data-cy="approve-request-button-req123"]').click();

// Select timetable view
cy.get('[data-cy="view-option-instructor"]').click();

// Find timetable grid
cy.get('[data-cy="timetable-grid"]').should('be.visible');
```

## Running Tests

```bash
# Run all tests headless
npm run cypress:run

# Open Cypress UI
npm run cypress:open

# Run specific test file
npx cypress run --spec "cypress/e2e/01-authentication/login.cy.ts"
```

## Writing New Tests

1. **Always use test data isolation** - Never modify real departments, programs, etc.
2. **Use data-cy selectors** - Prefer `[data-cy="element"]` over classes or text
3. **Clean up after tests** - Use `afterEach` hooks to remove test data
4. **Document test purpose** - Add clear descriptions to `describe` and `it` blocks
5. **Wait for elements** - Use Cypress's built-in retry-ability, avoid arbitrary waits

## Troubleshooting

### Tests Modifying Real Data
- Check that all entity creation uses `TEST_*` prefixes
- Verify `afterEach` cleanup is running
- Ensure test uses fixtures from `testData.ts`

### Elements Not Found
- Check `data-cy` attribute exists in component
- Verify element is visible (not hidden by CSS)
- Use Cypress UI to inspect element tree

### Flaky Tests
- Avoid `cy.wait(ms)` - use `cy.get().should()` instead
- Check for race conditions in async operations
- Ensure proper test isolation (beforeEach/afterEach)

## Best Practices

✅ **DO:**
- Use semantic `data-cy` names (`approve-request-button` not `btn-1`)
- Create focused, single-purpose tests
- Use page objects for complex interactions
- Test user workflows, not implementation details

❌ **DON'T:**
- Rely on CSS classes or element positions
- Share state between tests
- Use production credentials in tests
- Skip cleanup steps
