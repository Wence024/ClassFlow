# **Updated Cross-Department Resource Approval System - Department Head Workflow Focus**

## Current State Analysis

### ✅ **Completed Components**

1. **Database Layer** (Phase 1)
   - ✅ `status` column added to `timetable_assignments` with 'pending'/'confirmed' values
   - ✅ `is_cross_department_resource()` function created and working
   - ✅ `resource_requests` table with proper structure
   - ✅ `request_notifications` table created

2. **Service Layer** (Phase 2)
   - ✅ `resourceRequestService.ts` with CRUD operations
   - ✅ `notificationsService.ts` for managing notifications
   - ✅ `getRequestWithDetails()` enriches requests with resource names
   - ✅ Cross-department detection in `checkCrossDepartmentResources()`

3. **Hook Layer** (Phase 3)
   - ✅ `useResourceRequests()` for Program Heads
   - ✅ `useDepartmentRequests()` for Department Heads
   - ✅ `useMyPendingRequests()` for Program Head cancellation
   - ✅ `useRequestNotifications()` (exists but not fully wired)

4. **UI Layer - Program Head Side** (Phase 4)
   - ✅ `ClassSessionsPage.tsx` with cross-department modal
   - ✅ `PendingRequestsNotification.tsx` component (clock icon)
   - ✅ Cross-department request submission workflow
   - ✅ Pending session visual indicators in `SessionCell.tsx`
   - ✅ `pendingSessionIds` calculated and passed via context

5. **UI Layer - Department Head Side** (Phase 4)
   - ✅ `RequestNotifications.tsx` component (bell icon)
   - ✅ Enriched request details display
   - ✅ Approve/Reject handlers implemented
   - ✅ Query invalidation for real-time updates

---

## 🔴 **Critical Issues Requiring Immediate Fix**

### **Priority 1: Missing RLS Policy for Notification Creation**

**Problem:** The `request_notifications` table has SELECT and UPDATE policies for department heads, but **no INSERT policy**. This causes the RLS violation error when Program Heads try to create requests.

**Current Policies:**

```sql
-- ✅ Exists
CREATE POLICY "request_notifications_select_department" 
  ON "public"."request_notifications" FOR SELECT ...

-- ✅ Exists  
CREATE POLICY "request_notifications_update_department" 
  ON "public"."request_notifications" FOR UPDATE ...

-- ❌ MISSING
-- No INSERT policy exists!
```

**Solution:** Add INSERT policy allowing requesters to create notifications:

```sql
CREATE POLICY "request_notifications_insert_requester" 
  ON "public"."request_notifications" 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    -- Allow if the user is the requester of the associated request
    EXISTS (
      SELECT 1 
      FROM resource_requests 
      WHERE resource_requests.id = request_notifications.request_id
        AND resource_requests.requester_id = auth.uid()
    )
    OR has_role(auth.uid(), 'admin')
  );
```

**Impact:** This will fix Test 3, Step 6 (the RLS error in console).

---

### **Priority 2: Missing DELETE Policy for Request Cancellation**

**Problem:** The `resource_requests` table has no DELETE policy, preventing Program Heads from canceling their own pending requests.

**Current Policies:**

```sql
-- ✅ Exists
CREATE POLICY "resource_requests_insert_own" ...
CREATE POLICY "resource_requests_select_own" ...
CREATE POLICY "resource_requests_update_reviewers" ...

-- ❌ MISSING
-- No DELETE policy exists!
```

**Solution:** Add DELETE policy for requesters:

```sql
CREATE POLICY "resource_requests_delete_own" 
  ON "public"."resource_requests" 
  FOR DELETE 
  TO authenticated
  USING (
    requester_id = auth.uid()
    OR has_role(auth.uid(), 'admin')
  );
```

**Impact:** This will enable Test 6 (Program Head cancellation).

---

### **Priority 3: Missing DELETE Policy for Notifications**

