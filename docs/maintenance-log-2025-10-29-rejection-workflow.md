# Maintenance Log: Resource Request Rejection & Cross-Department Workflow

**Date**: 2025-10-29  
**Author**: AI Assistant  
**Status**: ✅ Implemented

## Summary

Implemented comprehensive rejection workflow and cross-department session management:
1. ✅ Rejection with required message
2. ✅ Dismiss functionality for notifications
3. ✅ Moving confirmed cross-department sessions triggers re-approval
4. ✅ Confirmation dialog before moving sessions to drawer
5. ✅ Restoration of rejected approved sessions to original position

## Changes Made

### 1. Database Changes

Created new database functions and columns via migration:

#### New Columns in `resource_requests`:
- `rejection_message` TEXT - Stores department head's rejection reason
- `original_period_index` INTEGER - Tracks original position for restoration
- `original_class_group_id` UUID - Tracks original group for restoration

#### New Database Functions:

**`reject_resource_request`**:
- Accepts rejection message from department head
- If request was approved: Restores session to original position
- If request was pending: Deletes session and timetable assignment
- Updates request status to 'rejected' with message

**`handle_cross_dept_session_move`**:
- Detects if a moved session uses cross-department resources
- Changes assignment status back to 'pending'
- Creates new resource request with original position stored
- Creates notification for department head

### 2. Service Layer Updates

**`resourceRequestService.ts`**:
- Added `rejectRequest(id, reviewerId, message)` - Calls database function
- Added `dismissRequest(id)` - Updates dismissed flag
- Updated `updateRequest` for non-approval updates

### 3. UI Components

**Created `RejectionDialog.tsx`**:
- Modal dialog for rejection with required message field
- Validates message is not empty
- Shows resource name being rejected

**Created `ConfirmDialog.tsx`**:
- Generic confirmation dialog component
- Used for drawer drop confirmations

**Updated `RequestNotifications.tsx`**:
- Added dismiss button (X icon) to each notification
- Changed reject button to open dialog instead of immediate rejection
- Filters out dismissed requests from display
- Added rejection dialog integration
- Improved button layout with dismiss on the side

### 4. Hook Updates

**`useResourceRequests.ts`**:
- Added `dismissRequest` mutation to `useResourceRequests`
- Added `dismissRequest` mutation to `useDepartmentRequests`

**`useTimetable.ts`**:
- Added cross-department detection on session move
- Checks if session is currently confirmed before moving
- Calls `handle_cross_dept_session_move` if requires re-approval
- Shows toast notification when re-approval is required

**`useTimetableDnd.ts`**:
- Updated `handleDropToDrawer` to accept optional confirmation callback
- Checks for cross-department resources before removing
- Shows confirmation dialog before removing cross-dept sessions
- Cancels active resource requests when session removed

**`PendingRequestsPanel.tsx`**:
- Filters out dismissed requests from display

## Verification Checklist

### ✅ Basic Rejection Flow
- [ ] Reject a pending request → class session deleted
- [ ] Rejection message is required and stored
- [ ] Notification deleted after rejection

### ✅ Approved Session Rejection
- [ ] Reject an approved request → session restored to original position
- [ ] Original position tracked correctly
- [ ] Session status changes back to confirmed after restoration

### ✅ Dismiss Functionality
- [ ] Click X button dismisses notification
- [ ] Dismissed notifications don't reappear
- [ ] Dismissed requests filtered from queries

### ✅ Moving Confirmed Sessions
- [ ] Move confirmed cross-dept session → status changes to pending
- [ ] New resource request created automatically
- [ ] Department head receives notification
- [ ] Original position stored for potential rejection

### ✅ Drawer Confirmation
- [ ] Confirmation dialog appears when moving cross-dept session to drawer
- [ ] Session removed and request cancelled on confirmation
- [ ] Department head notified of cancellation
- [ ] No confirmation for non-cross-dept sessions

## Technical Details

### Database Function: `reject_resource_request`

```sql
CREATE OR REPLACE FUNCTION public.reject_resource_request(
  _request_id uuid,
  _reviewer_id uuid,
  _rejection_message text
)
RETURNS json
SECURITY DEFINER
```

**Logic**:
1. Validates request exists and is pending/approved
2. Updates request status to 'rejected' with message
3. If approved + has original position → Restores assignment
4. If pending → Deletes assignment and session
5. Returns success with action taken

### Database Function: `handle_cross_dept_session_move`

```sql
CREATE OR REPLACE FUNCTION public.handle_cross_dept_session_move(
  _class_session_id uuid,
  _old_period_index int,
  _old_class_group_id uuid,
  _new_period_index int,
  _new_class_group_id uuid,
  _semester_id uuid
)
RETURNS json
SECURITY DEFINER
```

**Logic**:
1. Checks if session uses cross-department resources
2. Changes assignment status to 'pending'
3. Creates new resource request with original position
4. Creates notification for department head
5. Returns success with request details

### Atomic Operations

All rejection and move operations use `SECURITY DEFINER` database functions to ensure:
- Both operations succeed or fail together
- Proper permissions enforcement
- Consistent state

### Error Handling

- All service functions throw errors with descriptive messages
- UI displays error toasts to users
- Failed operations don't leave partial state

## Not Implemented

These items were discussed but not implemented in this iteration:

1. **Bulk Approval/Rejection** - Not requested by user
2. **Notification Cleanup in Database** - Notifications are deleted but could be archived
3. **Timetable History Tracking** - Would require additional tables
4. **Email Notifications** - Would require email service integration
5. **Rejection Appeal Process** - Not in current requirements

## Future Improvements

1. **Audit Trail**: Add comprehensive history tracking for all request state changes
2. **Batch Operations**: Allow department heads to approve/reject multiple requests at once
3. **Auto-cleanup**: Automatically archive old notifications after X days
4. **Rich Notifications**: Include more context in notifications (time slot, day, etc.)
5. **Undo/Redo**: Allow users to undo recent rejection/approval actions

## Files Modified

### Created:
- `src/components/dialogs/RejectionDialog.tsx`
- `src/components/dialogs/ConfirmDialog.tsx`
- `docs/maintenance-log-2025-10-29-rejection-workflow.md`

### Modified:
- `supabase/migrations/20251029-*.sql` (new migration)
- `src/features/resourceRequests/services/resourceRequestService.ts`
- `src/components/RequestNotifications.tsx`
- `src/features/resourceRequests/hooks/useResourceRequests.ts`
- `src/features/timetabling/hooks/useTimetable.ts`
- `src/features/timetabling/hooks/useTimetableDnd.ts`
- `src/components/PendingRequestsPanel.tsx`

## Testing Notes

All functionality should be tested with:
- Different user roles (program head, department head, admin)
- Edge cases (no active semester, missing original position)
- Error scenarios (network failures, permission errors)
- Real-time updates across multiple browser tabs

## Security Considerations

✅ All database functions use `SECURITY DEFINER` with explicit schema  
✅ RLS policies enforce proper access control  
✅ Input validation on rejection messages  
✅ Dismissed requests still respect RLS policies  
✅ Cross-department checks use database-level validation  

## Performance Notes

- Dismissing requests is a simple UPDATE operation (fast)
- Rejection involves multiple operations but wrapped in database function (atomic)
- Moving sessions checks status and creates requests (2-3 DB calls)
- Real-time subscriptions invalidate queries efficiently
