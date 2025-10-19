# Comprehensive Restructuring Plan: Multi-View Timetable System

## Overview

The current timetable is designed around a **Class Group View** where rows represent class groups and columns represent time periods. To support **Classroom View** and **Instructor View**, we need to restructure the timetable architecture to support multiple "view modes" while maintaining the same core data model and drag-and-drop functionality.

## Core Architecture Changes

### 1. **Create a View Mode System**

**New Type Definitions** (`src/features/timetabling/types/timetable.ts`):

```typescript
export type TimetableViewMode = 'class-group' | 'classroom' | 'instructor';

export interface TimetableViewConfig {
  mode: TimetableViewMode;
  label: string;
  icon: React.ComponentType;
  description: string;
}
```

**New Hook** (`src/features/timetabling/hooks/useTimetableViewMode.ts`):

- Manage the current view mode state (default: 'class-group')
- Provide `setViewMode` function to switch between views
- Persist the selected view mode in localStorage for UX continuity

### 2. **Abstract the Grid Building Logic**

Currently, `buildTimetableGrid` in `src/features/timetabling/utils/timetableLogic.ts` is hardcoded for class groups. We need to make it view-agnostic.

**Refactor `buildTimetableGrid`**:

- Rename to `buildTimetableGridForClassGroups` (keep existing logic)
- Create new functions:
  - `buildTimetableGridForClassrooms(assignments, allClassrooms, totalPeriods)`
  - `buildTimetableGridForInstructors(assignments, allInstructors, totalPeriods)`
- Create a **factory function**: `buildTimetableGrid(assignments, viewMode, resources, totalPeriods)` that delegates to the appropriate builder based on `viewMode`

**Grid Structure Differences**:

- **Class Group View**: Rows = Class Groups, Each cell = sessions assigned to that group at that time
- **Classroom View**: Rows = Classrooms, Each cell = sessions using that classroom at that time
- **Instructor View**: Rows = Instructors, Each cell = sessions taught by that instructor at that time

### 3. **Update Data Fetching in `useTimetable`**

**Modifications to `src/features/timetabling/hooks/useTimetable.ts`**:

- Import `useClassrooms` and `useInstructors` hooks
- Accept `viewMode` as a parameter (from `useTimetableViewMode`)
- Fetch the appropriate resource list based on view mode:

  ```typescript
  const resourceData = useMemo(() => {
    if (viewMode === 'classroom') return allClassrooms;
    if (viewMode === 'instructor') return allInstructors;
    return allClassGroups; // default
  }, [viewMode, allClassrooms, allInstructors, allClassGroups]);
  ```

- Pass `viewMode` and `resourceData` to the refactored `buildTimetableGrid` function

### 4. **Adapt the Timetable Component**

**Modifications to `src/features/timetabling/pages/components/timetable/index.tsx`**:

- Accept `viewMode` as a prop
- Dynamically determine row data based on view mode:

  ```typescript
  const rowItems = useMemo(() => {
    if (viewMode === 'classroom') return allClassrooms;
    if (viewMode === 'instructor') return allInstructors;
    return groups; // class groups
  }, [viewMode, allClassrooms, allInstructors, groups]);
  ```

- Update the "My Groups" vs "Other Groups" separation logic to work with all view modes (e.g., "My Program's Classrooms" vs "Other Classrooms")

**Modifications to `TimetableRow.tsx`**:

- Accept `viewMode` as a prop
- Render the appropriate row label:
  - Class Group View: `group.name`
  - Classroom View: `classroom.name (Capacity: ${classroom.capacity})`
  - Instructor View: `${instructor.first_name} ${instructor.last_name} (${instructor.contract_type})`

### 5. **Update SessionCell for Context-Aware Display**

**Modifications to `src/features/timetabling/pages/components/timetable/SessionCell.tsx`**:

- Accept `viewMode` as a prop
- Adjust tooltip content to highlight the "primary" information based on view:
  - **Classroom View**: Show classroom prominently, then course/instructor/groups
  - **Instructor View**: Show instructor prominently, then course/classroom/groups
  - **Class Group View**: Keep current behavior (course prominently)
- Update the "ownership" logic for drag-and-drop:
  - In Classroom/Instructor views, users can only drag sessions if they belong to their program (same as current logic, but validated differently)

### 6. **Modify Drag-and-Drop Behavior**

**Modifications to `src/features/timetabling/hooks/useTimetableDnd.ts`**:

- Accept `viewMode` as a parameter
- Update `isSlotAvailable` to account for different conflict scenarios:
  - **Classroom View**: Prevent dropping if classroom is already occupied at that time
  - **Instructor View**: Prevent dropping if instructor is already scheduled at that time
  - **Class Group View**: Keep existing logic (group/period availability)
- Update conflict checking to ensure cross-view consistency (e.g., moving a session in classroom view must still respect instructor availability)

**Modifications to conflict checking** (`src/features/timetabling/utils/checkConflicts.ts`):

- Create view-specific conflict validators:
  - `checkClassroomViewConflicts(timetable, session, classroomId, periodIndex, settings)`
  - `checkInstructorViewConflicts(timetable, session, instructorId, periodIndex, settings)`
- Update the main `checkTimetableConflicts` function to delegate based on view mode

### 7. **Update TimetablePage to Orchestrate Views**

**Modifications to `src/features/timetabling/pages/TimetablePage.tsx`**:

- Import and use `useTimetableViewMode`
- Fetch classrooms and instructors data:

  ```typescript
  const { classrooms } = useClassrooms();
  const { instructors } = useInstructors();
  ```

