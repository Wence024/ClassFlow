# Todos

Here is a rearranged, consolidated, and prioritized to-do list.

## 🟠 Active and Critical (Open) Tasks

*This phase focuses on high-impact, quick wins that significantly improve the user experience and address direct panel feedback.*

1. [x] **[UI] Separate Loading States for Clarity**
    * **Task:** `UI issue: separate submit loading in forms vs fetching loading in lists.`
    * **Action:** Modify your data hooks (`useClassGroups`, `useCourses`, etc.) to return distinct loading states (e.g., `isListLoading`, `isAdding`, `isUpdating`). Update UI components to use these for more granular feedback.

2. [x] **[UI] Enhance Timetable Tooltip**
    * **Task:** `Tooltip shall have course code. (panel priority ML)`
    * **Action:** In `Timetable.tsx`, add the `course.code` to the tooltip's display string.

3. [x] **[UX] Implement Confirmation Modals for Deletion**
    * **Task:** `Add confirm Delete modal for every remove/delete action.`
    * **Action:** Create a reusable confirmation modal. Implement logic in your UI to show this modal before any `remove...` mutation is called to prevent accidental data loss.

4. [x] **[UI] Fix Tooltip Truncation**
    * **Task:** `Timetabling: Fix tooltip truncating outside timetable area`
    * **Action:** Adjust the CSS for the tooltip in `Timetable.tsx`. This might involve ensuring the timetable's container doesn't have `overflow: hidden` or using a portal-based tooltip library that renders at the root of the document.

5. [x] **[UI/UX] Implement Collapsible Sidebar**
    * **Task:** `Add collapsible sidebar to maximize screen space for content-dense pages`
    * **Branch:** `feat/collapsible-sidebar`
    * **Status:** ✅ Completed
    * **Action:** Created `LayoutContext` for global sidebar state management. Integrated toggle button in Header with collapse/expand icons. Refactored Sidebar to support icon-only collapsed mode with hover tooltips. Added smooth transitions and comprehensive test coverage.
    * **Documentation:** See `docs/feature-plans/collapsible-sidebar.md` for full details.

## **Phase 2: Advanced Scheduling & Data Integrity (Current Sprint)**

*With the UI polished, this phase focuses on implementing the next major piece of core functionality: resource-aware conflict detection.*

1. [x] **[Data Model] Extend Core Data Models**
    * **Task:** `Component Details: Extend detail inputs for...`
    * **Action:**
        ✅ Add `size` and `student_count` to tables.
        ✅ Regenerate Supabase types.
        ✅ Update Zod schemas.
        ✅ Refactor forms to a composable, type-safe architecture.
        ✅ Add detailed fields for Instructors (first/last name, etc.).
        ✅ Add color and short code fields to all components.
        ✅ Implement random color generation for new items.
        ✅ Implement client-side search/filter on management pages.

2. **[Logic] Implement Advanced Conflict Detection**
    * **Task:** `Conflict: Implement advanced conflict detection logic` (Capacity check complete)
    * **Action:** Update your `checkConflicts.ts` utility. The main conflict-checking function should now use the new `classroom.capacity` and `classgroup.student_count` to detect capacity-based conflicts.
    * Observed problems:

3. [x] **[UI/UX] Visualize Timetabling Actions**
    * **Task:** `Timetabling: Availability marks for moving class sessions across periods`
    * **Action:** In `Timetable.tsx`, use the `onDragOver` event to call the conflict detection logic and conditionally apply a class to the target cell for instant feedback.

4. [x] **[Data Integrity] Restrict Invalid Timetabling Moves**
5. **[RBAC/UI] Add protected navigation links**
    * **Task:** Add nav links to `/dept-head` and `/browse/instructors` for authorized roles only.
    * **Status:** Pending

6. **[UX] Improve ProgramHeadInstructors selection UX**
    * **Task:** Replace generic `FormField` with `Select` component, add empty state guidance.
    * **Status:** Pending

