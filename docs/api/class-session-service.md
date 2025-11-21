# Class Session Service API Reference

Complete API documentation for class session management with dynamic resource assignment.

---

## Core Functions

### `createIncompleteClassSession(data)`

Creates a new class session without requiring instructor or classroom assignment.

**Purpose:** Allow program heads to create sessions when resources haven't been decided yet. Resources can be assigned later via timetable drag-and-drop.

**Parameters:**
```typescript
data: {
  course_id: string;           // Required: Course UUID
  class_group_id: string;      // Required: Class group UUID
  period_count: number;        // Required: Duration in periods (min: 1)
  instructor_id?: string | null;  // Optional: Instructor UUID
  classroom_id?: string | null;   // Optional: Classroom UUID
  program_id?: string | null;     // Optional: Program UUID
  user_id: string;             // Required: Creator's user UUID
}
```

**Returns:**
```typescript
Promise<ClassSession> // Hydrated session with null resources
```

**Throws:**
- `Error` if required fields are missing
- `Error` if course or class group doesn't exist
- `Error` if database constraint violations occur

**Example:**
```typescript
import { createIncompleteClassSession } from '@/lib/services/classSessionService';

// Create session without resources
const session = await createIncompleteClassSession({
  course_id: 'course-uuid-123',
  class_group_id: 'group-uuid-456',
  period_count: 2,
  instructor_id: null,  // Will be assigned later
  classroom_id: null,   // Will be assigned later
  user_id: currentUser.id
});

console.log(session.instructor); // null
console.log(session.classroom);  // null
console.log(session.course);     // Hydrated course object
```

---

### `assignResourcesToSession(sessionId, instructorId, classroomId)`

Assigns instructor and/or classroom to an existing session.

**Purpose:** Complete an incomplete session by assigning resources after it's been placed in the timetable.

**Parameters:**
```typescript
sessionId: string;              // Required: Session UUID
instructorId: string | null;    // Optional: Instructor UUID to assign
classroomId: string | null;     // Optional: Classroom UUID to assign
```

**Returns:**
```typescript
Promise<ClassSession> // Updated session with assigned resources
```

**Throws:**
- `Error` if session doesn't exist
- `Error` if instructor or classroom doesn't exist
- `Error` if resources create conflicts

**Example:**
```typescript
import { assignResourcesToSession } from '@/lib/services/classSessionService';

// After dropping session in timetable, assign inferred resources
const updatedSession = await assignResourcesToSession(
  'session-uuid-789',
  'instructor-uuid-111',  // Inferred from timetable slot
  'classroom-uuid-222'    // Inferred from timetable slot
);

console.log(updatedSession.instructor.first_name); // "John"
console.log(updatedSession.classroom.name);        // "Room 101"
```

---

### `reassignSessionResource(sessionId, resourceType, newResourceId)`

Changes a single resource (instructor or classroom) for an existing session.

**Purpose:** Support resource reassignment via drag-and-drop between resource rows in Instructor/Classroom views.

**Parameters:**
```typescript
sessionId: string;                        // Required: Session UUID
resourceType: 'instructor' | 'classroom'; // Required: Which resource to change
newResourceId: string;                    // Required: New resource UUID
```

**Returns:**
```typescript
Promise<ClassSession> // Updated session with new resource
```

**Throws:**
- `Error` if session doesn't exist
- `Error` if new resource doesn't exist
- `Error` if resource type is invalid
- `Error` if reassignment creates conflicts

**Example:**
```typescript
import { reassignSessionResource } from '@/lib/services/classSessionService';

// User drags session from "Dr. Smith" row to "Dr. Jones" row
const updated = await reassignSessionResource(
  'session-uuid-789',
  'instructor',
  'dr-jones-uuid'
);

console.log(updated.instructor.last_name); // "Jones"
console.log(updated.classroom.name);       // Unchanged: "Room 101"
```

---

### `getIncompleteSessionsForProgram(programId)`

Retrieves all sessions missing instructor and/or classroom for a specific program.

