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

### ✅ Phase 4: Dynamic Resource Reassignment (COMPLETED)
- [x] Remove resource mismatch blocking for instructor/classroom views
- [x] Add getResourceChangeInfo helper function
- [x] Update needsConfirmation to detect resource changes
- [x] Update handleConfirmation to support resource reassignment
- [x] Update executeDropMutation to use moveSessionWithResourceChange
- [x] Update handleDropToGrid with resource change detection
- [x] Add confirmation dialog logic for resource reassignment
- [x] Update DropZone with visual indicator differentiation
- [x] Add pre-assigned resource highlighting (vibrant vs subtle)

### 🔄 Phase 5: Form Component Updates (NOT STARTED)
- [ ] Add checkbox for "Assign resources now"
- [ ] Conditionally show/hide resource selectors
- [ ] Update form validation for optional resources
- [ ] Add info message for deferred assignment
- [ ] Handle form submission for incomplete sessions

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

Then redeploy previous version of application code.
