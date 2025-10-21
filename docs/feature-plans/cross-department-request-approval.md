# **Updated Implementation Plan: Interactive Cross-Department Resource Approval System**

Based on your revised workflow, here's the updated 5-phase implementation plan:

---

## **Phase 1: Database Layer Changes**

**1.1 Add `status` Column to `timetable_assignments` Table**

```sql
ALTER TABLE public.timetable_assignments 
ADD COLUMN status TEXT NOT NULL DEFAULT 'confirmed' 
CHECK (status IN ('pending', 'confirmed', 'rejected'));

-- Add index for better query performance
CREATE INDEX idx_timetable_assignments_status 
ON public.timetable_assignments(status);
```

**Rationale:** The `status` column distinguishes between pending cross-department requests and confirmed assignments. Default is `'confirmed'` to maintain backward compatibility with existing data.

**1.2 Helper Function: Check Cross-Department Resource**

```sql
CREATE OR REPLACE FUNCTION public.is_cross_department_resource(
  _program_id uuid,
  _instructor_id uuid DEFAULT NULL,
  _classroom_id uuid DEFAULT NULL
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    -- Check instructor cross-department
    SELECT 1 FROM instructors i
    JOIN programs p ON p.id = _program_id
    WHERE i.id = _instructor_id
      AND i.department_id IS NOT NULL
      AND p.department_id IS NOT NULL
      AND i.department_id != p.department_id
    UNION
    -- Check classroom cross-department
    SELECT 1 FROM classrooms c
    JOIN programs p ON p.id = _program_id
    WHERE c.id = _classroom_id
      AND c.preferred_department_id IS NOT NULL
      AND p.department_id IS NOT NULL
      AND c.preferred_department_id != p.department_id
  )
$$;
```

**Rationale:** This function encapsulates the cross-department detection logic at the database level, making it reusable and ensuring consistency.

---

## **Phase 2: Service Layer Changes**

**File: `src/features/classSessions/services/classSessionsService.ts`**

**2.1 Add Helper Functions**

```typescript
/**
 * Checks if an instructor belongs to a different department than the program.
 * 
 * @param programId - The ID of the program.
 * @param instructorId - The ID of the instructor.
 * @returns A promise that resolves to true if cross-department, false otherwise.
 */
export async function isCrossDepartmentInstructor(
  programId: string, 
  instructorId: string
): Promise {
  const { data, error } = await supabase.rpc('is_cross_department_resource', {
    _program_id: programId,
    _instructor_id: instructorId,
    _classroom_id: null,
  });
  if (error) {
    console.error('Error checking cross-department instructor:', error);
    return false;
  }
  return data === true;
}

/**
 * Checks if a classroom belongs to a different department than the program.
 * 
 * @param programId - The ID of the program.
 * @param classroomId - The ID of the classroom.
 * @returns A promise that resolves to true if cross-department, false otherwise.
 */
export async function isCrossDepartmentClassroom(
  programId: string, 
  classroomId: string
): Promise {
  const { data, error } = await supabase.rpc('is_cross_department_resource', {
    _program_id: programId,
    _instructor_id: null,
    _classroom_id: classroomId,
  });
  if (error) {
    console.error('Error checking cross-department classroom:', error);
    return false;
  }
  return data === true;
}

/**
 * Gets the target department ID for a cross-department resource.
 * 
 * @param instructorId - The ID of the instructor (optional).
 * @param classroomId - The ID of the classroom (optional).
 * @returns A promise that resolves to the department ID, or null if not found.
 */
export async function getResourceDepartmentId(
  instructorId?: string,
  classroomId?: string
): Promise {
  if (instructorId) {
    const { data, error } = await supabase
      .from('instructors')
      .select('department_id')
      .eq('id', instructorId)
      .single();
    if (error) {
      console.error('Error fetching instructor department:', error);
      return null;
    }
    return data?.department_id || null;
  }

  if (classroomId) {
    const { data, error } = await supabase
      .from('classrooms')
      .select('preferred_department_id')
      .eq('id', classroomId)
      .single();
    if (error) {
      console.error('Error fetching classroom department:', error);
      return null;
    }
    return data?.preferred_department_id || null;
  }

  return null;
}
```

**File: `src/features/timetabling/services/timetableService.ts`**