**Problem:** When requests are canceled/rejected, the associated notifications should also be deleted. Currently, no DELETE policy exists.

**Solution:** Add DELETE policy for department heads and system cleanup:

```sql
CREATE POLICY "request_notifications_delete" 
  ON "public"."request_notifications" 
  FOR DELETE 
  TO authenticated
  USING (
    -- Department heads can delete notifications for their department
    target_department_id = (
      SELECT department_id 
      FROM profiles 
      WHERE id = auth.uid()
    )
    AND has_role(auth.uid(), 'department_head')
    -- Or admins can delete anything
    OR has_role(auth.uid(), 'admin')
    -- Or requesters can delete their own notifications (for cleanup)
    OR EXISTS (
      SELECT 1 
      FROM resource_requests 
      WHERE resource_requests.id = request_notifications.request_id
        AND resource_requests.requester_id = auth.uid()
    )
  );
```

---

### **Priority 4: Department Head SELECT Policy for Resource Requests**

**Problem:** Department Heads can't see pending requests targeted at their department. The current SELECT policy only allows requesters to see their own requests.

**Current Policy:**

```sql
CREATE POLICY "resource_requests_select_own" 
  ON "public"."resource_requests" 
  FOR SELECT 
  TO authenticated 
  USING (requester_id = auth.uid());
```

**Solution:** Expand SELECT policy to include department heads:

```sql
-- First, DROP the existing restrictive policy
DROP POLICY IF EXISTS "resource_requests_select_own" 
  ON "public"."resource_requests";

-- Create new policy with both requester and reviewer access
CREATE POLICY "resource_requests_select_access" 
  ON "public"."resource_requests" 
  FOR SELECT 
  TO authenticated 
  USING (
    -- Requesters can see their own requests
    requester_id = auth.uid()
    -- Department heads can see requests for their department
    OR (
      has_role(auth.uid(), 'department_head')
      AND target_department_id = (
        SELECT department_id 
        FROM profiles 
        WHERE id = auth.uid()
      )
    )
    -- Admins can see everything
    OR has_role(auth.uid(), 'admin')
  );
```

**Impact:** This will fix Test 5, Step 3 (bell icon showing pending requests).

---

## 📋 **Recommended Implementation Order**

### **Step 1: Database Migration (CRITICAL)**

Create a new migration file: `docs/postgresql_schema/251023_fix_request_rls_policies.sql`

```sql
-- Fix 1: Add INSERT policy for request_notifications
CREATE POLICY "request_notifications_insert_requester" 
  ON "public"."request_notifications" 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM resource_requests 
      WHERE resource_requests.id = request_notifications.request_id
        AND resource_requests.requester_id = auth.uid()
    )
    OR has_role(auth.uid(), 'admin')
  );

-- Fix 2: Expand SELECT policy for resource_requests
DROP POLICY IF EXISTS "resource_requests_select_own" 
  ON "public"."resource_requests";

CREATE POLICY "resource_requests_select_access" 
  ON "public"."resource_requests" 
  FOR SELECT 
  TO authenticated 
  USING (
    requester_id = auth.uid()
    OR (
      has_role(auth.uid(), 'department_head')
      AND target_department_id = (
        SELECT department_id 
        FROM profiles 
        WHERE id = auth.uid()
      )
    )
    OR has_role(auth.uid(), 'admin')
  );

-- Fix 3: Add DELETE policy for resource_requests
CREATE POLICY "resource_requests_delete_own" 
  ON "public"."resource_requests" 
  FOR DELETE 
  TO authenticated
  USING (
    requester_id = auth.uid()
    OR has_role(auth.uid(), 'admin')
  );

-- Fix 4: Add DELETE policy for request_notifications
CREATE POLICY "request_notifications_delete" 
  ON "public"."request_notifications" 
  FOR DELETE 
  TO authenticated
  USING (
    target_department_id = (
      SELECT department_id 
      FROM profiles 
      WHERE id = auth.uid()
    )
    AND has_role(auth.uid(), 'department_head')
    OR has_role(auth.uid(), 'admin')
    OR EXISTS (
      SELECT 1 
      FROM resource_requests 
      WHERE resource_requests.id = request_notifications.request_id
        AND resource_requests.requester_id = auth.uid()
    )
  );
```

