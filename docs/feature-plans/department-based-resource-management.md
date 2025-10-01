# Department-Based Resource Management Implementation Plan

## **Problem Analysis**

The current system has a fundamental data model issue where program heads create their own instructors and classrooms, which bypasses the class merging feature. This creates several problems:

1. **Resource Duplication**: Multiple program heads create the same instructor/classroom
2. **Bypassed Merging**: Class merging doesn't work because resources are program-specific
3. **No Centralized Management**: No single source of truth for institutional resources
4. **No Cross-Program Coordination**: Programs can't share resources effectively

## **Proposed Solution: Department-Based Resource Management**

### **New Role Hierarchy**

1. **Admin**: Full system access, manages all resources
2. **Department Head**: Manages instructors and classrooms for their department
3. **Program Head**: Manages class assignments within their program (assigned to a department)

### **New Data Model**

#### **1. Departments Table**
```sql
CREATE TABLE public.departments (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NOT NULL,
    code text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT departments_pkey PRIMARY KEY (id)
);
```

#### **2. Updated User Profiles**
```sql
-- Add department_id to profiles table
ALTER TABLE public.profiles 
ADD COLUMN department_id uuid REFERENCES public.departments(id);

-- Update role enum to include department_head
ALTER TYPE user_role ADD VALUE 'department_head';
```

#### **3. Updated Instructors Table**
```sql
-- Remove user_id, add department_id
ALTER TABLE public.instructors 
DROP COLUMN user_id,
ADD COLUMN department_id uuid NOT NULL REFERENCES public.departments(id),
ADD COLUMN created_by uuid REFERENCES auth.users(id); -- Track who created it
```

#### **4. Updated Classrooms Table**
```sql
-- Remove user_id, add department_id  
ALTER TABLE public.classrooms
DROP COLUMN user_id,
ADD COLUMN department_id uuid NOT NULL REFERENCES public.departments(id),
ADD COLUMN created_by uuid REFERENCES auth.users(id); -- Track who created it
```

#### **5. Resource Requests Table**
```sql
CREATE TABLE public.resource_requests (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    requester_id uuid NOT NULL REFERENCES auth.users(id),
    resource_type text NOT NULL CHECK (resource_type IN ('instructor', 'classroom')),
    resource_id uuid NOT NULL,
    requesting_program_id uuid NOT NULL REFERENCES public.programs(id),
    target_department_id uuid NOT NULL REFERENCES public.departments(id),
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    requested_at timestamp with time zone DEFAULT now(),
    reviewed_at timestamp with time zone,
    reviewed_by uuid REFERENCES auth.users(id),
    notes text,
    CONSTRAINT resource_requests_pkey PRIMARY KEY (id)
);
```

## **Current Status & Immediate Priorities**

### **✅ Completed (Class Merging Implementation)**
- Fixed all linting and TypeScript errors
- Updated data structures to support merged sessions (`ClassSession[]` instead of `ClassSession`)
- Implemented class merging logic in conflict detection and timetable grid
- Updated TimetableGrid type to support merged sessions
- Fixed tooltip function signatures and null safety issues

### **❌ Current Issues**
- Test failures due to data structure changes from class merging
- Missing ColorPicker component causing test failures
- Integration tests need updates for new data structure
- Need to add conflict check for moving sessions to non-corresponding class groups

### **🚨 Immediate Priority: Stabilization**
Before implementing department-based resource management, we must:
1. Fix all test failures caused by class merging data structure changes
2. Update test mocks to use `ClassSession[]` instead of `ClassSession`
3. Fix TimetablePage integration tests
4. Fix SessionCell component tests
5. Create missing ColorPicker component or remove its test
6. Add conflict check for moving sessions to wrong class groups

## **Implementation Phases**

### **Phase 0: Complete Stabilization (IMMEDIATE)**
- [x] Fix test failures from class merging implementation
- [x] Update all test mocks for new data structure
- [x] Add conflict check for moving sessions to non-corresponding class groups
- [x] Ensure all existing functionality works with merged sessions
- [x] Update ai-code-maintenance.md with new testing requirements

### **Phase 1: Database Schema Migration**

#### **Task 1.1: Create Department Management**
- [x] Create `departments` table
- [x] Add `department_id` to `profiles` table
- [x] Update user role enum to include `department_head`
- [x] Create migration script

#### **Task 1.2: Update Resource Tables**
- [x] Remove `user_id` from `instructors` and `classrooms` tables
- [x] Add `department_id` to both tables
- [x] Add `created_by` field to track creation
- [x] Update foreign key constraints

#### **Task 1.3: Create Resource Request System**
- [x] Create `resource_requests` table
- [x] Create RLS policies for request management
- [x] Add indexes for performance

