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
  - **Classroom View**: Show course priminently, then groups/instructor
  - **Instructor View**: Show course prominently, then groups/classroom
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

- [x] Users can switch between Class Group, Classroom, and Instructor views seamlessly
- [x] All three views display the same underlying timetable data correctly
- [ ] Drag-and-drop works in all views with appropriate conflict detection
- [ ] Sessions from other programs appear grayed out in all views
- [ ] View preference persists across page reloads
- [ ] All existing functionality remains intact (backward compatible)
- [ ] No performance degradation (grid building is optimized)
- [ ] Comprehensive test coverage (unit + integration tests)
- [ ] Updated documentation (user guide, architecture docs)

## Detailed Test Cases

I'll help you create comprehensive manual test cases for each of these checkpoints. Let me first examine the current implementation to understand the context better.

Now let me look at a few more files to understand the full test coverage requirements:

Perfect! Now I have a comprehensive understanding of the multi-view timetabling implementation. Let me create detailed manual test cases for each checkpoint.

---

# 📋 Multi-View Timetabling - Manual Test Case Checklist

## ✅ 1. Users can switch between Class Group, Classroom, and Instructor views seamlessly

### Test Case 1.1: View Toggle Functionality

**Prerequisites:** Logged in as any user, navigate to `/scheduler`

**Steps:**

1. Observe the view selector buttons at the top (Class Groups, Classrooms, Instructors)
2. Click on "Classrooms" button
3. Observe the timetable reorganizes to show classrooms as rows
4. Click on "Instructors" button
5. Observe the timetable reorganizes to show instructors as rows
6. Click back on "Class Groups" button

**Expected Results:**

- All three buttons are visible and clickable
- Active button shows: `bg-background text-foreground shadow-sm font-medium`
- Inactive buttons show: `text-muted-foreground`
- Each view switches instantly (<500ms)
- No console errors during switching
- Icons change appropriately (Calendar/Building/User)

---

### Test Case 1.2: View Persistence Across Page Reloads

**Prerequisites:** Logged in as any user

**Steps:**

1. Navigate to `/scheduler`
2. Switch to "Classroom" view
3. Refresh the page (F5 or Ctrl+R)
4. Observe which view loads
5. Switch to "Instructor" view
6. Navigate away to `/classes` page
7. Navigate back to `/scheduler`

**Expected Results:**

- After step 3: Classroom view should still be active
- After step 7: Instructor view should still be active
- LocalStorage key `timetable_view_mode` should contain the correct value
- View mode persists across navigation and page reloads

---

## ✅ 2. All three views display the same underlying timetable data correctly

### Test Case 2.1: Data Consistency Across Views

**Prerequisites:**

- Logged in as Program Head
- At least 3 class sessions created and scheduled in the timetable
- Sessions should include multi-period sessions (e.g., 2-hour classes)

**Steps:**

1. In **Class Group** view, note the following for a scheduled session:
   - Course code displayed
   - Period position (e.g., Monday Period 3)
   - Whether it's a multi-period session (spans multiple cells)
2. Switch to **Classroom** view
3. Locate the same session by searching for the classroom name
4. Verify the session appears in the same time slot
5. Switch to **Instructor** view  
6. Locate the same session by searching for the instructor name
7. Verify the session appears in the same time slot

**Expected Results:**

- Session appears in **all three views** at the same time position
- Multi-period sessions span the same number of cells in all views
- Course code, colors, and visual styling remain consistent
- No duplicate or missing sessions across views

---

### Test Case 2.2: Merged Class Verification

**Prerequisites:**

- Two different class groups scheduled in the same period with same course, instructor, and classroom
- This creates a "merged class" scenario

**Steps:**

1. In **Class Group** view:
   - Locate both groups' rows
   - Verify both show the merged session indicator (Users icon with count "2")
2. Switch to **Classroom** view:
   - Locate the classroom row
   - Verify the session shows the merged indicator with count "2"
   - Hover over the session to see tooltip with "Merged Groups" list
3. Switch to **Instructor** view:
   - Locate the instructor row
   - Verify the session shows the merged indicator

**Expected Results:**

- Merged sessions display correctly in all three views
- Merged indicator (Users icon + count) appears in all views
- Tooltip in all views shows complete list of merged groups
- Same gradient/visual treatment in all views

