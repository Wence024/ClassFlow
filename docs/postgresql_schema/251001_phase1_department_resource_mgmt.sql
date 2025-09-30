-- Phase 1: Department-Based Resource Management - Forward Migration
-- This script creates departments (uuid), updates profiles/instructors/classrooms,
-- and adds the resource_requests table with basic indexes and RLS policies.

-- 0) Required extension(s)
CREATE EXTENSION IF NOT EXISTS pgcrypto; -- for gen_random_uuid()

-- 1) Departments (uuid-based)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'departments'
  ) THEN
    CREATE TABLE public.departments (
      id uuid NOT NULL DEFAULT gen_random_uuid(),
      name text NOT NULL,
      code text NOT NULL,
      created_at timestamp with time zone DEFAULT now(),
      CONSTRAINT departments_pkey PRIMARY KEY (id)
    );
  ELSE
    -- If table exists, ensure the id is uuid. If not, emit a NOTICE to manually reconcile.
    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'departments'
      AND column_name = 'id' AND data_type <> 'uuid'
    ) THEN
      RAISE NOTICE 'Existing public.departments.id is not uuid. Please migrate it manually before running this script.';
    END IF;
  END IF;
END$$;

-- 2) Profiles: add department_id (uuid) if missing, referencing departments
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'department_id'
  ) THEN
    ALTER TABLE public.profiles
      ADD COLUMN department_id uuid REFERENCES public.departments(id);
  END IF;
END$$;

-- Note: The reference schema uses text roles; if you use an enum, add the new value here.
-- Example (only if you actually have an enum named user_role):
-- DO $$ BEGIN
--   IF NOT EXISTS (
--     SELECT 1 FROM pg_type t
--     JOIN pg_enum e ON t.oid = e.enumtypid
--     WHERE t.typname = 'user_role' AND e.enumlabel = 'department_head'
--   ) THEN
--     ALTER TYPE user_role ADD VALUE 'department_head';
--   END IF;
-- END$$;

-- 3) Instructors: drop user_id, add department_id and created_by
DO $$
BEGIN
  -- Drop legacy policies that depend on user_id
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'instructors' AND policyname = 'Allow users to manage their own instructors'
  ) THEN
    DROP POLICY "Allow users to manage their own instructors" ON public.instructors;
  END IF;

  -- Drop user_id if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'instructors' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.instructors DROP COLUMN user_id;
  END IF;

  -- Add department_id (required)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'instructors' AND column_name = 'department_id'
  ) THEN
    ALTER TABLE public.instructors
      ADD COLUMN department_id uuid REFERENCES public.departments(id);
  END IF;

  -- Add created_by (optional, for auditing)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'instructors' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE public.instructors
      ADD COLUMN created_by uuid REFERENCES auth.users(id);
  END IF;

  -- Ensure NOT NULL on department_id once populated (defer strictness to data migration phase)
  -- ALTER TABLE public.instructors ALTER COLUMN department_id SET NOT NULL;
END$$;

-- 4) Classrooms: drop user_id, add department_id and created_by
DO $$
BEGIN
  -- Drop legacy policies that depend on user_id
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'classrooms' AND policyname = 'Allow users to manage their own classrooms'
  ) THEN
    DROP POLICY "Allow users to manage their own classrooms" ON public.classrooms;
  END IF;

  -- Drop user_id if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'classrooms' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.classrooms DROP COLUMN user_id;
  END IF;

  -- Add department_id (required)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'classrooms' AND column_name = 'department_id'
  ) THEN
    ALTER TABLE public.classrooms
      ADD COLUMN department_id uuid REFERENCES public.departments(id);
  END IF;

  -- Add created_by (optional, for auditing)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'classrooms' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE public.classrooms
      ADD COLUMN created_by uuid REFERENCES auth.users(id);
  END IF;

  -- Ensure NOT NULL on department_id once populated (defer strictness to data migration phase)
  -- ALTER TABLE public.classrooms ALTER COLUMN department_id SET NOT NULL;
END$$;

