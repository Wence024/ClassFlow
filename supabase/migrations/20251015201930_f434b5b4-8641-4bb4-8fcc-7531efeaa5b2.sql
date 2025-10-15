-- Fix RLS policies for timetable_assignments and class_sessions to use security definer functions
-- This prevents recursive query issues and improves performance

-- Step 1: Create security definer function to get user's program_id
CREATE OR REPLACE FUNCTION public.get_user_program_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT program_id
  FROM public.profiles
  WHERE id = _user_id
  LIMIT 1
$$;

-- Step 2: Create security definer function to get class_session's program_id
CREATE OR REPLACE FUNCTION public.get_class_session_program_id(_class_session_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT program_id
  FROM public.class_sessions
  WHERE id = _class_session_id
  LIMIT 1
$$;

-- Step 3: Drop and recreate timetable_assignments policies
DROP POLICY IF EXISTS "Allow authenticated read access to all timetable assignments" ON public.timetable_assignments;
DROP POLICY IF EXISTS "Allow program heads to manage their own program's assignments" ON public.timetable_assignments;

CREATE POLICY "Allow authenticated read access to all timetable assignments"
ON public.timetable_assignments
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow program heads to manage their timetable assignments"
ON public.timetable_assignments
FOR ALL
TO authenticated
USING (
  -- Admins can manage everything
  public.has_role(auth.uid(), 'admin')
  OR
  -- Program heads can manage assignments for their program's class sessions
  (
    public.has_role(auth.uid(), 'program_head')
    AND public.get_class_session_program_id(class_session_id) = public.get_user_program_id(auth.uid())
  )
)
WITH CHECK (
  -- Admins can manage everything
  public.has_role(auth.uid(), 'admin')
  OR
  -- Program heads can manage assignments for their program's class sessions
  (
    public.has_role(auth.uid(), 'program_head')
    AND public.get_class_session_program_id(class_session_id) = public.get_user_program_id(auth.uid())
  )
);

-- Step 4: Drop and recreate class_sessions policies
DROP POLICY IF EXISTS "Allow users to manage class sessions for their own program." ON public.class_sessions;
DROP POLICY IF EXISTS "Allow authenticated users to read all class sessions" ON public.class_sessions;

CREATE POLICY "Allow authenticated users to read all class sessions"
ON public.class_sessions
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow users to manage class sessions for their program"
ON public.class_sessions
FOR ALL
TO authenticated
USING (
  -- Admins can manage everything
  public.has_role(auth.uid(), 'admin')
  OR
  -- Program heads can manage their own program's sessions
  (
    public.has_role(auth.uid(), 'program_head')
    AND program_id = public.get_user_program_id(auth.uid())
  )
)
WITH CHECK (
  -- Admins can manage everything
  public.has_role(auth.uid(), 'admin')
  OR
  -- Program heads can only create sessions for their program
  (
    public.has_role(auth.uid(), 'program_head')
    AND program_id = public.get_user_program_id(auth.uid())
  )
);

-- Step 5: Add helpful comments
COMMENT ON FUNCTION public.get_user_program_id IS 'Returns the program_id for a given user from the profiles table. Used by RLS policies to avoid recursive queries.';
COMMENT ON FUNCTION public.get_class_session_program_id IS 'Returns the program_id for a given class_session. Used by RLS policies to avoid recursive queries.';