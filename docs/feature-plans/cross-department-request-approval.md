# Cross-Department Resource Request Approval System

## Overview

This feature enables program heads to request instructors or classrooms from other departments, requiring approval from the resource-owning department head before the assignment becomes confirmed. The system includes automatic notifications, confirmations, and state management for the entire request lifecycle.

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

- Required rejection message from department head
- Different behavior based on request origin:
  - **Pending requests**: Delete session and timetable assignment
  - **Approved requests (moved)**: Restore session to original position
- Rejection message displayed to program head via notifications
- Atomic operations via database function `reject_resource_request()`

**2.3 Request Dismissal**

- Department heads can dismiss requests without action (mark as irrelevant)
- Program heads can dismiss approval/rejection notifications after viewing
- Dismissal is instant with optimistic UI updates
- Dismissed items persist across sessions

---

### 3. Notification System

**3.1 Department Head Notifications (Resource Requests)**

- Real-time notifications when new requests are created
- Display resource details (instructor/classroom name, not just IDs)
- Badge counter shows pending request count
- Actions: Approve, Reject (with message), Dismiss
- Automatic cleanup via database trigger when requests resolved

**3.2 Program Head Notifications (Request Updates)**

- Real-time notifications when requests are approved/rejected
- Color-coded badges (green for approved, red for rejected)
- Display rejection messages from department heads
- Dismissal clears notification from view
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

**5.1 Timetable Synchronization**

- Sessions update visual styling when status changes
- Changes propagate instantly across all users viewing the timetable
- Leverages Supabase real-time subscriptions

**5.2 Notification Badge Updates**

- Badge counts update immediately when:
  - New requests created
  - Requests approved/rejected
  - Requests dismissed
- No page refresh required

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
- `dismissRequest(id)` - Updates dismissed flag
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
- `dismissRequest` mutation:
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
  - Invalidate queries
- `handleReject`:
  - Open `RejectionDialog` component
  - Require rejection message
  - Call `rejectRequest()` with message
  - Show success toast
  - Invalidate queries
- `handleDismiss`:
  - Optimistically remove from UI
  - Call `dismissRequest()`
  - Revert on error
- Display request details with resource names

### `PendingRequestsNotification.tsx` (Program Head)

- Use `useMyPendingRequests()` hook
- Display list of user's pending/resolved requests
- Badge colors: green (approved), red (rejected), default (pending)
- "Cancel" button for pending requests
- "Dismiss" button for approved/rejected requests
- Display rejection messages from department heads
- Real-time subscription for updates

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
- If pending request: Session deleted from timetable
- If approved request: Session restored to original position
- Program head sees rejection with message

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

- After approval → Green badge on notifications bell
- After rejection → Red badge on notifications bell
- Click on item → See full details and rejection message
- Click "Dismiss" → Item disappears immediately
- Refresh page → Dismissed items stay gone

**Cancelling Requests:**

- See pending requests in dropdown
- Click "Cancel" → Confirmation dialog
- Confirm → Request deleted, session removed

### Real-Time Testing

- Timetable updates instantly when status changes
- Bell icon badges update without refresh
- Multiple users see changes simultaneously
- Test concurrent approval/rejection
- Test notification delivery delays

### Edge Cases

- Multiple pending sessions in same cell
- Cross-department classroom AND instructor
- Department Head rejecting while Program Head views
- Network errors during multi-step operations
- Missing active semester
- **Resource deletion during pending request** (NEW)
- **Session deletion during pending placement** (NEW)
- **Active semester change during pending placement** (NEW)
- **Duplicate request prevention** (NEW)
- Invalid request IDs
- Permissions: non-owners can't drag pending sessions
- Race condition: moving session while approval happening
- Dismissing already-dismissed requests
- Approving already-approved requests

## Key Design Decisions

### Architecture

1. **Application-Layer Detection**: Cross-department detection in UI layer for better testability
2. **Database-Level Operations**: Approval, rejection, and movement handled by atomic database functions
3. **Non-Blocking Creation**: Sessions and assignments created immediately, marked as pending
4. **Automatic Cleanup**: Database trigger handles notification cleanup on status changes

### User Experience

5. **Visual Distinction**: Multiple indicators for pending state (border, opacity, clock icon)
6. **Confirmation Dialogs**: Explicit user confirmation for actions affecting cross-dept sessions
7. **Enriched Notifications**: Display resource names, not IDs
8. **Optimistic Updates**: Dismissal removes items instantly from UI
9. **Real-Time Synchronization**: Leverage Supabase subscriptions for instant updates

### State Management

