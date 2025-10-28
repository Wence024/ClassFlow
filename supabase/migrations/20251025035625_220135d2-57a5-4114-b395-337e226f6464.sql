-- Update get_user_department_id to derive from program for program heads
CREATE OR REPLACE FUNCTION public.get_user_department_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
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

-- Clean up redundant department_id for program heads
-- Only clear if the user has a program AND the inferred department matches the explicit one
UPDATE public.profiles
SET department_id = NULL
WHERE program_id IS NOT NULL 
  AND department_id IS NOT NULL
  AND department_id = (
    SELECT pr.department_id 
    FROM public.programs pr 
    WHERE pr.id = profiles.program_id
  );

COMMENT ON TABLE public.profiles IS 
  'User profiles. department_id should only be set for department heads. 
   Program heads inherit department from their program assignment.';