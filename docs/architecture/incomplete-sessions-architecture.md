# Incomplete Sessions - Technical Architecture

## Overview

This document describes the technical architecture for supporting incomplete class sessions - sessions that can be created without immediately assigning instructor or classroom resources.

## System Architecture

### Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interfaces                          │
├──────────────────────────┬──────────────────────────────────────┤
│ Class Sessions Form      │ Timetable Drag & Drop                │
│ - Optional resources     │ - Infer resources from drop location │
│ - Create incomplete      │ - Show assignment modal              │
└──────────────┬───────────┴────────────────────┬─────────────────┘
               │                                │
               ▼                                ▼
┌──────────────────────────────────────────────────────────────────┐
│                       Business Logic Layer                        │
├───────────────────────────┬──────────────────────────────────────┤
│ useManageClassSessions    │ useTimetableDnd                      │
│ - Form state management   │ - Drag & drop logic                  │
│ - Validation              │ - Resource inference                 │
│                           │ - Conflict detection                  │
└───────────────┬───────────┴────────────────────┬─────────────────┘
                │                                │
                ▼                                ▼
┌──────────────────────────────────────────────────────────────────┐
│                         Service Layer                             │
├───────────────────────────────────────────────────────────────────┤
│ classSessionService.ts                                            │
│ - createIncompleteClassSession()                                  │
│ - assignResourcesToSession()                                      │
│ - getIncompleteSessionsForProgram()                               │
│ - canPlaceInView()                                                │
└───────────────────────────┬───────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                      Database (Supabase)                          │
├───────────────────────────────────────────────────────────────────┤
│ class_sessions table                                              │
│ - instructor_id (nullable)                                        │
│ - classroom_id (nullable)                                         │
│ - check_resources_valid constraint                                │
└───────────────────────────────────────────────────────────────────┘
```

## Type System

### Core Types

```typescript
// Base type - supports null resources
type ClassSession = {
  id: string;
  course: Course;
  group: ClassGroup;
  instructor: Instructor | null;  // ← Nullable
  classroom: Classroom | null;     // ← Nullable
  period_count: number;
  program_id: string | null;
};

// Utility types for different completion states
type IncompleteClassSession = ClassSession & {
  instructor: null;
  classroom: null;
};

type PartiallyCompleteClassSession = ClassSession & (
  | { instructor: Instructor; classroom: null }
  | { instructor: null; classroom: Classroom }
);

type CompleteClassSession = ClassSession & {
  instructor: Instructor;
  classroom: Classroom;
};
```

### Type Guards

```typescript
// Runtime type checking
function isIncompleteSession(s: ClassSession): s is IncompleteClassSession {
  return s.instructor === null && s.classroom === null;
}

function isCompleteSession(s: ClassSession): s is CompleteClassSession {
  return s.instructor !== null && s.classroom !== null;
}
```

## Component Architecture

### Form Component Flow

```
ClassSessionForm
├── State: assignResourcesNow (boolean)
├── Conditional Rendering
│   ├── If true: Show resource selectors
│   │   └── Validate: Both required
│   └── If false: Hide selectors
│       └── Submit: instructor_id = null, classroom_id = null
└── Info Message
    └── "Resources will be assigned via timetable"
```

### Timetable Integration Flow

```
Drawer (Unassigned Sessions)
├── Display incomplete sessions with badges
├── Visual indicator: Dashed border + warning icon
└── Draggable: All sessions (complete or incomplete)
    │
    ▼
Drag Start
├── Store: DragSource { from: 'drawer', session_id }
└── Set: activeDraggedSession state
    │
    ▼
Drag Over Timetable Cell
├── Check: canPlaceInView(session, viewMode)
│   ├── Class-Group: ✅ Always allowed
│   ├── Instructor: ✅ Only if has instructor
│   └── Classroom: ✅ Only if has classroom
├── Visual: Green dot if allowed, red if not
└── Tooltip: Reason if not allowed
    │
    ▼
Drop on Cell
├── If complete: Normal assignment flow
└── If incomplete:
    ├── Infer resources based on view mode
    ├── Open ResourceAssignmentModal
    ├── User confirms/modifies resources
    └── Call: assignResourcesToSession()
        │
        ▼
    Update Session
    ├── Database: UPDATE class_sessions SET...
    ├── Invalidate: React Query cache
    └── UI: Session now appears complete
```

## Resource Inference Logic

### By View Mode

```typescript
function inferResources(
  viewMode: TimetableViewMode,
  targetRowId: string,
  targetPeriodIndex: number,
  session: ClassSession
): Promise<{ instructorId: string | null, classroomId: string | null }> {
  
  switch (viewMode) {
    case 'class-group':
      // Find available resources for this time slot
      const availableInstructor = await findAvailableInstructor(
        targetPeriodIndex,
        session.course
      );
      const availableClassroom = await findAvailableClassroom(
        targetPeriodIndex,
        session.group.student_count
      );
      return { 
        instructorId: availableInstructor?.id || null,
        classroomId: availableClassroom?.id || null 
      };
    
    case 'instructor':
      // Instructor determined by row, need classroom
      return {
        instructorId: targetRowId,
        classroomId: await promptForClassroom(targetPeriodIndex)
      };
    
    case 'classroom':
      // Classroom determined by row, need instructor
      return {
        instructorId: await promptForInstructor(targetPeriodIndex),
        classroomId: targetRowId
      };
  }
}
```

## Conflict Detection

### Updated Logic for Incomplete Sessions

```typescript
function checkConflicts(
  session: ClassSession,
  existingSessions: ClassSession[],
  targetPeriod: number
): Conflict[] {
  const conflicts: Conflict[] = [];
  
  for (const existing of existingSessions) {
    // Only check assigned resources
    if (session.instructor && existing.instructor) {
      if (session.instructor.id === existing.instructor.id) {
        conflicts.push({
          type: 'instructor',
          message: `${existing.instructor.first_name} is already teaching`
        });
      }
    }
    
    if (session.classroom && existing.classroom) {
      if (session.classroom.id === existing.classroom.id) {
        conflicts.push({
          type: 'classroom',
          message: `${existing.classroom.name} is already in use`
        });
      }
    }
    
    // No conflicts for null resources
  }
  
  return conflicts;
}
```

## Database Constraints

### Check Constraint

```sql
ALTER TABLE class_sessions 
ADD CONSTRAINT check_resources_valid 
CHECK (
  -- All combinations are valid:
  (instructor_id IS NOT NULL AND classroom_id IS NOT NULL) OR  -- Complete
  (instructor_id IS NOT NULL AND classroom_id IS NULL) OR      -- Partial (instructor only)
  (instructor_id IS NULL AND classroom_id IS NOT NULL) OR      -- Partial (classroom only)
  (instructor_id IS NULL AND classroom_id IS NULL)             -- Incomplete
);
```

### Index for Performance

```sql
CREATE INDEX idx_incomplete_sessions 
ON class_sessions (program_id, created_at) 
WHERE instructor_id IS NULL OR classroom_id IS NULL;

