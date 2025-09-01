# Todos

Here is a rearranged, consolidated, and prioritized to-do list.

## **Phase 1: Polish the Core Experience (Immediate Sprint)**

*This phase focuses on high-impact, quick wins that significantly improve the user experience and address direct panel feedback.*

1. [x] **[UI] Separate Loading States for     Clarity**
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
    * **Task:** `Conflict: ImplGement advanced conflict detection logic`
    * **Action:** Update your `checkConflicts.ts` utility. The main conflict-checking function should now use the new `classroom.capacity` and `classgroup.student_count` to detect capacity-based conflicts.
    * Observed problems:

3. **[UI/UX] Visualize Timetabling Actions**
    * **Task:** `Timetabling: Availability marks for moving class sessions across periods`
    * **Action:** In `Timetable.tsx`, use the `onDragOver` event to call the conflict detection logic and conditionally apply a class to the target cell for instant feedback.

4. **[Data Integrity] Restrict Invalid Timetabling Moves**
    * **Task:** `Timetabling: Restrict moving Class sessions to other unintended class groups`
    * **Action:** In the `onDropToGrid` handler within `useTimetableDnd.ts`, check if the dragged `ClassSession`'s `group.id` matches the target `groupId`. If they don't match, show a notification and abort the update.

## **Phase 3: Scaling, Administration & Performance (Mid-Term)**

*This phase expands the application's capabilities for multiple users, administrators, and larger data sets.*

1. **[Auth] Implement User Roles and Permissions**
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

* **[UX]** Fix: success update in forms has a red color instead of green.
* **[UI]** Add a zoom feature to timetable.
* **[UI]** Consolidate management pages into a single, more integrated UI.
* [ ] Implement captcha in login
* **[UI]** Implement a light/dark mode theme.
* **[UX]** Add tooltips and placeholder hints for all form fields.
* **[UX]** Show assigned component colors in the timetable class session box.
* **[Auth]** Implement CAPTCHA in the login/register forms.
* **[Data Model]** Allow classrooms and instructors to be optional in class sessions.
* **[Architecture]** Centralize error handling with a `useApiMutation` hook.
* [ ] Keyboard shortcuts and navigation
* [ ] Allow classrooms and instructors to be optional in class sessions.
