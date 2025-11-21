# ClassFlow Testing Guide

## Overview

ClassFlow uses a comprehensive testing strategy with three layers of tests:
1. **Unit/Integration Tests** - Vitest with React Testing Library
2. **E2E Tests** - Cypress for full user journeys
3. **Visual/Manual Testing** - Preview environment

## Testing Philosophy

### Test Pyramid
```
        /\
       /  \      E2E Tests (Few)
      /____\     - Full user journeys
     /      \    - Critical workflows
    /        \   
   /  Integ.  \  Integration Tests (Many)
  /____________\ - Component interactions
 /              \- Hook business logic
/   Unit Tests   \ Unit Tests (Most)
\________________/ - Pure functions
                   - Service layer
```

### What to Test
✅ **DO Test:**
- User-facing functionality
- Business logic and state management
- Data transformations
- Error handling
- Edge cases

❌ **DON'T Test:**
- Implementation details
- Third-party libraries
- UI styling (use visual testing)
- Trivial getters/setters

## Unit & Integration Tests (Vitest)

### Test Structure

Each vertical slice has its own `tests/` directory:

```
feature-name/
└── tests/
    ├── component.integration.test.tsx
    ├── hook.integration.test.tsx
    └── service.test.ts
```

### Component Integration Tests

**File:** `component.integration.test.tsx`  
**Purpose:** Test UI rendering and user interactions

```tsx
/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FeatureComponent from '../component';

describe('Feature Component Integration Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  it('should render the component', () => {
    renderWithProviders(<FeatureComponent />);
    expect(screen.getByText('Feature Title')).toBeInTheDocument();
  });

  it('should handle user input', async () => {
    const user = userEvent.setup();
    renderWithProviders(<FeatureComponent />);
    
    const input = screen.getByLabelText('Name');
    await user.type(input, 'Test Value');
    
    expect(input).toHaveValue('Test Value');
  });

  it('should submit form successfully', async () => {
    const user = userEvent.setup();
    renderWithProviders(<FeatureComponent />);
    
    await user.type(screen.getByLabelText('Name'), 'Test');
    await user.click(screen.getByText('Submit'));
    
    await waitFor(() => {
      expect(screen.getByText('Success')).toBeInTheDocument();
    });
  });
});
```

**Guidelines:**
- Mock external services (use `vi.mock()`)
- Test user interactions, not implementation
- Use `waitFor` for async updates
- Test loading and error states
- Use `data-cy` attributes for stable selectors

### Hook Integration Tests

**File:** `hook.integration.test.tsx`  
**Purpose:** Test business logic and state management

```tsx
/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFeature } from '../hook';
import * as service from '../service';

vi.mock('../service');

describe('Feature Hook Integration Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  it('should fetch data successfully', async () => {
    vi.mocked(service.fetchItems).mockResolvedValue([
      { id: '1', name: 'Item 1' },
    ]);

    const { result } = renderHook(() => useFeature(), { wrapper });

    await waitFor(() => {
      expect(result.current.items).toHaveLength(1);
    });
  });

  it('should handle mutations', async () => {
    vi.mocked(service.createItem).mockResolvedValue({ id: '2', name: 'New' });

    const { result } = renderHook(() => useFeature(), { wrapper });

    act(() => {
      result.current.createItem({ name: 'New' });
    });

    await waitFor(() => {
      expect(result.current.items).toContainEqual({ id: '2', name: 'New' });
    });
  });

  it('should handle errors', async () => {
    vi.mocked(service.fetchItems).mockRejectedValue(new Error('Failed'));

    const { result } = renderHook(() => useFeature(), { wrapper });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });
  });
});
```

**Guidelines:**
- Use `renderHook` from `@testing-library/react`
- Mock the service layer
- Test React Query states (loading, error, data)
- Test optimistic updates
- Use `act()` for state changes

### Service Layer Tests

**File:** `service.test.ts`  
**Purpose:** Test data access and transformations