10. **Bidirectional Control**: Both requester and reviewer can cancel/dismiss
11. **Restoration Logic**: Rejected approved sessions restored to original position
12. **Cascading Operations**: Deletion/cancellation removes all related records
13. **Backward Compatible**: Default status='confirmed' preserves existing behavior

### Security

14. **SECURITY DEFINER Functions**: Bypass RLS edge cases for consistent behavior
15. **Atomic Operations**: Multi-step operations wrapped in database functions
16. **Validation**: Comprehensive checks (active semester, status, permissions)
17. **Audit Trail**: Track reviewer, timestamps, rejection messages

### Performance

18. **Indexed Status Columns**: Fast queries on pending/confirmed status
19. **Trigger-Based Cleanup**: Automatic notification cleanup without manual queries
20. **Query Invalidation**: Targeted cache invalidation for affected data
21. **Set-Based Tracking**: Use Set data structure for pending session ID lookups

---

## Implementation Status

This feature is **currently implemented** and operational as of 2025-10-29. For detailed implementation history and verification checklists, see:

- `docs/maintenance-log-2025-10-28-approval-fix.md` - Atomic approval operations
- `docs/maintenance-log-2025-10-29-rejection-workflow.md` - Rejection and restoration logic
- `docs/maintenance-log-2025-10-29-request-workflow-complete.md` - Complete workflow implementation

### Edge Case Handling (NEW - 2025-10-30)

**Implemented edge cases:**

1. **Pending Session Highlight Persistence**
   - Orange highlight for pending cross-department sessions persists across page navigation
   - URL parameters (`pendingSessionId`, `resourceType`, `resourceId`, `departmentId`) are primary storage
   - `localStorage` backup automatically restores state if URL params are lost
   - 1-second validation delay prevents false "session not found" errors on fresh redirects
   - Both URL params and localStorage cleared after successful placement and request creation
   - Implementation: Dual-storage system in `TimetablePage.tsx` with restore logic
   - Benefit: Users can navigate away and return without losing workflow progress

2. **Resource Deletion During Pending Request**
   - When an instructor or classroom is deleted, all active requests for that resource are automatically cancelled
   - Department heads receive notification: "Request cancelled - [resource type] was deleted"
   - Implementation: `cancelActiveRequestsForResource()` in `resourceRequestService.ts`
   - Called from `removeInstructor()` and `removeClassroom()` service functions

3. **Session Deletion During Pending Placement**
   - When a class session is deleted from URL pending placement, the URL params are validated and cleared
   - User receives error toast: "Session not found. It may have been deleted"
   - Implementation: URL validation effect in `TimetablePage.tsx`
   - Automatic cleanup of active requests via `cancelActiveRequestsForClassSession()`

4. **Active Semester Change During Pending Placement**
   - Real-time subscription to semester changes clears pending placement state
   - User receives info toast: "Pending placement cleared due to semester change"
   - Implementation: Semester change subscription in `TimetablePage.tsx`
   - Prevents stale placements in wrong semester context

5. **Duplicate Request Prevention**
   - Before creating new request, checks for existing pending/approved requests
   - Returns existing request if found instead of creating duplicate
   - Implementation: Validation check in `createRequest()` in `resourceRequestService.ts`
   - Prevents multiple notifications for same resource

**Test Coverage:**

- Edge case test suite: `src/features/resourceRequests/services/tests/resourceRequestService.edgeCases.test.ts`
- Tests resource deletion, session deletion, duplicate prevention scenarios

### Known Issues and Future Enhancements

1. **Notification Components Integration**
   - `RequestNotifications` and `PendingRequestsNotification` components need to be added to Header
   - Currently implemented but not rendered in the UI

2. **Real-Time Query Invalidation**
   - Add timetable query invalidation after approval/rejection for instant updates
   - Currently requires manual refresh

3. **Concurrent Operations**
   - Add optimistic locking for concurrent approval/rejection attempts
   - Handle race conditions for simultaneous moves

4. **Bulk Operations**
   - Future enhancement: Allow department heads to approve/reject multiple requests at once
   - Not currently in requirements

5. **Audit Trail**
   - Enhanced history tracking for all request state changes
   - Email notifications for request updates

6. **Testing**
   - Add comprehensive E2E tests for full workflow
   - Test concurrent operations and edge cases
   - Verify real-time updates across multiple sessions

---

## C4 Component Diagram

For a detailed component diagram specific to this feature, see:
`docs/c4-diagrams/c3-cross-dept-request-approval.puml`

This diagram shows:

- All UI, hook, service, and database components involved
- Data flow through each layer
- Five key workflows with detailed annotations
- Real-time subscription relationships
- Integration with Supabase database and realtime systems

---