**2.2 Update `assignClassSessionToTimetable` Function**

Modify the function signature to accept an optional `status` parameter:

```typescript
export async function assignClassSessionToTimetable(
  assignment: TimetableAssignmentInsert & { status?: 'pending' | 'confirmed' }
): Promise {
  const { data, error } = await supabase
    .from('timetable_assignments')
    .upsert([assignment], { onConflict: 'user_id,class_group_id,period_index,semester_id' })
    .select('*')
    .single();
  if (error) throw error;
  return data as TimetableAssignment;
}
```

**File: `src/features/resourceRequests/services/resourceRequestService.ts`**

**2.3 Add `getRequestWithDetails` Function**

```typescript
/**
 * Fetches a single resource request with enriched resource data.
 * 
 * @param requestId - The ID of the resource request.
 * @returns A promise resolving to the resource request with instructor or classroom details.
 */
export async function getRequestWithDetails(requestId: string): Promise {
  const { data: request, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', requestId)
    .single();

  if (error) throw error;

  let resourceDetails;
  if (request.resource_type === 'instructor') {
    const { data: instructor } = await supabase
      .from('instructors')
      .select('*')
      .eq('id', request.resource_id)
      .single();
    resourceDetails = instructor;
  } else if (request.resource_type === 'classroom') {
    const { data: classroom } = await supabase
      .from('classrooms')
      .select('*')
      .eq('id', request.resource_id)
      .single();
    resourceDetails = classroom;
  }

  return { ...request, resource_details: resourceDetails };
}
```

---

## **Phase 3: Hook Layer Changes**

**File: `src/features/classSessions/hooks/useClassSessions.ts`**

**3.1 Add Helper Function for Cross-Department Detection**

```typescript
/**
 * Checks if the given class session data involves cross-department resources.
 * 
 * @param data - The class session data to check.
 * @param programId - The program ID to compare against.
 * @returns A promise that resolves to an object with cross-department flags.
 */
export async function checkCrossDepartmentResources(
  data: ClassSessionInsert,
  programId: string
): Promise<{
  isCrossDept: boolean;
  resourceType: 'instructor' | 'classroom' | null;
  resourceId: string | null;
  departmentId: string | null;
}> {
  // Check instructor
  const isInstructorCrossDept = await classSessionsService.isCrossDepartmentInstructor(
    programId,
    data.instructor_id
  );

  if (isInstructorCrossDept) {
    const deptId = await classSessionsService.getResourceDepartmentId(data.instructor_id);
    return {
      isCrossDept: true,
      resourceType: 'instructor',
      resourceId: data.instructor_id,
      departmentId: deptId,
    };
  }

  // Check classroom
  const isClassroomCrossDept = await classSessionsService.isCrossDepartmentClassroom(
    programId,
    data.classroom_id
  );

  if (isClassroomCrossDept) {
    const deptId = await classSessionsService.getResourceDepartmentId(undefined, data.classroom_id);
    return {
      isCrossDept: true,
      resourceType: 'classroom',
      resourceId: data.classroom_id,
      departmentId: deptId,
    };
  }

  return {
    isCrossDept: false,
    resourceType: null,
    resourceId: null,
    departmentId: null,
  };
}
```

**Note:** The `addClassSession` mutation itself doesn't change. The cross-department logic will be handled in the UI layer when the form is submitted.

**File: `src/features/resourceRequests/hooks/useResourceRequests.ts`**

**3.2 Add Hook for Fetching Own Pending Requests**

```typescript
/**
 * A hook for fetching the current user's pending resource requests.
 * 
 * @returns An object with the user's pending requests and loading state.
 */
export function useMyPendingRequests() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['my_pending_requests', user?.id];

  const listQuery = useQuery({
    queryKey,
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('resource_requests')
        .select('*')
        .eq('requester_id', user.id)
        .eq('status', 'pending')
        .order('requested_at', { ascending: false });
      if (error) throw error;
      return data as ResourceRequest[];
    },
    enabled: !!user,
  });

  const cancelMutation = useMutation({
    mutationFn: async (requestId: string) => {
      // Delete the timetable assignment and class session associated with this request
      const { data: request } = await supabase
        .from('resource_requests')
        .select('*, timetable_assignments(*)')
        .eq('id', requestId)
        .single();

      if (request) {
        // Delete associated timetable assignment and class session
        // (This will be implemented in Phase 4 with proper cascading)
      }

      // Delete the request
      const { error } = await supabase
        .from('resource_requests')
        .delete()
        .eq('id', requestId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ['hydratedTimetable'] });
    },
  });

  return {
    pendingRequests: listQuery.data || [],
    isLoading: listQuery.isLoading,
    cancelRequest: cancelMutation.mutateAsync,
    isCanceling: cancelMutation.isPending,
  };
}
```