```tsx
import { describe, it, expect, vi } from 'vitest';
import * as service from '../service';
import * as infraService from '@/lib/services/infraService';

vi.mock('@/lib/services/infraService');

describe('Feature Service Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch items and transform data', async () => {
    vi.mocked(infraService.fetchItems).mockResolvedValue([
      { id: '1', name: 'Item 1' },
    ]);

    const result = await service.fetchItems();

    expect(infraService.fetchItems).toHaveBeenCalled();
    expect(result).toEqual([{ id: '1', name: 'Item 1' }]);
  });

  it('should handle errors from infrastructure layer', async () => {
    vi.mocked(infraService.fetchItems).mockRejectedValue(
      new Error('Database error')
    );

    await expect(service.fetchItems()).rejects.toThrow('Database error');
  });

  it('should transform data correctly', async () => {
    const rawData = { id: '1', created_at: '2025-01-01' };
    vi.mocked(infraService.fetchItem).mockResolvedValue(rawData);

    const result = await service.fetchItem('1');

    expect(result.createdAt).toBe('2025-01-01');
  });
});
```

**Guidelines:**
- Mock infrastructure services (`lib/services/`)
- Test error propagation
- Test data transformations
- Verify service calls with correct params
- Keep tests focused on service layer only

### Mocking Patterns

#### Mock Supabase Services
```tsx
vi.mock('@/lib/services/classSessionsService', () => ({
  fetchByProgram: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}));
```

#### Mock Auth Context
```tsx
vi.mock('@/features/shared/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      id: 'user-123',
      email: 'test@test.com',
      role: 'program_head',
      program_id: 'prog-456',
      department_id: 'dept-789',
    },
    isAuthenticated: true,
  }),
}));
```

#### Mock Toast Notifications
```tsx
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));
```

## E2E Tests (Cypress)

### Test Structure

```
cypress/
├── e2e/
│   ├── 01-auth/
│   │   └── login.cy.ts
│   ├── 02-admin-workflows/
│   │   ├── users.cy.ts
│   │   ├── departments.cy.ts
│   │   └── classrooms.cy.ts
│   ├── 03-department-head-workflows/
│   │   └── view-department-requests.cy.ts
│   ├── 04-program-head-workflows/
│   │   ├── manage-sessions.cy.ts
│   │   ├── manage-courses.cy.ts
│   │   └── manage-class-groups.cy.ts
│   └── 05-timetabling/
│       ├── classroom-view.cy.ts
│       ├── instructor-view.cy.ts
│       └── conflict-detection.cy.ts
├── support/
│   ├── commands.ts
│   ├── seedTestData.ts
│   ├── testDataCleanup.ts
│   └── testSetup.ts
└── cypress.config.ts
```

### E2E Test Example

```tsx
/**
 * E2E tests for User Management (Admin).
 */
describe('Admin: User Management', () => {
  beforeEach(() => {
    // Seed test data
    cy.seedTestData('users');
    
    // Login as admin
    cy.visit('/login');
    cy.get('[data-cy="email-input"]').type('admin@test.com');
    cy.get('[data-cy="password-input"]').type('testpass123');
    cy.get('[data-cy="login-button"]').click();
    cy.url().should('include', '/dashboard');
    
    // Navigate to user management
    cy.get('[data-cy="nav-users"]').click();
  });

  afterEach(() => {
    // Clean up test data
    cy.cleanupTestData('users');
  });

  it('should display list of users', () => {
    cy.get('[data-cy="users-table"]').should('be.visible');
    cy.get('[data-cy^="user-row-"]').should('have.length.at.least', 1);
  });

  it('should create a new user', () => {
    cy.get('[data-cy="add-user-button"]').click();
    
    cy.get('[data-cy="user-email-input"]').type('newuser@test.com');
    cy.get('[data-cy="user-name-input"]').type('New User');
    cy.get('[data-cy="user-role-select"]').select('program_head');
    
    cy.get('[data-cy="submit-user-button"]').click();
    
    cy.get('[role="status"]').should('contain', 'User created');
    cy.get('[data-cy="users-table"]').should('contain', 'newuser@test.com');
  });

  it('should update user details', () => {
    cy.get('[data-cy^="user-row-"]').first().click();
    cy.get('[data-cy="edit-user-button"]').click();
    
    cy.get('[data-cy="user-name-input"]').clear().type('Updated Name');
    cy.get('[data-cy="submit-user-button"]').click();
    
    cy.get('[role="status"]').should('contain', 'User updated');
  });

  it('should delete a user', () => {
    cy.get('[data-cy^="user-row-"]').first().within(() => {
      cy.get('[data-cy="delete-user-button"]').click();
    });
    
    cy.get('[data-cy="confirm-dialog"]').should('be.visible');
    cy.get('[data-cy="confirm-button"]').click();
    
    cy.get('[role="status"]').should('contain', 'User deleted');
  });
});
```

