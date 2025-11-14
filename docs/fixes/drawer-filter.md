# Drawer Filter Fix - Program/Department Scoping

**Date:** 2025-11-14  
**Issue:** Program heads could see unassigned class sessions from other programs in the drawer  
**Status:** ✅ Implemented

---

## Problem Description

The TimetablePage drawer displayed all unassigned class sessions to all users, regardless of their role or program assignment. A CS program head could see ECE program sessions, which was incorrect behavior.

**Root Cause:**
- `TimetablePage.tsx` fetched all class sessions using `getAllClassSessions()`
- The `unassignedClassSessions` memo filtered only by assignment status (assigned vs unassigned)
- No role-based or program-based filtering was applied to the drawer sessions

---

## Solution Implemented

### Client-Side Filtering Approach

Implemented role-based filtering in `TimetablePage.tsx` to scope drawer sessions appropriately:

**Filtering Rules:**
1. **Admin:** See all unassigned sessions (no filtering)
2. **Program Head:** See only unassigned sessions from their assigned program
3. **Department Head:** See unassigned sessions from all programs in their department

**Implementation Details:**
- Added imports: `useAuth`, `useDepartmentId`, `usePrograms`
- Modified `unassignedClassSessions` memo to apply role-based filtering
- Filter logic executes after assignment filtering but before validation
- Department heads use the inferred department ID via `useDepartmentId()` hook
- Programs data fetched via `usePrograms()` for department-to-program mapping

### Code Changes

**File:** `src/features/timetabling/pages/TimetablePage.tsx`

```typescript
// Added hooks for user context
const { user } = useAuth();
const userDepartmentId = useDepartmentId();
const { listQuery: programsQuery } = usePrograms();

// Enhanced filtering in unassignedClassSessions memo
if (user && user.role !== 'admin') {
  if (user.role === 'program_head' && user.program_id) {
    // Program heads: only their program's sessions
    filtered = filtered.filter((cs) => cs.program_id === user.program_id);
  } else if (user.role === 'department_head' && userDepartmentId) {
    // Department heads: sessions from programs in their department
    const programs = programsQuery.data || [];
    const departmentProgramIds = new Set(
      programs.filter((p) => p.department_id === userDepartmentId).map((p) => p.id)
    );
    filtered = filtered.filter((cs) => cs.program_id && departmentProgramIds.has(cs.program_id));
  }
}
```

---

## Design Decisions

### Why Client-Side Filtering?

**Chose client-side filtering over RLS policy changes because:**
1. The RLS policy `"Allow authenticated users to read all class sessions"` enables cross-program visibility
2. Users need to view other programs' timetables for coordination (viewing != managing)
3. Cross-department resource workflows (instructors, classrooms) require read access to all sessions
4. Drawer scoping is a UI concern, not a data security concern
5. Simpler implementation without migration complexity

### Why Not Change RLS Policy?

**Preserving the permissive RLS policy maintains:**
- Cross-program timetable viewing (essential for scheduling coordination)
- Cross-department instructor/classroom request workflows
- Department head oversight of all department programs
- Conflict detection across programs and departments

The RLS policy for write operations (`INSERT`, `UPDATE`, `DELETE`) already restricts management to authorized users.

---

## Impact Analysis

### What Changed ✅
- **Drawer filtering:** Program heads now see only their program's unassigned sessions
- **Department head scoping:** Department heads see sessions from their department's programs only
- **Admin behavior:** Unchanged (see all sessions)

### What Did NOT Change ✅
- **RLS policies:** No changes to database security policies
- **Timetable viewing:** All users can still view all programs' schedules (grid view)
- **Cross-department resources:** Instructor/classroom request workflows unaffected
- **Assignment management:** Existing permission checks remain intact
- **Data fetching:** `getAllClassSessions()` still fetches all sessions for grid rendering

### Workflow Validation

| Workflow | Status | Notes |
|----------|--------|-------|
| Program head creates session for own program | ✅ Unaffected | Existing RLS handles this |
| Program head views other program's timetable | ✅ Unaffected | Grid view shows all programs |
| Program head drags session to grid | ✅ Scoped | Drawer only shows own program |
| Cross-department instructor request | ✅ Unaffected | Read access preserved |
| Cross-department classroom request | ✅ Unaffected | Read access preserved |
| Department head manages instructors | ✅ Unaffected | Separate resource management |
| Admin manages all resources | ✅ Unaffected | No filtering for admins |

---

## Testing Recommendations

### Manual Testing Scenarios

1. **As CS Program Head:**
   - ✅ Drawer shows only CS program unassigned sessions
   - ✅ Grid view shows all programs' schedules (CS, ECE, etc.)
   - ✅ Can request cross-department instructor from ECE
   - ✅ Can view ECE program timetable for coordination

2. **As Department Head:**
   - ✅ Drawer shows unassigned sessions from all department programs
   - ✅ Grid view shows all programs' schedules
   - ✅ Can manage instructors in own department

3. **As Admin:**
   - ✅ Drawer shows all unassigned sessions
   - ✅ Full access to all features

### Automated Testing (Future)

**Recommended test file:** `src/features/timetabling/pages/tests/TimetablePage.drawer.test.tsx`

```typescript
describe('TimetablePage Drawer Filtering', () => {
  it('shows only program sessions to program heads', async () => {
    // Test program head sees only their program's unassigned sessions
  });

  it('shows department programs to department heads', async () => {
    // Test department head sees all department programs' sessions
  });

  it('shows all sessions to admins', async () => {
    // Test admin sees all unassigned sessions
  });
});
```

---

## Additional Cleanup Performed

### Items Identified But Not Changed (By Design)

1. **`getAllClassSessions()` remains global:**
   - Fetches all sessions for timetable grid rendering
   - Required for cross-program visibility and conflict detection
   - Filtering happens at component level (drawer vs grid)

2. **`useQuery` cache key:**
   - Query key `['allClassSessions']` doesn't include `user.id`
   - Acceptable because data is the same for all users (read-only global view)
   - Filtering is applied in component, not at query level

3. **Type assertions in `classSessionsService.ts`:**
   - `(data as unknown as ClassSession[])` cast remains
   - Generated Supabase types may have minor mismatches
   - No impact on runtime behavior

---

## Dependencies

**Hooks Used:**
- `useAuth()` - Get current user and role
- `useDepartmentId()` - Get department ID for program heads (inferred from program)
- `usePrograms()` - Get programs list for department head filtering

**Data Flow:**
```
User Role → Filter Logic → Drawer Sessions
    ↓
[Admin] → No filter → All unassigned
[Program Head] → program_id filter → Own program only
[Dept Head] → department programs filter → Department programs only
```

---

## Conclusion

The drawer now correctly scopes unassigned sessions based on user role and assignment. The implementation uses client-side filtering to maintain flexibility for cross-program workflows while providing appropriate UI boundaries for session management.

**Key Principle:** *Read access is permissive, write access is restrictive, UI filtering provides appropriate scoping.*