---

### **Step 2: Service Layer Enhancement (OPTIONAL)**

**File:** `src/features/resourceRequests/services/notificationsService.ts`

Add a delete function for cleanup:

```typescript
/**
 * Deletes a notification (for cleanup after approval/rejection).
 *
 * @param id - The ID of the notification to delete.
 * @returns A promise that resolves when the operation is complete.
 */
export async function deleteNotification(id: string): Promise {
  const { error } = await supabase
    .from('request_notifications')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
```

---

### **Step 3: UI Enhancement - Automatic Notification Cleanup**

**File:** `src/components/RequestNotifications.tsx`

Update handlers to automatically delete notifications after approval/rejection:

```typescript
const handleApprove = async (requestId: string, classSessionId: string, notificationId: string) => {
  setApprovingId(requestId);
  try {
    // ... existing approval logic ...

    // Delete the notification after successful approval
    const { error: notifError } = await supabase
      .from('request_notifications')
      .delete()
      .eq('id', notificationId);

    if (notifError) console.warn('Failed to delete notification:', notifError);

    toast.success('Request approved successfully');
  } catch (error) {
    // ... existing error handling ...
  } finally {
    setApprovingId(null);
  }
};

const handleReject = async (requestId: string, classSessionId: string, notificationId: string) => {
  setRejectingId(requestId);
  try {
    // ... existing rejection logic ...

    // Delete the notification after successful rejection
    const { error: notifError } = await supabase
      .from('request_notifications')
      .delete()
      .eq('id', notificationId);

    if (notifError) console.warn('Failed to delete notification:', notifError);

    toast.success('Request rejected successfully');
  } catch (error) {
    // ... existing error handling ...
  } finally {
    setRejectingId(null);
  }
};
```

Update the render to pass notification ID:

```typescript
 handleApprove(request.id, request.class_session_id, request.id)}
  // ... existing props ...
>
  Approve

 handleReject(request.id, request.class_session_id, request.id)}
  // ... existing props ...
>
  Reject

```

**Note:** Since notifications are fetched via JOIN with requests, the `request.id` in the enriched data is actually the notification ID. Need to verify this mapping.

---

### **Step 4: UI Enhancement - Real-Time Subscription**

**File:** `src/components/RequestNotifications.tsx`

Add real-time subscription for instant updates:

```typescript
useEffect(() => {
  if (!departmentId) return;

  const channel = supabase
    .channel('request-notifications-realtime')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'request_notifications',
        filter: `target_department_id=eq.${departmentId}`,
      },
      () => {
        // Invalidate queries when notifications change
        queryClient.invalidateQueries({ queryKey: ['resource_requests', 'dept', departmentId] });
        queryClient.invalidateQueries({ queryKey: ['enriched_requests'] });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [departmentId, queryClient]);
```

---

### **Step 5: UI Enhancement - Pending Request Real-Time Updates**

**File:** `src/components/PendingRequestsNotification.tsx`

Add subscription for Program Head's pending requests:

```typescript
useEffect(() => {
  if (!user?.id) return;

  const channel = supabase
    .channel('my-pending-requests-realtime')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'resource_requests',
        filter: `requester_id=eq.${user.id}`,
      },
      () => {
        queryClient.invalidateQueries({ queryKey: ['my_pending_requests', user.id] });
        queryClient.invalidateQueries({ queryKey: ['my_enriched_requests'] });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [user?.id, queryClient]);
```

---

## 📊 **Updated Testing Checklist**

### **Test 3: Cross-Department Request Submission** (Should PASS after Step 1)

