# Dynamic Resource Timetabling - Feature Documentation

## Overview

This feature allows program heads to create class sessions **without** immediately assigning instructor or classroom resources. Resources can be assigned dynamically later via drag-and-drop in the timetable interface.

Additionally, it supports **Dynamic Resource Reassignment**, enabling program heads to reassign instructors and classrooms directly within the timetable by dragging sessions between resource rows.

---

## User Guide

### For Program Heads

#### Creating Incomplete Sessions

1. **Navigate to Class Sessions Management**
   - Go to "Manage Classes" page
   - Click "Create New Class Session"

2. **Option: Skip Resource Assignment**
   - Select Course and Class Group (required)
   - Set Duration in periods (required)
   - **Leave Instructor and Classroom empty** if you want to assign them later
   - Click "Create"

3. **Assigning Resources via Timetable**
   - Navigate to the Scheduler/Timetable page
   - Find your incomplete session in the drawer at the bottom
   - Sessions without resources show a warning badge
   - Drag the session to the timetable grid
   - Resources will be inferred based on:
     - **Class-Group View**: System suggests available instructor/classroom for that time slot
     - **Instructor View**: Instructor is determined by the row, select classroom
     - **Classroom View**: Classroom is determined by the row, select instructor

#### Visual Indicators

Incomplete sessions are identified by:
- 🚧 **Dashed orange border** in timetable cells
- ⚠️ **Warning badge** showing missing resources
- **Tooltip** displaying "⚠️ Not assigned" for null resources
- **Pulsing highlight** when awaiting placement after cross-dept request

---

## Dynamic Resource Reassignment

### Overview
Program heads can reassign instructors and classrooms directly within the timetable interface by dragging sessions between resource rows in Instructor View and Classroom View.

### Instructor Reassignment (Instructor View)

1. Switch to **Instructor View** in the timetable
2. Find the session in its current instructor's row
3. **Drag the session to a different instructor's row** at any time slot
4. System checks if the new instructor is available at that time
5. **Confirmation prompt appears** asking to confirm the instructor reassignment
6. Click "Confirm" to reassign the instructor and place the session
7. Session updates to show the new instructor

**Key Points:**
- Sessions can be moved to the same time slot (just changing instructor)
- Sessions can be moved to a different time slot AND change instructor
- Conflict detection prevents double-booking the new instructor
- Pre-assigned instructor row shows **vibrant green indicators** (80% opacity)
- Alternative instructor rows show **subtle green indicators** (40% opacity)

### Classroom Reassignment (Classroom View)

1. Switch to **Classroom View** in the timetable
2. Find the session in its current classroom's row
3. **Drag the session to a different classroom's row** at any time slot
4. System checks if the new classroom is available at that time
5. **Confirmation prompt appears** asking to confirm the classroom reassignment
6. Click "Confirm" to reassign the classroom and place the session
7. Session updates to show the new classroom

**Key Points:**
- Unassigned sessions (no classroom) appear in the drawer
- Can be placed in any available classroom
- Conflict detection prevents double-booking classrooms
- Capacity conflicts are still checked
- Pre-assigned classroom row shows **vibrant green indicators** (80% opacity)
- Alternative classroom rows show **subtle green indicators** (40% opacity)

### Visual Indicators

- **Pre-assigned resource rows**: Show vibrant green availability indicators (80% opacity)
- **Alternative resource rows**: Show subtle green availability indicators (40% opacity)
- This helps users identify the originally intended resource
- **Confirmation dialog**: Appears when reassigning a resource, showing the change from old to new

### Workflow Example: Reassigning an Instructor

1. You have a session currently assigned to "Dr. Smith" at Monday Period 2
2. You need to reassign it to "Dr. Jones" at Tuesday Period 4
3. Switch to **Instructor View**
4. Find the session in "Dr. Smith's" row at Monday Period 2
5. Drag it to "Dr. Jones'" row at Tuesday Period 4
6. System shows confirmation: *"You are changing the instructor from 'Dr. Smith' to 'Dr. Jones'. Continue?"*
7. Click "Continue"
8. Session is now assigned to "Dr. Jones" at Tuesday Period 4

### Important Notes

- Reassignment works **independently** of time changes
- You can move to the same time slot (just change instructor/classroom)
- You can move to a different time slot AND change the resource
- Cross-department resources still require the approval flow
- **Class-Group View** does NOT support resource reassignment (only time slot changes)