### Test Data Management

#### Seeding Test Data
```tsx
// cypress/support/seedTestData.ts
export async function seedUsers() {
  // Create test users
  await supabase.rpc('create_test_user', {
    email: 'testuser@test.com',
    full_name: 'Test User',
    role: 'program_head',
    password: 'testpass123',
  });
}
```

#### Cleaning Up Test Data
```tsx
// cypress/support/testDataCleanup.ts
export async function cleanupUsers() {
  await supabase.rpc('delete_test_user', {
    email: 'testuser@test.com',
  });
}
```

#### Custom Commands
```tsx
// cypress/support/commands.ts
Cypress.Commands.add('seedTestData', (dataType: string) => {
  cy.task('seedTestData', dataType);
});

Cypress.Commands.add('cleanupTestData', (dataType: string) => {
  cy.task('cleanupTestData', dataType);
});
```

### E2E Best Practices

✅ **DO:**
- Use `data-cy` attributes for selectors
- Seed fresh test data before each test
- Clean up test data after each test
- Test full user journeys
- Verify success messages
- Test error scenarios

❌ **DON'T:**
- Use CSS classes or IDs as selectors
- Share state between tests
- Leave test data in database
- Test implementation details
- Skip cleanup (corrupts database)

## Running Tests

### Run All Unit/Integration Tests
```bash
npm run test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Specific Test File
```bash
npx vitest run src/features/program-head/manage-class-sessions/tests/hook.integration.test.tsx
```

### Run E2E Tests (Headless)
```bash
npx cypress run
```

### Run E2E Tests (Interactive)
```bash
npx cypress open
```

### Run Specific E2E Test
```bash
npx cypress run --spec cypress/e2e/04-program-head-workflows/manage-sessions.cy.ts
```

## Continuous Integration

### GitHub Actions Workflow
```yaml
name: Tests

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: cypress-io/github-action@v5
        with:
          build: npm run build
          start: npm run preview
          wait-on: 'http://localhost:4173'
```

## Test Coverage

### View Coverage Report
```bash
npm run test -- --coverage
```

### Coverage Goals
- **Statements:** > 80%
- **Branches:** > 75%
- **Functions:** > 80%
- **Lines:** > 80%

### Coverage by Layer
- **Components:** Focus on user interactions
- **Hooks:** 90%+ coverage (business logic is critical)
- **Services:** 95%+ coverage (data access is critical)

## Debugging Tests

### Debug Vitest Tests
```tsx
// Add console.log in your test
it('should do something', () => {
  console.log(result.current);
  expect(result.current.value).toBe(expected);
});

// Or use debugger
it('should do something', () => {
  debugger;
  expect(result.current.value).toBe(expected);
});
```

### Debug Cypress Tests
```tsx
// Use cy.debug()
cy.get('[data-cy="button"]').debug().click();

// Use cy.pause() to pause execution
cy.pause();
cy.get('[data-cy="button"]').click();

// View command log in Cypress UI
```

### Common Issues

**Issue:** "Cannot find module '@/features/...'"
**Solution:** Check `vite.config.ts` has correct path aliases

**Issue:** "act() warning in tests"
**Solution:** Wrap state updates in `await waitFor()`

**Issue:** "Test timeout"
**Solution:** Increase timeout or check for infinite loops

**Issue:** "Cypress can't find element"
**Solution:** Add `cy.wait()` or use `cy.get(..., { timeout: 10000 })`

## Best Practices Summary

### General
- Write tests first (TDD) when possible
- Keep tests isolated and independent
- Use descriptive test names
- Test behavior, not implementation
- Mock external dependencies

### Component Tests
- Test user-visible behavior
- Use `screen` queries from RTL
- Prefer `getByRole` over `getByTestId`
- Test loading and error states
- Use `userEvent` for interactions

### Hook Tests
- Use `renderHook` from RTL
- Mock dependencies
- Test all hook return values
- Test side effects (mutations, cache updates)
- Use `act()` for state changes

### Service Tests
- Mock infrastructure services
- Test error handling
- Verify correct parameters
- Test data transformations
- Keep tests focused

### E2E Tests
- Use `data-cy` attributes
- Seed and clean test data
- Test full user journeys
- Verify success/error messages
- Test critical paths only

---

**Last Updated:** 2025-11-20  
**Version:** 1.0  
**Status:** Active
