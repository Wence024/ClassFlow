# Cross-Department Resource Request Approval System

## Overview

This feature enables program heads to request instructors or classrooms from other departments, requiring approval from the resource-owning department head before the assignment becomes confirmed. The system includes automatic notifications, confirmations, and state management for the entire request lifecycle.

---

## Implementation Status ✅

### ✅ Completed Features

1. **Dismiss Functionality**
   - Department heads can dismiss requests from their notification dropdown
   - Program heads can dismiss approval/rejection notifications
   - Optimistic UI updates for instant feedback
   - Database updates persist dismissed state
   - Dismissed items remain hidden after page refresh

2. **Rejection Feedback Messages**
   - Department heads must provide a rejection message (required field)
   - Rejection message stored in `resource_requests.rejection_message`
   - Program heads see rejection message in their notification dropdown
   - Message displayed in styled red box with "Reason:" label
   - Database trigger automatically cleans up notifications after dismissal

### 🧪 Testing Instructions

**Test 7: Department Head Dismiss**
1. Log in as department head
2. View pending request in bell notification dropdown
3. Click "Dismiss" button (X icon)
4. Verify request disappears immediately from dropdown
5. Refresh page - confirm request stays dismissed
6. Check database: `dismissed` flag should be `true`

**Test 8: Rejection with Feedback**
1. Log in as department head
2. Click "Reject" on a pending request
3. Verify rejection dialog appears
4. Try submitting without message - should show validation error
5. Enter rejection message: "Resource already assigned to another program"
6. Click "Reject Request"
7. Log in as the program head who made the request
8. Open their bell notification dropdown
9. Verify rejected request appears with red badge
10. Verify rejection message displays in red-themed box with "Reason:" label
11. Click "Dismiss" - request should disappear
12. Refresh page - confirm dismissed notification stays gone

---

## Core Features

### 1. Request Creation & Management

**1.1 Cross-Department Resource Detection**

- Automatically detect when a program head selects an instructor or classroom from another department
- Show confirmation modal with clear information about the cross-department request
- Allow program heads to proceed with or cancel the request

**1.2 Request Status Tracking**

- Track request status: `pending`, `approved`, `rejected`
- Store metadata: requester, target department, resource details
- Track original position for restoration if rejected

**1.3 Visual Indicators for Pending Sessions**

- Display pending sessions with distinct visual styling:
  - Dashed orange border
  - Reduced opacity (0.7)
  - Clock icon indicator
- Make pending sessions non-draggable until approved
- Update styling in real-time when status changes

---

### 2. Approval & Rejection Workflows

**2.1 Department Head Approval**

- Atomic database function ensures both request and timetable assignment update together
- Uses `SECURITY DEFINER` to bypass RLS policy edge cases
- Comprehensive validation (active semester, request exists, pending status)
- Returns detailed success/failure information
- Updates assignment status from `pending` to `confirmed`

**2.2 Department Head Rejection with Message**

- ✅ **Required rejection message from department head**
- Different behavior based on request origin:
  - **Pending requests**: Delete session and timetable assignment
  - **Approved requests (moved)**: Restore session to original position
- ✅ **Rejection message displayed to program head via notifications**
- Atomic operations via database function `reject_resource_request()`

**2.3 Request Dismissal**

- ✅ **Department heads can dismiss requests without action (mark as irrelevant)**
- ✅ **Program heads can dismiss approval/rejection notifications after viewing**
- ✅ **Dismissal is instant with optimistic UI updates**
- ✅ **Dismissed items persist across sessions**

---

### 3. Notification System

**3.1 Department Head Notifications (Resource Requests)**

- Real-time notifications when new requests are created
- Display resource details (instructor/classroom name, not just IDs)
- Badge counter shows pending request count
- Actions: Approve, Reject (with message), ✅ **Dismiss**
- Automatic cleanup via database trigger when requests resolved

**3.2 Program Head Notifications (Request Updates)**