7. **[Tests] Add integration tests for new pages**
    * **Task:** Create tests for DepartmentHeadDashboard and ProgramHeadInstructors.
    * **Status:** Pending

    * **Task:** `Timetabling: Restrict moving Class sessions to other unintended class groups`
    * **Action:** In the `onDropToGrid` handler within `useTimetableDnd.ts`, check if the dragged `ClassSession`'s `group.id` matches the target `groupId`. If they don't match, show a notification and abort the update.

## **Phase 3: Scaling, Administration & Performance (Mid-Term)**

*This phase expands the application's capabilities for multiple users, administrators, and larger data sets.*

1. [x] **[Auth] Implement User Roles and Permissions**
    * **Tasks:**
        * `User management: Add Profile, roles (program head vs admin) and program to each user.`
        * `User/Timetabling: Assign class session timetabling ownership based on program instead of user`
    * **Action:** Extend your Supabase user profiles table. Implement role-based access control (RBAC), likely with Supabase's Row Level Security (RLS) policies.

2. **[Admin] Build Administrator Controls**
    * **Tasks:**
        * `Admin/Semesters: Allow schedule configuration to admin users only...`
        * `Semesters: Allow admin to CRUD schedule for upcoming semesters`
    * **Action:** Create new admin-only pages and services, protected by the roles defined in the previous step.

3. **[Features] Implement Search, Filtering & Dynamic Views**
    * **Tasks:**
        * `Search and filter feature for class sessions and components`
        * `Implement Dynamic Timetable Views` (pivot by instructor, classroom, etc.)
    * **Action:** This is a major feature. It will involve adding search/filter state to your component hooks, updating Supabase service functions to handle filter parameters, and creating new UI components to display the pivoted data.

4. **[Performance] Implement Optimistic Updates**
    * **Task:** `Introduce optimistic UI updates to reduce waiting time for users.`
    * **Action:** Refactor your `useMutation` calls (especially in `useTimetableDnd.ts` and the component hooks) to use `onMutate`, `onError`, and `onSettled` for a faster, more responsive UI.

5. **[Performance] Implement Pagination for Component Lists**
    * **Task:** `Implement pagination or lazy loading for large course lists.`
    * **Action:** Update your Supabase services to accept `page` and `limit` parameters. Convert relevant `useQuery` hooks to `useInfiniteQuery` to handle fetching and displaying paginated data.

## **Phase 4: Long-Term & Ongoing Tasks**

*These are continuous improvement tasks essential for the project's health, maintainability, and long-term success.*

* **[Data Integrity] Implement Transactional Operations**
  * **Task:** `Check for any potential Data anomalies... / Should have commit/rollback functionality...`
  * **Action:** For complex operations (like deleting a course and all its associated sessions), create a Supabase RPC (database function) to perform the actions within a single transaction, ensuring data consistency.
* **[DevOps] Setup Continuous Integration (CI)**
  * **Task:** `Developer: Setup Continuous Integration setup`
  * **Action:** Create a GitHub Actions or similar CI pipeline to automatically run linting, type checks, and tests on every pull request.
* **[Testing] Expand Test Coverage**
  * **Task:** `Add or update unit tests for hooks and context logic.`
  * **Action:** As you add new features (especially complex logic like advanced conflict detection or RBAC), write corresponding unit and integration tests.
* **[Documentation] Maintain and Update Documentation**
  * **Tasks:**
    * `Update all docs and onboarding doc comments...`
    * `Review and update README.md...`
  * **Action:** Regularly update all documentation to reflect the current state of the architecture and features.

---

## **Other Tasks & Ideas (Backlog)**

*These items are valuable but are lower priority than the core roadmap.*