---

## For Department Heads

- Incomplete sessions appear in approval requests with clear indicators
- Badge shows "Needs resources" for sessions missing instructor or classroom
- All approval workflows function normally for incomplete sessions

---

## Technical Architecture

### Database Schema (✅ COMPLETED)

**Migration**: `nullable_resources.sql`

```sql
-- Made instructor_id and classroom_id nullable
ALTER TABLE class_sessions 
  ALTER COLUMN instructor_id DROP NOT NULL,
  ALTER COLUMN classroom_id DROP NOT NULL;

-- Added constraint for valid resource combinations
ALTER TABLE class_sessions 
  ADD CONSTRAINT check_resources_valid CHECK (...);

-- Index for querying incomplete sessions
CREATE INDEX idx_incomplete_sessions 
  ON class_sessions (program_id, created_at) 
  WHERE instructor_id IS NULL OR classroom_id IS NULL;
```

### Type System (✅ COMPLETED)

**Updated Types** (`src/types/classSession.ts`):

```typescript
export type ClassSession = {
  instructor: Instructor | null;  // Now nullable
  classroom: Classroom | null;     // Now nullable
  // ... other fields
};

// Utility types
export type IncompleteClassSession = ClassSession & {
  instructor: null;
  classroom: null;
};

export type CompleteClassSession = ClassSession & {
  instructor: Instructor;
  classroom: Classroom;
};
```

**New Types** (`src/features/program-head/schedule-class-session/types.ts`):

```typescript
export type ConfirmationType = 
  | 'cross-department' 
  | 'resource-reassignment'
  | 'remove-cross-department';

export interface ResourceReassignmentMetadata {
  resourceType: 'instructor' | 'classroom';
  fromName: string;
  toName: string;
  fromId: string;
  toId: string;
}
```

**Utility Functions** (`src/types/classSession.utils.ts`):

```typescript
// Type guards
isIncompleteSession(session): session is IncompleteClassSession
isPartiallyComplete(session): session is PartiallyCompleteClassSession
isCompleteSession(session): session is CompleteClassSession

// Helpers
getMissingResources(session): ('instructor' | 'classroom')[]
getResourceCompletionStatus(session): string
```

### Service Layer (✅ COMPLETED)

**Functions** (`src/lib/services/classSessionService.ts`):

```typescript
// Create session without resources
createIncompleteClassSession(data): Promise<ClassSession>

// Assign resources to existing session
assignResourcesToSession(
  sessionId: string,
  instructorId: string | null,
  classroomId: string | null
): Promise<ClassSession>

// Reassign a specific resource (NEW for Resource Reassignment)
reassignSessionResource(
  sessionId: string,
  resourceType: 'instructor' | 'classroom',
  newResourceId: string
): Promise<ClassSession>

// Query incomplete sessions
getIncompleteSessionsForProgram(programId): Promise<ClassSession[]>

// Check view mode compatibility
canPlaceInView(session, viewMode): boolean
```

**New Service Function** (`src/lib/services/timetableService.ts`):

```typescript
// Move session with resource reassignment
moveSessionWithResourceChange(
  from: { class_group_id, period_index, semester_id },
  to: { class_group_id, period_index, semester_id },
  class_session_id: string,
  user_id: string,
  resourceType: 'instructor' | 'classroom',
  newResourceId: string,
  status?: 'pending' | 'confirmed'
): Promise<void>
```

---

## Implementation Status

### ✅ Phase 1: Database Schema Changes (COMPLETED)
- [x] Make instructor_id and classroom_id nullable
- [x] Add check constraint for valid resource combinations
- [x] Create index for incomplete session queries
- [x] Add column comments for documentation

### ✅ Phase 2: Type System Updates (COMPLETED)
- [x] Update ClassSession type with nullable resources
- [x] Create utility types (Incomplete, PartiallyComplete, Complete)
- [x] Implement type guard functions
- [x] Add helper utilities for resource status
- [x] Add ConfirmationType and ResourceReassignmentMetadata types

### ✅ Phase 3: Service Layer Updates (COMPLETED)
- [x] Update getAllClassSessions to handle null resources
- [x] Add createIncompleteClassSession function
- [x] Add assignResourcesToSession function
- [x] Add getIncompleteSessionsForProgram query
- [x] Add canPlaceInView validation function
- [x] Update all mapping functions for nullable resources
- [x] Add reassignSessionResource function
- [x] Add moveSessionWithResourceChange function

