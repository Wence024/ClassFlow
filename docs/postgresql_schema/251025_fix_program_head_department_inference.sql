-- Migration: Fix Program Head Department Inference
-- Date: 2025-10-25
-- Purpose: Enable department inference for program heads via their assigned program
--          and improve RLS policies to handle NULL department_id explicitly

-- ============================================================================
-- STEP 1: Create security definer function for department inference
-- ============================================================================

-- This function returns the user's department ID by:
-- 1. Returning explicit department_id if set (for dept heads & admins)
-- 2. Otherwise deriving from programs.department_id via program_id (for program heads)
-- 3. Returns NULL if neither exists

CREATE OR REPLACE FUNCTION public.get_user_department_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    p.department_id,
    (SELECT pr.department_id FROM public.programs pr WHERE pr.id = p.program_id)
  )
  FROM public.profiles p
  WHERE p.id = _user_id
  LIMIT 1
$$;

COMMENT ON FUNCTION public.get_user_department_id(uuid) IS 
  'Returns user department ID. For department heads, uses explicit department_id. 
   For program heads, infers from programs.department_id via program_id.
   Returns NULL for admins or users without department/program assignments.
   SECURITY DEFINER to bypass RLS and prevent infinite recursion.';

-- ============================================================================
-- STEP 2: Update instructors RLS policy for department heads
-- ============================================================================

-- Drop the existing department_head policy
DROP POLICY IF EXISTS "instructors_manage_department_head" ON public.instructors;

-- Recreate with explicit NULL handling using the new function
CREATE POLICY "instructors_manage_department_head" 
ON public.instructors 
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'department_head'::public.user_role) 
  AND public.get_user_department_id(auth.uid()) IS NOT NULL
  AND department_id = public.get_user_department_id(auth.uid())
)
WITH CHECK (
  public.has_role(auth.uid(), 'department_head'::public.user_role)
  AND public.get_user_department_id(auth.uid()) IS NOT NULL  
  AND department_id = public.get_user_department_id(auth.uid())
);

COMMENT ON POLICY "instructors_manage_department_head" ON public.instructors IS 
  'Department heads can manage instructors in their department. 
   Requires explicit department_id assignment (NULL department_id fails explicitly).
   This prevents silent permission failures when department_id is missing.
   Uses get_user_department_id() security definer function to avoid RLS recursion.';

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Test the function with different user types:
-- SELECT id, email, department_id, program_id, public.get_user_department_id(id) as inferred_dept
-- FROM public.profiles
-- ORDER BY role;

-- Verify RLS policies are active:
-- SELECT schemaname, tablename, policyname, qual, with_check
-- FROM pg_policies
-- WHERE tablename = 'instructors' AND policyname LIKE '%department_head%';
