# Testing Strategy and Implementation

This document outlines the testing strategy, tools, and current implementation status for ensuring the quality and correctness of the ClassFlow application.

## Current Status

✅ **175 tests passing** across unit, integration, and component testing (includes new authentication/invite flow and program/department management)
✅ **Comprehensive coverage** of critical user flows and business logic
✅ **Automated testing** integrated into development workflow

## 1. Guiding Philosophy

- **Confidence, Not Just Coverage:** Prioritize tests that cover critical user flows and complex business logic over simply chasing a high coverage percentage.
- **The Testing Pyramid:** Adhere to a model with a large base of fast unit tests, a healthy number of integration tests, and a small, targeted suite of E2E tests.
- **Fast Feedback:** Tests must be fast and easy to run as a core part of the development workflow.
- **Isolate and Mock Dependencies:** Isolate the unit under test by mocking its external dependencies (e.g., Supabase services).

## 2. Tooling

- **Test Runner & Assertion:** [**Vitest**](https://vitest.dev/)
- **Component Testing:** [**React Testing Library**](https://testing-library.com/docs/react-testing-library/intro/)
- **Mocking API Services:** [**Vitest's built-in mocking**](https://vitest.dev/guide/mocking.html) (`vi.mock`)

## 3. Test Coverage by Feature (The Plan)

### **Authentication (`/src/features/auth`) - ✅ COMPLETED**

- **Type:** Integration Tests
- **Status:** ✅ Implemented and passing
- **Coverage:**
  - **`authService`:** Tests user authentication, role fetching, and secure token handling
  - **`AuthProvider`:** Tests context initialization and error handling
  - **`PrivateRoute` Component:** Tests route protection and user redirection
  - **`UserProfilePage`:** Tests profile management and updates

### **Class Session Components (`/src/features/classSessionComponents`)**

- **Type:** Integration Tests
- **Action (Pattern repeats for all components):**
  - **`useCourses` Hook:** Mock the `coursesService`. Test that the hook correctly fetches and returns data. Test that calling `addCourse` triggers the corresponding service function.
  - **`CourseTab.tsx` Page:** Mock the `useCourses` hook. Test that the component renders a list of courses from the mock hook data.

### **Class Sessions (`/src/features/classSessions`)**

- **Type:** Integration Tests
- **Action:**
  - **`useClassSessions` Hook:** Mock the `classSessionsService`. Test that new sessions are automatically tagged with the creator's `program_id`.
  - **`ClassSessionsPage.tsx` Page:** Mock all necessary hooks. Verify that the form is populated with the correct dropdown options.

### **Timetabling Logic (`/src/features/timetabling/utils`)**

- **Type:** Unit Tests (Highest Priority)
- **Action:**
  - **`checkConflicts.ts`:**
    - Write tests for **every** conflict scenario: instructor, classroom, group, and boundary.
    - Crucially, write tests that prove **cross-program conflict detection** works (e.g., two programs booking the same shared resource).
  - **`timetableLogic.ts`:** Test `buildTimetableGrid` to ensure it correctly transforms a flat array of assignments into the `Map` structure.
  - **`timeLogic.ts`:** Test `generateTimetableHeaders` to ensure it produces the correct number of day and time headers.

### **Timetabling (Hooks & UI)**

- **Type:** Integration Tests
- **Action:**
  - **`useTimetable` Hook:** Mock all dependencies. Test that it fetches data based on `semester_id`. Test that mutations like `assignClassSession` include the `semester_id`.
  - **`TimetablePage.tsx`:** Mock `useTimetable` and `useTimetableDnd`. Test that the page correctly renders owned vs. non-owned groups in the right order and that the `Drawer` is populated correctly.
  - **`SessionCell.tsx`:** Test that non-owned sessions are rendered with a "washed out" style and that their `draggable` attribute is set to `false`.

## 4. How to Run Tests

Execute the entire test suite with:

```bash
npm run test
```
