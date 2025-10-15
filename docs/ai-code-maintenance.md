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

### **Next Steps:**

The codebase has progressed with comprehensive user management and authentication integration tests. All core features are now covered with integration tests. The program-department relationship feature has been successfully implemented and tested.

1. **✅ Created all high-priority integration tests** for Department Head Dashboard, Program Head Instructors, and Class Session Components.
2. **✅ Created user management and authentication tests** to ensure secure role-based access control.
3. **✅ Updated program-department relationship tests** - Fixed test expectations to include required `department_id` field for all program operations.
4. **✅ Run the full test suite** to verify all tests pass: `npm run test`.
5. **✅ Perform final linting and type checking**: `npm run lint` and `npm run type-check`.
6. **Pause all development** on the `resourceRequests` feature and its related tests, pending stakeholder feedback as outlined in the updated planning document.

**🎉 MAINTENANCE COMPLETE** - The `feat/collapsible-sidebar` branch is now ready for final review and merge to main branch.

### **Phase 3: Final Testing and Verification - ✅ COMPLETED**

All Phase 3 tasks have been completed successfully:

1. **✅ Fixed all failing integration tests** for the `ProgramManagementPage`.
2. **✅ Performed a full linting, type-checking, and testing pass** to ensure codebase stability.
3. **✅ Updated documentation** - Updated `ai-code-maintenance.md` with current status.