* [ ] **[UX]** Fix: success/error update in forms has a white color instead of red/green.
* [ ] **[UI]** Add a zoom feature to timetable.
* [ ] **[UI]** Consolidate management pages into a single, more integrated UI.
* [ ] Implement captcha in login
* [ ]**[UI]** Implement a light/dark mode theme.
* [ ] **[UX]** Add tooltips and placeholder hints for all form fields.
* [x] **[UX]** Show assigned component colors in the timetable class session box.
* [ ] **[Auth]** Implement CAPTCHA in the login/register forms.
* [ ] **[Data Model]** Allow classrooms and instructors to be optional in class sessions.
* [ ] **[Architecture]** Centralize error handling with a `useApiMutation` hook.
* [ ] Keyboard shortcuts and navigation
* [ ] Allow classrooms and instructors to be optional in class sessions.
* [x] Add program assignment: Create an instructor entity to be assigned temporarily to another program
* [ ] Add location field to classroom component UI
* [ ] Add keyboard input in class session assignment UI
* [ ] Sort/filter issue in class sessions and components
  * Majors vs general subjects
  * Teachers in program/department vs other programs/departments
* [x] The prop drilling issue is very rampant for `timetable/index.tsx`. Perhaps a local context-based usage is effective on some of the variables.
* [x] Major feature: multi-user workflow
  * [x] Data models: user attributes as program head role and assigned workflow
  * [x] Prerequisite: Role access and admin schedule config controls

Refactor backlogs:

* [ ] **[Refactor]** Decompose monolithic management tab components (`CourseTab`, `ClassroomTab`, etc.) into smaller, more focused form and view components to reduce complexity.
* [ ] **[Refactor]** Further reduce prop drilling in the main `Timetable` component, potentially by expanding the `TimetableContext` or creating more specialized child components.
* [ ] **[Refactor]** Simplify the `buildTimetableGrid` utility to reduce its cognitive complexity, likely by extracting parts of its logic into smaller helper functions.
* [ ] **[Bug]** The `ColorPicker` popover closes immediately when the custom color input is clicked, preventing users from selecting a custom color.

* [x] TODO: Break down the forms and viewing into individual components (CourseTab, ClassroomTab, ClassGroupsTab, InstructorsTab)
* [ ] TODO: Fix issue where refresh clears the form especially when switching windows or tabs, hindering user experience. (ClassSessionComponentsPage)

* [ ] TODO: Consider duplicate courses, class groups, classrooms and instructors a data anomaly; such entities should be singleton. (ClassSessionComponentsPage)

* [ ] TODO: Make drawer stick to the bottom, or limit the height size of the timetable to accomodate the drawer. (TimetablePage)

* [x] TODO: Do scrolling behavior when placing the moved object around the edge of the viewport. (Timetable)
* [ ] TODO: In drawer, only make visible the class sessions that belong to the user's assigned program. (Drawer)

* [x] TODO: Apply refactor to prop drilling later (Timetable/index)

* [ ] TODO: Change name check to id check for the long term (checkConflicts)

* [x] TODO: Simplify buildTimetableGrid to alleviate cognitive complexity 16. (timeLogic.ts)

* [ ] TODO: Fix bug where choosing a custom color closes the color picker, making it unable to choose or type a custom color. (colorUtils.ts)

* [ ] ClassSessionComponents - Prioritize owned components
* [ ] Refactor ClassSessions/Courses - assess if course entity shall be merged with class session entity.
* [ ] TimetablePage - Replace program.id feedback with program.name/code
* [ ] [Data Integrity] Harden the database schema by adding ON DELETE RESTRICT constraints to all foreign keys in the class_sessions table + Smart Checks in the App

* [ ] Use React Query for usePrograms.ts

Maam Z's Feedback:

* [x] Class merging
  * [x] Requires management of shared classrooms (admin) and instructors (department heads) instead of solely program heads

Sir B's Feedback:

* Approval/Notify feature to Program Head When other program heads assign class sessions from instructors under him?
  * [ ] Need revision when managers of instructors are department heads: notify them/admin instead?
* [ ] CSV Import
* [ ] Classroom/instructor View
* [ ] Reports per instructor and class group.

Maam D's Feedback

