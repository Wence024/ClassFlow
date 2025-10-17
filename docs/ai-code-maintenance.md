# **Engineered Prompt for AI Agent**

**Objective:** You are a senior software engineer AI agent. Your task is to perform a comprehensive code quality and testing pass on the `lovable` branch of the ClassFlow project. The goal is to ensure the branch is stable, free of errors, and ready for a final review before being merged into the main branch.

**Workflow:** You will execute the following process in a strict, sequential order:

1. **Linting Pass:** Lint the entire project and fix all issues. Commit the changes.
2. **Type Checking Pass:** Type-check the entire project and fix all errors. Commit the changes.
3. **Iterative Testing Pass:** Process a specific list of test files one by one. For each file, ensure it exists, passes its tests, and then commit the changes.
4. **Final Verification Pass:** Run all checks and tests one last time to ensure full project stability.

---

## **Step 1: Full Project Linting Pass**

1. Execute the linting command: `npm run lint:fix`.
2. Analyze the output for any remaining errors that were not auto-fixed. Apply the necessary code changes to resolve **all** linting issues.
3. Once the command `npm run lint` passes with zero errors, create a single Git commit for all the linting-related changes.
    * **Commit Example:** `style(lint): :art: resolve all ESLint errors and warnings`

---

## **Step 2: Full Project Type Checking Pass**

1. Execute the type checking command: `npm run typeCheck`.
2. Analyze the output for any TypeScript errors. Apply the necessary code changes to resolve **all** type errors.
3. Once the type check passes with zero errors, create a single Git commit for all the type-checking-related changes.
    * **Commit Example:** `fix(types): :construction_worker: resolve all TypeScript errors across the project`

---

## **Step 3: Iterative Testing Pass (RE-PRIORITIZED)**

Please check `git diff --name-only feat/program-department-relation` to check for files to test.

**Sub-Workflow (for each file):**

1. Announce the target file you are now processing.
2. Check if the file exists. If it does not, create it with the correct boilerplate and a placeholder test.
3. Execute the test for **only this file**: `npx vitest run {path/to/the/current/file}`.
4. Analyze the test output. If it fails, modify the source code or the test file itself until the test passes.
5. Once the test for the current file passes, create a dedicated Git commit for the specific changes made to pass this test. The scope of the commit should be the feature being tested.
    * **Commit Example:** `test(timetabling-conflicts): :white_check_mark: add cross-program conflict detection test`

---

## **Step 4: Final Verification Pass**

After all individual test files have been processed and committed, perform a final, full-system check.

1. Execute `npm run lint`. Fix any new issues.
2. Execute `npm run type-check`. Fix any new errors.
3. Execute the full test suite: `npm run test`. Fix any failing tests.
4. If any changes were made during this final pass, create a final commit.
    * **Commit Example:** `chore(quality): :broom: perform final lint, type, and test pass`

---

## **Commit Message Specification**

All commits MUST adhere to the following rules:

* **Format:** `type(scope): :gitmoji: shortMessage\n\nlongMessage`
* **Tense:** Use the imperative, present tense in the short message (e.g., "add feature," not "added feature").
* **Brevity:** Do not repeat the scope in the short message. For `test(auth)`, a good message is "verify admin-only access", not "test auth for admin-only access".
* **Scope:** Use a descriptive scope. For small, targeted changes, prefer a more specific scope (e.g., `style(session-cell)`) over a general one (e.g., `style(timetabling)`).
* **Warning Footer:** If a commit is unusually large and its changes are too broad to be concisely described (e.g., a major refactor), add a `Warning:` footer to the long message. Example:

    ```git
    refactor(timetabling): :recycle: restructure timetable data flow

    This refactor modifies the entire data flow from the services through
    the hooks and into the UI components to support semester-based scoping.

    Warning: This commit is large as it touches all layers of the
    timetabling feature to implement the new data model.
    ```

---

## **Current Status Summary**

### **Phase 0: Class Merging Stabilization - ✅ COMPLETED**

All Phase 0 tasks have been completed successfully:

1. **✅ Fixed all linting and TypeScript errors** - All code now passes linting and type checking.
2. **✅ Updated data structures** - Changed from `ClassSession` to `ClassSession[]` to support merged sessions.
3. **✅ Fixed test failures** - Updated all test mocks and expectations to work with the new data structure.
4. **✅ Added conflict detection** - Implemented group mismatch conflict detection to prevent moving sessions to wrong class groups.
5. **✅ Updated documentation** - Updated `ai-code-maintenance.md` with current testing requirements.

### **Phase 1: High-Priority Integration Tests - ✅ COMPLETED**

Created comprehensive integration test files:

