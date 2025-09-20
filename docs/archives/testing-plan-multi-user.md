# **Index of Test Files for Multi-User Workflow Solidification**

## **1. Authentication & Authorization**

* [x] **File:** `src/features/auth/services/tests/authService.integration.test.ts`
  * **Purpose:** To verify that the `authService` correctly fetches `role` and `program_id` from the `profiles` table.
  * **Status:** **Needs Creation/Update.** This is a new behavior that is critical for the entire role-based system.
  * **Key Test:** `getStoredUser should return user with role and program_id from profiles table`.

* [x] **File:** `src/features/auth/components/tests/PrivateRoute.integration.test.tsx`
  * **Purpose:** To verify the new routing structure where `PrivateRoute` acts as a layout guard, and that authenticated users are correctly directed to the `AppLayout`.
  * **Status:** **Needs Creation/Update.** The component's props and behavior have fundamentally changed.
  * **Key Test:** `should render AppLayout and protected page if authenticated`.

## **2. Application Layout & Role-Based UI**

* [x] **File:** `src/components/layout/tests/Sidebar.integration.test.tsx`
  * **Purpose:** To verify that the `Sidebar` navigation is now role-aware.
  * **Status:** **Needs Creation.** This is a new UI feature.
  * **Key Test:** `should show "Settings" link for admin users` and `should NOT show "Settings" link for non-admin users`.

* [x] **File:** `src/features/scheduleConfig/pages/tests/ScheduleConfigPage.integration.test.tsx`
  * **Purpose:** To verify that the settings page correctly renders in a read-only state for non-admins and an editable state for admins.
  * **Status:** **Needs Creation.** This is a new UI behavior.
  * **Key Test:** `should display fields as disabled for non-admin users` and `should display fields as enabled for admin users`.

## **3. Core Timetabling Logic & Data Flow**

* [x] **File:** `src/features/timetabling/hooks/tests/useTimetable.integration.test.ts`
  * **Purpose:** To verify that the `useTimetable` hook now fetches data based on the active `semester_id` (not `user_id`) and correctly fetches all `classGroups`. It should also be tested to ensure it passes the `semester_id` during mutations.
  * **Status:** **Needs Creation/Update.** The data fetching logic has been completely refactored.
  * **Key Test:** `should call timetableService.getTimetableAssignments with the active semester ID` and `should pass semester_id to assignClassSessionToTimetable`.

* [x] **File:** `src/features/classSessions/hooks/tests/useClassSessions.integration.test.ts`
  * **Purpose:** To verify that the `useClassSessions` hook correctly associates a new class session with the creator's `program_id`.
  * **Status:** **Needs Creation/Update.** This is a new business rule.
  * **Key Test:** `should add class session with current user's program_id`.

## **4. Timetable UI & User Experience**

* [ ] **File:** `src/features/timetabling/pages/tests/TimetablePage.integration.test.tsx`
  * **Purpose:** This is the main UI integration test. It needs to verify the complete shared view, including group prioritization, the "Available Classes" drawer, and rendering of invalid data.
  * **Status:** **Needs Creation.** This validates the primary user-facing feature.
  * **Key Tests:**
    * `should render the user's own groups first, followed by a separator and other groups`.
    * `should display unassigned class sessions from all programs in the drawer`.
    * `should render a fallback UI for sessions with invalid/orphaned data`.

* [ ] **File:** `src/features/timetabling/pages/components/timetable/tests/SessionCell.integration.test.tsx`
  * **Purpose:** To verify the conditional styling and drag-and-drop restrictions at the individual cell level.
  * **Status:** **Needs Significant Update.** You will add tests for the new ownership logic.
  * **Key Tests:**
    * `should render non-owned sessions with "washed out" styling`.
    * `should have draggable=false for non-owned sessions`.
    * `should have draggable=true for owned sessions`.

* [ ] **File:** `src/features/timetabling/utils/tests/checkConflicts.test.ts`
  * **Purpose:** To ensure the core conflict detection logic is sound in a multi-program context.
  * **Status:** **Update/Enhance.** You've already started this, but ensure it has tests that explicitly place conflicting sessions under *different* program groups to prove cross-program conflict detection is working.
  * **Key Test:** `should detect an instructor conflict with a session from a different program/group`.
