# Dynamic Resource Timetabling - Feature Documentation

## Overview

This feature allows program heads to create class sessions **without** immediately assigning instructor or classroom resources. Resources can be assigned dynamically later via drag-and-drop in the timetable interface.

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

### For Department Heads

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

**New Functions** (`src/lib/services/classSessionService.ts`):

```typescript
// Create session without resources
createIncompleteClassSession(data): Promise<ClassSession>

// Assign resources to existing session
assignResourcesToSession(
  sessionId: string,
  instructorId: string | null,
  classroomId: string | null
): Promise<ClassSession>

// Query incomplete sessions
getIncompleteSessionsForProgram(programId): Promise<ClassSession[]>

// Check view mode compatibility
canPlaceInView(session, viewMode): boolean
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

### ✅ Phase 3: Service Layer Updates (COMPLETED)
- [x] Update getAllClassSessions to handle null resources
- [x] Add createIncompleteClassSession function
- [x] Add assignResourcesToSession function
- [x] Add getIncompleteSessionsForProgram query
- [x] Add canPlaceInView validation function
- [x] Update all mapping functions for nullable resources

### 🔄 Phase 4: Form Component Updates (IN PROGRESS)
- [ ] Add checkbox for "Assign resources now"
- [ ] Conditionally show/hide resource selectors
- [ ] Update form validation for optional resources
- [ ] Add info message for deferred assignment
- [ ] Handle form submission for incomplete sessions

### ⏳ Phase 5: Timetable Integration (NOT STARTED)
- [ ] Update Drawer to show incomplete session badges
- [ ] Add visual warnings for missing resources
- [ ] Implement resource inference on drop
- [ ] Create ResourceAssignmentModal component
- [ ] Add useResourceAvailability hook
- [ ] Handle drag restrictions by view mode

### ⏳ Phase 6: Visual Indicators (NOT STARTED)
- [ ] Update SessionCell for incomplete styling
- [ ] Add dashed border for incomplete sessions
- [ ] Show warning badges and icons
- [ ] Add filter for incomplete sessions
- [ ] Update tooltips with resource status

### ⏳ Phase 7: View Mode Restrictions (NOT STARTED)
- [ ] Validate session placement by view mode
- [ ] Prevent invalid drops (e.g., no instructor in instructor view)
- [ ] Add toast messages for restrictions
- [ ] Update drop zone validation

### ⏳ Phase 8: Testing (NOT STARTED)
- [ ] Unit tests for type guards
- [ ] Service layer tests for incomplete sessions
- [ ] Form component integration tests
- [ ] DnD logic tests for incomplete sessions
- [ ] E2E tests for complete workflow

### ⏳ Phase 9: Department Head Updates (NOT STARTED)
- [ ] Add incomplete session indicators in approval view
- [ ] Show badges for missing resources
- [ ] Update request cards with status

### ⏳ Phase 10: Documentation (PARTIAL)
- [x] This feature documentation
- [ ] Architecture document
- [ ] Migration guide for existing data
- [ ] User training materials

---

## Null Safety Migration Guide

### Required Updates Across Codebase

The nullable resources change requires adding null checks in **60+ files**. Key patterns:

#### 1. Tooltip/Display Components

```typescript
// Before:
<p>Instructor: {session.instructor.first_name}</p>

// After:
<p>Instructor: {session.instructor 
  ? `${session.instructor.first_name} ${session.instructor.last_name}` 
  : '⚠️ Not assigned'}</p>
```

#### 2. Validation Logic

```typescript
// Before:
if (session.instructor.id === targetId) { ... }

// After:
if (session.instructor && session.instructor.id === targetId) { ... }
```

#### 3. Conflict Detection

```typescript
// Before:
const hasConflict = existingSession.classroom.id === newSession.classroom.id;

// After:
const hasConflict = 
  existingSession.classroom && 
  newSession.classroom && 
  existingSession.classroom.id === newSession.classroom.id;
```

#### 4. Resource Queries

```typescript
// Before:
const instructorSessions = sessions.filter(
  s => s.instructor.id === instructorId
);

// After:
const instructorSessions = sessions.filter(
  s => s.instructor?.id === instructorId
);
```

### Files Requiring Null Safety Updates

**High Priority** (blocks basic functionality):
1. `src/features/program-head/schedule-class-session/hooks/useTimetableDnd.ts` (40 errors)
2. `src/features/program-head/schedule-class-session/hooks/useTimetable.ts` (14 errors)
3. `src/features/program-head/schedule-class-session/utils/checkConflicts.ts` (20 errors)
4. `src/features/program-head/schedule-class-session/pages/components/timetable/SessionCell.tsx` (6 errors)

**Medium Priority** (affects edit/display):
5. `src/features/program-head/manage-class-sessions/component.tsx`
6. `src/features/program-head/manage-class-sessions/pages/ClassSessionsPage.tsx`
7. `src/features/department-head/manage-instructors/component.tsx`

**Lower Priority** (edge cases):
8. All test files referencing ClassSession
9. Reporting/analytics components
10. Export/import utilities

---

## Development Workflow

### Next Steps for Implementation

1. **Fix Null Safety Issues** (Priority 1)
   ```bash
   # Run type check to see all errors
   npm run typeCheck
   
   # Fix files in order of priority above
   # Pattern: Add ? or null checks before accessing nested properties
   ```

2. **Update Form Component** (Priority 2)
   - Add "Assign now" checkbox to ClassSessionForm
   - Implement conditional rendering for resource selectors
   - Test creating incomplete sessions

3. **Implement Visual Indicators** (Priority 3)
   - Update SessionCell with warning badges
   - Style incomplete sessions with dashed borders
   - Add filter toggle for incomplete sessions

4. **Add Resource Assignment Modal** (Priority 4)
   - Create modal component
   - Implement resource inference logic
   - Handle cross-department flow

5. **Write Tests** (Priority 5)
   - Unit tests for utilities
   - Integration tests for form and DnD
   - E2E tests for complete workflow

### Testing Checklist

- [ ] Create incomplete session via form
- [ ] Incomplete session appears in drawer with badge
- [ ] Drag incomplete session to class-group view
- [ ] Resource assignment modal opens
- [ ] Assign resources and place session
- [ ] Session becomes complete after placement
- [ ] Edit incomplete session (should allow resource assignment)
- [ ] View restrictions work (can't place no-instructor session in instructor view)
- [ ] Cross-department flow works with incomplete sessions
- [ ] Incomplete sessions show in approval requests

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

---

## Known Limitations

1. **Type Safety**: Requires extensive null checks across codebase (60+ files)
2. **View Restrictions**: Incomplete sessions can only be placed in compatible views
3. **Conflict Detection**: Limited for incomplete sessions (only checks assigned resources)
4. **Reporting**: May need updates to handle sessions with partial data

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

Then redeploy previous version of application code.
