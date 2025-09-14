# Multi-User Plan

Of course. Based on the detailed project structure and code you've provided, here is a comprehensive breakdown of the steps needed to implement a simultaneous multi-user workflow for managing the timetable.

Your current architecture, with its clear separation of concerns and use of Supabase for the backend and TanStack Query for state management, provides an excellent foundation for these features. The existing real-time implementation in `useTimetable` is a key asset that we will leverage.

Here are the phases and steps to achieve your goals:

---

## **Phase 1: Backend and Data Model Setup (The Foundation)**

The first step is to extend your database schema to understand the concepts of "Programs" and user roles. This ensures that permissions are enforced at the database level, which is the most secure approach.

### **1. Database Schema Changes (Supabase)**

You'll need to introduce a `programs` table and link your users and class sessions to it.

1. **Create a `programs` Table:** This table will store the different academic programs.
    * **SQL:**

        ```sql
        CREATE TABLE public.programs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          -- You might also want to add a user_id for the head of the entire school/admin
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
        ```

2. **Update User Data (`profiles` table):** To associate users with roles and programs, it's best practice to have a `profiles` table that extends Supabase's `auth.users` table.
    * Add `program_id` and `role` columns. The `program_id` will link a "program head" to their specific program.
    * **SQL:**

        ```sql
        CREATE TABLE public.profiles (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          program_id UUID REFERENCES public.programs(id) ON DELETE SET NULL,
          role TEXT NOT NULL DEFAULT 'program_head' -- e.g., 'program_head', 'admin'
        );

        -- Function to create a profile when a new user signs up
        CREATE FUNCTION public.handle_new_user()
        RETURNS TRIGGER AS $$
        BEGIN
          INSERT INTO public.profiles (id)
          VALUES (new.id);
          RETURN new;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;

        -- Trigger to call the function on new user creation
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
        ```

3. **Update `class_sessions` Table:** Each class session must be "owned" by a program. Add a `program_id` column.
    * **SQL:**

        ```sql
        ALTER TABLE public.class_sessions
        ADD COLUMN program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE;
        ```

4. **Regenerate Supabase Types:** After applying these schema changes in the Supabase SQL Editor, regenerate your TypeScript types to make them available in your frontend code.

### **2. Implement Row Level Security (RLS) Policies**

RLS is crucial for ensuring users can only modify data they are authorized to.

1. **Admin-Only Schedule Configuration:**
    * **File:** `supabase/schema.sql` (or apply in SQL Editor)
    * **Action:** Create policies on the `schedule_configuration` table to restrict write access to admins.
    * **Conceptual RLS Policy:**

        ```sql
        -- First, enable RLS
        ALTER TABLE public.schedule_configuration ENABLE ROW LEVEL SECURITY;

        -- Allow all authenticated users to READ the settings
        CREATE POLICY "Allow all users to read schedule config"
        ON public.schedule_configuration FOR SELECT USING (true);

        -- Allow only ADMINS to modify the settings
        CREATE POLICY "Allow admins to modify schedule config"
        ON public.schedule_configuration FOR ALL -- (INSERT, UPDATE, DELETE)
        USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
        ```

2. **Program-Based Timetable Permissions:**
    * **File:** `supabase/schema.sql` (or apply in SQL Editor)
    * **Action:** Create policies on the `timetable_assignments` table.
    * **Conceptual RLS Policies:**

        ```sql
        -- Enable RLS on the table
        ALTER TABLE public.timetable_assignments ENABLE ROW LEVEL SECURITY;

        -- Allow all users to SEE all assignments
        CREATE POLICY "Allow all users to read timetable"
        ON public.timetable_assignments FOR SELECT USING (true);

        -- Allow users to INSERT, UPDATE, DELETE assignments that belong to their program
        CREATE POLICY "Allow program heads to manage their assignments"
        ON public.timetable_assignments FOR ALL -- (INSERT, UPDATE, DELETE)
        USING (
          -- Check if the program_id of the class session being assigned...
          (SELECT cs.program_id FROM public.class_sessions cs WHERE cs.id = class_session_id)
          -- ...matches the program_id of the current user.
          = (SELECT p.program_id FROM public.profiles p WHERE p.id = auth.uid())
        );
        ```

---

## **Phase 2: Frontend Integration**

With the backend ready, you can now update the frontend to use this new information.