---

## **Phase 4: UI Layer Changes**

**File: `src/features/classSessions/pages/components/classSession/ClassSessionForm.tsx`**

**4.1 Add Cross-Department Detection and Confirmation Modal**

Add state for the confirmation modal and detection logic:

```typescript
const [showConfirmModal, setShowConfirmModal] = useState(false);
const [crossDeptInfo, setCrossDeptInfo] = useState<{
  resourceType: string;
  resourceName: string;
  departmentName: string;
  departmentId: string;
  sessionData: ClassSessionFormData;
} | null>(null);

// New onSubmit wrapper that checks for cross-department resources
const handleFormSubmit = async (data: ClassSessionFormData) => {
  if (!user?.program_id) {
    toast.error('Cannot create session: No program assigned');
    return;
  }

  // Check if this is a cross-department resource
  const crossDeptCheck = await checkCrossDepartmentResources(data, user.program_id);

  if (crossDeptCheck.isCrossDept && crossDeptCheck.departmentId) {
    // Fetch department and resource names for display
    const { data: dept } = await supabase
      .from('departments')
      .select('name')
      .eq('id', crossDeptCheck.departmentId)
      .single();

    let resourceName = '';
    if (crossDeptCheck.resourceType === 'instructor') {
      const { data: instructor } = await supabase
        .from('instructors')
        .select('first_name, last_name')
        .eq('id', crossDeptCheck.resourceId)
        .single();
      resourceName = `${instructor?.first_name} ${instructor?.last_name}`;
    } else {
      const { data: classroom } = await supabase
        .from('classrooms')
        .select('name')
        .eq('id', crossDeptCheck.resourceId)
        .single();
      resourceName = classroom?.name || '';
    }

    // Show confirmation modal
    setCrossDeptInfo({
      resourceType: crossDeptCheck.resourceType,
      resourceName,
      departmentName: dept?.name || 'Unknown Department',
      departmentId: crossDeptCheck.departmentId,
      sessionData: data,
    });
    setShowConfirmModal(true);
  } else {
    // No cross-department resource, proceed normally
    await onSubmit(data);
  }
};

// Handler for confirming cross-department request
const handleConfirmCrossDeptRequest = async () => {
  if (!crossDeptInfo) return;

  // This will be passed to the parent's onSubmit with a flag
  await onSubmit(crossDeptInfo.sessionData, {
    isPending: true,
    resourceType: crossDeptInfo.resourceType,
    resourceId: crossDeptInfo.sessionData.instructor_id || crossDeptInfo.sessionData.classroom_id,
    targetDepartmentId: crossDeptInfo.departmentId,
  });

  setShowConfirmModal(false);
  setCrossDeptInfo(null);
};
```

Add the ConfirmModal component at the end of the form JSX:

```tsx
 {
    setShowConfirmModal(false);
    setCrossDeptInfo(null);
  }}
>

    You are requesting to use {crossDeptInfo?.resourceName}, 
    which belongs to the {crossDeptInfo?.departmentName} department.

    This assignment will be marked as pending until approved by the 
    {crossDeptInfo?.departmentName} department head.

    Submit request to the {crossDeptInfo?.departmentName} department head?

```

**4.2 Update Parent Component to Handle Pending Status**

The parent component (e.g., `ClassSessionsPage.tsx`) needs to be updated to:

1. Accept the pending flag and resource info from the form
2. Create the class session
3. Assign it to the timetable with `status: 'pending'`
4. Create the resource request

**File: `src/features/timetabling/pages/components/timetable/SessionCell.tsx`**

**4.3 Add Visual Distinction for Pending Sessions**

Modify the `VisibleSessionBlock` component to check for pending status:

