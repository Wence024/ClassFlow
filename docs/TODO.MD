# Todos

Here is a rearranged, consolidated, and prioritized to-do list.

This new list merges duplicates, removes tasks that are already completed by your migration to React Query, and sequences everything for maximum impact and logical flow.

## **Phase 1: Polish the Core Experience (Immediate Sprint)**

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

## **Phase 2: Advanced Scheduling & Data Integrity (Next Sprint)**

*With the UI polished, this phase focuses on implementing the next major piece of core functionality: resource-aware conflict detection.*

1. **[Data Model] Extend Core Data Models**
    * **Task:** `Component Details: Extend detail inputs for...`
    * **Sub-task:** `Add classroom's size and classgroup's number of students (panel priority ML)`
    * **Action:**
        1. Add `size` to the `classrooms` table and `student_count` to the `class_groups` table in Supabase.
        2. Regenerate Supabase types.
        3. Update Zod schemas in `validation.ts`.
        4. Add the new fields to the `ComponentForm.tsx`.
        5. Make other fields optional
        6. Add color assignment to all components.
        7. Create shortform code for class groups, classrooms and instructors
        8. For instructors:
          a.  Differentiate name into Last name and first name;
          b.  Auto-generated but customizable short (i.e., First name and last name initials);
          c. teacher's contract (flexible/free-form) in a single line;
          d. email; phone;
          e. title; prefix and suffix for name (not strictly profession but can be for now)
    * Encountered problems:
        * [x] UX: Course form is still disorganized linearly, but adjusted for instructors.
        * [x] UX: Dearch and filter.
        * [x] UX: Color isn't showing.
        * [x] ~~FormFields: Assess react-hook-forms usage (e.g., Controller/FormFields repeated usage) if optimal.~~
        * [x] Make color generate randomly initially for class session components.
        * [x] Color shows in component forms
          * [x] Instructor color shows in class sessions.
        * [x] Data model: remove "title" from instructors
    * Finishing touches:
        * [x] Check doc comments
        * [-] Write some test files. Discontinued.
        * [-] Centralize error handling. Postponed.
        * [ ] Update documentation

2. **[Logic] Implement Advanced Conflict Detection**
    * **Task:** `Conflict: Implement advanced conflict detection logic`
    * **Action:** Update your `checkConflicts.ts` utility. The main conflict-checking function should now accept the new `classroom.size` and `classgroup.student_count` to detect capacity-based conflicts.

3. **[UI/UX] Visualize Timetabling Actions**
    * **Task:** `Timetabling: Red/green marks for moving class sessions across periods`
    * **Action:** In `Timetable.tsx`, use the `onDragEnter` or `onDragOver` events to call the advanced conflict detection logic. Conditionally apply a class (e.g., `bg-green-200` or `bg-red-200`) to the drop target cell to give the user instant feedback.

4. **[Data Integrity] Restrict Invalid Timetable Moves**
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

## **Completed / Superseded Tasks**

*The following tasks from your original list are considered complete or have been made redundant by your technical choices.*

* ✅ **[React Query] Transition from context+providers:** This is successfully done.
* ✅ **[React Query] Caching / Memoization:** React Query handles this automatically.
* ✅ **[React Query] Basic Fetch Retries:** React Query provides this by default for `useQuery`.
* ✅ **[Architecture] ComponentInsert/Update type has been created. Where is ComponentDelete?:** Your current pattern of passing an `id` to the remove mutation is correct and sufficient.
* ✅ **[Architecture] Support multi-user:** Your hooks and query keys are already user-specific.
* ✅ **[UI] Verify loading state in timetable again:** The loading overlay in `TimetablePage.tsx` is correctly implemented.

Other tasks:

* [ ] Add a zoom feature to timetable
* [ ] Merge class session code and management with its components, though more distinct.
* [ ] Give option to Reduce/expand details in class sessions and components, or remove entirely and either tooltip or click for more info.
* [ ] Consolidate class sessions, components and timetabling into a single ui.
* [ ] Implement captcha in login
* [ ] Implement light/dark mode theme
* [ ] Keyboard shortcuts and navigation
* [ ] Interface for showing component details
  * and link to class sessions/periods
* [ ] Allow classrooms and instructors to be optional in class sessions.
* [ ] Add tooltips and placeholder hints for component form fields.
* [ ] Postpone dealing with linear monotonous style
* [ ] Show assigned instructor Color shows in timetable class session box

AI-recommended tasks:

* [ ] Decouple ClassSessionForm: This is a major architectural cleanup that simplifies your most complex page.
* [ ] Standardize Error Handling: This improves code consistency and developer experience.
* [ ] Memoize Timetable: This is a quick performance win.

Less-priority features:

* [ ] Study Custom fields in all class session components
* [ ] Learn about predefined selections
  * For courses: preselected classroom/s
  * For class groups: preselected instructor/s
  * For instructors: preselected class groups and classrooms
* [ ] See the value of time-offs