-- Enables fast queries like:
SELECT * FROM class_sessions 
WHERE program_id = $1 
  AND (instructor_id IS NULL OR classroom_id IS NULL)
ORDER BY created_at DESC;
```

## State Management

### React Query Keys

```typescript
// Query for all sessions (includes incomplete)
['classSessions', userId]

// Query for incomplete sessions only
['incompleteSessions', programId]

// Query for unassigned sessions (not yet on timetable)
['unassignedSessions', programId, semesterId]
```

### Cache Invalidation

```typescript
// After assigning resources
queryClient.invalidateQueries(['classSessions']);
queryClient.invalidateQueries(['incompleteSessions']);
queryClient.invalidateQueries(['unassignedSessions']);

// After placing on timetable
queryClient.invalidateQueries(['timetableAssignments']);
queryClient.invalidateQueries(['unassignedSessions']);
```

## Security Considerations

### RLS Policies

Existing policies continue to work:
```sql
-- Program heads can manage their own sessions
CREATE POLICY "program_heads_manage_sessions"
ON class_sessions FOR ALL
USING (
  auth.uid() IN (
    SELECT id FROM profiles 
    WHERE program_id = class_sessions.program_id 
      AND role = 'program_head'
  )
);

-- No special policy needed for incomplete sessions
-- The nullable columns are transparent to RLS
```

### Validation

- **Client-side**: Form validates optional resources
- **Server-side**: Check constraint ensures valid combinations
- **Business logic**: View mode restrictions prevent invalid placements

## Performance Considerations

### Optimizations

1. **Indexed Queries**: Use partial index for incomplete sessions
2. **Query Batching**: Fetch resources alongside sessions
3. **Lazy Loading**: Load resource details only when needed
4. **Cache Strategy**: Invalidate specific keys, not entire cache

### Query Patterns

```typescript
// ✅ Efficient: Uses index
SELECT * FROM class_sessions 
WHERE program_id = $1 
  AND (instructor_id IS NULL OR classroom_id IS NULL);

// ✅ Efficient: Single join
SELECT cs.*, i.*, c.*
FROM class_sessions cs
LEFT JOIN instructors i ON cs.instructor_id = i.id
LEFT JOIN classrooms c ON cs.classroom_id = c.id
WHERE cs.program_id = $1;

// ❌ Inefficient: Multiple queries
for (const session of sessions) {
  if (session.instructor_id) {
    const instructor = await getInstructor(session.instructor_id);
  }
}
```

## Testing Strategy

### Unit Tests

```typescript
describe('Type Guards', () => {
  it('identifies incomplete sessions', () => {
    const session = { instructor: null, classroom: null, ... };
    expect(isIncompleteSession(session)).toBe(true);
  });
});

describe('Service Layer', () => {
  it('creates incomplete session', async () => {
    const session = await createIncompleteClassSession({
      course_id: 'c1',
      class_group_id: 'g1',
      ...
    });
    expect(session.instructor).toBeNull();
    expect(session.classroom).toBeNull();
  });
});
```

### Integration Tests

```typescript
describe('Form Component', () => {
  it('creates incomplete session when checkbox unchecked', async () => {
    render(<ClassSessionForm />);
    await user.click(screen.getByLabelText(/assign now/));
    await user.click(screen.getByRole('button', { name: /create/ }));
    
    expect(mockSubmit).toHaveBeenCalledWith({
      instructor_id: null,
      classroom_id: null,
      ...
    });
  });
});
```

### E2E Tests

```typescript
describe('Incomplete Session Workflow', () => {
  it('creates and assigns resources via timetable', () => {
    cy.createIncompleteSession('Math 101', 'Group A');
    cy.visit('/scheduler');
    cy.drag('[data-cy="session-card"]', '[data-cy="cell-0-0"]');
    cy.get('[data-cy="resource-modal"]').within(() => {
      cy.selectInstructor('Dr. Smith');
      cy.selectClassroom('Room 101');
      cy.contains('Confirm').click();
    });
    cy.get('[data-cy="cell-0-0"]').should('contain', 'Math 101');
  });
});
```

## Migration Path

### Existing Data

All existing sessions have both instructor and classroom assigned, so they remain valid and unchanged.

### New Features

1. Users can create new sessions without resources
2. Existing sessions can be edited to remove resources (if desired)
3. No data migration required

### Rollback

If needed, can restore NOT NULL constraints after assigning placeholder resources to any incomplete sessions.