- Pass `viewMode`, `classrooms`, and `instructors` to the `useTimetable` hook
- Add a **View Selector UI** (tab navigation or dropdown) above the timetable:

  ```tsx

     setViewMode('class-group')}>Class Groups
     setViewMode('classroom')}>Classrooms
     setViewMode('instructor')}>Instructors

  ```

- Pass `viewMode` to the `Timetable` component

### 8. **Update Tests**

**New Test Files**:

- `src/features/timetabling/hooks/tests/useTimetableViewMode.test.tsx`
- `src/features/timetabling/utils/tests/timetableLogic.classroom.test.ts`
- `src/features/timetabling/utils/tests/timetableLogic.instructor.test.ts`

**Update Existing Tests**:

- `src/features/timetabling/hooks/tests/useTimetable.integration.test.tsx`: Add tests for each view mode
- `src/features/timetabling/pages/tests/TimetablePage.integration.test.tsx`: Test view switching behavior
- `src/features/timetabling/utils/tests/checkConflicts.test.ts`: Add view-specific conflict scenarios

## Implementation Phases

### Phase 1: Foundation (View Mode System)

1. Create `TimetableViewMode` type and related types
2. Implement `useTimetableViewMode` hook with localStorage persistence
3. Add view selector UI to `TimetablePage` (non-functional, just UI)
4. Update JSDoc for all new types and hooks

### Phase 2: Grid Logic Abstraction

1. Refactor `buildTimetableGrid` into view-specific builders
2. Implement `buildTimetableGridForClassrooms`
3. Implement `buildTimetableGridForInstructors`
4. Create factory function to delegate based on view mode
5. Write comprehensive unit tests for each builder

### Phase 3: Data Integration

1. Update `useTimetable` to accept `viewMode` and fetch appropriate resources
2. Modify `Timetable` component to render different row types
3. Update `TimetableRow` to display context-aware labels
4. Update `SessionCell` tooltip content for each view
5. Write integration tests for data flow

### Phase 4: Drag-and-Drop Adaptation

1. Update `useTimetableDnd` to handle view-specific drop logic
2. Implement view-specific conflict validators in `checkConflicts.ts`
3. Update `isSlotAvailable` to account for view mode
4. Test drag-and-drop in all three views extensively

### Phase 5: Polish & Documentation

1. Add loading states for classroom/instructor data fetching
2. Implement error boundaries for view switching
3. Update user guide documentation with new views
4. Add keyboard shortcuts for view switching (optional)
5. Create a feature plan document in `docs/feature-plans/multi-view-timetable.md`

## UI/UX Considerations

**View Selector Design**:

- Use a tab-based navigation (similar to the component management tabs)
- Icon for each view: Calendar for Class Groups, Building for Classrooms, User for Instructors
- Show active view with highlight and border

**Visual Differentiation**:

- Each view should have a subtle color accent in the header to indicate the current mode
- Class Group View: Blue accent
- Classroom View: Green accent
- Instructor View: Purple accent

**Row Grouping**:

- Maintain "My Program" vs "Other Programs" separation in all views
- In Classroom View: "My Department's Classrooms" vs "Other Departments"
- In Instructor View: "My Department's Instructors" vs "Other Departments"

**Conflict Indicators**:

- Update the warning icon logic to show view-specific conflicts
- Example: In Classroom View, show warning if instructor has a conflict even though classroom is free

## Security & RLS Considerations

**No Database Changes Required**:

- The `timetable_assignments` table structure remains unchanged
- RLS policies continue to work as-is (program-based ownership)
- All view modes are simply different presentations of the same underlying data

**Validation**:

- Ensure users can only drag sessions belonging to their program in all views
- Maintain the same conflict checking regardless of view mode
- Validate on both client and server (RLS handles server-side)

## Migration Strategy

**Backward Compatibility**:

- Default view mode is 'class-group', so existing behavior is preserved
- All existing tests continue to pass with the default view
- No breaking changes to existing API or data model

**Rollout**:

1. Deploy with feature flag (localStorage key: `timetable_multi_view_enabled`)
2. Test with power users (admins, department heads)
3. Gather feedback and iterate
4. Enable for all users
5. Add to user guide and training materials

## File Structure Changes

**New Files**:

```txt
src/features/timetabling/
├── hooks/
│   └── useTimetableViewMode.ts (NEW)
├── utils/
│   ├── timetableLogic.classroom.ts (NEW - extracted logic)
│   └── timetableLogic.instructor.ts (NEW - extracted logic)
├── types/
│   └── viewMode.ts (NEW - view mode types)
└── components/
    └── ViewSelector.tsx (NEW - tab/button UI for switching views)
```

**Modified Files**:

- `src/features/timetabling/pages/TimetablePage.tsx`
- `src/features/timetabling/hooks/useTimetable.ts`
- `src/features/timetabling/hooks/useTimetableDnd.ts`
- `src/features/timetabling/utils/timetableLogic.ts`
- `src/features/timetabling/utils/checkConflicts.ts`
- `src/features/timetabling/pages/components/timetable/index.tsx`
- `src/features/timetabling/pages/components/timetable/TimetableRow.tsx`
- `src/features/timetabling/pages/components/timetable/SessionCell.tsx`

## Success Criteria

- [ ] Users can switch between Class Group, Classroom, and Instructor views seamlessly
- [ ] All three views display the same underlying timetable data correctly
- [ ] Drag-and-drop works in all views with appropriate conflict detection
- [ ] Sessions from other programs appear grayed out in all views
- [ ] View preference persists across page reloads
- [ ] All existing functionality remains intact (backward compatible)
- [ ] No performance degradation (grid building is optimized)
- [ ] Comprehensive test coverage (unit + integration tests)
- [ ] Updated documentation (user guide, architecture docs)
