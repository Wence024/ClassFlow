# E2E Test Flow: From Setup to Scheduling

## Personas for Testing

1. **`Admin User`**: Responsible for initial system setup.
2. **`Department Head User`**: Manages instructor resources for a specific department (e.g., Computer Science).
3. **`Program Head User`**: Manages the schedule for a specific academic program (e.g., BS in Computer Science).

## Prerequisites

* A running instance of the application connected to a Supabase project.
* Three user accounts created via the registration page.
* In the Supabase `profiles` table, manually set the roles and assignments for these users:
  * **User 1**: `role` = `admin`
  * **User 2**: `role` = `department_head`, `department_id` = (will be set to the "Computer Science" department ID created in Phase 1).
  * **User 3**: `role` = `program_head`, `program_id` = (will need a "BS in Computer Science" program pre-populated in the `programs` table).

---

This flow is divided into phases, each corresponding to a major step in the overall scheduling process.

## Phase 1: System Administration (Admin Persona)

**Goal**: To set up the foundational structure of the academic year and the institution's departments.

1. **Login as Admin User.**
2. **Configure the Schedule**:
    * Navigate to the **Settings** page (`/schedule-configuration`).
    * **Action**: Verify that all form fields (Periods Per Day, Start Time, etc.) are enabled and editable.
    * **Action**: Change "Periods Per Day" to a specific value (e.g., `10`). Click "Save Settings".
    * **Expected Result**: A success notification appears. Refreshing the page should show the new value (`10`) has persisted. This confirms the `useScheduleConfig` hook and its service are working for admins.
3. **Create Departments**:
    * Navigate to the **Departments** page (`/departments`).
    * **Action**: In the "Create Department" form, enter `Name: Computer Science` and `Code: CS`. Click "Create".
    * **Action**: Create a second department with `Name: Mathematics` and `Code: MATH`.
    * **Expected Result**: Both "Computer Science" and "Mathematics" appear in the list of departments on the page, confirming the `useDepartments` hook and service.
4. **Create Shared Classrooms**:
    * Navigate to **Manage Class Components** -> **Classrooms** tab (`/component-management`).
    * **Action**: Verify that the creation form is enabled.
    * **Action**: Create a new classroom called `Main Auditorium` with a capacity of `150`.
    * **Expected Result**: The "Main Auditorium" card appears in the list. This confirms an Admin can create shared resources.

## Phase 2: Resource Management (Department Head Persona)

**Goal**: To populate the system with instructors managed at the department level.

1. **Login as Department Head User** (assigned to the "Computer Science" department).
2. **Manage Instructors**:
    * Navigate to the **Department Dashboard** (`/dept-head`).
    * **Action**: Verify that the "Create Instructor" form is enabled. The page title should indicate you are managing instructors for your department.
    * **Action**: Create a new instructor: `First Name: Alan`, `Last Name: Turing`. Fill in any other desired details.
    * **Expected Result**: A success notification appears, and "Alan Turing" is added to the list of instructors on this page. This confirms that Department Heads can manage their own instructor pool as intended by the `AdminInstructorManagement.tsx` component.

## Phase 3: Program-Specific Setup (Program Head Persona)

**Goal**: To define the specific courses and student groups for a single academic program.

1. **Login as Program Head User** (assigned to the "BS in Computer Science" program).
2. **Manage Courses**:
    * Navigate to **Manage Class Components** -> **Courses** tab.
    * **Action**: Create a new course: `Name: Introduction to Programming`, `Code: CS101`.
    * **Expected Result**: The "Introduction to Programming" course card appears in the list.
3. **Manage Class Groups**:
    * Navigate to **Manage Class Components** -> **Class Groups** tab.
    * **Action**: Create a new class group: `Name: Section A`, `Number of Students: 25`.
    * **Expected Result**: The "Section A" class group card appears in the list.
4. **Create a Schedulable Class Session**:
    * Navigate to the **Manage Classes** page (`/class-sessions`).
    * **Action**: In the "Create New Class Session" form, select the following:
        * **Course**: "Introduction to Programming (CS101)"
        * **Instructor**: "Alan Turing" (created by the Department Head)
        * **Class Group**: "Section A"
        * **Classroom**: "Main Auditorium" (created by the Admin)
        * **Duration**: `2` periods.
    * **Expected Result**: A new class session card for "Introduction to Programming - Section A" appears in the list on the right. This is a critical integration test, proving that a Program Head can successfully consume resources created by other roles.

## Phase 4: Core Timetabling Workflow (Program Head Persona)

**Goal**: To visually schedule the created class session and test the core timetabling features.

1. **Navigate to the Timetable**:
    * Go to the **Timetable** page (`/scheduler`).
    * **Expected Result**: The timetable grid loads. The "Section A" row is visible and appears under "My Groups". The "Available Classes" drawer at the bottom contains a draggable pill for "Introduction to Programming - Section A".
2. **Schedule the Class**:
    * **Action**: Drag the "Introduction to Programming" pill from the drawer and drop it onto an empty slot in the "Section A" row.
    * **Expected Result**: The session appears on the grid, spanning two periods. The pill is removed from the "Available Classes" drawer. The change persists after a page refresh.
3. **Test Conflict Detection**:
    * (Setup for this test may require another user to have placed a class in a conflicting slot).
    * **Action**: Drag the newly placed "CS101" session and hover it over a slot that is already occupied or would cause an instructor/classroom conflict.
    * **Expected Result**: The target slot should highlight in **red**, indicating a conflict. Releasing the mouse should fail the drop and show an error notification.
4. **Move the Class**:
    * **Action**: Drag the "CS101" session from its current position to another *empty* and *valid* slot within the "Section A" row.
    * **Expected Result**: The session moves to the new slot. The original slot becomes empty.
5. **Un-schedule the Class**:
    * **Action**: Drag the "CS101" session from the grid and drop it back into the "Available Classes" drawer area.
    * **Expected Result**: The session is removed from the grid, and the pill for "Introduction to Programming - Section A" reappears in the drawer.

## Phase 5: Collaborative Resource Request (Testing the "On Hold" Feature)

**Goal**: To test the existing (but paused) UI for cross-departmental resource requests.

1. **Program Head - Initiate Request**:
    * Login as the **Program Head User**.
    * Navigate to the **Request Instructor** page (`/requests/instructor`).
    * **Action**: Select the "Mathematics" department from the dropdown. The instructor list should populate. Select an instructor. Click "Submit Request".
    * **Expected Result**: The request is submitted without error.
2. **Department Head - Verify Notification**:
    * Login as the **Department Head User** for the "Mathematics" department (this may require a separate user account).
    * **Expected Result**: A notification bell icon with a red badge should be visible in the header. Clicking the bell opens a popover showing the pending request from the Program Head, with "Approve" and "Reject" buttons. This confirms the notification flow is wired up.

---

## Final Success Criteria

If all the steps above are completed without unexpected errors, it confirms that:

* The role-based permissions are being enforced correctly across the UI.
* The core data model (Admin -> Departments, Dept Head -> Instructors) is functioning.
* The end-to-end flow of creating components, combining them into a class session, and scheduling it on the timetable is working as intended.
* Conflict detection and real-time updates are operational.