- Real-time notifications when requests are approved/rejected
- Color-coded badges (green for approved, red for rejected)
- ✅ **Display rejection messages from department heads in styled red box**
- ✅ **Dismissal clears notification from view**
- Automatic cleanup via database trigger

**3.3 Cancellation Notifications**

- Department heads notified when program heads cancel requests
- Triggered when sessions removed from timetable to drawer
- Message: "Request cancelled by program head"

**3.4 Database-Level Notification Cleanup**

- Automatic trigger `cleanup_request_notifications()`
- Deletes notifications when:
  - Request status changes from 'pending' (approved/rejected)
  - Request dismissed flag set to true
  - Request deleted entirely
- Prevents stale notification accumulation

---

### 4. Session Movement & Re-Approval

**4.1 Moving Confirmed Cross-Department Sessions**

- Confirmation dialog appears when moving confirmed cross-dept sessions
- Warning: "This move will require approval from [Department Name] again"
- Options: Continue (proceed with move) or Cancel (abort)
- On confirmation:
  - Session moves to new position
  - Status changes back to `pending`
  - New resource request created automatically
  - Department head notified via `handle_cross_dept_session_move()`
  - Original position stored for potential restoration

**4.2 Removing Sessions to Drawer**

- Confirmation dialog for cross-dept sessions being removed
- Warning: "Removing this session will cancel the approval request"
- Options: Continue (remove) or Cancel (keep on timetable)
- On confirmation:
  - Session removed from timetable
  - All active requests cancelled via `cancelActiveRequestsForClassSession()`
  - Department head receives cancellation notification

**4.3 Restoration on Rejection**

- When department head rejects a moved (approved) session:
  - Session automatically restored to original time slot
  - Assignment status returns to `confirmed`
  - Rejection message delivered to program head
- Database function `reject_resource_request()` handles restoration atomically

---

### 5. Real-Time Updates

**5.1 Centralized Real-Time Subscriptions**

- All real-time updates managed by `RealtimeProvider.tsx`
- Single global subscription per table to avoid conflicts
- Uses `invalidateQueries` instead of `refetchQueries` to prevent race conditions
- Subscribed tables with invalidation strategy:
  - `resource_requests` - invalidates `resource_requests`, `my_pending_requests`, `my_reviewed_requests` (exact: false) for INSERT/UPDATE events only (DELETE events skipped to prevent dismiss race conditions)
  - `request_notifications` - invalidates `request-notifications` (exact: false)
  - `timetable_assignments` - invalidates `timetable_assignments`, `hydratedTimetable` (exact: false)
  - `class_sessions` - invalidates `classSessions`, `allClassSessions` (exact: false)
- Prevents "disconnected port" errors from duplicate subscriptions
- Query invalidation marks queries as stale without forcing immediate refetch
- Queries refetch only when actively observed (component mounted)

#### Dismiss Action Race Condition Prevention

To prevent dismissed notifications from reappearing:

1. **Dual Optimistic Updates**: Both base query (`my_reviewed_requests`) and enriched query (`my_enriched_reviewed_requests`) are updated optimistically
2. **Extended Propagation Delay**: 300ms delay allows for:
   - Database update commit
   - Supabase real-time event broadcast
   - React Query invalidation cascade
3. **Defensive Rendering**: Filter out dismissed items in render even if they slip through queries
4. **Matched Stale Times**: Both queries use same `staleTime: 10000` to prevent premature refetches
5. **Query Cancellation**: Pending queries cancelled on component unmount to prevent stale updates
6. **Selective RealtimeProvider Invalidation**: DELETE events don't trigger reviewed requests invalidation (handled by component)

#### Dismissal Permissions

Program Heads can dismiss their **own** reviewed requests (approved or rejected) to clear notifications:
- **RLS Policy**: `resource_requests_update_requesters_dismiss`
  - Allows `requester_id = auth.uid()` to UPDATE
  - Restricted to `status IN ('approved', 'rejected')`
  - Only allows updating the `dismissed` field
  - Cannot dismiss pending requests (those should be cancelled instead)
  
Department Heads and Admins retain full update permissions for request management via the `resource_requests_update_reviewers` policy.

