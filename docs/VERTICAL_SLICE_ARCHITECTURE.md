# Vertical Slice Architecture Guide

## Overview

ClassFlow has been refactored to use a **vertical slice architecture** organized by user role. This architectural pattern groups all code for a specific feature (UI, business logic, data access) into a single directory, making features self-contained and easier to understand, test, and maintain.

## Why Vertical Slices?

### Traditional Layered Architecture Problems
```
src/
├── components/     # All UI components mixed together
├── hooks/          # All hooks from all features
├── services/       # All data access code
└── types/          # All types scattered
```

**Problems:**
- Hard to understand feature boundaries
- Changes to one feature touch many directories
- Difficult to test features in isolation
- Unclear ownership and responsibilities

### Vertical Slice Architecture Benefits
```
src/features/program-head/manage-class-sessions/
├── component.tsx      # UI for this feature
├── hook.ts            # Business logic
├── service.ts         # Data access
├── types.ts           # Feature-specific types
└── tests/             # All tests for this feature
```

**Benefits:**
- ✅ Feature code is co-located
- ✅ Easy to find all code for a feature
- ✅ Clear boundaries between features
- ✅ Self-contained and testable
- ✅ Role-based organization matches user mental model

## Directory Structure

### Role-Based Feature Organization

```
src/features/
├── admin/                      # Admin-only features
│   ├── manage-users/
│   ├── manage-departments/
│   ├── manage-programs/
│   ├── manage-classrooms/
│   └── view-all-requests/
│
├── department-head/            # Department head features
│   ├── manage-instructors/
│   ├── approve-request/
│   ├── reject-request/
│   └── view-department-requests/
│
├── program-head/               # Program head features
│   ├── manage-class-sessions/
│   ├── schedule-class-session/ # Timetabling
│   ├── request-cross-dept-resource/
│   ├── view-pending-requests/
│   └── manage-components/
│
└── shared/                     # Shared across roles
    ├── auth/
    ├── components/
    └── hooks/
```

### Vertical Slice Structure

Each vertical slice follows a consistent structure:

```
feature-name/
├── component.tsx              # Main UI component
├── hook.ts                    # React Query hooks & business logic
├── service.ts                 # Data access layer (calls lib/services)
├── types.ts                   # Feature-specific types
├── types/                     # Additional type definitions (optional)
│   └── validation.ts          # Zod schemas
├── components/                # Feature-specific components (optional)
│   ├── FeatureCard.tsx
│   └── FeatureForm.tsx
└── tests/                     # All tests for this feature
    ├── component.integration.test.tsx
    ├── hook.integration.test.tsx
    └── service.test.ts
```

## Layer Responsibilities

### Component Layer (`component.tsx`)
**Responsibility:** UI rendering and user interactions

```tsx
/**
 * UI component for managing class sessions (Program Head only).
 */
export default function ManageClassSessionsComponent() {
  // Use the hook for business logic
  const { sessions, isLoading, createSession, updateSession } = useManageClassSessions();
  
  // Only UI concerns here
  return (
    <div>
      {/* Form, table, cards, etc. */}
    </div>
  );
}
```

**Guidelines:**
- Focus on presentation and user interaction
- Delegate business logic to hooks
- Handle form state and validation
- Show loading/error states
- Use shadcn/ui components

### Hook Layer (`hook.ts`)
**Responsibility:** Business logic and state management

```tsx
/**
 * Hook for managing class sessions business logic.
 */
export function useManageClassSessions() {
  const { user } = useAuth();
  
  // React Query for data fetching
  const { data: sessions, isLoading } = useQuery({
    queryKey: ['classSessions', user.program_id],
    queryFn: () => service.fetchClassSessions(user.program_id),
  });
  
  // Mutations with optimistic updates
  const createMutation = useMutation({
    mutationFn: service.createClassSession,
    onSuccess: () => {
      queryClient.invalidateQueries(['classSessions']);
      toast.success('Session created');
    },
  });
  
  return {
    sessions,
    isLoading,
    createSession: createMutation.mutate,
  };
}
```

**Guidelines:**
- Use React Query for data fetching/caching
- Implement business rules and validation
- Handle optimistic updates
- Manage loading/error states
- Coordinate between service calls
- Keep pure business logic

### Service Layer (`service.ts`)
**Responsibility:** Data access abstraction

```tsx
/**
 * Service layer for class sessions.
 * Thin wrapper over infrastructure services.
 */
export async function fetchClassSessions(programId: string) {
  return await classSessionsService.fetchByProgram(programId);
}

export async function createClassSession(data: ClassSessionInsert) {
  return await classSessionsService.create(data);
}
```

**Guidelines:**
- Thin wrapper over `lib/services/` (infrastructure)
- Feature-specific data transformations
- Error handling and formatting
- Keep synchronous logic here when possible
- NO direct database calls (use `lib/services/`)

