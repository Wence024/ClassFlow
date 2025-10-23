-- Create security definer function to get user's department ID
CREATE OR REPLACE FUNCTION public.get_user_department_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT department_id
  FROM public.profiles
  WHERE id = _user_id
  LIMIT 1
$$;

-- Drop and recreate the department head instructor management policy
DROP POLICY IF EXISTS "instructors_manage_department_head" ON public.instructors;

CREATE POLICY "instructors_manage_department_head"
ON public.instructors
FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'department_head'::user_role) 
  AND department_id = get_user_department_id(auth.uid())
)
WITH CHECK (
  has_role(auth.uid(), 'department_head'::user_role) 
  AND department_id = get_user_department_id(auth.uid())
);