### ✅ Phase 4: Dynamic Resource Reassignment (COMPLETED v1.2)
- [x] Remove resource mismatch blocking for instructor/classroom views
- [x] Add getResourceChangeInfo helper function
- [x] Update needsConfirmation to detect resource changes
- [x] Update handleConfirmation to support resource reassignment
- [x] Update executeDropMutation to use moveSessionWithResourceChange
- [x] Update handleDropToGrid with resource change detection
- [x] Add confirmation dialog logic for resource reassignment
- [x] Update DropZone with visual indicator differentiation
- [x] Add pre-assigned resource highlighting (vibrant vs subtle)
- [x] **FIX (v1.1): Wire moveSessionWithResourceChange through useTimetable with proper semester_id and cache invalidation**
- [x] **FIX (v1.2): Same-period resource reassignment now properly detects resource changes**
- [x] **FIX (v1.2): Drawer-to-timetable allows reassignment to any available resource row**
- [x] Add diagnostic logging for debugging drag-and-drop operations

### 🔄 Phase 5: Form Component Updates (NOT STARTED)
- [ ] Update form validation schema to make resources optional
- [ ] Add info message explaining optional resource assignment
- [ ] Handle form submission for incomplete sessions (null resources)
- [ ] Update form UI to indicate fields are optional

### 🔄 Phase 6: Timetable Integration (PARTIAL)
- [x] Update Drawer visual indicators (already present)
- [x] Add visual warnings for missing resources (already present)
- [ ] Implement resource inference on drop (Class-Group view)
- [ ] Create ResourceAssignmentModal component
- [ ] Add useResourceAvailability hook
- [x] Handle drag restrictions by view mode

### 🔄 Phase 7: Visual Indicators (PARTIAL)
- [x] Update SessionCell for incomplete styling
- [x] Add dashed border for incomplete sessions
- [x] Show warning badges and icons
- [ ] Add filter for incomplete sessions
- [x] Update tooltips with resource status
- [x] Add vibrant/subtle green indicators for pre-assigned resources

### ⏳ Phase 8: Testing (NOT STARTED)
- [ ] Unit tests for type guards
- [ ] Service layer tests for incomplete sessions
- [ ] Form component integration tests
- [ ] DnD logic tests for incomplete sessions
- [ ] E2E tests for complete workflow
- [ ] Tests for resource reassignment workflows

### ⏳ Phase 9: Department Head Updates (NOT STARTED)
- [ ] Add incomplete session indicators in approval view
- [ ] Show badges for missing resources
- [ ] Update request cards with status

### ✅ Phase 10: Documentation (COMPLETED)
- [x] Feature documentation with resource reassignment
- [x] Technical architecture details
- [x] User guide for resource reassignment
- [x] Implementation status tracking
- [x] Bug fix documentation (v1.2)

---

## Known Issues & Fixes

### Fixed Issues (Version 1.2 - 2025-01-XX)

#### Issue #1: Same-Period Resource Reassignment Not Working
**Problem**: Moving a session to a different classroom/instructor row at the same period would fail silently without updating the resource.

**Root Cause**: The `isSameCell` check in `executeDropMutation` was comparing `source.class_group_id === dbTargetGroupId` which evaluated to `true` when the period was the same, even though the resource row (classroom/instructor) was different. This caused the function to return early without processing the resource change.

**Fix**: Updated the `isSameCell` logic to include `!resourceChangeMetadata?.isChanging` check for resource views, allowing same-period drops when the resource is changing.

```typescript
const isSameCell =
  viewMode === 'class-group'
    ? source.class_group_id === dbTargetGroupId && source.period_index === targetPeriodIndex
    : source.class_group_id === dbTargetGroupId && 
      source.period_index === targetPeriodIndex &&
      !resourceChangeMetadata?.isChanging; // Now allows resource change at same period
```

**Additional Fix (v1.2.1)**: Fixed critical bug in `moveSessionWithResourceChange` where same-period resource changes would cause the session to disappear back to drawer. The function was calling `moveClassSession` with identical source and destination, causing the assignment to be deleted. Added check to skip move when slot isn't changing.

