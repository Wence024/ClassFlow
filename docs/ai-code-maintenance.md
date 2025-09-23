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

## **Step 3: Iterative Testing Pass**

Process the following list of test files sequentially. For each file in the list, you must complete the entire sub-workflow before moving to the next.

**List of Target Test Files:**
List of test files:

### Recommended Testing Plan

#### New Test File Required (1)

1. **File:** `src/components/ui/custom/tests/color-picker.test.tsx`
    * **Purpose:** To verify the functionality of the new, refactored `ColorPicker` component.
    * **Status:** **Needs Creation.**
    * **Key Tests:**
        * `should open the popover when the trigger button is clicked`.
        * `should call onChange and close when a preset color is selected`.
        * `should call onChange when the custom color input is used`.
        * `should call onChange with a random color when the random button is clicked`.

#### Existing Test Files to Update (Crucial)

The migration has changed the underlying DOM structure of your application. Your existing integration tests are almost certainly failing and must be updated. This is where the bulk of the testing effort should be focused.

1. **`src/features/classSessionComponents/pages/tests/CourseTab.integration.test.tsx`**
    * **Reason:** The form and item cards are now built with Shadcn's `Button`, `Card`, `Input`, etc. Queries for elements and assertions about their state will need to be updated. For example, `getByRole('button', { name: /Edit/i })` will now find a Shadcn button.

2. **`src/features/timetabling/pages/tests/TimetablePage.integration.test.tsx`**
    * **Reason:** This is a high-priority update. The drawer, session cells, and any interactive elements have been changed. You also need to add mocking for the new `toast()` function to confirm that conflict notifications are being triggered.

3. **`src/features/timetabling/pages/components/timetable/tests/SessionCell.integration.test.tsx`**
    * **Reason:** The internal structure of the `SessionCell` has changed. Tests verifying styling for "owned" vs. "non-owned" sessions and `draggable` attributes need to be validated against the new DOM and class structure.

4. **`src/features/scheduleConfig/pages/tests/ScheduleConfigPage.integration.test.tsx`**
    * **Reason:** The form fields are no longer custom `FormField` components but are now Shadcn `Input` and `Label` components. Tests that check if fields are `disabled` for non-admins must be updated to work with the new structure.

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