---

## ⚠️ 3. Drag-and-drop works in all views with appropriate conflict detection

### ✅ Test Case 3.1: Basic Drag & Drop in All Views

**Prerequisites:** Program Head user with unassigned sessions in drawer

**Steps:**

1. In **Class Group** view:
   - Drag an unassigned session from drawer
   - Drop into a valid empty slot
   - Verify session appears
2. Switch to **Classroom** view:
   - Drag the same session from its current position
   - Drop into a different valid empty slot in the same classroom row
3. Switch to **Instructor** view:
   - Drag the same session again
   - Drop into another valid slot in the same instructor row

**Expected Results:**

- Drag initiates successfully in all three views (cursor changes to grabbing)
- Valid drop zones show green indicator
- Invalid zones show red indicator
- Session moves successfully in all views
- After moving in one view, the session position updates in all other views
- No console errors

---

### ✅ Test Case 3.2: Boundary Conflict Detection (All Views)

**Prerequisites:** Schedule configured with 8 periods per day, 5 days = 40 total periods

**Steps:**

1. In **Class Group** view:
   - Drag a **3-period session** from drawer
   - Attempt to drop at period 38 (would extend to period 40, which is at day boundary)
   - Observe error message
2. Attempt to drop the same session at period 39 (would extend beyond period 40)
3. Switch to **Classroom** view and repeat steps 1-2
4. Switch to **Instructor** view and repeat steps 1-2

**Expected Results:**

- All attempts show red drop zone indicator
- Toast error: "Boundary conflict: The session extends beyond the last period of the day..."
- Session does NOT get placed
- Behavior is **identical** in all three views

---

### ✅ Test Case 3.3: Multi-Period Classroom Conflict (Classroom View)

**Prerequisites:**

- Session A: 2-period class in Classroom "R101" at periods 6-7
- Session B: 2-period class (unassigned)

**Steps:**

1. Switch to **Classroom** view
2. Locate the "R101" row
3. Drag Session B from drawer
4. Attempt to drop at period 7 (would span periods 7-8, overlapping with Session A)
5. Observe conflict indicator
6. Attempt to drop at period 5 (would span periods 5-6, overlapping with Session A)

**Expected Results:**

- Both drop attempts show **red** indicator
- Toast error: "Classroom conflict: Period X is already occupied..."
- Session B does NOT get placed
- **This previously was bypassed but should now work** ✅

---

### ✅ Test Case 3.4: Multi-Period Instructor Conflict (Instructor View)

**Prerequisites:**

- Instructor "Dr. Smith" teaching Session A (3-period class) at periods 10-12
- Session B (2-period, same instructor) unassigned

**Steps:**

1. Switch to **Instructor** view
2. Locate "Dr. Smith" row
3. Drag Session B from drawer
4. Attempt to drop at period 11 (would overlap periods 11-12)
5. Attempt to drop at period 9 (would span 9-10, adjacent but not overlapping)

**Expected Results:**

- Step 4: Red indicator, toast error about instructor conflict
- Step 5: **Green indicator**, successful placement (no overlap)
- Multi-period instructor conflicts are properly detected

---

### ✅ Test Case 3.5: Group Double-Booking Prevention (All Views)

**Prerequisites:**

- Class Group "BSIT 3" has Session A at periods 13-14
- Session B (for same group, different course) is unassigned

**Steps:**

1. In **Classroom** view:
   - Drag Session B (which belongs to "BSIT 3")
   - Attempt to drop at period 13 in ANY classroom row
2. Observe error about group conflict
3. Switch to **Instructor** view:
   - Drag Session B
   - Attempt to drop at period 14 in ANY instructor row
4. Observe the same group conflict error

**Expected Results:**

- **Even in Classroom/Instructor views**, the system prevents double-booking the class group
- Toast error: "Group conflict: Period 13 is already occupied by class '...' for group 'BSIT 3'"
- This ensures students cannot be in two places at once
- **This fix was recently implemented** ✅

---

### Test Case 3.6: Merged Session Dragging (Classroom View)

**Prerequisites:**

- Merged session exists: Group A + Group B, same course/instructor/classroom
- User is Program Head for the program containing Group A

**Steps:**

