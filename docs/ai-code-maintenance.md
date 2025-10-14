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

You will now focus on a single test file to validate all new functionality on the Classrooms tab.

**Target Test File**: `src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx`

**Sub-Workflow**:

1. Announce that you are processing the target test file.
2. Check if the file exists. If it does not, create it with the necessary boilerplate.
3. **Update and add the following test cases** to ensure complete coverage of the new features:

    * **Test Case 1: Admin - Form UI**
        * **Description**: `should show "Preferred Department" dropdown for admin users`.
        * **Action**: Render the component as an `admin`, simulate an "Edit" click, and assert that the "Preferred Department (Optional)" dropdown is visible and enabled.

    * **Test Case 2: Admin - Functionality**
        * **Description**: `should allow admins to set and clear the preferred department`.
        * **Action (Part A - Set)**: Mock the `useDepartments` hook. As an `admin`, simulate editing a classroom, selecting a department from the dropdown, and saving. Assert that the `updateClassroom` mutation is called with the correct `preferred_department_id`.
        * **Action (Part B - Clear)**: Simulate editing the same classroom again, selecting the `"-- None --"` option, and saving. Assert that the `updateClassroom` mutation is called with `preferred_department_id: null`.

    * **Test Case 3: Non-Admin - View Prioritization**
        * **Description**: `should render a prioritized list for users with a department ID`.
        * **Action**: Render the component as a `program_head` or `department_head` associated with "Department A". Mock the `useClassrooms` hook to return a mix of classrooms (some preferred for "Department A", some for "Department B", some with `null`). Assert that the "Department A" classrooms appear first, followed by a separator element, followed by the rest.

    * **Test Case 4: Non-Admin - Permissions**
        * **Description**: `should hide Edit/Delete buttons and disable the form for non-admin roles`.
        * **Action**: Render the component as a `program_head`. Assert that the "Edit" and "Delete" buttons are **not present** in the DOM for any `ClassroomCard`. Assert that the main form's `<fieldset>` is disabled.

4. Execute the test for **only this file**: `npx vitest run src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx`.
5. Analyze the test output. If any tests fail, modify the source code or the test file itself until all tests for this file pass.
6. Once all tests pass, create a dedicated Git commit for all changes made.
    * **Commit Message**: `test(classrooms): :white_check_mark: add department assignment and permission tests`

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
