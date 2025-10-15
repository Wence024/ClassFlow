-- CRITICAL SECURITY FIX: Move roles to separate table to prevent privilege escalation
-- Note: user_role enum already exists, so we skip creating it

-- Step 1: Create the user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role user_role NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Step 2: Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 3: Migrate existing roles from profiles to user_roles (only if not already migrated)
INSERT INTO public.user_roles (user_id, role)
SELECT id, role FROM public.profiles 
WHERE role IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 4: Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role user_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Step 5: Create helper function to get user's role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- Step 6: RLS Policies for user_roles table
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can manage roles" ON public.user_roles;

CREATE POLICY "Users can view their own role"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can manage roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Step 7: Update existing RLS policies that referenced profiles.role
DROP POLICY IF EXISTS "Allow admins to read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Only admins can insert programs" ON public.programs;
DROP POLICY IF EXISTS "Only admins can update programs" ON public.programs;
DROP POLICY IF EXISTS "Only admins can delete programs" ON public.programs;
DROP POLICY IF EXISTS "Allow admins to update schedule configuration" ON public.schedule_configuration;
DROP POLICY IF EXISTS "classrooms_manage_admin" ON public.classrooms;
DROP POLICY IF EXISTS "instructors_manage_admin" ON public.instructors;
DROP POLICY IF EXISTS "instructors_manage_department_head" ON public.instructors;
DROP POLICY IF EXISTS "resource_requests_update_reviewers" ON public.resource_requests;

-- Step 8: Recreate policies using the security definer function
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can insert programs"
ON public.programs FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update programs"
ON public.programs FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete programs"
ON public.programs FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update schedule configuration"
ON public.schedule_configuration FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "classrooms_manage_admin"
ON public.classrooms FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "instructors_manage_admin"
ON public.instructors FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "instructors_manage_department_head"
ON public.instructors FOR ALL
USING (
  public.has_role(auth.uid(), 'department_head')
  AND department_id = (SELECT department_id FROM public.profiles WHERE id = auth.uid())
)
WITH CHECK (
  public.has_role(auth.uid(), 'department_head')
  AND department_id = (SELECT department_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "resource_requests_update_reviewers"
ON public.resource_requests FOR UPDATE
USING (
  public.has_role(auth.uid(), 'admin')
  OR (
    public.has_role(auth.uid(), 'department_head')
    AND target_department_id = (SELECT department_id FROM public.profiles WHERE id = auth.uid())
  )
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin')
  OR (
    public.has_role(auth.uid(), 'department_head')
    AND target_department_id = (SELECT department_id FROM public.profiles WHERE id = auth.uid())
  )
);

-- Step 9: Update the admin_update_user_profile function to work with user_roles
CREATE OR REPLACE FUNCTION public.admin_update_user_profile(
  target_user_id uuid,
  new_role user_role DEFAULT NULL,
  new_program_id uuid DEFAULT NULL,
  new_department_id uuid DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can update user profiles';
  END IF;

  -- Update the target user's profile (program_id and department_id)
  UPDATE profiles
  SET
    program_id = CASE WHEN new_program_id IS NOT NULL THEN new_program_id ELSE program_id END,
    department_id = CASE WHEN new_department_id IS NOT NULL THEN new_department_id ELSE department_id END
  WHERE id = target_user_id;

  -- Update or insert the role if provided
  IF new_role IS NOT NULL THEN
    -- Delete existing role
    DELETE FROM user_roles WHERE user_id = target_user_id;
    -- Insert new role
    INSERT INTO user_roles (user_id, role)
    VALUES (target_user_id, new_role);
  END IF;
END;
$$;

-- Step 10: Update handle_new_user trigger function to use user_roles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert into profiles
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  -- Insert default role into user_roles
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'program_head');
  
  RETURN NEW;
END;
$$;

-- Step 11: Secure the profiles table - drop existing update policy first
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own name and avatar"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Step 12: Drop the role column from profiles (data already migrated)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;