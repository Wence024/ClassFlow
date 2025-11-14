# Fix: Confirmation Modal for Cross-Department Timetable Moves

## Issue
The confirmation modal was appearing for ALL drag-and-drop operations in the timetable, regardless of whether the session involved cross-department resources or not.

**Expected Behavior:**
The modal should only appear when:
1. Moving a session with `'confirmed'` status AND
2. The session uses resources (instructor OR classroom) from a DIFFERENT department than the user's department

**Observed Behavior:**
The modal appeared for all drag-and-drop operations, including same-department resources and pending sessions.

## Root Cause
There was a **data type mismatch** in the cross-department resource check in `useTimetableDnd.ts`.

The code was comparing:
- `instructor.department_id` (a department UUID) with `user?.program_id` (a program UUID)
- `classroom.preferred_department_id` (a department UUID) with `user?.program_id` (a program UUID)

**Why this was wrong:**
- Programs belong to departments (programs have a `department_id` field)
- A program UUID is not the same as a department UUID
- For example: Program "BS Computer Science" has ID `f27d50d9-...` but belongs to department "College of Engineering" with ID `ce65053a-...`

This meant `hasCrossDeptResource` evaluated to `true` for ANY session with an instructor or classroom that had a department set, even if they were in the same department as the user.

## Solution
Use the `useDepartmentId()` hook to get the user's department ID (which handles both department heads and program heads correctly), then compare resource department IDs against the user's department ID.

### Files Modified

#### 1. `src/features/timetabling/hooks/useTimetableDnd.ts`
- Added `userDepartmentId: string | null` parameter to the hook signature
- Updated `needsReapproval()` function to accept `userDepartmentId` instead of `user`
- Changed comparisons in `needsReapproval()` (lines 113-118) to use `userDepartmentId` instead of `user?.program_id`
- Updated `handleDropToDrawer()` (lines 461-465) to use `userDepartmentId` instead of `user?.program_id`
- Updated JSDoc to document the new parameter

#### 2. `src/features/timetabling/pages/TimetablePage.tsx`
- The `useDepartmentId()` hook was already being called (line 44)
- Updated the `useTimetableDnd()` hook call to pass `userDepartmentId` as the third parameter

## Before vs After

### Before (Incorrect)
```typescript
const hasCrossDeptResource = Boolean(
  (classSessionToDrop.instructor.department_id &&
    classSessionToDrop.instructor.department_id !== user?.program_id) ||  // ❌ Comparing dept UUID to program UUID
  (classSessionToDrop.classroom.preferred_department_id &&
    classSessionToDrop.classroom.preferred_department_id !== user?.program_id) // ❌ Wrong comparison
);
```

### After (Correct)
```typescript
const hasCrossDeptResource = Boolean(
  (classSessionToDrop.instructor.department_id &&
    classSessionToDrop.instructor.department_id !== userDepartmentId) ||  // ✅ Comparing dept UUID to dept UUID
  (classSessionToDrop.classroom.preferred_department_id &&
    classSessionToDrop.classroom.preferred_department_id !== userDepartmentId) // ✅ Correct comparison
);
```

## Testing
After this fix:

✅ **Dragging a session with same-department resources**: No confirmation modal  
✅ **Dragging a session with cross-department resources that is pending**: No confirmation modal  
✅ **Dragging a session with cross-department resources that is confirmed**: Confirmation modal appears ✓  
✅ **Dragging from drawer**: No confirmation modal for placement  
✅ **Dropping to drawer with cross-dept resources**: Confirmation modal appears for canceling requests

## Related Files
- `src/features/auth/hooks/useDepartmentId.ts` - Provides correct department ID for both program heads and department heads
- `src/features/timetabling/hooks/tests/useTimetableDnd.confirmation.test.tsx` - Test coverage for confirmation logic
- `src/features/resourceRequests/workflows/tests/moveConfirmedSession.integration.test.tsx` - Integration tests

## Date
2025-11-14
