# Supabase Backend Integration Plan

This document outlines the tasks required to migrate the ClassFlow application from a `localStorage`-based MVP to a full-fledged backend using Supabase.

## Phase 1: Project Setup & Authentication

This phase establishes the foundation for all subsequent work.

- [x] **1. Create Supabase Project:**
  - Set up a new project on the Supabase dashboard (free tier is sufficient).

- [x] **2. Design Database Schema:**
  - Create tables corresponding to the existing data models:
    - `profiles` (to link with `auth.users`)
    - `courses`
    - `class_groups`
    - `classrooms`
    - `instructors`
    - `class_sessions` (with foreign keys to the above)
    - `timetable_assignments` (e.g., `id`, `group_id`, `period_index`, `session_id`, `user_id`)
  - Define relationships and foreign key constraints.
  - Ensure all tables have a `user_id` column to associate data with a user.

- [x] **3. Configure Environment:**
  - Create a `.env.local` file from `.env.example`.
  - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from your Supabase project settings.

- [x] **4. Implement Supabase Client:**
  - Create a singleton Supabase client instance (e.g., in `src/lib/supabaseClient.ts`).

- [x] **5. Set Up Authentication:**
  - Create a new `AuthContext` and `AuthProvider` to manage user sessions via Supabase.
  - Replace mock login/signup pages with components that use `supabase.auth.signUp()`, `signInWithPassword()`, and `signOut()`.
  - Implement route protection based on the user's authentication state.

- [x] **6. Enable Row Level Security (RLS):**
  - **Crucial for security.** Enabled RLS on all data tables.
  - Wrote policies to ensure users can only access and modify their own data (`auth.uid() = user_id`). See `supabase/schema.sql`.

## Phase 2: Service Layer Migration (CRUD)

This phase involves replacing all `localStorage` logic with asynchronous Supabase calls.

- [x] **1. Generate TypeScript Types:**
  - Used the Supabase CLI to generate types into `src/lib/supabase.types.ts`.
  - Replaced the manual/placeholder types in `src/features/scheduleLessons/types/scheduleLessons.ts` with types derived from the generated schema for full type safety.

- [x] **2. Refactor Component Services:**
  - Update each service file in `src/features/scheduleLessons/services/` one by one.
  - Replace `localStorage.getItem/setItem` with `supabase.from('...').select/insert/update/delete`.
  - All service functions will now be `async`.
    - [x] `coursesService.ts`
    - [x] `classGroupsService.ts`
    - [x] `classroomsService.ts`
    - [x] `instructorsService.ts`
    - [x] `classSessionsService.ts`

- [x] **3. Refactor Timetable Service & Logic:**
  - The `timetableService.ts` will be significantly changed.
  - `getTimetable` will now fetch from the `timetable_assignments` table and reconstruct the `Map` structure on the client.
  - `setTimetable` will be removed.
  - The logic in `TimetableProvider` (`assignSession`, `removeSession`, `moveSession`) will now directly make `async` calls to `insert`, `delete`, or `update` rows in the `timetable_assignments` table.

## Phase 3: UI & State Management Adaptation

With an async backend, the UI needs to handle loading, error, and server states.

- [x] **1. Update Context Providers:**
  - Refactor all context providers (`CoursesProvider`, `ClassSessionsProvider`, etc.) to fetch initial data from the new async services within a `useEffect` hook.

- [x] **2. Implement Loading & Error States:**
  - Add `loading` and `error` states to all contexts that fetch data.
  - Use the existing `LoadingSpinner` and `ErrorMessage` components throughout the UI where data is being loaded or might fail.

- [x] **3. Refactor Form Submissions:**
  - All `onSubmit` handlers in forms (`ComponentForm`, `ClassSessionForm`) will now be `async`.
  - Use the `loading` prop on `ActionButton` to provide visual feedback during submission.

- [x] **4. (Recommended) Adopt a Server State Library:**
  - For a better user experience and simpler code, consider integrating `react-query` (TanStack Query) or `SWR`.
  - This will abstract away the complexities of caching, refetching, and managing server state, greatly simplifying the context providers. This can be a post-migration enhancement.

## Phase 4: Cleanup & Documentation

- [x] **1. Remove Obsolete Code:**
  - Delete the `timetableService.ts` migration logic.
  - Remove any remaining `localStorage` code.

- [x] **2. Update Documentation:**
  - Update `docs/architecture.md` to reflect Supabase as the data source.
  - Update `docs/user-guide.md` to mention that data is now stored securely in the cloud.

## Phase 5: Real-time (Post-MVP Enhancement)

- [x] **1. Implement Real-time Subscriptions:**
  - In `TimetableProvider`, use Supabase's real-time capabilities to subscribe to changes in the `timetable_assignments` table.
  - When a change event is received, update the local state automatically. This is the foundation for multi-user collaboration.