- ✅ Modal appears with department name
- ✅ Request created without RLS error
- ✅ Notification created successfully
- ✅ Timetable updates instantly (already working via existing subscription)

### **Test 4: Visual Styling** (Already PASSING)

- ✅ Pending sessions show dashed border, opacity 0.7, clock icon
- ✅ Dragging disabled for pending sessions

### **Test 5: Department Head Approval/Rejection** (Should PASS after Steps 1-4)

- ✅ Bell icon shows badge count
- ✅ Click bell reveals pending requests with resource names
- ✅ Approve updates status to 'confirmed'
- ✅ Session styling updates to normal immediately
- ✅ Notification disappears from list

### **Test 6: Program Head Cancellation** (Should PASS after Steps 1-2)

- ✅ Clock icon shows badge count
- ✅ Click clock reveals own pending requests
- ✅ Cancel deletes session, assignment, and request
- ✅ Notification cleared from department head's bell

---

## 🎯 **Key Benefits of This Plan**

1. **Minimal Code Changes:** Focuses on database-level RLS policies (most critical issue)
2. **Security-First:** Ensures proper access control at the database level
3. **Real-Time Ready:** Existing subscriptions will work once RLS is fixed
4. **Backward Compatible:** All existing features continue to work
5. **Incremental:** Can be implemented step-by-step with immediate testing

---

## 🚨 **Critical Dependencies**

Before implementing UI enhancements (Steps 3-5), **Step 1 (Database Migration) MUST be completed first**. Without fixing the RLS policies, the following will fail:

- ❌ Creating notifications (INSERT blocked)
- ❌ Department heads viewing requests (SELECT blocked)
- ❌ Program heads canceling requests (DELETE blocked)
- ❌ Cleaning up notifications (DELETE blocked)

---

## 📝 **Documentation Updates Needed**

1. Update `docs/feature-plans/cross-department-request-approval.md` with:
   - Mark database RLS fixes as completed
   - Update test checklist with actual results
   - Document the RLS policy patterns for future reference

2. Create `docs/rls-patterns.md` documenting:
   - Pattern for request/notification workflows
   - When to use SECURITY DEFINER functions
   - How to handle cross-table access checks

3. Update architecture diagrams showing:
   - Request approval flow
   - Notification lifecycle
   - RLS policy boundaries

Based on my examination of the codebase, I've identified the core issue preventing the Department Head workflow from functioning properly: **missing RLS policies on the `request_notifications` and `resource_requests` tables**.

The good news is that most of the implementation is actually complete! The UI components, services, and hooks are all in place. The critical blocker is at the database security layer.

**Key Findings:**

1. **RLS Policy Gap (CRITICAL):** The `request_notifications` table only has SELECT and UPDATE policies, but no INSERT policy. This is causing the "42501 - new row violates row-level security" error you saw in Test 3.

2. **Department Head Access Blocked:** The `resource_requests` table's SELECT policy only allows requesters to see their own requests. Department Heads can't see requests targeted at their department.

3. **Missing DELETE Policies:** Neither table has DELETE policies, which prevents:
   - Program Heads from canceling their requests
   - System cleanup of notifications after approval/rejection

4. **Visual Indicators Working:** The pending session styling with dashed borders, opacity, and clock icons is already implemented correctly via `pendingSessionIds` in `useTimetable`.

The plan I've provided focuses on **Step 1 (Database Migration)** as the highest priority, since without fixing these RLS policies, the entire Department Head workflow will remain blocked. Once that's done, the existing UI components should work immediately.

Would you like me to proceed with implementing this plan, starting with the database migration?

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
6. [x] Check browser console for errors
7. [x] Query database: `SELECT * FROM resource_requests WHERE status='pending';`
8. [x] Verify request was created
9. [x] Update instantly when the class session with foreign instructor is created, instead of having to switch tabs.

- doesn't apply to classrooms yet.

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
5. [x] Verify: Session removed from timetable, request deleted from database

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