**Purpose:** Query incomplete sessions to display in the timetable drawer or filter lists.

**Parameters:**
```typescript
programId: string; // Required: Program UUID
```

**Returns:**
```typescript
Promise<ClassSession[]> // Array of incomplete sessions
```

**Throws:**
- `Error` if program doesn't exist
- `Error` if database query fails

**Example:**
```typescript
import { getIncompleteSessionsForProgram } from '@/lib/services/classSessionService';

// Fetch all incomplete sessions for current program
const incompleteSessions = await getIncompleteSessionsForProgram(
  currentProgram.id
);

console.log(incompleteSessions.length); // 5
incompleteSessions.forEach(session => {
  console.log(`${session.course.name}: Missing ${getMissingResources(session).join(', ')}`);
  // Output: "Math 101: Missing instructor, classroom"
});
```

---

### `canPlaceInView(session, viewMode)`

Validates whether a session can be placed in the current timetable view mode.

**Purpose:** Enforce view mode restrictions - incomplete sessions need compatible views for placement.

**Parameters:**
```typescript
session: ClassSession;                              // Required: Session to validate
viewMode: 'class-group' | 'instructor' | 'classroom'; // Required: Current view
```

**Returns:**
```typescript
boolean // true if placement is allowed
```

**Rules:**
- **Class-Group View**: Always allows placement (resources inferred)
- **Instructor View**: Requires `session.instructor !== null`
- **Classroom View**: Requires `session.classroom !== null`

**Example:**
```typescript
import { canPlaceInView } from '@/lib/services/classSessionService';

const incompleteSession = {
  instructor: null,
  classroom: null,
  // ... other fields
};

canPlaceInView(incompleteSession, 'class-group'); // true
canPlaceInView(incompleteSession, 'instructor');  // false (no instructor)
canPlaceInView(incompleteSession, 'classroom');   // false (no classroom)

// After assigning instructor
const partialSession = {
  ...incompleteSession,
  instructor: { id: '...', first_name: 'John', ... }
};

canPlaceInView(partialSession, 'instructor'); // true (now has instructor)
canPlaceInView(partialSession, 'classroom');  // false (still no classroom)
```

---

## Timetable Service Functions

### `moveSessionWithResourceChange(from, to, sessionId, userId, resourceType, newResourceId, status)`

Moves a session and simultaneously changes its instructor or classroom.

**Purpose:** Support drag-and-drop resource reassignment in Instructor/Classroom views.

**Parameters:**
```typescript
from: {
  class_group_id: string;
  period_index: number;
  semester_id: string;
};
to: {
  class_group_id: string;
  period_index: number;
  semester_id: string;
};
class_session_id: string;
user_id: string;
resourceType: 'instructor' | 'classroom';
newResourceId: string;
status?: 'pending' | 'confirmed'; // Default: 'confirmed'
```

**Returns:**
```typescript
Promise<void>
```

**Behavior:**
1. Removes session from original position
2. Updates session with new resource
3. Places session at new position
4. Handles cross-department approval if needed

**Example:**
```typescript
import { moveSessionWithResourceChange } from '@/lib/services/timetableService';

// User drags session from Dr. Smith (Monday P2) to Dr. Jones (Tuesday P4)
await moveSessionWithResourceChange(
  {
    class_group_id: 'group-123',
    period_index: 2,  // Monday Period 2
    semester_id: 'fall-2024'
  },
  {
    class_group_id: 'group-123',
    period_index: 12, // Tuesday Period 4
    semester_id: 'fall-2024'
  },
  'session-789',
  currentUser.id,
  'instructor',
  'dr-jones-uuid',
  'confirmed'
);
```

---

## Type Guards & Utilities

### `isIncompleteSession(session)`

Type guard to check if a session has no resources assigned.

**Example:**
```typescript
import { isIncompleteSession } from '@/types/classSession.utils';

if (isIncompleteSession(session)) {
  console.log('Session needs both instructor and classroom');
}
```

### `isPartiallyComplete(session)`

Type guard to check if exactly one resource is assigned.

