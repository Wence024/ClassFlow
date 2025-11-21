# Dynamic Resource Timetabling - Implementation Status

## Current Status: 30% Complete (Phases 1-3)

### ✅ COMPLETED

#### Phase 1: Database Schema (100%)
- ✅ Made `instructor_id` and `classroom_id` nullable in `class_sessions` table
- ✅ Added `check_resources_valid` constraint
- ✅ Created partial index `idx_incomplete_sessions` for performance
- ✅ Added column comments for documentation
- **Files Modified**: Database migration executed successfully

#### Phase 2: Type System (100%)
- ✅ Updated `ClassSession` type with nullable resources
- ✅ Created utility types (`IncompleteClassSession`, `PartiallyCompleteClassSession`, `CompleteClassSession`)
- ✅ Implemented type guard functions (`isIncompleteSession`, `isCompleteSession`, etc.)
- ✅ Added helper utilities (`getMissingResources`, `getResourceCompletionStatus`)
- **Files Created**: 
  - `src/types/classSession.ts` (updated)
  - `src/types/classSession.utils.ts` (new)

#### Phase 3: Service Layer (100%)
- ✅ Updated all service functions to handle nullable resources with proper mapping
- ✅ Added `createIncompleteClassSession` function
- ✅ Added `assignResourcesToSession` function
- ✅ Added `getIncompleteSessionsForProgram` query function
- ✅ Added `canPlaceInView` validation function
- **Files Modified**:
  - `src/lib/services/classSessionService.ts`

#### Phase 3.5: Partial Null Safety Updates (20%)
- ✅ Fixed `Drawer.tsx` tooltip to handle null resources
- ✅ Fixed `SessionCell.tsx` invalid data check (course/group only)
- ✅ Fixed `component.tsx` form reset for editing
- **Files Modified**:
  - `src/features/program-head/schedule-class-session/pages/components/Drawer.tsx`
  - `src/features/program-head/schedule-class-session/pages/components/timetable/SessionCell.tsx` (partial)
  - `src/features/program-head/manage-class-sessions/component.tsx`

### 🚧 IN PROGRESS

#### Phase 4: Null Safety Migration (20% complete, 60+ files remaining)

**Current Blockers**: Type errors in critical files requiring null checks:

**Critical Files** (must be fixed to unblock):
1. `src/features/program-head/schedule-class-session/hooks/useTimetableDnd.ts` - 30+ null check errors
2. `src/features/program-head/schedule-class-session/hooks/useTimetable.ts` - 14 errors  
3. `src/features/program-head/schedule-class-session/utils/checkConflicts.ts` - 20 errors
4. `src/features/program-head/schedule-class-session/pages/components/timetable/SessionCell.tsx` - 6 errors (tooltip builder)

**Pattern to Apply**:
```typescript
// Before:
session.instructor.first_name

// After:
session.instructor?.first_name || 'Not assigned'

// or with type guard:
if (session.instructor) {
  session.instructor.first_name
}
```

### ⏳ NOT STARTED

#### Phase 4: Form Component Updates (0%)
- [ ] Add \"Assign resources now\" checkbox to `ClassSessionForm`
- [ ] Implement conditional rendering of resource selectors
- [ ] Update form validation schema for optional resources
- [ ] Add informational message about deferred assignment
- [ ] Handle form submission for incomplete sessions

#### Phase 5: Timetable Integration (0%)
- [ ] Update Drawer component with incomplete session badges
- [ ] Implement resource inference logic in `useTimetableDnd`
- [ ] Create `ResourceAssignmentModal` component
- [ ] Add `useResourceAvailability` hook
- [ ] Implement view mode validation for drops
- [ ] Add visual feedback for invalid drops

#### Phase 6: Visual Indicators (0%)
- [ ] Update `SessionCell` styling for incomplete sessions
- [ ] Add dashed border style for incomplete
- [ ] Show warning badge icons
- [ ] Add `TimetableFilters` component for incomplete toggle
- [ ] Update all tooltips to show resource status

#### Phase 7: View Mode Restrictions (0%)
- [ ] Implement `canPlaceInView` checks in DnD logic
- [ ] Add toast messages for invalid placements
- [ ] Update drop zone validation
- [ ] Restrict incomplete sessions by view mode

#### Phase 8: Testing (0%)
- [ ] Unit tests for type guards (12 tests)
- [ ] Service layer tests (8 tests)
- [ ] Form component integration tests (6 tests)
- [ ] DnD logic integration tests (10 tests)
- [ ] E2E workflow tests (4 scenarios)

#### Phase 9: Department Head Updates (0%)
- [ ] Add incomplete indicators in approval view
- [ ] Update request cards with resource status

#### Phase 10: Documentation (40%)
- [x] Feature documentation
- [x] Architecture document  
- [ ] User training guide
- [ ] API documentation
- [ ] Migration guide for existing installations

---

## Next Steps (Priority Order)

### 1. Complete Null Safety Migration (CRITICAL)
**Estimated Effort**: 4-6 hours