**Database Constraint**: The `enforce_dismissed_on_reviewed_only` trigger prevents accidentally dismissing pending requests at the database level.

**5.2 Timetable Synchronization**

- Sessions update visual styling when status changes
- Changes propagate instantly across all users viewing the timetable
- Leverages centralized Supabase real-time subscriptions

**5.3 Notification Badge Updates**

- Badge counts update immediately when:
  - New requests created
  - Requests approved/rejected
  - Requests dismissed
- No page refresh required
- All updates flow through centralized RealtimeProvider

---

## Database Schema Requirements

### Tables

**`timetable_assignments`**

- Column: `status TEXT NOT NULL DEFAULT 'confirmed'`
- Check constraint: `status IN ('pending', 'confirmed')`
- Index on status for performance

**`resource_requests`**

- Columns: `id`, `requester_id`, `target_department_id`, `resource_type`, `resource_id`, `class_session_id`, `status`, `reviewed_by`, `reviewed_at`, `dismissed`, `rejection_message`, `original_period_index`, `original_class_group_id`
- Check constraint: `status IN ('pending', 'approved', 'rejected')`

**`request_notifications`**

- Columns: `id`, `request_id`, `target_department_id`, `message`, `created_at`
- Foreign key to `resource_requests`

---

### Database Functions

**`is_cross_department_resource(_program_id, _instructor_id, _classroom_id)`**

- Returns boolean indicating if resource belongs to different department
- Handles both instructors and classrooms
- Uses SECURITY DEFINER for RLS bypass

**`approve_resource_request(_request_id, _reviewer_id)`**

- Atomically updates request status to 'approved'
- Updates timetable_assignment status to 'confirmed'
- Validates active semester, request existence, pending status
- Returns JSON with success/failure details
- Uses SECURITY DEFINER for consistent permissions

**`reject_resource_request(_request_id, _reviewer_id, _rejection_message)`**

- Validates request and message
- If approved request: restores session to original position
- If pending request: deletes session and assignment
- Updates request status to 'rejected' with message
- Returns JSON with action taken
- Uses SECURITY DEFINER for atomic operations

**`handle_cross_dept_session_move(_class_session_id, _old_period_index, _old_class_group_id, _new_period_index, _new_class_group_id, _semester_id)`**

- Detects cross-department resources on moved session
- Changes assignment status to 'pending'
- Creates new resource request with original position stored
- Creates notification for department head
- Returns JSON with request details
- Uses SECURITY DEFINER

**`cleanup_request_notifications()` (Trigger Function)**

- Automatically deletes related notifications when:
  - Request status changes from 'pending'
  - Request dismissed flag set to true
  - Request deleted
- Fires on UPDATE and DELETE of `resource_requests`
- Uses SECURITY DEFINER

---

## Service Layer Requirements

### `classSessionsService.ts`

- `isCrossDepartmentInstructor(programId, instructorId)` - Calls database function
- `isCrossDepartmentClassroom(programId, classroomId)` - Calls database function
- `getResourceDepartmentId(instructorId?, classroomId?)` - Returns target department ID
- `checkCrossDepartmentResources(data, programId)` - Returns object with cross-dept details

### `timetableService.ts`

- `assignClassSessionToTimetable(session, status?)` - Accepts optional status parameter
- Pass status through to database upsert operation

### `resourceRequestService.ts`

- `approveRequest(id, reviewerId)` - Calls `approve_resource_request()` database function
- `rejectRequest(id, reviewerId, message)` - Calls `reject_resource_request()` database function
- ✅ **`dismissRequest(id)` - Updates dismissed flag**
- `getRequestWithDetails(requestId)` - Fetches enriched request with instructor/classroom names
- `cancelActiveRequestsForClassSession(classSessionId)` - Cancels all pending/approved requests for a session
- Joins to instructors or classrooms table based on resource_type

## Hook Layer Requirements

### `useClassSessions.ts`

- Export `checkCrossDepartmentResources(data, programId)` helper
- Returns: `{ isCrossDept, resourceType, resourceId, departmentId }`
- Called from UI before submission