### **Phase 2: Backend Services Refactoring**

#### **Task 2.1: Update Instructor Services**
- [x] Modify `instructorsService.ts` to work with departments
- [x] Add department-based filtering
- [x] Implement permission checks for department heads
- [x] Update CRUD operations

#### **Task 2.2: Update Classroom Services**
- [x] Modify `classroomsService.ts` to work with departments
- [x] Add department-based filtering
- [x] Implement permission checks for department heads
- [x] Update CRUD operations

#### **Task 2.3: Create Resource Request Services**
- [x] Create `resourceRequestService.ts`
- [x] Implement request creation, approval, rejection
- [x] Add notification system for requests
- [x] Create hooks for request management

### **Phase 3: Frontend Role-Based UI**

#### **Task 3.1: Update Authentication System**
- [x] Update `AuthContext` to handle department information
- [x] Add department-based permission checks
- [x] Update user profile management

#### **Task 3.2: Create Department Management UI**
- [x] Create department management page (admin only)
- [x] Create department head dashboard
- [x] Add department selection for program heads

#### **Task 3.3: Update Resource Management UI**
- [x] Update instructor management to show department-based resources (Dept Head Dashboard)
- [ ] Update classroom management to show department-based resources
- [ ] Add resource request interface for program heads
- [ ] Add approval interface for department heads

### **Phase 4: Resource Request System**

#### **Task 4.1: Request Creation**
- [ ] Add "Request Resource" buttons to program head interfaces
- [ ] Create request form with resource selection
- [ ] Implement request submission logic

#### **Task 4.2: Request Approval**
- [ ] Create department head approval interface
- [ ] Add notification system for pending requests
- [ ] Implement approval/rejection workflow

#### **Task 4.3: Resource Assignment**
- [ ] Update class session creation to use approved resources
- [ ] Add cross-department resource indicators
- [ ] Update timetable to show resource ownership

### **Phase 5: Testing and Migration**

#### **Task 5.1: Data Migration**
- [ ] Create migration script for existing data
- [ ] Assign existing resources to appropriate departments
- [ ] Update existing user roles

#### **Task 5.2: Update Tests**
- [ ] Update all existing tests for new data model
- [ ] Add tests for resource request system
- [ ] Add tests for department-based permissions

#### **Task 5.3: Integration Testing**
- [ ] Test cross-department resource sharing
- [ ] Test class merging with shared resources
- [ ] Test permission boundaries

## **Updated AI Code Maintenance Plan**

### **New Test Files Required**

1. **`src/features/departments/`** (New Feature)
   - `hooks/useDepartments.ts`
   - `services/departmentsService.ts`
   - `types/department.ts`
   - `pages/DepartmentManagementPage.tsx`

2. **`src/features/resourceRequests/`** (New Feature)
   - `hooks/useResourceRequests.ts`
   - `services/resourceRequestService.ts`
   - `types/resourceRequest.ts`
   - `pages/ResourceRequestPage.tsx`

### **Updated Test Files**

1. **`src/features/classSessionComponents/pages/tests/InstructorTab.integration.test.tsx`**
   - Update to test department-based instructor management
   - Add tests for cross-department resource requests

2. **`src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx`**
   - Update to test department-based classroom management
   - Add tests for cross-department resource requests

3. **`src/features/timetabling/pages/tests/TimetablePage.integration.test.tsx`**
   - Update to test class merging with cross-department resources
   - Add tests for resource conflict detection

## **Migration Strategy**

### **Step 1: Create Department Structure**
1. Create departments table
2. Assign existing users to departments
3. Create department head roles

### **Step 2: Migrate Existing Resources**
1. Assign existing instructors to appropriate departments
2. Assign existing classrooms to appropriate departments
3. Update ownership model

### **Step 3: Update Application Logic**
1. Update services to use department-based filtering
2. Update UI to show department-based resources
3. Implement resource request system

### **Step 4: Enable Cross-Department Sharing**
1. Update class merging logic to work with shared resources
2. Implement resource request approval workflow
3. Update timetable to show cross-department sessions

## **Benefits of New Model**

1. **Centralized Resource Management**: Single source of truth for institutional resources
2. **Effective Class Merging**: Resources can be shared across programs
3. **Better Resource Utilization**: No duplication of instructors/classrooms
4. **Clear Permission Boundaries**: Department heads manage their resources
5. **Cross-Program Coordination**: Programs can request resources from other departments
6. **Audit Trail**: Track who created and approved resources

## **Risk Mitigation**

1. **Data Migration**: Comprehensive backup and rollback plan
2. **User Training**: Clear documentation for new role-based workflows
3. **Gradual Rollout**: Implement in phases to minimize disruption
4. **Fallback Options**: Maintain ability to revert to old model if needed
