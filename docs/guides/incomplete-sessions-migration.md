# Migration Guide - Nullable Resources

Guide for upgrading existing ClassFlow installations to support incomplete sessions with nullable instructor/classroom resources.

---

## Overview

This migration adds support for creating class sessions without immediate resource assignment. The changes are **backwards compatible** - all existing sessions remain valid and functional.

### What Changes
- ✅ Database: `instructor_id` and `classroom_id` become nullable
- ✅ Database: New check constraint for valid resource combinations
- ✅ Database: New index for incomplete session queries
- ✅ Types: ClassSession type updated with nullable resources
- ✅ Services: New functions for incomplete session management
- ✅ UI: Form allows optional resources, timetable handles incomplete sessions

### What Doesn't Change
- ❌ Existing sessions keep their resources (no data loss)
- ❌ RLS policies remain the same
- ❌ Cross-department approval workflow unchanged
- ❌ Existing validation logic continues to work

---

## Prerequisites

Before starting the migration:

1. **Backup Database**
   ```bash
   # Create full backup
   pg_dump -h your-host -U your-user -d classflow > backup_$(date +%Y%m%d).sql
   
   # Or use Supabase dashboard: Database > Backups > Create Backup
   ```

2. **Check Current Schema**
   ```sql
   -- Verify current constraints
   SELECT constraint_name, constraint_type
   FROM information_schema.table_constraints
   WHERE table_name = 'class_sessions';
   
   -- Check existing data
   SELECT COUNT(*) as total_sessions,
          COUNT(instructor_id) as with_instructor,
          COUNT(classroom_id) as with_classroom
   FROM class_sessions;
   ```

3. **Test Environment**
   - Apply migration to test/staging environment first
   - Verify all existing functionality works
   - Test new incomplete session features
   - Only then apply to production

4. **Dependencies**
   - PostgreSQL 12+ (Supabase uses PostgreSQL 15)
   - Supabase project with class_sessions table
   - Admin/owner access to database

---

## Migration Steps

### Step 1: Apply Database Migration

The migration is located at: `supabase/migrations/YYYYMMDD_nullable_resources.sql`

**Option A: Via Supabase Dashboard**

1. Navigate to SQL Editor in Supabase dashboard
2. Copy the migration SQL content
3. Paste into SQL editor
4. Click "Run" to execute
5. Verify success message appears

**Option B: Via Supabase CLI**

```bash
# Ensure Supabase CLI is installed
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Apply migration
supabase db push

# Verify migration applied
supabase db remote status
```

**Option C: Manual SQL Execution**

```sql
-- 1. Make instructor_id nullable
ALTER TABLE class_sessions 
  ALTER COLUMN instructor_id DROP NOT NULL;

-- 2. Make classroom_id nullable
ALTER TABLE class_sessions 
  ALTER COLUMN classroom_id DROP NOT NULL;

-- 3. Add check constraint for valid combinations
ALTER TABLE class_sessions 
  ADD CONSTRAINT check_resources_valid CHECK (
    -- All combinations are valid:
    -- Both assigned, one assigned, neither assigned
    (instructor_id IS NOT NULL AND classroom_id IS NOT NULL) OR
    (instructor_id IS NOT NULL AND classroom_id IS NULL) OR
    (instructor_id IS NULL AND classroom_id IS NOT NULL) OR
    (instructor_id IS NULL AND classroom_id IS NULL)
  );

-- 4. Add index for incomplete session queries
CREATE INDEX idx_incomplete_sessions 
  ON class_sessions (program_id, created_at) 
  WHERE instructor_id IS NULL OR classroom_id IS NULL;

-- 5. Add documentation
COMMENT ON COLUMN class_sessions.instructor_id IS 
  'Instructor assigned to this session. NULL if not yet assigned via timetable.';

COMMENT ON COLUMN class_sessions.classroom_id IS 
  'Classroom assigned to this session. NULL if not yet assigned via timetable.';

COMMENT ON CONSTRAINT check_resources_valid ON class_sessions IS 
  'Allows all resource assignment combinations: both, one, or neither resource assigned.';
```

### Step 2: Verify Database Changes

After applying the migration, verify everything worked:

