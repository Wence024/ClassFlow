# **Updated Implementation Plan: Interactive Cross-Department Resource Approval System**

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
---

## **Manual E2E Test Checklist**

### **Test 1: Database Layer Verification**
- [x] Open Supabase SQL Editor
- [x] Execute: `SELECT * FROM timetable_assignments LIMIT 5;`
- [x] Confirm `status` column exists and contains 'pending' or 'confirmed'
- [x] Execute: `SELECT is_cross_department_resource('program-uuid', 'instructor-uuid', NULL);`
- [x] Confirm function returns boolean

### **Test 2: Same-Department Session Creation**
1. [x] Log in as Program Head
2. [x] Navigate to Classes page
3. [x] Create new class session with instructor from same department
4. [x] Verify: **No confirmation modal appears**
5. [x] Check timetable: session should appear immediately with normal styling

### **Test 3: Cross-Department Request Submission**
1. [x] Log in as Program Head (e.g., Computer Science program)
2. [x] Navigate to Classes page
3. [x] Create session with instructor from different department (e.g., Mathematics)
4. [x] Verify: **Confirmation Modal appears** with department name and instructor name
5. [x] Click "Submit Request"
6. [ ] Check browser console for errors

Error occured:
This error is caused:
lovable.js:1 
 Failed to create request notification 
{code: '42501', details: null, hint: null, message: 'new row violates row-level security policy for table "request_notifications"'}
console.<computed>	@	lovable.js:1
createRequest	@	resourceRequestService.ts:68
await in createRequest		
handleConfirmCrossDept	@	ClassSessionsPage.tsx:182
<button>		
_c	@	button.tsx:22
<Button>		
ConfirmModal	@	confirm-modal.tsx:64

It's strange that despite the RLS policy error, the request is still created in the database.

Switching tabs and back is needed before the notification panel updates with the request.

7. [x] Query database: `SELECT * FROM resource_requests WHERE status='pending';`
8. [x] Verify request was created

### **Test 4: Visual Styling (Conditional)**
⚠️ **This test will FAIL until Priority 1, Item 2 is fixed**
1. [x] Navigate to Timetable page
2. [x] Look for sessions with pending status
3. [x] Verify: Dashed orange border, reduced opacity, clock icon
4. [x] Try to drag: Should be disabled
- For the workflow, It should be enabled or it is prescheduled in a modal timetable in the manage classes page.

### **Test 5: Department Head Approval/Rejection**
⚠️ **This test will FAIL until Priority 1, Item 1 is fixed**
1. [x] Log in as Department Head
2. [x] Look for bell icon with notification badge (won't be visible yet)
3. [ ] After fix: Click bell, verify list shows pending requests
- does not show pending requests

4. [ ] Click "Approve" on a request
5. [ ] Check database: `timetable_assignments.status` should change to 'confirmed'
6. [ ] Verify: Session on timetable updates to normal styling

### **Test 6: Program Head Cancellation**
⚠️ **This test will FAIL until Priority 1, Item 1 is fixed**
1. [x] Log in as Program Head with pending requests
2. [x] Look for clock icon with badge (won't be visible yet)
3. [x] After fix: Click clock, verify list shows own pending requests
4. [x] Click "Cancel"
5. [ ] Verify: Session removed from timetable, request deleted from database
- need reload or switch tabs to see timetable class session removed. Notification is persistent and not cleared.


---

# **4. Recommendations**

3. **Wire Up Pending Session Styling** (Priority 1, Item 2)
   - Update `TimetablePage` to pass `pendingSessionIds` from `useTimetable` hook
   - Ensure context provider includes this value
   - Verify `SessionCell` receives and uses the prop correctly

4. **Add Query Invalidation** (Priority 2, Item 4)
   - Quick win to enable real-time updates
   - Add to both approval and rejection handlers

5. **Write Integration Tests** (Priority 3, Item 5)
   - Once UI is wired up, create comprehensive tests
   - Follow the manual test checklist above as a starting point

---

# **5. Architecture Notes**

**Strengths of Current Implementation:**
- ✅ Clean separation of concerns (service → hook → UI)
- ✅ Database-level validation with RLS policies
- ✅ Proper use of React Query for state management
- ✅ Comprehensive error handling in service layer
- ✅ Optimistic updates for better UX

**Technical Debt to Address:**
- ⚠️ Type safety: Some `as any` casts in RPC calls
- ⚠️ Missing loading states in some components
- ⚠️ No rollback mechanism for failed cross-dept request creation (3-step process)

---