# Testing Strategy and Plan

This document outlines the testing strategy, tools, and a detailed plan for ensuring the quality and correctness of the UniScheduleWeave application.

## 1. Guiding Philosophy

Our testing strategy is guided by the following principles:

* **Confidence, Not Just Coverage:** The primary goal of testing is to increase our confidence that the application works as expected. We will prioritize tests that cover critical user flows and complex business logic over simply chasing a high coverage percentage.
* **The Testing Pyramid:** We will adhere to the testing pyramid model, focusing on a large base of fast, reliable unit tests, a healthy number of integration tests, and a small, targeted suite of end-to-end tests.
* **Fast Feedback:** Tests must be fast and easy to run. They will be a core part of the development workflow and will be integrated into our CI/CD pipeline to catch regressions before they reach production.
* **Isolate and Mock Dependencies:** When testing a unit (like a component or a hook), we will mock its external dependencies (like Supabase services) to ensure the test is isolated, fast, and deterministic.

## 2. Tooling

* **Test Runner & Assertion:** [**Vitest**](https://vitest.dev/) is our primary tool for its speed and seamless integration with the Vite ecosystem.
* **Component Testing:** [**React Testing Library**](https://testing-library.com/docs/react-testing-library/intro/) will be used to test React components by interacting with them as a user would.
* **Mocking API Services:** We will use Vitest's built-in mocking capabilities (`vi.mock`) to mock our service layer (`/services`). For more complex scenarios, [**Mock Service Worker (MSW)**](https://mswjs.io/) could be introduced to intercept network requests at the network level.
* **End-to-End (E2E) Testing (Future):** [**Playwright**](https://playwright.dev/) is the recommended tool for future E2E testing due to its speed and modern feature set.

## 3. The Testing Pyramid

Our test suite will be structured as follows:

* **Unit Tests (Base):**
  * **Focus:** Individual functions, especially pure business logic.
  * **Location:** `src/features/**/utils/*.test.ts`
  * **Goal:** Verify that our core algorithms (like conflict detection) are mathematically correct. These are the fastest and most numerous tests.

* **Integration Tests (Middle):**
  * **Focus:** Multiple units working together. This is the "sweet spot" for our application.
  * **Location:** `src/features/**/hooks/*.test.ts` or `src/features/**/pages/*.test.ts`
  * **Goal:** Verify that our custom hooks correctly manage state and interact with mocked services, and that our pages render correctly based on the state from those hooks.

* **End-to-End Tests (Top):**
  * **Focus:** Full user workflows in a real browser environment.
  * **Location:** A dedicated top-level `/tests` directory.
  * **Goal:** Verify that critical user journeys (e.g., login -> create a course -> schedule it) are fully functional. These are the slowest and most brittle tests, and will be used sparingly.

---

## 4. Test Coverage by Feature (The Plan)

Here is a detailed breakdown of what should be tested in each part of the codebase.

### **Foundational UI (`/src/components/ui`)**

* **Type:** Unit/Component Tests
* **Action:**
  * Test that `ActionButton` correctly renders children and handles `disabled` and `loading` states.
  * Test that `FormField` renders the correct input type and displays error messages when an `error` prop is passed.
  * Test that `ConfirmationModal` is not visible when `isOpen` is `false` and that clicking "Confirm" calls the `onConfirm` callback.
  * Consider using **Storybook** for visual testing and documenting the different states of these components.

### **Authentication (`/src/features/auth`)**

* **Type:** Integration Tests
* **Action:**
  * **`useAuth` Hook:** Test the hook's behavior by wrapping it in a test component. Mock the `authService` to simulate successful and failed login/register attempts and verify that the hook's state (`user`, `error`, `loading`) updates correctly.
  * **`PrivateRoute` Component:** Test that it renders its `children` when a user is authenticated in the mock `AuthContext`.
  * Test that it redirects to `/login` when a user is not authenticated.

### **Class Session Components (`/src/features/classSessionComponents`)**

* **Type:** Integration Tests (for hooks and pages)
* **Action (Pattern repeats for Courses, Classrooms, Instructors, ClassGroups):**
  * **`useCourses` Hook:** Mock the `coursesService`. Test that the hook correctly fetches and returns data. Test that calling `addCourse` triggers the corresponding service function.
  * **`CourseTab.tsx` Page:** Mock the `useCourses` hook. Test that the component renders a list of courses from the mock hook data. Simulate a "delete" button click and verify that the confirmation modal appears.

### **Class Sessions (`/src/features/classSessions`)**

* **Type:** Integration Tests
* **Action:**
  * **`useClassSessions` Hook:** Mock the `classSessionsService`. Test that the hook correctly fetches and returns the hydrated session data.
  * **`ClassSessionsPage.tsx` Page:** Mock `useClassSessions` and all the component hooks (`useCourses`, etc.). Verify that the form is populated with the correct dropdown options and that the list renders correctly.

### **Timetabling Logic (`/src/features/timetabling/utils`)**

* **Type:** Unit Tests (Highest Priority)
* **Action:**
  * **`checkConflicts.ts`:** This is the most critical unit to test.
    * Write tests for **every** conflict scenario: instructor, classroom, group, day boundary, and timetable boundary.
    * Write tests to ensure it correctly identifies a valid placement.
    * Write tests to verify that the `source` parameter correctly ignores the source cell during a "move" operation.
  * **`timetableLogic.ts`:** Test `buildTimetableGrid` to ensure it correctly transforms a flat array of assignments into the `Map` structure. Test edge cases like empty assignments or empty groups.
  * **`timeLogic.ts`:** Test `generateTimetableHeaders` to ensure it produces the correct number of day and time headers based on a mock `ScheduleConfig`.

### **Timetabling (Hooks & UI)**

* **Type:** Integration Tests
* **Action:**
  * **`useTimetable` Hook:** This is a complex hook to test. Mock all its dependencies (`useAuth`, `useClassGroups`, `useScheduleConfig`, `timetableService`). Test that it calls `buildTimetableGrid` with the correct data. Test that `assignClassSession` first calls `checkConflicts` and then (if no conflict) calls the service.
  * **`TimetablePage.tsx`:** Mock `useTimetable` and `useTimetableDnd`. Test that the `Timetable` component receives the correct props. Test that the page correctly calculates the `unassignedClassSessions` for the `Drawer`.

## 5. Implementation Roadmap

This plan should be implemented in phases, aligned with your project's roadmap.

1. **Phase 1 (Immediate Sprint): Complete Core Logic Unit Tests**
    * Achieve high test coverage for all functions in `/src/features/timetabling/utils/`. This provides the biggest confidence boost for the lowest effort.

2. **Phase 2 (Next Sprint): Write Key Integration Tests**
    * Write integration tests for the `useAuth` hook and `PrivateRoute` component.
    * Write integration tests for one of the component management hooks (e.g., `useCourses`) and its corresponding UI (`CourseTab.tsx`). This will establish a pattern that can be replicated for the others.

3. **Phase 3 (Mid-Term): Expand Integration Coverage**
    * Write integration tests for the `useTimetable` and `useClassSessions` hooks.
    * Write integration tests for the main pages (`TimetablePage.tsx`, `ClassSessionsPage.tsx`) to ensure they correctly orchestrate their child components and hooks.

4. **Phase 4 (Long-Term): Introduce E2E Tests**
    * Once the UI and core features are stable, write a small number of E2E tests for the absolute "happy path" critical flows, such as user registration and scheduling a single class.

## 6. How to Run Tests

Execute the entire test suite with:

```bash
npm run test
```