### Infrastructure Layer (`lib/services/`)
**Responsibility:** Direct database/API communication

```tsx
/**
 * Infrastructure service for class sessions.
 * Handles all Supabase database operations.
 */
export async function fetchByProgram(programId: string) {
  const { data, error } = await supabase
    .from('class_sessions')
    .select('*')
    .eq('program_id', programId);
    
  if (error) throw error;
  return data;
}
```

**Guidelines:**
- Direct Supabase queries
- No business logic
- Reusable across features
- Centralized in `lib/services/`

## Testing Strategy

### Test Organization
Each vertical slice has its own `tests/` directory:

```
feature-name/tests/
├── component.integration.test.tsx   # UI component tests
├── hook.integration.test.tsx        # Business logic tests
└── service.test.ts                   # Service layer tests
```

### Component Tests
**Focus:** User interactions and rendering

```tsx
describe('ManageClassSessions Component', () => {
  it('should display sessions in a table', async () => {
    render(<ManageClassSessionsComponent />);
    
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });
  
  it('should create a new session', async () => {
    render(<ManageClassSessionsComponent />);
    
    await userEvent.click(screen.getByText('Add Session'));
    // ... fill form and submit
    
    await waitFor(() => {
      expect(screen.getByText('Session created')).toBeInTheDocument();
    });
  });
});
```

### Hook Tests
**Focus:** Business logic and state management

```tsx
describe('useManageClassSessions Hook', () => {
  it('should fetch sessions for user program', async () => {
    const { result } = renderHook(() => useManageClassSessions(), {
      wrapper: createQueryWrapper(),
    });
    
    await waitFor(() => {
      expect(result.current.sessions).toHaveLength(3);
    });
  });
  
  it('should create session with optimistic update', async () => {
    const { result } = renderHook(() => useManageClassSessions(), {
      wrapper: createQueryWrapper(),
    });
    
    act(() => {
      result.current.createSession(mockSessionData);
    });
    
    await waitFor(() => {
      expect(result.current.sessions).toContainEqual(mockSessionData);
    });
  });
});
```

### Service Tests
**Focus:** Data access logic

```tsx
describe('Class Sessions Service', () => {
  it('should fetch sessions and transform data', async () => {
    vi.mocked(classSessionsService.fetchByProgram)
      .mockResolvedValue(mockData);
    
    const result = await fetchClassSessions('program-123');
    
    expect(classSessionsService.fetchByProgram)
      .toHaveBeenCalledWith('program-123');
    expect(result).toEqual(mockData);
  });
});
```

## Real-World Examples

### Example 1: Manage Class Sessions (Program Head)

**Location:** `src/features/program-head/manage-class-sessions/`

**Feature:** CRUD operations for class sessions with cross-department resource handling

**Structure:**
```
manage-class-sessions/
├── component.tsx       # Form and table UI
├── hook.ts            # CRUD operations with React Query
├── service.ts         # Wrapper over infrastructure
├── types.ts           # ClassSession, validations
└── tests/
    ├── component.integration.test.tsx
    ├── hook.integration.test.tsx
    └── service.test.ts
```

**Key Patterns:**
- Component handles form state with `react-hook-form`
- Hook manages React Query for CRUD operations
- Service layer wraps `lib/services/classSessionsService`
- Cross-department logic handled in hook layer

### Example 2: Approve Request (Department Head)

**Location:** `src/features/department-head/approve-request/`

**Feature:** Approve cross-department resource requests

**Structure:**
```
approve-request/
├── hook.ts            # Approval mutation
├── service.ts         # Calls RPC function
├── types.ts           # Request types
└── tests/
    ├── hook.integration.test.tsx
    └── service.test.ts
```

**Key Patterns:**
- No dedicated component (integrated into dashboard)
- Hook provides `approveRequest` mutation
- Service calls Supabase RPC function
- Toast notifications on success/error

### Example 3: Schedule Class Session (Timetabling)

**Location:** `src/features/program-head/schedule-class-session/`

**Feature:** Drag-and-drop timetable scheduling

**Structure:**
```
schedule-class-session/
├── components/
│   ├── TimetableGrid.tsx
│   ├── SessionCell.tsx
│   └── UnassignedDrawer.tsx
├── hooks/
│   ├── useTimetable.ts
│   ├── useTimetableDnd.ts
│   └── useConflictDetection.ts
├── services/
│   ├── timetableService.ts
│   └── conflictService.ts
├── types/
│   ├── timetable.ts
│   └── conflict.ts
└── tests/
    ├── timetable-hook.integration.test.tsx
    ├── drag-drop-hook.integration.test.tsx
    └── conflict-detection.test.ts
```

**Key Patterns:**
- Complex feature with multiple sub-components
- Multiple specialized hooks for different concerns
- Conflict detection in separate hook
- Extensive drag-and-drop logic

## Shared Features

### When to Share Code

