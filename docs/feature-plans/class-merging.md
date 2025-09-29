# Implementation Index for Class Merging Feature

## **Phase 1: Update Core Logic to Permit Merging**

The goal of this phase is to teach the application's brain that sessions sharing a course, instructor, and classroom are allowed to exist at the same time.

* **Task 1.1: Modify Conflict Detection for Instructors**
  * **File:** `src/features/timetabling/utils/checkConflicts.ts`
  * **Function to Edit:** `findInstructorConflictInPeriod` (or its parent `checkInstructorConflicts`).
  * **Action:** Inside the `if` condition that checks for a matching instructor ID (`conflictingSession.instructor.id === sessionToCheck.instructor.id`), add a nested check. If the `course.id` of both sessions is **also the same**, it is a valid merge, and you should `return null` or `continue` the loop. A conflict should only be returned if the courses are *different*.

* **Task 1.2: Modify Conflict Detection for Classrooms**
  * **File:** `src/features/timetabling/utils/checkConflicts.ts`
  * **Function to Edit:** `findClassroomConflictInPeriod` (or its parent `checkClassroomConflicts`).
  * **Action:** Apply the exact same logic as in Task 1.1. If a matching classroom is found, check if the `course.id` is also the same. If so, it is not a conflict.

* **Task 1.3: Update Unit Tests for Conflict Logic**
  * **File:** `src/features/timetabling/utils/tests/checkConflicts.test.ts`
  * **Action:**
        1. Add a new test case: "should NOT return a conflict for sessions with the same course, instructor, and classroom but different groups."
        2. Add a new test case: "should STILL return a conflict for sessions with the same instructor but different courses."
        3. Ensure all existing tests still pass.

## **Phase 2: Restructure Frontend Data for Merged Display**

The goal here is to transform the raw list of assignments into a grid data structure that explicitly groups merged sessions together.

* **Task 2.1: Update Timetable Grid Data Type**
  * **File:** `src/features/timetabling/utils/timetableLogic.ts`
  * **Action:** Change the type definition of `TimetableGrid` to hold an array of sessions per cell.
    * **From:** `Map<string, (ClassSession | null)[]>`
    * **To:** `Map<string, (ClassSession[] | null)[]>`

* **Task 2.2: Rearchitect the `buildTimetableGrid` Function**
  * **File:** `src/features/timetabling/utils/timetableLogic.ts`
  * **Action:** Refactor the function's implementation to perform a multi-pass process:
        1. Create an intermediate map that groups all assignments by their `period_index`.
        2. Iterate through this intermediate map to identify sets of assignments that are "mergeable" (same course, instructor, classroom).
        3. Build the final `TimetableGrid`. For each period, place either `null`, a single-session array `[session]`, or a merged-session array `[sessionA, sessionB, ...]` into the grid cells for all relevant groups. For a merged session, ensure the **exact same array instance** is placed in the row of every participating group.

* **Task 2.3: Update Unit Tests for Grid Logic**
  * **File:** `src/features/timetabling/utils/tests/timetableLogic.test.ts`
  * **Action:**
        1. Add a new test suite for `buildTimetableGrid`.
        2. Write a test that provides mergeable assignments and asserts that the resulting grid contains a cell with an array of multiple `ClassSession` objects.
        3. Assert that the rows for all groups involved in the merge contain the identical session array at that period index.

## **Phase 3: Adapt UI Components to Render the New Data Structure**

Finally, update the React components to visually represent the merged data.

* **Task 3.1: Refactor `SessionCell` to Handle Merged Sessions**
  * **File:** `src/features/timetabling/pages/components/timetable/SessionCell.tsx`
  * **Action:**
        1. Change the component's props to accept `sessions: ClassSession[]` instead of `session: ClassSession`.
        2. Update the rendering logic to display the "pie chart" or multi-color block effect based on the contents of the `sessions` array.
        3. Modify the tooltip to display the names of all class groups involved in the merge.
        4. Adjust the `draggable` attribute logic: the cell should be draggable if the current user owns at least one of the sessions in the array.

* **Task 3.2: Implement Duplication Avoidance in `TimetableRow`**
  * **File:** `src/features/timetabling/pages/components/timetable/TimetableRow.tsx`
  * **Action:** Modify the loop that renders the cells for the row.
        1. When you encounter a cell that contains a merged session array (`sessionsInCell`), check if the current row's `group.id` matches the `group.id` of the **first session** in that array (`sessionsInCell[0]`).
        2. If it matches, render the `<SessionCell />` as normal (it will have the correct `colSpan`).
        3. If it does **not** match, it means another row is responsible for rendering this merged block, so you should render **nothing** for this cell and all subsequent cells covered by its `colSpan`.
        4. Ensure your loop correctly skips the periods that are covered by another row's `colSpan` to avoid rendering extra `EmptyCell` components.