```sql
-- 1. Check columns are nullable
SELECT column_name, is_nullable, data_type
FROM information_schema.columns
WHERE table_name = 'class_sessions'
  AND column_name IN ('instructor_id', 'classroom_id');
-- Expected: is_nullable = 'YES' for both

-- 2. Verify constraint exists
SELECT constraint_name, check_clause
FROM information_schema.check_constraints
WHERE constraint_name = 'check_resources_valid';
-- Expected: One row with the constraint definition

-- 3. Verify index exists
SELECT indexname, indexdef
FROM pg_indexes
WHERE indexname = 'idx_incomplete_sessions';
-- Expected: One row with partial index definition

-- 4. Verify no data was affected
SELECT COUNT(*) as total_sessions,
       COUNT(instructor_id) as with_instructor,
       COUNT(classroom_id) as with_classroom
FROM class_sessions;
-- Expected: Same counts as before migration

-- 5. Test creating incomplete session
INSERT INTO class_sessions (
  course_id, class_group_id, period_count, user_id,
  instructor_id, classroom_id
)
VALUES (
  (SELECT id FROM courses LIMIT 1),
  (SELECT id FROM class_groups LIMIT 1),
  1,
  (SELECT id FROM auth.users LIMIT 1),
  NULL,  -- No instructor
  NULL   -- No classroom
)
RETURNING id;
-- Expected: New session ID returned

-- 6. Clean up test data
DELETE FROM class_sessions WHERE instructor_id IS NULL AND classroom_id IS NULL;
```

### Step 3: Update Application Code

**If using Git/GitHub:**

```bash
# Pull latest changes that include nullable resource support
git fetch origin
git checkout main
git pull origin main

# Install any new dependencies
npm install

# Regenerate Supabase types
npm run supabase:generate-types
# Or manually: supabase gen types typescript --project-id your-project-id > src/integrations/supabase/types.ts
```

**Manual Code Updates (if needed):**

The following files must be updated to handle nullable resources:

1. **Type Definitions** - Already completed in codebase
   - `src/types/classSession.ts`
   - `src/types/classSession.utils.ts`
   - `src/types/validation/classSession.ts`

2. **Service Layer** - Already completed in codebase
   - `src/lib/services/classSessionService.ts`
   - `src/lib/services/timetableService.ts`

3. **UI Components** - Partially completed
   - Form validation (needs update)
   - Timetable drawer (mostly complete)
   - Session cells (complete)

### Step 4: Test the Migration

**Automated Tests (Recommended):**

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e
```

**Manual Testing Checklist:**

- [ ] **Existing Sessions Still Work**
  - [ ] View timetable with existing sessions
  - [ ] Edit existing session
  - [ ] Move existing session to different slot
  - [ ] Delete existing session

- [ ] **Create Complete Session**
  - [ ] Create session with instructor + classroom
  - [ ] Verify it appears in timetable
  - [ ] No dashed border or warning badges

- [ ] **Create Incomplete Session**
  - [ ] Create session without instructor
  - [ ] Create session without classroom
  - [ ] Create session without both
  - [ ] Verify dashed border and warning badges appear

- [ ] **Assign Resources Later**
  - [ ] Drag incomplete session to timetable
  - [ ] Resource modal appears (Class-Group View)
  - [ ] Assign resources and confirm
  - [ ] Session becomes complete

- [ ] **Resource Reassignment**
  - [ ] Switch to Instructor View
  - [ ] Drag session to different instructor row
  - [ ] Confirm reassignment dialog
  - [ ] Verify instructor changed

- [ ] **Conflict Detection**
  - [ ] Try double-booking instructor (should fail)
  - [ ] Try double-booking classroom (should fail)
  - [ ] Verify error messages appear

- [ ] **Cross-Department Workflow**
  - [ ] Assign cross-dept instructor to incomplete session
  - [ ] Verify approval request created
  - [ ] Approve request as department head
  - [ ] Verify session placed successfully

### Step 5: Monitor Production

After deploying to production:

**Immediate Checks (First Hour):**

```sql
-- Check for any errors in logs
SELECT * FROM logs 
WHERE timestamp > NOW() - INTERVAL '1 hour'
  AND level = 'ERROR';

-- Monitor incomplete sessions being created
SELECT COUNT(*) as incomplete_count
FROM class_sessions
WHERE created_at > NOW() - INTERVAL '1 hour'
  AND (instructor_id IS NULL OR classroom_id IS NULL);

-- Check for constraint violations
SELECT * FROM logs
WHERE timestamp > NOW() - INTERVAL '1 hour'
  AND message LIKE '%check_resources_valid%';