### `useResourceRequests.ts`

- `useMyPendingRequests()` hook for Program Heads
  - Returns pending requests where `requester_id = current user`
- `useDepartmentRequests()` hook for Department Heads
  - Returns pending requests for their department
- `cancelRequest` mutation:
  - Deletes timetable_assignment (by class_session_id)
  - Deletes class_session
  - Deletes resource_request
  - Invalidates relevant queries
- ✅ **`dismissRequest` mutation:**
  - Updates dismissed flag
  - Optimistically removes from UI
  - Invalidates queries

### `useTimetable.ts`

- Track pending session IDs from timetable_assignments
- Return `pendingSessionIds` set
- Detect cross-department moves on confirmed sessions
- Call `handle_cross_dept_session_move()` when needed
- Show toast notification for re-approval requirement

### `useTimetableDnd.ts`

- Accept `pendingPlacementInfo` parameter with cross-dept details
- `handleDropToGrid()`:
  - Accept optional confirmation callback
  - Detect cross-dept resources on confirmed sessions
  - Call confirmation before proceeding
  - After successful placement of pending session, automatically create resource request
  - Show success toast with notification reminder
- `handleDropToDrawer()` - Accept optional confirmation callback
  - Check for cross-dept resources before removal
  - Call `cancelActiveRequestsForClassSession()` on confirmation
  - Handle cancellation notifications

## UI Component Requirements

### `ClassSessionForm.tsx`

- State for `showConfirmModal` and `crossDeptInfo`
- Wrap `onSubmit` with `handleFormSubmit`:
  - Call `checkCrossDepartmentResources(data, user.program_id)`
  - If cross-dept: fetch dept/resource names, show ConfirmModal
  - If not cross-dept: call original `onSubmit`
- `handleConfirmCrossDeptRequest` calls `onSubmit` with metadata
- Render ConfirmModal with cross-department details

### `ClassSessionsPage.tsx`

- When cross-dept resource detected:
  1. Show confirmation modal with resource details
  2. On confirm: create class_session (unassigned)
  3. Redirect to `/scheduler` with URL params: `pendingSessionId`, `resourceType`, `resourceId`, `departmentId`
  4. Show success toast: "Session created! Drag it to timetable..."
- No longer uses `PendingTimetableModal` component (removed)

### `SessionCell.tsx`

- Accept `pendingSessionIds?: Set<string>` prop
- Check if session ID in pendingSessionIds set
- Pending session styling:
  - Dashed orange border: `border: '2px dashed #F59E0B'`
  - Reduced opacity: 0.7
  - Clock icon indicator (top-right)
  - Non-draggable: `draggable={isOwnSession && !isPending}`
- DropZone rejects drops onto pending sessions

### `TimetablePage.tsx`

- Read URL params: `pendingSessionId`, `resourceType`, `resourceId`, `departmentId`
- Pass pending placement info to `useTimetableDnd` hook
- Show toast notification on mount if `pendingSessionId` exists
- Pass `pendingPlacementSessionId` to `Drawer` component for highlighting
- Pass `pendingSessionIds` from useTimetable hook through context
- Confirmation dialog state and handlers
- `handleDropToGridWithConfirm` wrapper with confirmation logic
- `handleDropToDrawerWithConfirm` wrapper with confirmation logic
- Render `ConfirmDialog` component

### `RequestNotifications.tsx` (Department Head)

- Query enriched requests using `getRequestWithDetails`
- Display resource names (not IDs)
- `handleApprove`:
  - Call `approveRequest()` service function
  - Show success toast
  - Invalidate only timetable-related queries (RealtimeProvider handles resource_requests)
- `handleReject`:
  - Open `RejectionDialog` component
  - Require rejection message
  - Call `rejectRequest()` with message
  - Show success toast
  - Invalidate only timetable-related queries (RealtimeProvider handles resource_requests)
- ✅ **`handleDismiss`:**
  - Optimistically remove from UI
  - Call `dismissRequest()`
  - No manual invalidation needed (RealtimeProvider handles it)
  - Revert on error