**Testing**: 
- ✅ Can now drag session to different classroom row at same period
- ✅ Confirmation dialog appears for resource reassignment
- ✅ classroom_id/instructor_id updates correctly in database
- ✅ Session stays in timetable after resource reassignment (v1.2.1 fix)

---

#### Issue #2: Drawer-to-Timetable Restricted to Pre-Assigned Resource
**Problem**: Sessions with a pre-assigned classroom/instructor could only be dropped into their originally assigned resource's row. Dropping into a different resource row showed no availability indicators.

**Root Cause**: The `isViewModeCompliant` function for `classroom` and `instructor` cases was checking if the target row matched the session's current resource:
```typescript
case 'classroom':
  if (!draggedSession.classroom) return true;
  return draggedSession.classroom.id === targetGroupId; // Only allowed original classroom
```

**Fix**: Changed the logic to always return `true` for resource views when dropping from the drawer, relying on conflict checking and confirmation flows to handle reassignment:
```typescript
case 'classroom':
case 'instructor':
  // Always allow drops from drawer (conflicts checked separately)
  // Resource assignment/reassignment will trigger confirmation when needed
  return true;
```

**Testing**:
- ✅ Green availability indicators now show for ALL available resource rows
- ✅ Can drop session with pre-assigned classroom into any classroom row
- ✅ Confirmation dialog appears for resource reassignment
- ✅ Resource assignment works correctly from drawer to any available row

---

### Additional Improvements (v1.2)
- Added diagnostic `console.debug` logging throughout drag-and-drop flow
- Enhanced error messages for debugging
- Improved code comments explaining resource vs class-group ID semantics

---

## Additional Documentation

### Comprehensive Guides

- **[API Reference](../api/class-session-service.md)** - Complete API documentation for all service functions with examples
- **[User Guide](../guides/incomplete-sessions-user-guide.md)** - Step-by-step tutorials for program heads
- **[Migration Guide](../guides/incomplete-sessions-migration.md)** - Installation and upgrade instructions

### Quick Links

- **Type Definitions:** `src/types/classSession.ts`, `src/types/classSession.utils.ts`
- **Validation Schema:** `src/types/validation/classSession.ts`
- **Service Layer:** `src/lib/services/classSessionService.ts`, `src/lib/services/timetableService.ts`
- **Database Migration:** `supabase/migrations/*_nullable_resources.sql`

---

## Performance & Security

### Query Optimization

The `idx_incomplete_sessions` partial index dramatically improves query performance:

```sql
-- Optimized query using the index
SELECT * FROM class_sessions 
WHERE program_id = :programId 
  AND (instructor_id IS NULL OR classroom_id IS NULL);
-- Uses index scan: ~10-100x faster than full table scan
```

**Best Practices:**
- Use `getIncompleteSessionsForProgram()` to leverage the index
- Batch resource assignments with `Promise.all()`
- Cache incomplete session counts in React Query
- Avoid filtering all sessions client-side

### Security Considerations

**RLS Policies:**
- Nullable resources don't affect existing Row Level Security policies
- Program heads can only manage sessions in their own program
- Cross-department resource assignments still require department head approval
- Incomplete sessions follow the same approval workflow as complete sessions

**Data Validation:**
- **Client-side:** Form validates optional resources (Zod schema)
- **Database:** Check constraint ensures valid resource combinations
- **Business logic:** View mode restrictions prevent invalid placements
- **Type safety:** TypeScript enforces null checking throughout codebase

**Audit Trail:**
```sql
-- Track when resources are assigned
CREATE OR REPLACE FUNCTION log_resource_assignment()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.instructor_id IS NULL AND NEW.instructor_id IS NOT NULL THEN
    INSERT INTO audit_log (table_name, record_id, action, details)
    VALUES ('class_sessions', NEW.id, 'instructor_assigned', 
            jsonb_build_object('instructor_id', NEW.instructor_id));
  END IF;
  
  IF OLD.classroom_id IS NULL AND NEW.classroom_id IS NOT NULL THEN
    INSERT INTO audit_log (table_name, record_id, action, details)
    VALUES ('class_sessions', NEW.id, 'classroom_assigned', 
            jsonb_build_object('classroom_id', NEW.classroom_id));
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_resource_assignment
AFTER UPDATE ON class_sessions
FOR EACH ROW
EXECUTE FUNCTION log_resource_assignment();
```

---

## Testing Strategy

### Unit Tests

