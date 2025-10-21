# Multi-View Timetable: Stabilization and V2 Refactor Plan

**Status:** Proposed
**Date:** October 20, 2025
**Author:** Gemini AI (based on analysis by `lovable` and project maintainer)

## 1. Overview

This document outlines a hybrid strategy to address a critical bug in the multi-view timetabling feature while planning for a long-term architectural improvement.

The immediate problem is a persistent foreign key constraint violation (`23503`) and disappearing sessions when users drag-and-drop in "Classroom" or "Instructor" views. This is caused by a fundamental mismatch between the UI's representation of data and the database schema's expectations.

The proposed solution is a two-phase approach:

1. **Immediate Stabilization:** Implement a targeted front-end fix to correctly map UI actions to the existing database structure. This resolves the bug quickly and safely.
2. **Long-Term Architectural Refactor:** Plan and execute a proper database schema redesign to align the data model with the multi-view functionality, thereby eliminating the root cause and reducing future technical debt.

## 2. Problem Analysis: View vs. Model Mismatch

The core issue lies in the design of the `timetable_assignments` table, which was created for a "Class Group" centric view.

* **Database Model:** The `timetable_assignments` table is keyed on `(class_group_id, period_index, semester_id)`. It **requires** a `class_group_id` for every entry.
* **UI View:** In "Classroom View" or "Instructor View," the row identity is a `classroom_id` or `instructor_id`, not a `class_group_id`.
* **The Bug:** When a user drops a session onto a row in these views, the front-end code incorrectly sends the row's ID (e.g., a `classroom_id`) to the `moveClassSession` mutation, which then attempts to insert it into the `class_group_id` column. This violates the foreign key constraint, causing the database operation to fail.
* **Data Loss Symptom:** The `moveClassSession` operation was implemented as a "delete-then-insert." When the `insert` fails, the original session has already been deleted, causing it to "vanish" from the UI until the next full refetch.

Database analysis has confirmed that existing data is valid and RLS policies are not the cause. The fault lies entirely in the front-end's translation of the drag-and-drop action to a database mutation.

## 3. The Hybrid Strategy

A single, large-scale refactor to fix this bug is too slow and risky. A quick, poorly-architected patch would introduce technical debt. Therefore, we will proceed with a hybrid strategy:

1. **Stabilize First:** Implement the well-architected front-end fix proposed by the `lovable` AI. This makes the feature work correctly *now*.
2. **Refactor Strategically:** Plan and execute the database schema redesign as a separate, non-urgent task to improve the system's long-term health.

---

## 4. Phase 1: Immediate Stabilization (Short-Term Fix)

**Objective:** Patch the front-end to correctly handle multi-view drag-and-drop operations against the current schema, fix the data loss issue, and deliver a stable user experience.

### Action Items

1. **Update Drag-and-Drop Logic (`useTimetableDnd.ts`)**
    * In the `handleDropToGrid` function, introduce a `dbTargetGroupId` variable.
    * This variable will be derived conditionally:
        * If `viewMode === 'class-group'`, it will use the `targetClassGroupId` from the drop event.
        * If `viewMode` is `'classroom'` or `'instructor'`, it will correctly extract the `class_group_id` from the `classSessionToDrop` object.
    * All mutation calls (`assignClassSession`, `moveClassSession`) must use this corrected `dbTargetGroupId` for the database operation.
    * Wrap mutation calls in a `try/catch` block to handle errors gracefully and display a toast notification instead of causing an unhandled promise rejection.

2. **Make Mutations Safer (`timetableService.ts`)**
    * Modify the `moveClassSessionInTimetable` function to reverse its order of operations.
    * **New Order:** First, call `assignClassSessionToTimetable` to insert the session at the new location. Only if this succeeds, then call `removeClassSessionFromTimetable` to delete the session from the old location.
    * This "insert-then-delete" pattern prevents data loss if the move operation fails for any reason (e.g., a concurrent edit causes a conflict).

3. **Refine Conflict Checking (`checkConflicts.ts`)**
    * No changes are needed here. The logic to restrict group mismatch errors to only the `class-group` view is already correct and should be maintained.

4. **Enhance Testing (`useTimetableDnd.integration.test.tsx`)**
    * Add new integration test cases for drag-and-drop operations specifically in "Classroom View" and "Instructor View."
    * Assert that a `move` operation in these views correctly calls the underlying `moveClassSession` mutation with the session's own `class_group_id`, not the classroom or instructor ID from the row.
    * Add tests to ensure that failed mutations are caught and do not crash the application.

---

## 5. Phase 2: Long-Term Architectural Refactor (V2 Plan)

**Objective:** Redesign the database schema to align with the multi-view feature, thereby simplifying front-end logic, removing technical debt, and improving the overall architecture.

### Action Items (Phase 2)

1. **Schema Redesign:**
    * The `timetable_assignments` table should be simplified to represent the "when" and "what" of a schedule, not the "who" or "where," which are properties of the session itself.
    * **Proposed New Schema:**

        ```sql
        CREATE TABLE timetable_assignments (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          class_session_id uuid NOT NULL REFERENCES public.class_sessions(id) ON DELETE CASCADE,
          period_index integer NOT NULL,
          semester_id uuid NOT NULL REFERENCES public.semesters(id),
          UNIQUE (class_session_id, period_index, semester_id)
        );
        ```

    * **Justification:** With this structure, `class_group_id`, `classroom_id`, and `instructor_id` are all accessible via a `JOIN` on `class_sessions`. This is a more normalized and flexible design. It keeps the concepts of a "session" (the components) and an "assignment" (the time slot) cleanly separated.

2. **Data Migration Strategy:**
    * Develop a robust SQL migration script to transfer all existing records from the old `timetable_assignments` table to the new structure. This script must be thoroughly tested to prevent any data loss during the transition.

3. **Code Refactoring:**
    * Once the new schema is in place, the front-end "translation layer" implemented in Phase 1 can be removed.
    * The `useTimetableDnd` and `useTimetable` hooks will be simplified, as the logic for handling different resource IDs will no longer be necessary.
    * Backend services (`timetableService.ts`) will be updated to query against the new, simpler table structure.

4. **Documentation:**
    * This plan will be updated to reflect the completion of Phase 1.
    * A new, more detailed document will be created specifically for the V2 refactor, including the final schema, migration scripts, and a checklist of all code files to be refactored.

## 6. Next Steps

1. Create a new branch (`fix/multi-view-dnd`).
2. Implement all action items listed under **Phase 1: Immediate Stabilization**.
3. Create a new backlog item to track the work for **Phase 2: Long-Term Architectural Refactor**.
4.  