- Display request details with resource names
- No local real-time subscription (handled by RealtimeProvider)

### `PendingRequestsNotification.tsx` (Program Head)

- Fetches reviewed requests (approved/rejected) that haven't been dismissed
- Query configured with `staleTime: 5000` to prevent race conditions
- Display list of user's reviewed requests
- Badge colors: green (approved), red (rejected)
- ✅ **"Dismiss" button for approved/rejected requests**
- ✅ **Display rejection messages from department heads** in styled box with "Reason:" label
- Optimistic UI updates on dismissal
- 100ms debounce before invalidation to allow database propagation
- Uses `exact: true` invalidation to prevent partial key matches
- No local real-time subscription (handled by RealtimeProvider)

### `Drawer.tsx`

- Accept `pendingPlacementSessionId?: string` prop
- Apply special highlighting to pending placement session:
  - Pulsing orange border animation
  - Orange background tint
  - Exclamation badge (top-right)
  - Shadow glow effect
- Regular sessions maintain normal styling

### `RejectionDialog.tsx` (New Component)

- Modal dialog for rejection
- Required message field with validation
- Display resource name being rejected
- Cancel and Reject buttons
- Props: `open`, `onClose`, `onReject`, `resourceName`

### `ConfirmDialog.tsx` (New Component)

- Generic confirmation dialog
- Props: `open`, `onClose`, `onConfirm`, `title`, `description`
- Used for:
  - Moving confirmed cross-dept sessions
  - Removing cross-dept sessions to drawer

## Testing Requirements

### Database Testing

- Test `is_cross_department_resource()` with same/different departments
- Verify status column defaults and constraints
- Test RLS policies respect status column
- Test `approve_resource_request()` atomicity
- Test `reject_resource_request()` restoration logic
- Test `handle_cross_dept_session_move()` detection
- Test `cleanup_request_notifications()` trigger fires correctly
- Test concurrent approval attempts fail gracefully

### Service Layer Testing

- Test cross-department detection with various department combinations
- Test `assignClassSessionToTimetable` with 'pending' and 'confirmed' status
- Verify error handling in all service functions
- Test `cancelActiveRequestsForClassSession()` cancels all requests
- Test `approveRequest()` handles missing active semester
- Test `rejectRequest()` with pending vs approved requests

### UI Flow Testing - Same Department

- Create session with same-dept instructor → No modal
- Session assigned immediately as 'confirmed'
- Session appears normal (solid border, draggable)

### UI Flow Testing - Cross Department (Full Workflow)

**Initial Request:**

- [x] Program Head selects cross-dept resource → Modal appears
- [x] Modal shows department name and resource name
- [x] Program Head confirms → Redirected to timetable page
- [x] Session appears in drawer with pulsing orange border and badge
- [x] Toast notification guides user to drag session
- [x] Program Head drags session to timetable slot
- [x] Request created automatically after placement
- [x] Department head notified

**Pending Session Appearance (after placement):**

- Dashed orange border
- Reduced opacity (0.7)
- Clock icon indicator
- Non-draggable

**Department Head Approval:**

- [x] Notification appears in bell icon
- [x] Opens dropdown, sees enriched details
- [x] Clicks "See in Timetable" and navigates to cell in timetable
- [x] Clicks "Approve" → Loading state → Success toast
- [x] Request disappears from dropdown
- [x] Assignment status becomes 'confirmed'
- [x] Session updates to normal styling in real-time
- [x] Program head sees approval notification

**Department Head Rejection:**

- [x] Clicks "Reject" → Dialog opens requiring message
- [x] Cannot submit without message
- [x] Enters message, clicks "Reject Request"
- [x] If pending request: Session deleted from timetable
- [x] If approved request: Session restored to original position
- [x] Program head sees rejection notification with feedback message displayed

### UI Flow Testing - Session Movement

**Moving Confirmed Cross-Dept Sessions:**