**Type Guards** (`src/types/classSession.utils.test.ts`):
```typescript
describe('isIncompleteSession', () => {
  it('returns true when both resources are null', () => {
    const session: ClassSession = {
      id: '1',
      course: mockCourse,
      group: mockGroup,
      instructor: null,
      classroom: null,
      period_count: 1,
      program_id: 'prog-1'
    };
    expect(isIncompleteSession(session)).toBe(true);
  });

  it('returns false when one resource is assigned', () => {
    const session: ClassSession = {
      ...mockSession,
      instructor: mockInstructor,
      classroom: null
    };
    expect(isIncompleteSession(session)).toBe(false);
  });
});

describe('getMissingResources', () => {
  it('returns both resources when both null', () => {
    const session = { instructor: null, classroom: null, ... };
    expect(getMissingResources(session)).toEqual(['instructor', 'classroom']);
  });

  it('returns empty array when complete', () => {
    const session = { instructor: {...}, classroom: {...}, ... };
    expect(getMissingResources(session)).toEqual([]);
  });
});
```

### Integration Tests

**Service Layer** (`src/lib/services/classSessionService.test.ts`):
```typescript
describe('createIncompleteClassSession', () => {
  it('creates session with null resources', async () => {
    const data: ClassSessionInsert = {
      course_id: 'course-1',
      class_group_id: 'group-1',
      instructor_id: null,
      classroom_id: null,
      period_count: 2,
      user_id: 'user-1'
    };

    const session = await createIncompleteClassSession(data);

    expect(session.instructor).toBeNull();
    expect(session.classroom).toBeNull();
    expect(session.course).toBeDefined();
    expect(session.group).toBeDefined();
  });
});

describe('assignResourcesToSession', () => {
  it('assigns instructor and classroom to incomplete session', async () => {
    // Create incomplete session
    const incomplete = await createIncompleteClassSession({...});

    // Assign resources
    const complete = await assignResourcesToSession(
      incomplete.id,
      'instructor-1',
      'classroom-1'
    );

    expect(complete.instructor).toBeDefined();
    expect(complete.classroom).toBeDefined();
  });
});
```

### E2E Tests

**Complete Workflow** (`e2e/incomplete-sessions.spec.ts`):
```typescript
test('create and place incomplete session', async ({ page }) => {
  // 1. Create incomplete session
  await page.goto('/manage-classes');
  await page.click('[data-cy="create-session-btn"]');
  await page.selectOption('[data-cy="course-select"]', 'Math 101');
  await page.selectOption('[data-cy="group-select"]', 'Group A');
  // Leave resources empty
  await page.click('[data-cy="submit-btn"]');

  await expect(page.locator('.toast-success')).toBeVisible();

  // 2. Navigate to timetable
  await page.goto('/scheduler');

  // 3. Find incomplete session in drawer
  const drawer = page.locator('[data-cy="drawer"]');
  const incompleteSession = drawer.locator('[data-cy^="unassigned-session-"]').first();
  await expect(incompleteSession).toHaveClass(/border-dashed/);

  // 4. Drag to timetable
  await incompleteSession.dragTo(page.locator('[data-cy="cell-0-0"]'));

  // 5. Resource modal appears
  await expect(page.locator('[data-cy="resource-modal"]')).toBeVisible();
  await page.selectOption('[data-cy="instructor-select"]', 'Dr. Smith');
  await page.selectOption('[data-cy="classroom-select"]', 'Room 101');
  await page.click('[data-cy="confirm-btn"]');

  // 6. Session appears in timetable
  const cell = page.locator('[data-cy="cell-0-0"]');
  await expect(cell).toContainText('Math 101');
  await expect(cell).not.toHaveClass(/border-dashed/);
});
```

---

## Known Limitations

1. **Type Safety**: Requires extensive null checks across codebase (60+ files)
2. **View Restrictions**: Incomplete sessions can only be placed in compatible views
3. **Conflict Detection**: Limited for incomplete sessions (only checks assigned resources)
4. **Reporting**: May need updates to handle sessions with partial data
5. **Class-Group View**: Does not support resource reassignment (only time slot changes)

---

## FAQ

**Q: Can I edit an incomplete session to add resources?**  
A: Yes, edit the session from "Manage Classes" and assign instructor/classroom.

