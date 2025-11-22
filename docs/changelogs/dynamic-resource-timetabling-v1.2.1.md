# Changelog: Dynamic Resource Timetabling v1.2.1

**Date**: 2025-11-22  
**Type**: Hotfix  
**Impact**: Critical Bug Fix

## Overview

Fixed a critical bug in same-period resource reassignment where sessions would disappear back to the drawer after attempting to move them to a different resource at the same time slot.

## Root Cause

In `src/lib/services/timetableService.ts`, the `moveSessionWithResourceChange` function was:
1. Correctly updating the resource (classroom or instructor)
2. Then calling `moveClassSession` with the SAME source and destination slot
3. This caused `moveClassSession` to:
   - Upsert to the same cell (no-op)
   - Delete from the same cell (removes the assignment!)
4. Result: Session removed from timetable and moved back to drawer

## The Fix

**File**: `src/lib/services/timetableService.ts`

Added a check to skip the `moveClassSession` call when the time slot isn't actually changing:

```typescript
export async function moveSessionWithResourceChange(
  from: { class_group_id: string; period_index: number; semester_id: string },
  to: { class_group_id: string; period_index: number; semester_id: string },
  class_session_id: string,
  user_id: string,
  resourceType: 'instructor' | 'classroom',
  newResourceId: string,
  status: 'pending' | 'confirmed' = 'confirmed'
): Promise<void> {
  const { reassignSessionResource } = await import('./classSessionService');

  // First, reassign the resource
  await reassignSessionResource(class_session_id, resourceType, newResourceId);

  // Only move the timetable assignment if the time slot is actually changing
  const isSameSlot = 
    from.class_group_id === to.class_group_id && 
    from.period_index === to.period_index &&
    from.semester_id === to.semester_id;

  if (!isSameSlot) {
    // Move the session to new time slot
    await moveClassSession(from, to, class_session_id, user_id, status);
  }
}
```

## Testing Scenarios

### Before Fix (BROKEN)
1. Place session in Classroom A at Period 5
2. Drag to Classroom B at Period 5 (same period)
3. Confirm the resource change
4. ❌ Session disappears and moves back to drawer

### After Fix (WORKING)
1. Place session in Classroom A at Period 5
2. Drag to Classroom B at Period 5 (same period)
3. Confirm the resource change
4. ✅ Session stays at Period 5 with Classroom B assigned

## Impact

- **Severity**: Critical
- **Affected Features**: 
  - Same-period classroom reassignment
  - Same-period instructor reassignment
- **User Experience**: Previously broken workflow now works as expected

## Related Documentation

- [Dynamic Resource Timetabling Feature Plan](../features/dynamic-resource-timetabling.md)
- [v1.2.0 Changelog](./dynamic-resource-timetabling-v1.2.md)
- [v1.1.0 Changelog](./dynamic-resource-timetabling-v1.1.md)