- Drag confirmed cross-dept session to new slot
- Confirmation dialog appears: "This will require re-approval"
- Click "Cancel" → Session stays in place
- Click "Continue" → Session moves, status becomes 'pending'
- New request created with original position stored
- Department head notified

**Removing to Drawer:**

- Drag cross-dept session to drawer
- Confirmation dialog: "This will cancel the approval"
- Click "Cancel" → Session stays on timetable
- Click "Continue" → Session removed, requests cancelled
- Department head receives cancellation notification

### UI Flow Testing - Program Head Notifications

**Viewing Updates:**

- [x] After approval → Green badge on notifications bell
- [x] After rejection → Red badge on notifications bell
- [x] Click on item → See full details and rejection message in styled box
- [x] Click "Dismiss" → Item disappears immediately (optimistic update)
- [x] Refresh page → Dismissed items stay gone
- [x] Rejection message displayed with "Reason:" label in red-themed box

**Cancelling Requests:**

- [x] See pending requests in dropdown (separate Clock icon component)
- [x] Click "Cancel" (X button) → Request cancelled immediately
- [x] Confirm → Request deleted, session removed from timetable
- [x] All related queries invalidated for consistency

### Real-Time Testing

- Multiple users viewing same session
- Approval/rejection propagates instantly to all viewers
- Session styling updates without refresh
- Notification badges update in real-time

---

## System Flow Diagram

```
Program Head                Department Head              Database
     |                            |                          |
     |--[1] Create Session------->|                          |
     |   (Cross-dept resource)    |                          |
     |                            |                          |
     |--[2] Place on Timetable--->|                          |
     |   (Status: pending)        |                          |
     |                            |                          |
     |                            |<--[3] Notification-------|
     |                            |   (New request)          |
     |                            |                          |
     |                            |--[4] Review Request----->|
     |                            |                          |
     |                  OPTION A: APPROVE                    |
     |                            |--[5] Approve------------>|
     |<--[6] Notification---------|   (Status: confirmed)    |
     |   (Green badge)            |                          |
     |                            |                          |
     |                  OPTION B: REJECT                     |
     |                            |--[5] Reject + Message--->|
     |<--[6] Notification---------|   (Delete or Restore)    |
     |   (Red badge + Message)    |                          |
     |                            |                          |
     |                  OPTION C: DISMISS                    |
     |                            |--[5] Dismiss------------>|
     |                            |   (Mark as dismissed)    |
     |                            |                          |
     |--[7] Dismiss Notification->|                          |
     |   (Optimistic update)      |                          |
```

---

## Known Edge Cases

### Handled Edge Cases

1. **Duplicate Request Prevention**: Service layer checks for existing pending/approved requests before creating new ones
2. **Concurrent Approvals**: Database function validates request status before approval
3. **Resource Deletion**: System handles cleanup when instructors/classrooms are deleted
4. **Session Movement**: Re-approval required with original position stored for restoration
5. **Dismissal Persistence**: Uses database `dismissed` flag to persist across sessions
6. **Notification Cleanup**: Automatic trigger removes stale notifications

### Potential Edge Cases

1. **Multi-Program Coordination**: If multiple programs request same resource simultaneously
2. **Semester Transitions**: Behavior when active semester changes mid-workflow
3. **Permission Changes**: User role changes during pending request lifecycle

---

## Performance Considerations

- Real-time subscriptions limited to user-relevant data
- Optimistic UI updates for instant feedback
- Query invalidation scoped to affected data only
- Enriched request details fetched on-demand (not preloaded)
- Database indexes on `status`, `target_department_id`, `requester_id`

---

## Security Considerations

- All database functions use `SECURITY DEFINER` with `SET search_path = public`
- RLS policies enforce department and program boundaries
- Request validation ensures users can only act on their resources
- Atomic operations prevent partial state updates
- Dismissal restricted to request owner and target department

---

## Future Enhancements

- Bulk approval/rejection for multiple requests
- Email notifications in addition to in-app notifications
- Request history/audit log
- Analytics dashboard for cross-department resource usage
- Automatic approval rules based on department policies