* [ ] Title in login page para mas formal (as a substitute sa landing page)
* [ ] Direct "CECE Head" Name for user accounts for testing
* [ ] Let admin edit user names
* [ ] Classroom instructor prioritized assignment
* [ ] Instructors can't be edited as program heads
* [ ] Make drawer stick in the bottom viewport (timetable)
* [ ] red/green for failure/success notifications
* [ ] Allow users to change their full name in profiles page
* [ ] Allow users to change password in profiles page (less prio)
* [ ] fix sticking of navigation and form and tabs on component management
* [ ] hover on sidebar
* [ ] captcha for login

Sir D's Feedback (School IT/Networking Head)

* [ ] (Haven't consulted yet)

Solved:

* [x] Keep the merged capacity check as a soft conflict instead of a hard conflict.

Ponderings:

* [ ] Examine why sessioncell UI logic is separate and decentralized from timetablelogic. It gave me a headache when trying to manually deal with class-merging renders.

* A collapsible sidebar would be great.
* A single-page UI for timetabling would be intuitive.
* A folder restructure according to use case would be clarifying.
* An optional name for `invite user` field in user management would be nice?
* Resolving the security concerns by lovable would be nice.
* Resolving the supabase warnings for performance query would be nice.
* [x] A "Not Assigned" for profiles is better than "-".
* Choosing between program head role / program selection and department head role / department selection is more intuitive.
* Removing colors in components other than instructor would seem cleaner.
* Being able to edit user names would be nice.

* [ ] Program head users need to be assigned to programs (nullable for department heads and admins).
* [x] Programs need to be related to only one department (implemented with department_id foreign key and UI).
* [ ] Check for data anomalies regarding program management.
* [ ] Remove null usage of department_head except for admin roles.
* [ ] Adjust type alias for import paths to be cleaner.
* [ ] Realign the stylings of all pages.

Group mismatch conflict not applicable in classroom and instructor views

* [ ] short-term solution: limit group mismatch conflict only to class group view
* [ ] long-term solution: make class groups assignment optional in the database and be managed directly in the timetable instead
* [ ] broader long-term solution: make classrooms and instructors assignment optional and be done in the timetable instead

Big backlog: security concerns by lovable:

```txt
Backlogs: A new Lovable ai project where I injected my codebase through github gave this response:

I'll scan the codebase to understand the current state of this college scheduling system and analyze the security implications of the recent authentication changes.

Now let me check the database schema and RLS policies more thoroughly:

Let me check if there are any remaining public registration pages:

Now let me check the database trigger more thoroughly and look at the security scan results:

Perfect! Now let me check if the register function is still being used anywhere in the UI and verify the complete state of authentication:

Excellent! Now let me create a comprehensive security analysis and implementation plan:

## 🔒 **Security Audit Report: College Scheduling System**

Based on my comprehensive scan of the codebase, I've identified both **strengths** and **critical areas** that need attention. Here's what I found:

---

### ✅ **Security Strengths - Well Implemented**

1. **✅ Roles in Separate Table (CRITICAL)**
   - **Excellent work!** Roles are correctly stored in the `user_roles` table (not in `profiles`)
   - This prevents privilege escalation attacks where users could modify their own role
   - Security definer functions (`has_role()`, `get_user_role()`) properly bypass RLS without exposing data

2. **✅ Admin-Only Invite System**
   - Public registration has been successfully removed
   - The `invite-user` edge function properly validates admin status before sending invitations
   - Role and department/program assignments are set at invitation time

3. **✅ Comprehensive RLS Policies**
   - Row-level security is enabled on critical tables
   - Policies correctly use the `has_role()` function to avoid recursive RLS issues
   - Department and program scoping is properly enforced

4. **✅ Proper Authentication Flow**
   - Session management follows Supabase best practices
   - Roles are fetched from `user_roles` table during login
   - Auth context properly separates concerns

---

### ⚠️ **Security Issues & Recommendations**

#### **1. CRITICAL: Unused Registration Function Still Exists**

**Issue:** The `register()` function in `AuthProvider` and `authService` is still present and functional, even though public registration has been removed from the UI.

**Risk:** If an attacker discovers the API endpoint or calls the function directly, they could bypass the admin-only invite system.

**Current State:**
- `src/features/auth/services/authService.ts` - `register()` function exists
- `src/features/auth/contexts/AuthProvider.tsx` - `register()` method exposed in context
- No UI currently calls this function

**Recommendation:**
```typescript
// Option 1: Remove the function entirely (recommended)
// Delete the register() function from authService.ts and AuthProvider.tsx

// Option 2: Disable at database level (defense in depth)
// In Supabase Auth settings, disable public signups entirely
```

**Action Plan:**

**Step 1: Remove Client-Side Registration Code**
* Delete `register()` function from `src/features/auth/services/authService.ts`
* Remove `register` from `AuthProvider` context value
* Remove `register` from `AuthContextType` interface
* Update all test mocks to remove register references

**Step 2: Disable Public Signups in Supabase**
* Navigate to Supabase Dashboard → Authentication → Settings
* Disable "Enable email signups" option
* This adds a second layer of defense even if code is somehow compromised

**Step 3: Clean Up Related Code**
* Remove `resendVerificationEmail()` function (only used with public registration)
* Delete `VerifyEmailPage.tsx` (no longer needed)
* Remove `/verify-email` route from `AuthRoutes.tsx`
* Update any documentation referencing public registration

---

#### **2. MEDIUM: Function Security Warnings**

**Issue:** The Supabase linter reports 3 functions without explicit `search_path` settings.

**Risk:** Without explicit search paths, functions could be vulnerable to search path injection attacks.

**Functions Affected:**
* `update_user_role()`
* `get_my_role()`
* `create_user()`

**Recommendation:**
All functions should include `SET search_path = public` or specific schemas:

```sql
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public  -- ✅ Add this
AS $$
BEGIN
  RETURN (
    SELECT role::text
    FROM public.user_roles
    WHERE user_id = auth.uid()
  );
END;
$$;
```

---

#### **3. LOW: Auth Configuration Hardening**

**Issues from Linter:**
* OTP expiry exceeds recommended threshold
* Leaked password protection is disabled
* Postgres version has security patches available

**Recommendations:**
* Reduce OTP expiry to 24 hours or less
* Enable leaked password protection (checks against haveibeenpwned)
* Schedule a Postgres upgrade to apply security patches

---

#### **4. MEDIUM: Incomplete Error Handling in Edge Function**

**Issue:** The `invite-user` edge function catches errors but doesn't validate all inputs thoroughly.

**Current Code:**

```typescript
const { email, role, program_id, department_id } = await req.json();

if (!email || !role) {
  throw new Error('Email and role are required');
}
```

**Risk:** Missing validation for:
* Email format validity
* Role is one of the allowed values
* Program/department IDs exist in database

**Recommendation:**

```typescript
// Add validation library
import { z } from 'zod';

const inviteSchema = z.object({
  email: z.string().email('Invalid email format'),
  role: z.enum(['admin', 'department_head', 'program_head']),
  program_id: z.string().uuid().nullable(),
  department_id: z.string().uuid().nullable(),
});

// In the function
const body = await req.json();
const validatedData = inviteSchema.parse(body);
```

---

### 📊 **Overall Security Score: B+ (Good, with room for improvement)**

**Breakdown:**
* ✅ Critical foundations: **A** (roles table, RLS, admin invites)
* ⚠️ Code cleanup: **C** (unused registration code)
* ⚠️ Configuration: **B** (some hardening needed)
* ⚠️ Input validation: **B-** (edge function needs improvement)

---

### 🎯 **Prioritized Action Items**

**Priority 1 (This Week):**

1. Remove unused `register()` functions from codebase
2. Disable public signups in Supabase Auth settings
3. Add `SET search_path = public` to all security definer functions

**Priority 2 (Next Sprint):**
4. Add comprehensive input validation to `invite-user` edge function
5. Enable leaked password protection
6. Reduce OTP expiry time

**Priority 3 (Maintenance):**
7. Schedule Postgres upgrade
8. Review and test all RLS policies with different user roles
9. Add security testing to CI/CD pipeline

---

Would you like me to implement any of these recommendations? I can start with Priority 1 items to eliminate the critical security gap with the unused registration code.