### **1. Update User Context and Authentication**

Your application needs to be aware of the user's `role` and `program_id`.

* **Files:**
  * `src/features/auth/services/authService.ts`
  * `src/features/auth/contexts/AuthProvider.tsx`
  * `src/features/auth/types/auth.ts`
* **Actions:**
    1. Modify the `User` type in `auth.ts` to include `program_id: string | null`.
    2. In `authService.ts`, update `login` and `getStoredUser` to perform a query on the `profiles` table to fetch the `role` and `program_id` along with the standard user data.
    3. In `AuthProvider.tsx`, store the `program_id` in the state and expose it through the `AuthContext`.

### **2. Enforce Admin-Only Access in the UI**

Prevent non-admin users from seeing or interacting with admin-level pages.

* **File:** `src/features/scheduleConfig/pages/ScheduleConfigPage.tsx`
* **Action:**
    1. Use the `useAuth` hook to get the user's role.
    2. Conditionally render the configuration form.

        ```tsx
        import { useAuth } from '../../auth/hooks/useAuth';

        const ScheduleConfigPage: React.FC = () => {
          const { role } = useAuth();
          // ... other hooks

          if (role !== 'admin') {
            return <p>You do not have permission to access this page.</p>;
          }

          return (
            {/* The rest of the page component */}
          );
        };
        ```

### **3. Link New Class Sessions to a Program**

When a program head creates a class session, it must be tagged with their program ID.

* **File:** `src/features/classSessions/hooks/useClassSessions.ts`
* **Action:**
    1. In the `addClassSession` mutation, get the current user's `program_id` from the `useAuth` hook.
    2. Add this `program_id` to the new class session object before sending it to `classSessionsService.addClassSession`. The service will then save it to the database.

---

## **Phase 3: Implementing the Multi-User Timetable Workflow**

This final phase focuses on the user-facing features on the timetable page.

### **1. Visual Distinction for Non-Owned Sessions**

Make sessions created by other programs appear "grayed out".

* **File:** `src/features/timetabling/pages/components/timetable/SessionCell.tsx`
* **Action:**
    1. Get the current user from the `useAuth` hook.
    2. Compare the user's `program_id` with the `program_id` of the session being rendered. (You'll need to ensure the `program_id` is fetched as part of the `ClassSession` object).
    3. Conditionally apply styles.

        ```tsx
        // ... inside SessionCell component
        import { useAuth } from '../../../../auth/hooks/useAuth';

        const { user } = useAuth();
        const isOwner = user?.program_id === session.program_id;

        const cellStyle: React.CSSProperties = {
          backgroundColor: isOwner ? getSessionCellBgColor(...) : '#D1D5DB', // A gray color
          border: isOwner ? getSessionCellBorderStyle(...) : 'none',
          opacity: isOwner ? 1 : 0.7
        };

        const textStyle: React.CSSProperties = {
          color: isOwner ? getSessionCellTextColor(...) : '#4B5563', // A darker gray text
        };
        ```

### **2. Restrict Drag-and-Drop Movement**

Only allow program heads to move the sessions owned by their program.

* **File:** `src/features/timetabling/pages/components/timetable/SessionCell.tsx`
* **Action:**
    1. Using the same `isOwner` boolean from the previous step, set the `draggable` attribute on the session's div. This provides immediate, clear feedback to the user.

        ```tsx
        <div
          draggable={isOwner}
          // ... other props
        >
          {/* ... cell content */}
        </div>
        ```

* **File:** `src/features/timetabling/hooks/useTimetableDnd.ts`
* **Action (Recommended UX Improvement):**
    1. While RLS provides the definitive security, adding a client-side check in `handleDropToGrid` prevents the user from seeing a jarring error notification after an invalid drop.
    2. Before calling `moveClassSession`, check if the dragged session's `program_id` matches the user's `program_id`. If not, show a friendly notification and abort the operation.

### **3. Leverage Real-Time for Seamless Updates**

Your existing real-time setup in `useTimetable.ts` is perfect for this workflow. When one program head moves a session, the database change will trigger an event. All other connected users will receive this event, causing their `useTimetable` hook to refetch the data and automatically re-render the grid with the updated session placement, styled correctly according to the ownership rules you just implemented. No additional work is required here.

By following these steps, you will successfully transform your single-user application into a robust, secure, and intuitive multi-user timetabling system.
