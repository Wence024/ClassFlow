# Dynamic Resource Timetabling v1.2

**Release Date**: 2025-01-XX

## Summary

Fixed critical resource reassignment issues that prevented proper classroom and instructor changes during drag-and-drop operations.

---

## Bug Fixes

### Issue #1: Same-Period Resource Reassignment Not Working

**Problem**: Moving a session to a different classroom/instructor row at the same period would fail silently without updating the resource.

**Impact**: 
- Program heads couldn't reassign classrooms/instructors at the same time slot
- Workaround required changing the time slot first, then changing the resource

**Root Cause**: 
The `isSameCell` check in `executeDropMutation` incorrectly evaluated same-period, different-resource drops as "no change needed" and returned early.

**Fix**: 
Updated the `isSameCell` logic to check if a resource change is occurring:
```typescript
const isSameCell =
  viewMode === 'class-group'
    ? source.class_group_id === dbTargetGroupId && source.period_index === targetPeriodIndex
    : source.class_group_id === dbTargetGroupId && 
      source.period_index === targetPeriodIndex &&
      !resourceChangeMetadata?.isChanging; // Now allows resource change at same period
```

**Files Changed**:
- `src/features/program-head/schedule-class-session/hooks/useTimetableDnd.ts`

---

### Issue #2: Drawer-to-Timetable Restricted to Pre-Assigned Resource

**Problem**: Sessions with pre-assigned classrooms/instructors could only be dropped into their originally assigned resource's row. Alternative resource rows showed no availability indicators.

**Impact**:
- Limited flexibility when reassigning resources
- Confusing UX - users expected to see all available slots
- Required deleting and recreating sessions to change resources

**Root Cause**: 
The `isViewModeCompliant` function for `classroom` and `instructor` views was checking if the target row matched the session's current resource, blocking drops to other resources.

**Fix**: 
Changed resource view logic to always allow drops from drawer, relying on conflict checking and confirmation flows:
```typescript
case 'classroom':
case 'instructor':
  // Always allow drops from drawer (conflicts checked separately)
  // Resource assignment/reassignment will trigger confirmation when needed
  return true;
```

**Files Changed**:
- `src/features/program-head/schedule-class-session/hooks/useTimetableDnd.ts`

---

## Improvements

### Enhanced Diagnostic Logging

Added comprehensive `console.debug` logging throughout the drag-and-drop flow:
- `getResourceChangeInfo`: Logs detected resource changes
- `needsConfirmation`: Logs confirmation type determination
- `executeDropMutation`: Logs `isSameCell` evaluation with all relevant parameters

**Benefit**: Easier debugging of future drag-and-drop issues

---

## Testing

### Manual Testing Checklist

**Same-Period Classroom Reassignment**:
- ✅ Create session in Classroom A at Period 5
- ✅ Drag to Classroom B at Period 5 (same period)
- ✅ Verify confirmation dialog appears
- ✅ Verify classroom_id updates to Classroom B

**Drawer-to-Timetable Reassignment**:
- ✅ Create session with Classroom A assigned
- ✅ Drag from drawer to Classroom B row
- ✅ Verify green indicators show for Classroom B
- ✅ Verify confirmation dialog for classroom change
- ✅ Verify session places successfully in Classroom B

**Instructor View** (same tests repeated):
- ✅ Same-period instructor reassignment works
- ✅ Drawer-to-timetable instructor reassignment works

---

## Documentation Updates

- Updated `docs/features/dynamic-resource-timetabling.md` with:
  - "Known Issues & Fixes" section documenting both bugs
  - Implementation status showing v1.2 completion
  - Technical details of fixes

- Updated `docs/changelogs/index.md`:
  - Added link to this changelog

---

## Migration Notes

No database migrations or breaking changes. This is a pure bug fix release.

---

## Known Limitations

- Resource reassignment still requires separate database operations (not atomic)
- Future enhancement: Wrap timetable assignment + resource update in a transaction

---

## Contributors

- AI Assistant - Implementation and documentation
