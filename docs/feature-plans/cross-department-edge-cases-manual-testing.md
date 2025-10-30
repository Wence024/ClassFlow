# Cross-Department Request Edge Cases - Manual Testing Guide

This document provides step-by-step manual testing procedures for edge cases in the cross-department resource request approval system.

## Prerequisites

- Two user accounts: Program Head (PH) and Department Head (DH)
- Active semester configured
- Test data: instructors and classrooms from different departments

---

## Test Case 1: Resource Deletion During Pending Request

**Scenario:** An instructor is deleted while a request for that instructor is pending approval.

### Setup
1. As PH, create a class session with cross-department instructor
2. Place session on timetable (creates pending request)
3. Verify DH sees notification for the request

### Test Steps
1. As Admin, navigate to Components > Instructors
2. Delete the instructor that has the pending request
3. Verify deletion succeeds without errors
4. As DH, check notifications panel
   - **Expected:** Notification shows "Request cancelled - instructor was deleted"
   - **Expected:** Request status is no longer "pending"

### Cleanup
- Remove test session from timetable if still present

---

## Test Case 2: Classroom Deletion During Pending Request

**Scenario:** A classroom is deleted while a request for that classroom is pending approval.

### Setup
1. As PH, create a class session with cross-department classroom
2. Place session on timetable (creates pending request)
3. Verify DH sees notification for the request

### Test Steps
1. As Admin, navigate to Components > Classrooms
2. Delete the classroom that has the pending request
3. Verify deletion succeeds without errors
4. As DH, check notifications panel
   - **Expected:** Notification shows "Request cancelled - classroom was deleted"
   - **Expected:** Request status is no longer "pending"

### Cleanup
- Remove test session from timetable if still present

---

## Test Case 3: Session Deletion During Pending Placement

**Scenario:** A class session is deleted while it's in pending placement state (highlighted in drawer).

### Setup
1. As PH, create a class session with cross-department resource
2. Note the session ID from the success toast
3. Verify you're redirected to timetable with highlighted session in drawer
4. **Do not drag the session yet** - keep it highlighted

### Test Steps
1. Open a new tab/window with the same account
2. Navigate to Components > Classes
3. Delete the highlighted class session
4. Return to the timetable tab
5. Try to refresh the page
   - **Expected:** URL params are cleared automatically
   - **Expected:** Error toast appears: "Session not found. It may have been deleted"
   - **Expected:** Session no longer appears in drawer
   - **Expected:** Highlight/pulsing effect is removed

### Edge Case Variant
1. Without refreshing, try to drag the (now-deleted) session
   - **Expected:** Drag should fail gracefully or session should not be draggable

---

## Test Case 4: Active Semester Change During Pending Placement

**Scenario:** The active semester is changed while a session is in pending placement.

### Setup
1. As Admin, ensure you have two semesters configured
2. Note which semester is currently active
3. As PH, create a class session with cross-department resource
4. Verify session is highlighted in timetable drawer

### Test Steps
1. Keep the timetable page open with highlighted session
2. Open a new tab as Admin
3. Navigate to Schedule Configuration
4. Change the active semester to the other semester
5. Return to the timetable tab (do not refresh)
   - **Expected:** URL params are automatically cleared
   - **Expected:** Info toast appears: "Pending placement cleared due to semester change"
   - **Expected:** Session highlight/pulsing effect is removed
   - **Expected:** Page still functional, no errors

### Cleanup
- Return active semester to original configuration
- Delete test session

---

## Test Case 5: Duplicate Request Prevention

**Scenario:** Attempting to create multiple requests for the same class session.

### Setup
1. As PH, create a class session with cross-department resource
2. Place session on timetable (creates request #1)
3. Verify DH sees the notification

### Test Steps
1. As PH, remove the session back to drawer (drag to drawer area)
   - **Expected:** Confirmation dialog appears
   - **Expected:** On confirm, request is cancelled
2. Place the same session back on timetable again
   - **Expected:** New request is created successfully
3. Remove and re-add the session multiple times rapidly
   - **Expected:** No duplicate notifications for DH
   - **Expected:** Only one active request exists per session
4. As DH, verify notification panel
   - **Expected:** Only sees one pending request (not multiple)

### Edge Case Variant: Concurrent Placement Attempts
1. As PH, open two browser tabs with same account
2. In both tabs, navigate to timetable
3. Drag the same session from drawer to timetable in both tabs simultaneously
   - **Expected:** First placement succeeds
   - **Expected:** Second placement returns existing request
   - **Expected:** No duplicate notifications created

---

## Test Case 6: Resource Deletion After Approval

**Scenario:** Resource is deleted after request is approved but before program head places another session.

### Setup
1. As PH, create and place cross-dept session
2. As DH, approve the request
3. Verify session shows as confirmed (solid border)

### Test Steps
1. As Admin, delete the approved instructor/classroom
2. Verify deletion succeeds
3. As PH, check timetable
   - **Expected:** Session remains on timetable (already confirmed)
   - **Note:** This is intentional - confirmed sessions are not retroactively affected
4. As PH, try to create a new session with the deleted resource
   - **Expected:** Resource no longer appears in dropdown

---

## Test Case 7: Session Deletion via URL Parameter Tampering

**Scenario:** User manually edits URL to reference non-existent session.

### Setup
1. As PH, create and place a cross-dept session normally
2. Note the URL format with pendingSessionId parameter

### Test Steps
1. Manually edit the URL to use a fake session ID:
   ```
   /scheduler?pendingSessionId=00000000-0000-0000-0000-000000000000&resourceType=instructor&resourceId=real-id&departmentId=real-dept-id
   ```
2. Navigate to the edited URL
   - **Expected:** URL params are validated and cleared
   - **Expected:** Error toast: "Session not found. It may have been deleted"
   - **Expected:** No highlight in drawer
   - **Expected:** Page loads normally without crashes

### Edge Case Variant: Invalid Resource IDs
1. Use a valid session ID but invalid resource IDs
   - **Expected:** Similar validation and error handling
   - **Expected:** Graceful degradation

---

## Test Case 8: Semester Change Immediately After Placement

**Scenario:** Semester changes right after session placement but before request approval.

### Setup
1. As PH, create cross-dept session and place on timetable
2. Verify request is pending
3. As DH, do not approve yet

### Test Steps
1. As Admin, change the active semester
2. As DH, try to approve the old request
   - **Expected:** Approval should fail with error about missing active semester
   - **Expected:** Error message references semester validation
3. As PH, check timetable
   - **Expected:** Session from old semester not visible in new semester
   - **Expected:** If timetable page was open, pending placement was cleared

---

## Test Results Template

For each test case, document results using this format:

```
## Test Case [Number]: [Title]
- Date Tested: YYYY-MM-DD
- Tester: [Name]
- Result: ✅ PASS / ❌ FAIL
- Notes:
  - [Any observations]
  - [Unexpected behavior]
  - [Performance issues]
- Screenshots: [Attach if failures]
```

---

## Success Criteria

All test cases must:
1. Complete without unhandled errors
2. Display appropriate user-facing messages
3. Maintain data consistency
4. Handle edge cases gracefully
5. Prevent duplicate data/requests
6. Clean up stale state automatically

---

## Regression Testing Checklist

After fixing edge case issues, verify these still work:

- [ ] Normal cross-dept request creation
- [ ] Normal approval workflow
- [ ] Normal rejection workflow  
- [ ] Session movement with re-approval
- [ ] Session removal with cancellation
- [ ] Real-time notifications update correctly
- [ ] Pending session visual styling
- [ ] Confirmed session visual styling