```typescript
// Add this to the SessionCell props (passed from parent)
interface SessionCellProps {
  sessions: ClassSession[];
  groupId: string;
  periodIndex: number;
  isLastInDay: boolean;
  isNotLastInTable: boolean;
  pendingAssignments?: Set; // New prop: Set of pending assignment IDs
}

// In the VisibleSessionBlock, add styling for pending status
const isPending = pendingAssignments?.has(primarySession.id);

// Update the cell style
const cellStyle = isOwnSession
  ? {
      ...createCellBackground(sessions, isDraggedSession),
      ...(isPending && {
        border: '2px dashed #F59E0B',
        opacity: 0.7,
      }),
    }
  : { backgroundColor: '#E5E7EB', border: 'none', opacity: 0.8 };

// Update draggable logic
const isDraggable = isOwnSession && !isPending;

// Add a pending indicator icon
{isPending && (

)}
```

**File: `src/components/RequestNotifications.tsx`**

**4.4 Enhance Notification Display and Actions**

```typescript
// Fetch enriched request details
const enrichedRequests = useQuery({
  queryKey: ['enriched_requests', requests],
  queryFn: async () => {
    return Promise.all(
      pendingRequests.map(async (req) => {
        const details = await resourceRequestService.getRequestWithDetails(req.id);
        return details;
      })
    );
  },
  enabled: pendingRequests.length > 0,
});

// Update handleApprove to also update timetable status
const handleApprove = async (request: ResourceRequest) => {
  // Update request status
  await updateRequest({
    id: request.id,
    update: {
      status: 'approved',
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    },
  });

  // Update timetable assignment status to 'confirmed'
  const { error } = await supabase
    .from('timetable_assignments')
    .update({ status: 'confirmed' })
    .eq('class_session_id', request.resource_id) // Assuming resource_id links to class_session
    .eq('status', 'pending');

  if (error) {
    console.error('Failed to update timetable status:', error);
    toast.error('Approved, but failed to update timetable');
  } else {
    toast.success('Request approved');
  }
};

// Update handleReject to delete timetable assignment and class session
const handleReject = async (request: ResourceRequest) => {
  // First, find and delete the timetable assignment
  const { data: assignment } = await supabase
    .from('timetable_assignments')
    .select('class_session_id')
    .eq('class_session_id', request.resource_id)
    .eq('status', 'pending')
    .single();

  if (assignment) {
    // Delete timetable assignment
    await supabase
      .from('timetable_assignments')
      .delete()
      .eq('class_session_id', assignment.class_session_id);

    // Delete class session
    await supabase
      .from('class_sessions')
      .delete()
      .eq('id', assignment.class_session_id);
  }

  // Update request status
  await updateRequest({
    id: request.id,
    update: {
      status: 'rejected',
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    },
  });

  toast.success('Request rejected and session removed');
};

// Display enriched information

  {request.resource_type === 'instructor'
    ? `${enrichedDetails?.first_name} ${enrichedDetails?.last_name}`
    : enrichedDetails?.name}

```

**4.5 Add Program Head Cancellation UI**

Create a new component or section in the Header to show pending requests:

```tsx
// In Header.tsx or a new PendingRequestsDropdown.tsx
const { pendingRequests, cancelRequest, isCanceling } = useMyPendingRequests();

// Display dropdown similar to RequestNotifications
// With "Cancel" button that calls cancelRequest()
```

---

## **Phase 5: Testing & Validation**

**5.1 Database Testing**

- Test `is_cross_department_resource()` function with various scenarios
- Verify `status` column defaults and constraints
- Test RLS policies for pending assignments

**5.2 Service Layer Testing**

- Test `isCrossDepartmentInstructor()` and `isCrossDepartmentClassroom()` with same/different departments
- Test `getResourceDepartmentId()` returns correct department
- Test `assignClassSessionToTimetable()` with `status: 'pending'`

**5.3 UI Flow Testing**

- **Same Department**: Create session → No modal → Assigned immediately
- **Cross Department**: Create session → Modal appears → Confirm → Session created with pending status
- **Visual Distinction**: Verify pending sessions show dashed border and reduced opacity
- **Non-Draggable**: Verify pending sessions cannot be dragged
- **Department Head Approval**: Verify approval updates status to 'confirmed'
- **Department Head Rejection**: Verify rejection deletes assignment and session
- **Program Head Cancellation**: Verify cancel deletes assignment, session, and request
- **Bell Icon**: Verify count updates correctly
- **Toast Notifications**: Verify all toasts appear at appropriate times