Fix type errors in this order:
1. `useTimetableDnd.ts` - Add null checks before accessing instructor/classroom properties
2. `useTimetable.ts` - Add optional chaining and null guards
3. `checkConflicts.ts` - Update conflict detection to skip null resources
4. `SessionCell.tsx` - Fix tooltip builder with conditional rendering
5. Remaining 50+ files - Systematic null check additions

**Success Criteria**: `npm run typeCheck` passes with 0 errors

### 2. Update Form Component (HIGH)
**Estimated Effort**: 2-3 hours

Add checkbox and conditional rendering:
```typescript
const [assignNow, setAssignNow] = useState(false);

return (
  <form>
    <Checkbox
      checked={assignNow}
      onCheckedChange={setAssignNow}
      label="Assign instructor and classroom now"
    />
    
    {assignNow ? (
      <>
        <InstructorSelector />
        <ClassroomSelector />
      </>
    ) : (
      <InfoBox>Resources will be assigned via timetable</InfoBox>
    )}
  </form>
);
```

### 3. Add Visual Indicators (MEDIUM)
**Estimated Effort**: 3-4 hours

Update `SessionCell` component:
```typescript
const isIncomplete = isIncompleteSession(session);
const missing = getMissingResources(session);

return (
  <div className={cn(
    "session-cell",
    isIncomplete && "border-dashed border-orange-500"
  )}>
    {isIncomplete && (
      <AlertTriangle className="absolute top-1 left-1 text-orange-500" />
    )}
    {/* ... existing content */}
  </div>
);
```

### 4. Implement Resource Assignment Modal (MEDIUM)
**Estimated Effort**: 4-5 hours

Create new `ResourceAssignmentModal` component with:
- Resource selection dropdowns
- Available resource filtering by time slot
- Cross-department warnings
- Confirmation flow

### 5. Add Comprehensive Tests (HIGH)
**Estimated Effort**: 6-8 hours

Write tests for:
- Type guards and utilities
- Service layer functions
- Form component behavior
- DnD logic with incomplete sessions
- End-to-end workflow

---

## Known Issues

### Type Errors (60+)
**Status**: Blocking further development  
**Impact**: Cannot build application  
**Resolution**: Systematic null check additions (see Phase 4 above)

### Missing UI Components
**Status**: Design complete, implementation pending  
**Impact**: Cannot test user workflow  
**Resolution**: Phases 5-6 implementation

### Incomplete Test Coverage
**Status**: 0% for new features  
**Impact**: No validation of implementation  
**Resolution**: Phase 8 test writing

---

## Testing Instructions (Once Unblocked)

### Manual Testing

1. **Create Incomplete Session**:
   ```
   1. Go to "Manage Classes"
   2. Click "Create New Class Session"
   3. Select course and group
   4. Uncheck "Assign resources now"
   5. Click Create
   6. Verify: Session appears with warning badge
   ```

2. **Assign Resources via Timetable**:
   ```
   1. Go to Scheduler page
   2. Find incomplete session in drawer
   3. Drag to timetable grid (class-group view)
   4. Verify: Resource assignment modal opens
   5. Select instructor and classroom
   6. Click Confirm
   7. Verify: Session appears complete in timetable
   ```

3. **View Mode Restrictions**:
   ```
   1. Create incomplete session (no instructor)
   2. Switch to Instructor View
   3. Try to drag incomplete session
   4. Verify: Drop is rejected with error message
   ```

### Automated Testing

```bash
# Type checking
npm run typeCheck

# Unit tests
npm run test -- --run

# Integration tests  
npm run test -- --run src/features/program-head

# E2E tests
npm run test:e2e -- --spec "cypress/e2e/incomplete-sessions.cy.ts"
```

---

## Rollback Plan

If critical issues found:

```sql
-- 1. Assign placeholder resources to incomplete sessions
UPDATE class_sessions 
SET 
  instructor_id = COALESCE(instructor_id, 'placeholder-instructor-id'),
  classroom_id = COALESCE(classroom_id, 'placeholder-classroom-id')
WHERE instructor_id IS NULL OR classroom_id IS NULL;

-- 2. Restore NOT NULL constraints
ALTER TABLE class_sessions 
  ALTER COLUMN instructor_id SET NOT NULL,
  ALTER COLUMN classroom_id SET NOT NULL;

-- 3. Drop incomplete session index
DROP INDEX idx_incomplete_sessions;
```

Then revert code to previous commit.

---

## Resources

- **Feature Documentation**: `docs/features/dynamic-resource-timetabling.md`
- **Architecture Doc**: `docs/architecture/incomplete-sessions-architecture.md`
- **Database Migration**: `supabase/migrations/*_nullable_resources.sql`
- **Type Utilities**: `src/types/classSession.utils.ts`
- **Service Functions**: `src/lib/services/classSessionService.ts`

---

**Last Updated**: 2025-01-21  
**Completion**: 30%  
**Estimated Remaining**: 20-30 hours of development