```

**Daily Checks (First Week):**

```sql
-- Track incomplete session stats
SELECT 
  DATE(created_at) as date,
  COUNT(*) FILTER (WHERE instructor_id IS NULL AND classroom_id IS NULL) as fully_incomplete,
  COUNT(*) FILTER (WHERE instructor_id IS NULL AND classroom_id IS NOT NULL) as missing_instructor,
  COUNT(*) FILTER (WHERE instructor_id IS NOT NULL AND classroom_id IS NULL) as missing_classroom,
  COUNT(*) FILTER (WHERE instructor_id IS NOT NULL AND classroom_id IS NOT NULL) as complete
FROM class_sessions
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Check average time to resource assignment
SELECT 
  AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/3600) as avg_hours_to_assign
FROM class_sessions
WHERE created_at > NOW() - INTERVAL '7 days'
  AND created_at <> updated_at
  AND instructor_id IS NOT NULL 
  AND classroom_id IS NOT NULL;
```

---

## Rollback Procedure

If critical issues arise, you can rollback the migration.

⚠️ **WARNING:** Rollback will **DELETE** any incomplete sessions (those with null resources).

### Step 1: Identify Incomplete Sessions

```sql
-- Find all incomplete sessions
SELECT id, course_id, class_group_id, period_count,
       instructor_id, classroom_id, created_at
FROM class_sessions 
WHERE instructor_id IS NULL OR classroom_id IS NULL;

-- Export for record-keeping
\copy (SELECT * FROM class_sessions WHERE instructor_id IS NULL OR classroom_id IS NULL) TO 'incomplete_sessions_backup.csv' CSV HEADER;
```

### Step 2: Handle Incomplete Sessions

**Option A: Delete Incomplete Sessions**

```sql
-- Delete all incomplete sessions
DELETE FROM class_sessions 
WHERE instructor_id IS NULL OR classroom_id IS NULL;

-- Verify deletion
SELECT COUNT(*) FROM class_sessions 
WHERE instructor_id IS NULL OR classroom_id IS NULL;
-- Expected: 0
```

**Option B: Assign Placeholder Resources**

```sql
-- Create placeholder instructor if needed
INSERT INTO instructors (first_name, last_name, code)
VALUES ('Placeholder', 'Instructor', 'PLACEHOLDER')
RETURNING id;
-- Note the ID: placeholder_instructor_id

-- Create placeholder classroom if needed
INSERT INTO classrooms (name, code)
VALUES ('Placeholder Classroom', 'PLACEHOLDER')
RETURNING id;
-- Note the ID: placeholder_classroom_id

-- Assign placeholders to incomplete sessions
UPDATE class_sessions 
SET instructor_id = COALESCE(instructor_id, 'placeholder_instructor_id'),
    classroom_id = COALESCE(classroom_id, 'placeholder_classroom_id')
WHERE instructor_id IS NULL OR classroom_id IS NULL;

-- Verify all sessions now have resources
SELECT COUNT(*) FROM class_sessions 
WHERE instructor_id IS NULL OR classroom_id IS NULL;
-- Expected: 0
```

### Step 3: Restore NOT NULL Constraints

```sql
-- Remove check constraint
ALTER TABLE class_sessions 
  DROP CONSTRAINT IF EXISTS check_resources_valid;

-- Restore NOT NULL on instructor_id
ALTER TABLE class_sessions 
  ALTER COLUMN instructor_id SET NOT NULL;

-- Restore NOT NULL on classroom_id
ALTER TABLE class_sessions 
  ALTER COLUMN classroom_id SET NOT NULL;

-- Drop incomplete sessions index
DROP INDEX IF EXISTS idx_incomplete_sessions;

-- Remove comments
COMMENT ON COLUMN class_sessions.instructor_id IS NULL;
COMMENT ON COLUMN class_sessions.classroom_id IS NULL;
```

### Step 4: Verify Rollback

```sql
-- Verify constraints restored
SELECT column_name, is_nullable
FROM information_schema.columns
WHERE table_name = 'class_sessions'
  AND column_name IN ('instructor_id', 'classroom_id');
-- Expected: is_nullable = 'NO' for both

-- Verify all sessions valid
SELECT COUNT(*) as total_sessions
FROM class_sessions;
-- Should match pre-migration count (minus deleted incomplete sessions)
```

### Step 5: Rollback Application Code

```bash
# Revert to previous version
git log --oneline | head -20  # Find commit before migration
git checkout <commit-hash-before-migration>

# Reinstall dependencies
npm install

# Rebuild
npm run build

