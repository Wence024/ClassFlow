# Role-Based & Collaborative Resource Management

## **Problem Analysis**

The current system has a fundamental data model issue where program heads create their own instructors and classrooms, which bypasses the class merging feature. This creates several problems:

1. **Resource Duplication**: Multiple program heads create the same instructor/classroom.
2. **Bypassed Merging**: Class merging doesn't work because resources are program-specific.
3. **No Centralized Management**: No single source of truth for institutional resources.
4. **No Cross-Program Coordination**: Programs can't share resources effectively.

## **Proposed Solution: Foundational Structure**

### **New Role Hierarchy**

1. **Admin**: Full system access, manages all departments, classrooms, and can act as a department head for any department.
2. **Department Head**: Manages the pool of instructors for their specific department.
3. **Program Head**: Manages class assignments within their program by consuming available resources.

### **New Data Model**

The database schema has been updated to support this structure by creating a `departments` table and linking `profiles`, `instructors`, and `classrooms` to it.

> ### **Revised Workflow & Areas for Stakeholder Consultation**
>
> Initial implementation included a formal "request/approval" system for cross-departmental resource sharing. However, recent stakeholder feedback indicates a more collaborative, peer-to-peer workflow may be in use, especially for general subjects managed by deans (Department Heads).
>
> **Development on the formal `resource_requests` feature is now ON HOLD.**
>
> The immediate next step is to consult with the deans/department heads to clarify the exact workflow. Key questions to ask include:
>
> * **Clarifying Roles:** "Can you describe the process for scheduling a 'major-specific' course versus a 'general education' course? Who is responsible for each?"
> * **Understanding Coordination:** "When you need an instructor from another department, is the process about requesting a *specific person*, or is it about discovering *who is available* at a certain time?"
> * **Defining the Ideal System Interaction:** "Would you prefer a formal request/approve system inside the app? Or would it be more useful to see a view-only version of other departments' instructor schedules to find open slots and then coordinate with the other dean directly?"
> * **Final Assignment Step:** "What does it mean when a schedule is 'submitted to the instructor'? Is this a notification, or does the instructor have an approval step?"

## **Implementation Phases (Updated Status)**

### **Phase 0: Stabilization - ✅ COMPLETED**

* [x] Fixed all test failures from class merging implementation.
* [x] Updated all test mocks for new data structure.
* [x] Ensured all existing functionality works with merged sessions.

### **Phase 1: Database Schema & Core Roles - ✅ COMPLETED**

* [x] Created `departments` table and updated `profiles`, `instructors`, and `classrooms` to use department ownership.
* [x] Created migration scripts (`251001_phase1_department_resource_mgmt.sql`).
* [x] Updated user role enum to include `department_head`.

### **Phase 2: Backend Services & Foundational UI - 🟢 IN PROGRESS**

* [x] **Update Instructor/Classroom Services**: `instructorsService.ts` and `classroomsService.ts` are refactored to work with department-based ownership and permissions.
* [x] **Create Department Management UI**: A page for Admins to CRUD departments (`DepartmentManagementPage.tsx`).
* [x] **Create Department Head Dashboard**: A view for Department Heads to manage instructors within their department (`DepartmentHeadDashboard.tsx`).
* [x] **Create Program Head Browser**: A view for Program Heads to browse instructors by department (`ProgramHeadInstructors.tsx`).

### **Phase 3: Resource Request System - ⏸️ ON HOLD**

* [ ] **Create Resource Request Services**: `resourceRequestService.ts` and `notificationsService.ts`.
* [ ] **Build Request UI**: Interface for Program Heads to submit requests.
* [ ] **Build Approval UI**: Notification dropdown and interface for Department Heads to approve/reject.
* **Status:** This entire phase is paused pending the stakeholder consultation mentioned above.

### **Phase 4: Testing and Migration - 🟢 IN PROGRESS**

* [ ] **Data Migration**: Create script to assign existing resources and users to departments.
* [x] **Update Core Tests**: Update existing tests for the new department-based data model.
* [ ] **Add Tests for New UIs**: Add integration tests for `DepartmentHeadDashboard` and `ProgramHeadInstructors`.
* [ ] **Integration Testing**: Test permission boundaries for all roles.