**Create a shared feature when:**
- Used by multiple roles (e.g., auth)
- Pure infrastructure (e.g., database services)
- UI components used everywhere (e.g., buttons, forms)

**Keep code in vertical slice when:**
- Specific to one role or feature
- Contains business logic unique to that feature
- Would add unnecessary coupling if shared

### Shared Directory Structure

```
src/features/shared/
├── auth/                    # Authentication
│   ├── contexts/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   └── types/
├── components/              # Reusable UI components
│   ├── ResourceSelector/
│   └── ColorPicker/
└── hooks/                   # Reusable hooks
    └── useQueryParams.ts

src/lib/services/            # Infrastructure services
├── classSessionsService.ts
├── instructorsService.ts
└── resourceRequestsService.ts
```

## Migration Guidelines

### Migrating to Vertical Slices

1. **Identify the Feature:** What user story does this code support?
2. **Create the Slice Directory:** `src/features/{role}/{feature-name}/`
3. **Move the Component:** Start with the main UI component
4. **Extract the Hook:** Move business logic from component to hook
5. **Create the Service:** Add thin wrapper over infrastructure
6. **Define Types:** Create feature-specific type definitions
7. **Write Tests:** Component, hook, and service tests
8. **Update Imports:** Update all imports to new paths
9. **Remove Old Code:** Delete old files after verification

### Example Migration

**Before (Layered):**
```
src/
├── components/ClassSessionManager.tsx
├── hooks/useClassSessions.ts
├── services/classSessionService.ts
└── types/classSession.ts
```

**After (Vertical Slice):**
```
src/features/program-head/manage-class-sessions/
├── component.tsx
├── hook.ts
├── service.ts
├── types.ts
└── tests/
    ├── component.integration.test.tsx
    ├── hook.integration.test.tsx
    └── service.test.ts
```

## Best Practices

### DO ✅
- Keep features self-contained
- Co-locate related code
- Test each layer independently
- Use clear naming conventions
- Document complex business logic
- Keep services thin
- Extract shared code when it's used 3+ times

### DON'T ❌
- Mix role-specific logic in shared features
- Put business logic in components
- Skip the service layer (always abstract infrastructure)
- Create premature abstractions
- Share code that's used in only one place
- Put database queries in hooks
- Bypass the testing structure

## Common Patterns

### Pattern 1: Form with Validation
```tsx
// component.tsx
export default function FeatureComponent() {
  const { createItem } = useFeature();
  const form = useForm({ resolver: zodResolver(schema) });
  
  const onSubmit = (data) => {
    createItem(data);
  };
  
  return <FormProvider {...form}><form onSubmit={form.handleSubmit(onSubmit)} /></FormProvider>;
}

// hook.ts
export function useFeature() {
  const createMutation = useMutation({
    mutationFn: service.createItem,
    onSuccess: () => toast.success('Created'),
  });
  
  return { createItem: createMutation.mutate };
}
```

### Pattern 2: List with Filters
```tsx
// component.tsx
export default function FeatureComponent() {
  const [filters, setFilters] = useState({});
  const { items } = useFeature(filters);
  
  return <><FilterBar onChange={setFilters} /><ItemList items={items} /></>;
}

// hook.ts
export function useFeature(filters) {
  return useQuery({
    queryKey: ['items', filters],
    queryFn: () => service.fetchItems(filters),
  });
}
```

### Pattern 3: Master-Detail
```tsx
// component.tsx
export default function FeatureComponent() {
  const [selected, setSelected] = useState(null);
  const { items } = useFeature();
  
  return (
    <>
      <ItemList items={items} onSelect={setSelected} />
      {selected && <ItemDetail item={selected} />}
    </>
  );
}
```

## Troubleshooting

### "Where should this code go?"
1. Is it UI-only? → Component
2. Is it business logic? → Hook
3. Is it data access for this feature? → Service
4. Is it shared infrastructure? → `lib/services/`
5. Is it used across roles? → `features/shared/`

### "How do I share code between features?"
1. Is it used 3+ times? Extract to shared
2. Is it role-agnostic? Move to `features/shared/`
3. Is it infrastructure? Move to `lib/services/`
4. Otherwise, keep it duplicated (YAGNI)

### "How do I test this?"
1. Component tests: User interactions
2. Hook tests: Business logic
3. Service tests: Data transformations
4. E2E tests: Full user journeys

## Conclusion

The vertical slice architecture makes ClassFlow more maintainable by:
- **Organizing by feature** instead of by technical layer
- **Role-based structure** matching how users think
- **Self-contained slices** that are easy to understand and test
- **Clear boundaries** between features
- **Consistent patterns** across the codebase

When in doubt, ask: "What user story does this support?" and place the code in that feature's slice.

---

**Last Updated:** 2025-11-20  
**Version:** 1.0  
**Status:** Active refactoring in progress (~75% complete)
