-- Phase 1: Department-Based Resource Management - Rollback Script
-- This script attempts to revert the forward migration. It is best-effort and
-- may need manual adjustments depending on data state and previous schema.

-- Disable RLS policies added in forward migration (if present)
DO $$
BEGIN
  -- resource_requests
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'resource_requests' AND policyname = 'resource_requests_select_own'
  ) THEN
    DROP POLICY resource_requests_select_own ON public.resource_requests;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'resource_requests' AND policyname = 'resource_requests_insert_own'
  ) THEN
    DROP POLICY resource_requests_insert_own ON public.resource_requests;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'resource_requests' AND policyname = 'resource_requests_update_reviewers'
  ) THEN
    DROP POLICY resource_requests_update_reviewers ON public.resource_requests;
  END IF;

  -- instructors/classrooms department policies
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'instructors' AND policyname = 'instructors_read_authenticated'
  ) THEN
    DROP POLICY instructors_read_authenticated ON public.instructors;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'instructors' AND policyname = 'instructors_manage_admin'
  ) THEN
    DROP POLICY instructors_manage_admin ON public.instructors;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'instructors' AND policyname = 'instructors_manage_department_head'
  ) THEN
    DROP POLICY instructors_manage_department_head ON public.instructors;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'classrooms' AND policyname = 'classrooms_read_authenticated'
  ) THEN
    DROP POLICY classrooms_read_authenticated ON public.classrooms;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'classrooms' AND policyname = 'classrooms_manage_admin'
  ) THEN
    DROP POLICY classrooms_manage_admin ON public.classrooms;
  END IF;
END$$;

-- Drop resource_requests table (if exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'resource_requests'
  ) THEN
    DROP TABLE public.resource_requests;
  END IF;
END$$;

-- Revert classrooms: drop created_by, department_id; restore user_id
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'classrooms' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE public.classrooms DROP COLUMN created_by;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'classrooms' AND column_name = 'department_id'
  ) THEN
    ALTER TABLE public.classrooms DROP COLUMN department_id;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'classrooms' AND column_name = 'preferred_department_id'
  ) THEN
    ALTER TABLE public.classrooms DROP COLUMN preferred_department_id;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'classrooms' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.classrooms ADD COLUMN user_id uuid NOT NULL;
    ALTER TABLE public.classrooms ADD CONSTRAINT classrooms_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);
  END IF;
END$$;

-- Revert instructors: drop created_by, department_id; restore user_id
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'instructors' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE public.instructors DROP COLUMN created_by;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'instructors' AND column_name = 'department_id'
  ) THEN
    ALTER TABLE public.instructors DROP COLUMN department_id;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'instructors' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.instructors ADD COLUMN user_id uuid NOT NULL;
    ALTER TABLE public.instructors ADD CONSTRAINT instructors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);
  END IF;
END$$;

-- Revert profiles: drop department_id
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'department_id'
  ) THEN
    ALTER TABLE public.profiles DROP COLUMN department_id;
  END IF;
END$$;

-- Restore legacy user_id-based policies (matching 250930 reference)
DO $$
BEGIN
  -- instructors
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'instructors' AND policyname = 'Allow users to manage their own instructors'
  ) THEN
    CREATE POLICY "Allow users to manage their own instructors"
      ON public.instructors FOR ALL TO public
      USING ((SELECT auth.uid()) = user_id)
      WITH CHECK ((SELECT auth.uid()) = user_id);
  END IF;

  -- classrooms
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'classrooms' AND policyname = 'Allow users to manage their own classrooms'
  ) THEN
    CREATE POLICY "Allow users to manage their own classrooms"
      ON public.classrooms FOR ALL TO public
      USING ((SELECT auth.uid()) = user_id)
      WITH CHECK ((SELECT auth.uid()) = user_id);
  END IF;
END$$;

-- Optionally drop departments (uuid) table if it was created by forward migration.
-- WARNING: Only run if you are sure no other objects depend on it.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'departments'
  ) THEN
    DROP TABLE public.departments;
  END IF;
END$$;