**5.4 Edge Cases**

- What happens if a department head rejects while program head is viewing?
- What happens if a program head cancels while department head is reviewing?
- Verify real-time updates work correctly for all parties
- Test with both instructor and classroom cross-department scenarios

---

## **Key Implementation Notes**

1. **Database First**: Add the `status` column and helper function before any code changes
2. **Backward Compatibility**: Default `status` to `'confirmed'` so existing assignments work
3. **Non-Blocking**: Class sessions are still created, just marked as pending
4. **Cascading Deletes**: Rejection and cancellation must delete both assignment and session
5. **Real-Time Updates**: Leverage existing Supabase subscriptions for live updates
6. **Visual Feedback**: Multiple indicators (dashed border, opacity, clock icon) for pending state
7. **Permission Checks**: Respect existing RLS policies and role-based permissions
8. **Error Handling**: Gracefully handle failures in cross-department detection and request creation

---

# Updated Implementation Plan: Interactive Cross-Department Resource Approval System

## Phase 1: Database Layer Changes (SQL Migrations)

**1.1 Add `status` Column to `timetable_assignments`**

- Add `status TEXT NOT NULL DEFAULT 'confirmed'` with CHECK constraint for 'pending', 'confirmed', 'rejected'
- Add index on status column for performance
- Default to 'confirmed' maintains backward compatibility

**1.2 Create Helper Function**

- `is_cross_department_resource(_program_id, _instructor_id, _classroom_id)`
- Returns boolean if resource is from different department
- Handles both instructors and classrooms in single function
- Uses SECURITY DEFINER for RLS bypass

## Phase 2: Service Layer Changes

**2.1 File: `classSessionsService.ts`**

- Add `isCrossDepartmentInstructor(programId, instructorId)` - calls DB function
- Add `isCrossDepartmentClassroom(programId, classroomId)` - calls DB function  
- Add `getResourceDepartmentId(instructorId?, classroomId?)` - returns target dept ID
- No changes to `addClassSession` - logic moves to UI layer

**2.2 File: `timetableService.ts`**

- Update `assignClassSessionToTimetable` signature to accept optional `status: 'pending' | 'confirmed'`
- Pass status through to database upsert

**2.3 File: `resourceRequestService.ts`**

- Add `getRequestWithDetails(requestId)` - fetches request with enriched instructor/classroom data
- Joins to instructors or classrooms table based on resource_type

## Phase 3: Hook Layer Changes

**3.1 File: `useClassSessions.ts`**

- Add exported helper `checkCrossDepartmentResources(data, programId)`
- Returns object with: `{ isCrossDept, resourceType, resourceId, departmentId }`
- Called from UI before submission

**3.2 File: `useResourceRequests.ts`**

- Add `useMyPendingRequests()` hook for Program Heads
- Returns pending requests where `requester_id = current user`
- Add `cancelRequest` mutation that:
  - Deletes timetable_assignment (by class_session_id)
  - Deletes class_session
  - Deletes resource_request
  - Invalidates relevant queries

## Phase 4: UI Layer Changes

**4.1 File: `ClassSessionForm.tsx`**

- Add state for `showConfirmModal` and `crossDeptInfo`
- Wrap existing `onSubmit` with `handleFormSubmit` that:
  - Calls `checkCrossDepartmentResources(data, user.program_id)`
  - If cross-dept: fetch dept/resource names, show ConfirmModal
  - If not cross-dept: call original `onSubmit`
- Add `handleConfirmCrossDeptRequest` that calls `onSubmit` with additional metadata
- Render `ConfirmModal` with cross-department details

**4.2 Parent Component Changes (e.g., `ClassSessionsPage.tsx`)**

- Update to accept pending flag and resource info from form
- When pending:
  1. Create class_session normally
  2. Assign to timetable with `status: 'pending'`
  3. Create resource_request with appropriate metadata
- Handle all three operations in sequence with error handling

**4.3 File: `SessionCell.tsx`**