# Redeploy
# (Deployment command depends on your setup)
```

---

## Troubleshooting

### Issue: Migration Fails with Foreign Key Violation

**Symptom:**
```
ERROR: update or delete on table "class_sessions" violates foreign key constraint
```

**Cause:** Timetable assignments reference sessions that would become incomplete

**Solution:**
```sql
-- Check for related timetable assignments
SELECT ta.id, ta.class_session_id, cs.instructor_id, cs.classroom_id
FROM timetable_assignments ta
JOIN class_sessions cs ON ta.class_session_id = cs.id
WHERE cs.instructor_id IS NULL OR cs.classroom_id IS NULL;

-- If any exist, the migration is safe (just changing nullable, not deleting data)
-- If issue persists, check for cascading delete rules
```

### Issue: Type Errors in Application

**Symptom:**
```
Type 'null' is not assignable to type 'Instructor'
```

**Cause:** TypeScript cache not updated or types not regenerated

**Solution:**
```bash
# Clear TypeScript cache
rm -rf node_modules/.cache

# Regenerate Supabase types
npm run supabase:generate-types

# Restart TypeScript server (VS Code)
# Cmd/Ctrl + Shift + P > "TypeScript: Restart TS Server"

# Rebuild
npm run build
```

### Issue: Queries Still Require Resources

**Symptom:** Form validation fails when submitting without resources

**Cause:** Validation schema not updated

**Solution:**
Update `src/types/validation/classSession.ts`:
```typescript
export const classSessionSchema = z.object({
  course_id: z.string().min(1, 'A course must be selected'),
  class_group_id: z.string().min(1, 'A class group must be selected'),
  classroom_id: z.string().optional(),  // ← Changed from required
  instructor_id: z.string().optional(), // ← Changed from required
  period_count: z.number().int().min(1, 'Duration must be at least 1 period'),
  program_id: z.string().optional(),
});
```

### Issue: Incomplete Sessions Don't Appear in Drawer

**Symptom:** Created incomplete session but can't see it in timetable

**Cause:** 
1. Filter hiding incomplete sessions
2. Query not including null resources
3. Wrong program selected

**Solution:**
```typescript
// Check query includes incomplete
const { data } = await supabase
  .from('class_sessions')
  .select(`
    *,
    course:courses(*),
    instructor:instructors(*),  // Uses LEFT JOIN automatically
    classroom:classrooms(*)     // Uses LEFT JOIN automatically
  `)
  .eq('program_id', programId);

// Filter should default to showing incomplete
const [showIncomplete, setShowIncomplete] = useState(true);
```

---

## Performance Considerations

### Query Performance

The new index improves incomplete session queries:

```sql
-- Before: Full table scan
EXPLAIN ANALYZE
SELECT * FROM class_sessions 
WHERE program_id = 'some-program-id'
  AND (instructor_id IS NULL OR classroom_id IS NULL);

-- After: Index scan (much faster)
-- Uses idx_incomplete_sessions
```

### Expected Impact

- **Index size:** ~1-5% increase in class_sessions table size
- **Query speed:** 10-100x faster for incomplete session queries
- **Insert speed:** Negligible impact (<1% slower)
- **Update speed:** Negligible impact (<1% slower)

### Optimization Tips

```typescript
// ✅ Good: Use the index
const incomplete = await getIncompleteSessionsForProgram(programId);

// ❌ Bad: Full table scan
const all = await getAllClassSessions();
const incomplete = all.filter(s => !s.instructor || !s.classroom);

// ✅ Good: Batch operations
await Promise.all(sessions.map(assignResources));

// ❌ Bad: Sequential operations
for (const session of sessions) {
  await assignResources(session);
}
```

---

## Support

### Getting Help

- Check existing documentation in `docs/features/`
- Review API reference in `docs/api/`
- Search GitHub issues for similar problems
- Contact system administrator

### Reporting Issues

When reporting migration issues, include:
1. PostgreSQL version
2. Supabase CLI version
3. Error messages (full stack trace)
4. Steps to reproduce
5. Current database state (counts, constraints)
6. Application logs

### Emergency Contacts

- **Technical Lead:** [Your Name]
- **Database Admin:** [DBA Name]
- **Supabase Support:** https://supabase.com/support

---

## Post-Migration Tasks

After successful migration:

- [ ] Update user documentation
- [ ] Train program heads on new workflow
- [ ] Monitor incomplete session usage
- [ ] Gather feedback on UX
- [ ] Plan Phase 2 features (form component updates)
- [ ] Schedule performance review after 1 month
- [ ] Document lessons learned
