-- Fix instructors RLS policy for department heads to properly insert records

-- Drop the problematic policy that queries profiles table
DROP POLICY IF EXISTS "instructors_manage_department_head" ON public.instructors;

-- Create a new, cleaner policy that uses the security definer function
-- This policy allows department heads to manage instructors in their own department
CREATE POLICY "instructors_manage_department_head"
ON public.instructors
FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'department_head'::user_role) 
  AND department_id = (
    SELECT department_id 
    FROM public.profiles 
    WHERE id = auth.uid()
  )
)
WITH CHECK (
  has_role(auth.uid(), 'department_head'::user_role) 
  AND department_id = (
    SELECT department_id 
    FROM public.profiles 
    WHERE id = auth.uid()
  )
);