**Q: What happens if I try to place an incomplete session in Instructor View?**  
A: The drop will be rejected if the session has no instructor assigned. You must assign the instructor first or use Class-Group View.

**Q: Can incomplete sessions trigger cross-department requests?**  
A: No, resources must be assigned first. The cross-dept check happens after resource assignment.

**Q: Are incomplete sessions validated differently?**  
A: Yes, conflict detection only checks assigned resources. If instructor is null, no instructor conflicts are checked.

**Q: Can I reassign a classroom in Class-Group View?**  
A: No, resource reassignment is only supported in Instructor View and Classroom View. Class-Group View only allows moving sessions within the same group.

**Q: What happens if I drag a session to a different instructor who's already busy?**  
A: The system will detect the conflict and prevent the drop, showing an error message.

**Q: Do I need department head approval to reassign resources?**  
A: Not for resources within your own department. Cross-department resources still require approval.

---

## Rollback Procedure

If issues arise:

```sql
-- 1. Find all incomplete sessions
SELECT * FROM class_sessions 
WHERE instructor_id IS NULL OR classroom_id IS NULL;

-- 2. Assign placeholder resources
UPDATE class_sessions 
SET instructor_id = 'default-instructor-id',
    classroom_id = 'default-classroom-id'
WHERE instructor_id IS NULL OR classroom_id IS NULL;

-- 3. Restore constraints
ALTER TABLE class_sessions 
  ALTER COLUMN instructor_id SET NOT NULL,
  ALTER COLUMN classroom_id SET NOT NULL;
```

---

## Bug Fixes & Technical Notes

### Fixed: Resource Reassignment Cache Invalidation (2025-01-22)

**Problem**: After confirming classroom reassignment in Classroom View, the session remained visually in the original classroom row, even though the database was updated correctly.

**Root Cause**: 
1. The resource-change mutation path (`moveSessionWithResourceChange`) was bypassing React Query mutations entirely
2. No cache invalidation occurred after resource reassignment
3. The `semester_id` was being incorrectly derived from the timetable grid data instead of using the active semester

**Solution**:
- **Centralized Resource Reassignment**: Added `moveSessionWithResourceChange` wrapper function in `useTimetable.ts` that:
  - Derives `semester_id` from `useActiveSemester()` hook (correct source)
  - Handles `user.id` centrally
  - Invalidates both `['hydratedTimetable']` and `['allClassSessions']` caches after mutation
- **Updated DnD Hook**: Modified `useTimetableDnd.ts` to use the wrapper instead of directly importing the service
- **Removed Brittle Logic**: Eliminated the incorrect "look into the grid to find semester" approach

**Files Modified**:
- `src/features/program-head/schedule-class-session/hooks/useTimetable.ts` - Added wrapper and exposed `activeSemesterId`
- `src/features/program-head/schedule-class-session/hooks/useTimetableDnd.ts` - Use wrapper instead of direct service import

**Verification**:
```typescript
// Before: Incorrect semester derivation
const semesterId = timetable.get(Array.from(timetable.keys())[0])?.[0]?.[0]?.id || '';

// After: Correct semester from hook
const { activeSemesterId } = useTimetable(viewMode);
```

### Resource Reassignment Execution Path

When a confirmed session is dragged to a different instructor/classroom row:

1. **Conflict Checker** (`checkTimetableConflicts`) allows the move in resource views
2. **getResourceChangeInfo** detects whether the resource is being changed vs. first-time assigned
3. **needsConfirmation** chooses between:
   - `cross-department` confirmation (for cross-dept resources)
   - `resource-reassignment` confirmation (for changing existing resource)
4. **TimetablePage** resolves human-readable resource names and shows the appropriate confirmation dialog
5. After confirmation, **useTimetableDnd** calls `moveSessionWithResourceChange` wrapper from **useTimetable**, which:
   - Calls `timetableService.moveSessionWithResourceChange` with correct `semester_id` and `user_id`
   - Reassigns the resource on the `class_sessions` row via `reassignSessionResource`
   - Moves the timetable assignment when needed
   - Invalidates both `['hydratedTimetable', activeSemesterId]` and `['allClassSessions']` caches
6. **React Query** refetches data and the UI updates immediately to show the new resource assignment

**Key Insight**: By wiring resource reassignment through `useTimetable`, we ensure consistent `semester_id` handling and automatic cache invalidation, just like the regular move path.


Then redeploy previous version of application code.