**Example:**
```typescript
import { isPartiallyComplete } from '@/types/classSession.utils';

if (isPartiallyComplete(session)) {
  console.log('Session has one resource, needs one more');
}
```

### `isCompleteSession(session)`

Type guard to check if both resources are assigned.

**Example:**
```typescript
import { isCompleteSession } from '@/types/classSession.utils';

if (isCompleteSession(session)) {
  console.log('Session is fully assigned');
}
```

### `getMissingResources(session)`

Returns array of missing resource types.

**Example:**
```typescript
import { getMissingResources } from '@/types/classSession.utils';

const missing = getMissingResources(session);
// Returns: ['instructor', 'classroom'] or ['instructor'] or ['classroom'] or []

console.log(`Missing: ${missing.join(', ')}`);
```

### `getResourceCompletionStatus(session)`

Returns human-readable status label.

**Example:**
```typescript
import { getResourceCompletionStatus } from '@/types/classSession.utils';

const status = getResourceCompletionStatus(session);
// Returns: "Complete" | "Needs resources" | "Partially assigned"
```

---

## Error Handling

All service functions follow consistent error patterns:

```typescript
try {
  const session = await createIncompleteClassSession(data);
} catch (error) {
  if (error.message.includes('not found')) {
    // Handle missing entity
  } else if (error.message.includes('conflict')) {
    // Handle scheduling conflict
  } else {
    // Handle generic error
  }
}
```

**Common Error Messages:**
- `"Course not found"` - Invalid course_id
- `"Class group not found"` - Invalid class_group_id
- `"Instructor not found"` - Invalid instructor_id
- `"Classroom not found"` - Invalid classroom_id
- `"Session not found"` - Invalid session_id
- `"Instructor conflict at period X"` - Double-booking
- `"Classroom conflict at period X"` - Double-booking
- `"Classroom capacity exceeded"` - Too many students

---

## Best Practices

### 1. Always Validate View Mode
```typescript
// ❌ Bad: No validation
const handleDrop = (session) => {
  placeinTimetable(session);
};

// ✅ Good: Validate first
const handleDrop = (session) => {
  if (!canPlaceInView(session, currentViewMode)) {
    toast.error('Cannot place incomplete session in this view');
    return;
  }
  placeInTimetable(session);
};
```

### 2. Use Type Guards for UI Logic
```typescript
// ❌ Bad: Manual null checks everywhere
const badge = session.instructor === null && session.classroom === null
  ? 'Needs resources'
  : 'Partial';

// ✅ Good: Use utility function
const badge = getResourceCompletionStatus(session);
```

### 3. Batch Resource Queries
```typescript
// ❌ Bad: Sequential queries
const incomplete = await getIncompleteSessionsForProgram(programId);
for (const session of incomplete) {
  await assignResourcesToSession(session.id, null, null);
}

// ✅ Good: Batch operations
const incomplete = await getIncompleteSessionsForProgram(programId);
await Promise.all(
  incomplete.map(s => assignResourcesToSession(s.id, null, null))
);
```

---

## React Query Integration

Recommended query keys for caching:

```typescript
// Query incomplete sessions
const { data: incompleteSessions } = useQuery({
  queryKey: ['class-sessions', 'incomplete', programId],
  queryFn: () => getIncompleteSessionsForProgram(programId)
});

// Mutation for assigning resources
const assignMutation = useMutation({
  mutationFn: ({ sessionId, instructorId, classroomId }) =>
    assignResourcesToSession(sessionId, instructorId, classroomId),
  onSuccess: () => {
    queryClient.invalidateQueries(['class-sessions']);
    queryClient.invalidateQueries(['timetable-assignments']);
  }
});

// Mutation for resource reassignment
const reassignMutation = useMutation({
  mutationFn: ({ sessionId, resourceType, newResourceId }) =>
    reassignSessionResource(sessionId, resourceType, newResourceId),
  onSuccess: () => {
    queryClient.invalidateQueries(['class-sessions']);
    queryClient.invalidateQueries(['timetable-assignments']);
  }
});
```