-- 5) Resource Requests table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'resource_requests'
  ) THEN
    CREATE TABLE public.resource_requests (
      id uuid NOT NULL DEFAULT gen_random_uuid(),
      requester_id uuid NOT NULL REFERENCES auth.users(id),
      resource_type text NOT NULL CHECK (resource_type IN ('instructor', 'classroom')),
      resource_id uuid NOT NULL,
      requesting_program_id uuid NOT NULL REFERENCES public.programs(id),
      target_department_id uuid NOT NULL REFERENCES public.departments(id),
      status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
      requested_at timestamp with time zone DEFAULT now(),
      reviewed_at timestamp with time zone,
      reviewed_by uuid REFERENCES auth.users(id),
      notes text,
      CONSTRAINT resource_requests_pkey PRIMARY KEY (id)
    );
  END IF;
END$$;

-- 6) Indexes for performance
CREATE INDEX IF NOT EXISTS idx_resource_requests_target_department
  ON public.resource_requests USING btree (target_department_id);
CREATE INDEX IF NOT EXISTS idx_resource_requests_requesting_program
  ON public.resource_requests USING btree (requesting_program_id);
CREATE INDEX IF NOT EXISTS idx_resource_requests_status
  ON public.resource_requests USING btree (status);
CREATE INDEX IF NOT EXISTS idx_instructors_department
  ON public.instructors USING btree (department_id);
CREATE INDEX IF NOT EXISTS idx_classrooms_department
  ON public.classrooms USING btree (department_id);

-- 7) Enable RLS and basic policies for resource_requests
ALTER TABLE public.resource_requests ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to see their own requests
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'resource_requests' AND policyname = 'resource_requests_select_own'
  ) THEN
    CREATE POLICY resource_requests_select_own
      ON public.resource_requests FOR SELECT TO authenticated
      USING (requester_id = auth.uid());
  END IF;

  -- Allow request creation by authenticated users
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'resource_requests' AND policyname = 'resource_requests_insert_own'
  ) THEN
    CREATE POLICY resource_requests_insert_own
      ON public.resource_requests FOR INSERT TO authenticated
      WITH CHECK (requester_id = auth.uid());
  END IF;

  -- Allow department heads/admins to review requests targeting their department
  -- NOTE: Adjust role checks as needed for your role system.
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'resource_requests' AND policyname = 'resource_requests_update_reviewers'
  ) THEN
    CREATE POLICY resource_requests_update_reviewers
      ON public.resource_requests FOR UPDATE TO authenticated
      USING (
        -- Example: a simple check allowing updates where the target department matches the user's profile department
        target_department_id = (SELECT department_id FROM public.profiles WHERE id = auth.uid())
      )
      WITH CHECK (
        target_department_id = (SELECT department_id FROM public.profiles WHERE id = auth.uid())
      );
  END IF;
END$$;

-- 7.1) RLS for instructors/classrooms with department-based ownership
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;

-- Instructors: read for authenticated users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'instructors' AND policyname = 'instructors_read_authenticated'
  ) THEN
    CREATE POLICY instructors_read_authenticated
      ON public.instructors FOR SELECT TO public
      USING (auth.role() = 'authenticated');
  END IF;

  -- Manage within same department (department heads/admin logic refined later)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'instructors' AND policyname = 'instructors_manage_department'
  ) THEN
    CREATE POLICY instructors_manage_department
      ON public.instructors FOR ALL TO authenticated
      USING (department_id = (SELECT department_id FROM public.profiles WHERE id = auth.uid()))
      WITH CHECK (department_id = (SELECT department_id FROM public.profiles WHERE id = auth.uid()));
  END IF;
END$$;

-- Classrooms: read for authenticated users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'classrooms' AND policyname = 'classrooms_read_authenticated'
  ) THEN
    CREATE POLICY classrooms_read_authenticated
      ON public.classrooms FOR SELECT TO public
      USING (auth.role() = 'authenticated');
  END IF;

  -- Manage within same department
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'classrooms' AND policyname = 'classrooms_manage_department'
  ) THEN
    CREATE POLICY classrooms_manage_department
      ON public.classrooms FOR ALL TO authenticated
      USING (department_id = (SELECT department_id FROM public.profiles WHERE id = auth.uid()))
      WITH CHECK (department_id = (SELECT department_id FROM public.profiles WHERE id = auth.uid()));
  END IF;
END$$;

-- 8) Helpful comment on future strictness
COMMENT ON TABLE public.instructors IS 'Now owned by departments. Consider setting department_id NOT NULL after data backfill.';
COMMENT ON TABLE public.classrooms IS 'Now owned by departments. Consider setting department_id NOT NULL after data backfill.';
COMMENT ON TABLE public.resource_requests IS 'Cross-department resource request workflow.';


Represents organizational units (e.g., colleges or faculties).