1. In **Classroom** view:
   - Locate the merged session
   - Hover over it - cursor should show "grab" (not "not-allowed")
2. Drag the merged session to a new valid slot in the same classroom row
3. Observe the move

**Expected Results:**

- Session is draggable because user owns Group A
- Both Group A and Group B's schedules update (merged session moves together)
- **This fix ensures the user's session is found in merged arrays** ✅
- If user did NOT own any group in the merge, cursor shows "not-allowed"

---

### Test Case 3.7: Cross-View Resource Mismatch Prevention

**Prerequisites:** Program Head with multiple sessions

**Steps:**

1. In **Classroom** view:
   - Drag Session A (assigned to "Room 101") from its current position
   - Attempt to drop it in the "Room 202" row
2. Observe error message
3. Switch to **Instructor** view:
   - Drag Session B (taught by "Dr. Smith") from its current position
   - Attempt to drop it in the "Prof. Jones" row

**Expected Results:**

- Step 2: Red indicator, error: "Cannot place this session in a different classroom..."
- Step 4: Red indicator, error: "Cannot place this session with a different instructor..."
- Sessions can only be moved within rows that match their resource
- In Class Group view, sessions can only be moved within their own group's row

---

## ⚠️ 4. Sessions from other programs appear grayed out in all views

### Test Case 4.1: Visual Differentiation of Foreign Sessions

**Prerequisites:**