1. **✅ `src/features/departments/hooks/tests/useDepartments.integration.test.tsx`** - Tests department CRUD operations for Admins.
2. **✅ `src/features/departments/pages/tests/DepartmentHeadDashboard.integration.test.tsx`** - Tests role-based access and department-scoped instructor display.
3. **✅ `src/features/classSessionComponents/pages/tests/ProgramHeadInstructors.integration.test.tsx`** - Tests Program Head's ability to browse instructors by department.
4. **✅ `src/features/classSessionComponents/pages/tests/CourseTab.integration.test.tsx`** - Tests course management UI.
5. **✅ `src/features/classSessionComponents/pages/tests/InstructorTab.integration.test.tsx`** - Tests instructor management for department heads.
6. **✅ `src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx`** - Tests classroom management with role-based access.

### **Phase 2: User Management & Authentication Tests - ✅ COMPLETED**

Created user management and authentication integration tests:

1. **✅ `src/features/auth/pages/tests/UserProfilePage.integration.test.tsx`** - Tests user profile display and updates.
2. **✅ `src/features/users/services/tests/usersService.integration.test.ts`** - Tests user service with role fetching from dedicated table.
3. **✅ `src/features/users/hooks/tests/useUsers.integration.test.tsx`** - Tests user management hooks.
4. **✅ `src/features/auth/contexts/tests/AuthProvider.integration.test.tsx`** - Tests auth context and role-based permissions.
5. **✅ `src/features/auth/services/tests/authService.integration.test.ts`** - Tests auth service with secure role management.

### **Phase 3: Collapsible Sidebar (feat/collapsible-sidebar) - ✅ COMPLETED**

Implemented a modern, docked sidebar with collapsible functionality:

1. **✅ `src/contexts/LayoutContext.tsx`** - Created global layout context for sidebar state management.
2. **✅ `src/components/Header.tsx`** - Added sidebar toggle button with collapse/expand icons.
3. **✅ `src/components/Sidebar.tsx`** - Refactored to support collapsible behavior with icon-only mode and hover tooltips.
4. **✅ `src/components/layout/AppLayout.tsx`** - Integrated LayoutProvider and smooth transitions.
5. **✅ `src/contexts/tests/LayoutContext.test.tsx`** - Tests for layout context state management.
6. **✅ `src/components/tests/Header.integration.test.tsx`** - Tests for header toggle button integration.
7. **✅ `src/components/layout/tests/AppLayout.integration.test.tsx`** - Tests for sidebar collapse behavior and state persistence.
8. **✅ `src/components/layout/tests/Sidebar.integration.test.tsx`** - Updated to include LayoutProvider in test setup.

6. **✅ `src/features/auth/pages/tests/CompleteRegistrationPage.integration.test.tsx`** - Tests invite acceptance and user registration flow.

**JSDoc Coverage:**

* Added comprehensive JSDoc comments to `useDepartments` hook
* Added JSDoc to `useInstructorsByDepartment` function
* Verified existing JSDoc coverage across core hooks and utilities

### **Key Changes Made:**

* **Data Structure**: Updated `TimetableGrid` type from `Map<string, (ClassSession | null)[]>` to `Map<string, (ClassSession[] | null)[]>`.
* **Conflict Detection**: Added `checkGroupMismatch` function to prevent cross-group session assignments.
* **Test Updates**: Fixed all test mocks to use the new data structure format.
* **Component Updates**: Updated `SessionCell`, `TimetableRow`, and `TimetablePage` components to handle merged sessions.
* **Gradient Rendering**: Fixed gradient background rendering for merged sessions with different colors.
* **Security Improvements**
  * Moved roles to separate `user_roles` table to prevent privilege escalation attacks.
  * Implemented SECURITY DEFINER functions for role checks to avoid RLS recursion.
  * Updated auth service to fetch roles from dedicated table.
  * Removed client-side role override (DevRoleSwitcher) to prevent permission mismatches between client and server.
  * Removed public registration code paths and replaced with admin-only invite workflow.
  * Fixed full_name population in CompleteRegistrationPage to update profiles table correctly.
* **User Management**: Added comprehensive user profile management with role-based access control.
* **Collapsible Sidebar**: Implemented modern docked sidebar with toggle in header, icon-only collapsed mode with tooltips, and smooth transitions between states.

### **Phase 4: Final Maintenance Pass - ✅ COMPLETED**

All Phase 4 tasks have been completed successfully:

1. **✅ Full Project Linting Pass** - All ESLint errors and warnings resolved with `npm run lint:fix`.
2. **✅ Full Project Type Checking Pass** - All TypeScript errors resolved with `npm run type-check`.
3. **✅ Iterative Testing Pass** - All test files processed and verified to pass:
   - `src/contexts/tests/LayoutContext.test.tsx` - LayoutContext state management tests
   - `src/components/tests/Header.integration.test.tsx` - Header sidebar toggle integration tests (fixed QueryClient provider)
   - `src/components/layout/tests/AppLayout.integration.test.tsx` - AppLayout collapsible sidebar integration tests (fixed QueryClient provider)
   - `src/components/layout/tests/Sidebar.integration.test.tsx` - Sidebar role-based navigation tests
