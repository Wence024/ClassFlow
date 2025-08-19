# Testing Strategy

This document outlines the testing philosophy, tools, and roadmap for the UniScheduleWeave application.

## Philosophy

- **Test Business Logic Rigorously**: The highest priority for testing is the pure business logic that governs the application's core rules (e.g., conflict detection). This logic should be decoupled from the UI and tested extensively.
- **Pragmatic Coverage**: We aim for high-impact testing rather than 100% coverage for its own sake. Critical user flows and complex logic take precedence.
- **Automate Everything**: All tests should be runnable from a single command and will be integrated into our CI/CD pipeline to ensure that no new change introduces a regression.

## Tooling

- **Unit & Integration Testing**: [**Vitest**](https://vitest.dev/) is used for its speed, simplicity, and seamless integration with Vite.
- **End-to-End (E2E) Testing** (Future): [**Playwright**](https://playwright.dev/) or [**Cypress**](https://www.cypress.io/) will be considered for automating user flow tests in a real browser.

## Types of Tests

### 1. Unit Tests

- **Purpose**: To verify that individual, isolated functions work as expected.
- **Location**: Test files live alongside the source files they are testing (e.g., `checkConflicts.test.ts`).
- **Priority**: High. These are fast, stable, and essential for verifying core business rules.
- **Examples**:
  - `utils/checkConflicts.ts`: Testing all conflict scenarios.
  - `utils/timetableLogic.ts`: Testing the grid-building logic.

### 2. Integration Tests

- **Purpose**: To verify that multiple units (e.g., a hook and a service) work together correctly.
- **Location**: Can live alongside the feature's primary hook.
- **Priority**: Medium. These are critical for ensuring the data layer is functioning correctly.
- **High-Priority Targets**:
  - The `useTimetable` hook's interaction with `timetableService`.
  - The authentication flow (`useAuth` and `authService`).
  - Form submissions and validation logic.

### 3. End-to-End (E2E) Tests

- **Purpose**: To simulate a real user's workflow from start to finish in a browser.
- **Priority**: A long-term goal. To be implemented once the application's core feature set is stable.
- **Example Flows**:
  - User registers, logs in, creates a course, creates a class session, and drags it onto the timetable.
  - User attempts to schedule a conflicting class and verifies that the UI prevents it.

## How to Run Tests

Execute all tests in the project by running:

```bash
npm run test
```

## Testing Roadmap

Our approach to testing will evolve with the application, following the phases in our [Coding Guidelines](./coding-guidelines.md):

- **MVP Phase**: Unit tests for all critical business logic in the `utils` folders are required.
- **Post-MVP (Short-Term)**: Expand coverage to include integration tests for all custom hooks that handle data mutations.
- **Post-MVP (Long-Term)**: Implement a foundational E2E test suite covering the most critical "happy path" user flows.