- Two programs: "BSIT" (user's program) and "BSCS" (other program)
- Both programs have sessions scheduled in the timetable
- Logged in as Program Head of BSIT

**Steps:**

1. In **Class Group** view:
   - Locate a BSIT group row with your session (should have color)
   - Locate a BSCS group row with their session
   - Compare visual styling
2. Switch to **Classroom** view:
   - Find a classroom row containing both BSIT and BSCS sessions
   - Compare the visual styling of both sessions
3. Switch to **Instructor** view:
   - Find an instructor row with sessions from both programs
   - Compare visual styling

**Expected Results:**

- **Your program's sessions:**
  - Full color based on instructor color
  - Normal opacity
  - Cursor shows "grab" on hover
- **Other program's sessions:**
  - Background: `#E5E7EB` (gray)
  - Opacity: 0.8
  - Text color: `#4B5563` (muted gray)
  - Cursor shows "not-allowed" on hover
- Behavior is **consistent across all three views**

---

### Test Case 4.2: Foreign Session Interaction Restrictions

**Prerequisites:** Same as 4.1

**Steps:**

1. In **Classroom** view:
   - Attempt to drag a session from another program
2. Attempt to drop your own session on top of a foreign session
3. Hover over foreign session to see tooltip

**Expected Results:**

- Step 1: Drag does NOT initiate (cursor stays "not-allowed")
- Step 2: Red drop indicator, conflict error
- Step 3: Tooltip shows session details but no edit capability
- Foreign sessions are completely read-only

---

## ✅ 5. View preference persists across page reloads

**(Already covered in Test Case 1.2)**

### Additional Test Case 5.1: LocalStorage Inspection

**Prerequisites:** Browser DevTools open

**Steps:**

1. Navigate to `/scheduler`
2. Open DevTools → Application → Local Storage
3. Find key: `timetable_view_mode`
4. Switch between views and observe the value change
5. Manually delete the key
6. Refresh the page

**Expected Results:**

- Value changes immediately when switching views
- Possible values: `class-group`, `classroom`, `instructor`
- After deleting and refreshing: defaults to `class-group`
- No errors in console

---

## ⚠️ 6. All existing functionality remains intact (backward compatible)

### Test Case 6.1: Legacy Class-Group View Functionality

**Prerequisites:** Program Head user

**Steps:**

1. Verify all original features work in Class-Group view:
   - Create new class session
   - Assign session to timetable
   - Move session between periods
   - Delete session from timetable
   - View unassigned sessions in drawer
   - Conflict detection (boundary, instructor, classroom, group)
2. Verify Session Cell tooltips work
3. Verify soft conflict warnings (capacity issues) appear

**Expected Results:**

- All features work exactly as before multi-view implementation
- No regressions in original functionality
- Tooltip content matches original design
- Warning indicators (yellow triangle) appear correctly

---

### Test Case 6.2: Admin Resource Management

**Prerequisites:** Admin user

**Steps:**

1. Navigate to `/instructors` (Admin Instructor Management)
2. Create a new instructor
3. Navigate to `/classrooms`
4. Create a new classroom
5. Navigate to `/scheduler` (should show all views)
6. Verify new resources appear in Classroom and Instructor views

**Expected Results:**

- Admin can still manage instructors and classrooms
- New resources immediately appear in respective views
- No permission errors or UI breaks

---

## ⚠️ 7. No performance degradation (grid building is optimized)

### Test Case 7.1: Large Dataset Performance

**Prerequisites:**

- Database with 50+ class sessions scheduled
- 10+ class groups
- 15+ classrooms  
- 20+ instructors

**Steps:**

1. Navigate to `/scheduler` in Class-Group view
2. Note initial load time (use browser DevTools Network tab)
3. Switch to Classroom view
4. Note view switch time
5. Switch to Instructor view
6. Note view switch time
7. Drag a session from drawer to grid
8. Note drop response time

**Expected Results:**

- Initial load: < 2 seconds
- View switching: < 500ms
- Drag-drop response: < 300ms
- No UI freezing or janky animations
- Console shows no performance warnings
- Grid building functions use optimized algorithms (Map-based lookups, not nested loops)

---

### Test Case 7.2: Memory Leak Check

**Prerequisites:** Browser DevTools Memory profiler

**Steps:**

1. Navigate to `/scheduler`
2. Take memory snapshot
3. Switch between views 20 times rapidly
4. Take another memory snapshot
5. Compare memory usage

**Expected Results:**

- Memory increase should be < 5MB
- No significant memory leaks
- Garbage collection properly releases old grid instances

---

## ⚠️ 8. Comprehensive test coverage (unit + integration tests)

### Test Case 8.1: Review Existing Test Files

**Prerequisites:** Access to codebase

**Checklist:**

- [ ] `src/features/timetabling/utils/tests/timetableLogic.factory.test.ts`
  - Tests `buildTimetableGrid` factory function for all view modes
- [ ] `src/features/timetabling/utils/tests/timetableLogic.classroom.test.ts`
  - Tests classroom-specific grid building and merging
- [ ] `src/features/timetabling/utils/tests/timetableLogic.instructor.test.ts`
  - Tests instructor-specific grid building and merging
- [ ] `src/features/timetabling/utils/tests/timetableLogic.test.ts`
  - Tests class-group view (original) with merging logic
- [ ] `src/features/timetabling/hooks/tests/useTimetableViewMode.test.tsx`
  - Tests view mode persistence and state management
- [ ] `src/features/timetabling/pages/tests/TimetablePage.integration.test.tsx`
  - Integration test for full page with all views
- [ ] `src/features/timetabling/pages/components/timetable/tests/SessionCell.test.tsx`
  - Unit tests for SessionCell in all view modes
- [ ] `src/features/timetabling/pages/components/timetable/tests/SessionCell.integration.test.tsx`
  - Integration tests for SessionCell drag-drop behavior

**Expected Results:**

- All test files exist and are passing
- Coverage includes:
  - Grid building for all three views
  - Session merging logic
  - Conflict detection (boundary, row, group)
  - View mode switching
  - Drag-drop interactions
  - Foreign session rendering

---

### Test Case 8.2: Run Test Suite

**Prerequisites:** Development environment set up

**Steps:**

```bash
# Run all tests
npm run test

# Run specific test suites
npx vitest run src/features/timetabling/utils/tests/
npx vitest run src/features/timetabling/hooks/tests/
npx vitest run src/features/timetabling/pages/tests/
```

**Expected Results:**

- All tests pass (0 failed)
- Coverage reports show >80% coverage for multi-view logic
- No test timeout errors
- No flaky tests (run 3 times to verify)

---

## ⚠️ 9. Updated documentation (user guide, architecture docs)

### Test Case 9.1: User Guide Completeness

**Prerequisites:** Access to `docs/user-guide.md`

**Checklist:**

- [ ] Section explaining view modes exists
- [ ] Instructions on switching between views
- [ ] Screenshots or descriptions of each view
- [ ] Explanation of grayed-out sessions from other programs
- [ ] FAQ entry: "Why can't I drag sessions from other programs?"
- [ ] FAQ entry: "What's the difference between the three views?"
- [ ] Updated "Step 3: Schedule on the Timetable" section to mention views

**Current Status:** ❌ User guide mentions timetable but does NOT explain multi-view feature

**Required Updates:**

```markdown
### Step 3: Schedule on the Timetable

1. Navigate to the **Timetable** page.
2. **Choose your view**: Use the view selector at the top to switch between:
   - **Class Groups**: See the schedule organized by student groups (default)
   - **Classrooms**: See which classes are scheduled in each room
   - **Instructors**: See each instructor's teaching schedule
3. Sessions from other programs appear grayed out and are read-only.
4. Your unassigned classes are in the **"Available Classes"** drawer at the bottom.
5. **Drag** a class and **drop** it onto a valid slot.

**Note:** You can move sessions in any view mode, but they must remain in the row that matches their resource (e.g., in Classroom view, a session in Room 101 can only be moved within the Room 101 row).
```

---

### Test Case 9.2: Architecture Documentation

**Prerequisites:** Access to `docs/architecture.md` or equivalent

**Checklist:**

- [ ] Multi-view system architecture diagram
- [ ] Explanation of `TimetableViewMode` type
- [ ] Data flow: `viewMode` → `useTimetable` → `buildTimetableGrid` → view-specific builders
- [ ] Conflict detection strategy per view mode
- [ ] Explanation of "resource row ID" concept (changes meaning per view)
- [ ] Merging logic across views
- [ ] LocalStorage persistence strategy

**Current Status:** Needs verification

---

### Test Case 9.3: Code Documentation (JSDoc)

**Prerequisites:** Access to source code

**Checklist for each key file:**

- [ ] `src/features/timetabling/hooks/useTimetable.ts` - JSDoc explains viewMode parameter
- [ ] `src/features/timetabling/utils/timetableLogic.ts` - JSDoc for each builder function
- [ ] `src/features/timetabling/utils/checkConflicts.ts` - JSDoc explains viewMode impact
- [ ] `src/features/timetabling/components/ViewSelector.tsx` - Component documentation
- [ ] `src/features/timetabling/types/timetable.ts` - Type definitions documented

**Expected Results:**

- All exported functions have JSDoc comments
- Parameters include `@param` descriptions
- Return types have `@returns` descriptions
- Complex logic has inline comments

---

## 📊 Summary and Quick Reference

### ✅ Implemented & Verified

1. ✅ View switching UI (ViewSelector component)
2. ✅ View persistence (localStorage)
3. ✅ Grid building for all three views
4. ✅ Basic data consistency across views

### ⚠️ Needs Verification (Manual Testing Required)

3. ⚠️ **Drag-and-drop in all views** - Multiple test cases above
4. ⚠️ **Grayed-out foreign sessions** - Visual and interaction tests
6. ⚠️ **Backward compatibility** - Regression testing
7. ⚠️ **Performance** - Load time and memory testing
8. ⚠️ **Test coverage** - Run test suite and verify
9. ⚠️ **Documentation updates** - User guide and architecture docs

### 🎯 Critical Test Focus Areas

Based on recent fixes and console logs, prioritize these:

1. **Multi-period conflict detection in Classroom/Instructor views** (Test 3.3, 3.4)
2. **Group double-booking prevention in all views** (Test 3.5)
3. **Merged session dragging** (Test 3.6)
4. **Foreign session visual treatment** (Test 4.1, 4.2)

---

## 🔧 Test Execution Strategy

### Phase 1: Core Functionality (30 min)

- Test Cases 1.1, 1.2, 2.1, 2.2
- Goal: Verify view switching and data consistency

### Phase 2: Drag & Drop (45 min)

- Test Cases 3.1 through 3.7
- Goal: Verify all conflict detection scenarios

### Phase 3: Permission & Display (20 min)

- Test Cases 4.1, 4.2
- Goal: Verify foreign session restrictions

### Phase 4: Quality & Docs (30 min)

- Test Cases 6.1, 7.1, 8.2, 9.1
- Goal: Regression testing and documentation audit

---

Would you like me to create a more detailed test plan for any specific test case, or would you like me to help prioritize which tests to run first based on the recent changes?