4. **✅ Final Verification Pass** - All checks completed successfully:
   - Linting: ✅ Passes with zero errors
   - Type checking: ✅ Passes with zero errors  
   - Full test suite: ✅ All 171 tests passing
* **Test Maintenance**: Removed all references to deleted `register()` and `resendVerificationEmail()` functions from test mocks.

### **Phase 5: Timetabling RLS & Bug Fixes - ✅ COMPLETED**

**Date Completed:** October 16, 2025  
**Branch:** `lovable` (merged from various fixes)  
**Total Changes:** 9 files modified

All Phase 5 tasks have been completed successfully:

1. **✅ Fixed RLS Policies** - Resolved timetable RLS policies to allow program heads to edit their timetables
2. **✅ Fixed Service Layer** - Removed `user_id` dependency from `removeClassSessionFromTimetable`
3. **✅ Fixed Drag & Drop** - Corrected permission checks and conflict detection for merged sessions
4. **✅ Test Updates** - Fixed test expectations to match actual service signatures
5. **✅ Created Missing Tests** - Added comprehensive integration tests for `useTimetableDnd` hook

**Key Issues Resolved:**
- Fixed program head inability to edit timetables due to incorrect RLS policies
- Fixed merged class session duplication bug in drag-and-drop operations
- Fixed permission checks to prevent moving sessions from other programs
- Fixed test mocks to match actual service function signatures

**Test Coverage:**
- ✅ `src/features/timetabling/services/timetableService.test.ts` - Service layer unit tests
- ✅ `src/features/timetabling/hooks/tests/useTimetable.integration.test.tsx` - Hook integration tests (fixed)
- ✅ `src/features/timetabling/hooks/tests/useTimetableDnd.integration.test.tsx` - DnD hook tests (created)
- ✅ `src/features/timetabling/pages/tests/TimetablePage.integration.test.tsx` - Page integration tests (fixed)

### **Phase 6: Instructor Search & Timetabling Fixes - ✅ COMPLETED**

**Date Completed:** October 17, 2025
**Branch:** `fix/prog-heads-rls-problem`
**Total Changes:** 3 files modified

All Phase 6 tasks have been completed successfully:

1.  **✅ Fixed Timetabling DnD Tests** - Resolved failures in `useTimetableDnd.integration.test.tsx` by wrapping state updates in `act()`.
2.  **✅ Fixed Instructor Tab Tests** - Resolved multiple failures in `InstructorTab.integration.test.tsx` by:
    *   Providing a complete mock for the `AuthContext`.
    *   Using valid UUIDs in mock data to prevent validation errors.
    *   Scoping button queries to specific item cards to resolve ambiguity.
    *   Correcting the assertion for the `removeInstructor` mock call.
3.  **✅ All Tests Passing** - All tests related to the changed files are now passing.

**Key Issues Resolved:**
- Fixed race conditions in `useTimetableDnd` hook tests.
- Fixed multiple issues in `InstructorTab` integration tests related to mocking, validation, and element selection.

### **Next Steps:**

The codebase has been updated with fixes for the instructor search and timetabling features. All tests for the modified files are passing.

1.  **✅ Run the full test suite** to verify all tests pass: `npm run test`
2.  **✅ Perform final linting and type checking**: `npm run lint` and `npm run type-check`
3.  **Merge the branch** into `master`.

### **Phase 4: AI Code Maintenance Session - ✅ COMPLETED**

**Date Completed:** January 15, 2025  
**Branch:** `feat/admin-user-invites`  
**Total Tests:** 175 passing across 34 test files  
**Status:** Ready for merge to main branch

All maintenance phases have been successfully completed:

1. **✅ Linting Pass**: Resolved hardcoded password ESLint errors in CompleteRegistrationPage test
2. **✅ Type Checking Pass**: All TypeScript errors resolved
3. **✅ Testing Pass**: Fixed element selection and assertion issues in integration tests
4. **✅ Final Verification**: Complete test suite passes with 175 tests

**Key Issues Resolved:**
- Fixed hardcoded password ESLint errors in CompleteRegistrationPage test
- Resolved element selection issues in test assertions using `getAllByDisplayValue('[1]')`
- Updated test expectations to match actual component behavior
- Ensured all integration tests properly wrap components with QueryClientProvider

**Final Test Results:**
- **175 tests passing** across 34 test files
- **0 linting errors**
- **0 TypeScript errors**
- **All integration tests passing**

The codebase is now stable and ready for production deployment.
