# **Engineered Prompt for AI Agent**

**Objective:** You are a senior software engineer AI agent. Your task is to perform a comprehensive code quality and testing pass on the `lovable` branch of the ClassFlow project. The goal is to ensure the branch is stable, free of errors, and ready for a final review before being merged into the main branch.

**Workflow:** You will execute the following process in a strict, sequential order:

1. **Linting Pass:** Lint the entire project and fix all issues. Commit the changes.
2. **Type Checking Pass:** Type-check the entire project and fix all errors. Commit the changes.
3. **Iterative Testing Pass:** Process a specific list of test files one by one. For each file, ensure it exists, passes its tests, and then commit the changes.
4. **Final Verification Pass:** Run all checks and tests one last time to ensure full project stability.

---

## **Step 1: Full Project Linting Pass**

1. Execute the linting command: `npm run lint -- --fix`.
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

Create the necessary integration tests to ensure the Program Management feature is fully validated.
Task 1: Create the Hook Integration Test
Create a new test file at src/features/programs/hooks/tests/usePrograms.integration.test.tsx.
Write tests to verify the hook's mutations:
should allow creating a new program.
should allow updating an existing program.
should handle program deletion correctly.
Use src/features/departments/hooks/tests/useDepartments.integration.test.tsx as a template for these tests.
Task 2: Create the Page Integration Test
Create a new test file at src/features/programs/pages/tests/ProgramManagementPage.integration.test.tsx.
Write tests to verify the UI and user interactions:
should deny access to non-admin users.
should display a list of programs for admin users.
should call the create mutation when the create form is submitted.
should populate the form for editing and call the update mutation on save.

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

### **Phase 1: High-Priority Integration Tests - ✅ IN PROGRESS**

Created three critical integration test files:

1. **✅ `src/features/departments/hooks/tests/useDepartments.integration.test.tsx`** - Tests department CRUD operations for Admins.
2. **✅ `src/features/departments/pages/tests/DepartmentHeadDashboard.integration.test.tsx`** - Tests role-based access and department-scoped instructor display.
3. **✅ `src/features/classSessionComponents/pages/tests/ProgramHeadInstructors.integration.test.tsx`** - Tests Program Head's ability to browse instructors by department.

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

### **Next Steps:**

The codebase has progressed into implementing the foundational UI for the new role-based system. The immediate priority is to stabilize these core features.

1. **Create the new high-priority integration tests** listed above to ensure the `DepartmentHeadDashboard` and `ProgramHeadInstructors` pages are working as expected.
2. **Fix any remaining test failures** (currently 10 failing) to get the entire suite to pass.
3. **Pause all development** on the `resourceRequests` feature and its related tests, pending stakeholder feedback as outlined in the updated planning document.