- Add `pendingAssignments?: Set` to props (passed from TimetablePage)
- Check if `primarySession.id` is in pendingAssignments set
- For pending sessions:
  - Apply dashed border (`border: '2px dashed #F59E0B'`)
  - Reduce opacity to 0.7
  - Disable dragging (`draggable={isOwnSession && !isPending}`)
  - Add clock icon indicator in top-right corner
- Update DropZone to reject drops onto pending sessions

**4.4 File: `useTimetable.ts` (parent of SessionCell)**

- Query timetable_assignments and build Set of pending class_session_ids
- Pass `pendingAssignments` set down to SessionCell via TimetableRow

**4.5 File: `RequestNotifications.tsx`**

- Add query to fetch enriched request details using `getRequestWithDetails`
- Display instructor names (`first_name last_name`) or classroom names instead of IDs
- Update `handleApprove`:
  - Update resource_request: `status='approved'`, `reviewed_by`, `reviewed_at`
  - Update timetable_assignments: `status='confirmed'` where `class_session_id` matches
  - Show toast notification
- Update `handleReject`:
  - Find timetable_assignment by class_session_id
  - Delete timetable_assignment
  - Delete class_session
  - Update resource_request: `status='rejected'`, `reviewed_by`, `reviewed_at`
  - Show toast notification

**4.6 New Component: Program Head Pending Requests**

- Create dropdown/section in Header (similar to RequestNotifications)
- Use `useMyPendingRequests()` hook
- Display list of user's pending requests with resource details
- Add "Cancel" button for each request
- On cancel: call `cancelRequest()` mutation, show confirmation dialog

## Phase 5: Testing & Validation

**5.1 Database Testing**

- Test `is_cross_department_resource()` with same/different departments
- Verify status column defaults and constraints work
- Test RLS policies respect status column

**5.2 Service Layer Testing**

- Test cross-department detection functions with various department combinations
- Test `assignClassSessionToTimetable` with both 'pending' and 'confirmed' status
- Verify error handling in all service functions

**5.3 UI Flow Testing - Same Department**

- Create session with same-dept instructor → No modal → Assigned immediately as 'confirmed'
- Session appears normal (solid border, draggable)

**5.4 UI Flow Testing - Cross Department (Full Workflow)**

- Program Head selects cross-dept instructor → Modal appears with dept name
- Program Head confirms → Session created, assigned as 'pending', request created
- Session appears with dashed border, reduced opacity, clock icon, non-draggable
- Dept Head sees notification in bell icon (count updates)
- Dept Head opens dropdown, sees enriched request details
- **Approval**: Dept Head approves → Assignment status becomes 'confirmed' → Session becomes normal
- **Rejection**: Dept Head rejects → Assignment and session deleted → Disappears from timetable

**5.5 UI Flow Testing - Program Head Cancellation**

- Program Head sees their pending requests in new dropdown
- Program Head clicks "Cancel" → Confirmation dialog appears
- Confirm cancel → Assignment, session, and request all deleted

**5.6 Real-Time Testing**

- Verify timetable updates in real-time for all users when status changes
- Verify bell icon count updates when requests are created/resolved
- Test concurrent actions (e.g., approve while requestor is viewing)

**5.7 Edge Cases**

- Multiple pending sessions in same cell (should all show pending)
- Cross-department classroom (in addition to instructor)
- Department Head rejecting while Program Head views timetable
- Network errors during multi-step operations
- Permissions: verify non-owners can't drag pending sessions

## Key Design Decisions

1. **Application-Layer Approach**: Cross-department detection in UI, not DB trigger (better testability)
2. **Non-Blocking Creation**: Class sessions and assignments created immediately, just marked pending
3. **Cascading Deletes on Rejection**: Rejection/cancellation removes all related records
4. **Visual Distinction**: Multiple indicators (border, opacity, icon) for pending state
5. **Bidirectional Cancel**: Both requester and reviewer can cancel/reject
6. **Real-Time Updates**: Leverage existing Supabase subscriptions
7. **Backward Compatible**: Default status='confirmed' preserves existing behavior
8. **Enriched Notifications**: Show resource names, not just IDs

This updated plan reflects your interactive workflow where:

1. Selection triggers a confirmation modal (not automatic post-creation)
2. Pending sessions are visually distinct and non-draggable
3. Both Department Heads and Program Heads can manage requests
4. Rejection deletes the session entirely
