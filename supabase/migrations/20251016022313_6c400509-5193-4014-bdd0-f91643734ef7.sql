-- Fix timetable_assignments RLS to allow department heads to manage their department's programs
-- This allows department heads to manage timetabling for all programs in their department

-- Drop the existing management policy
DROP POLICY IF EXISTS "Allow program heads to manage their timetable assignments" ON public.timetable_assignments;

-- Create new policy that includes department head access
CREATE POLICY "Allow program heads and department heads to manage timetable assignments"
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
  OR
  -- Department heads can manage assignments for class sessions in their department's programs
  (
    public.has_role(auth.uid(), 'department_head')
    AND EXISTS (
      SELECT 1 
      FROM public.class_sessions cs
      JOIN public.programs prog ON cs.program_id = prog.id
      JOIN public.profiles prof ON prof.id = auth.uid()
      WHERE cs.id = timetable_assignments.class_session_id
        AND prog.department_id = prof.department_id
    )
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
  OR
  -- Department heads can manage assignments for class sessions in their department's programs
  (
    public.has_role(auth.uid(), 'department_head')
    AND EXISTS (
      SELECT 1 
      FROM public.class_sessions cs
      JOIN public.programs prog ON cs.program_id = prog.id
      JOIN public.profiles prof ON prof.id = auth.uid()
      WHERE cs.id = class_session_id
        AND prog.department_id = prof.department_id
    )
  )
);

COMMENT ON POLICY "Allow program heads and department heads to manage timetable assignments" ON public.timetable_assignments IS 
'Allows admins, program heads (for their program), and department heads (for all programs in their department) to manage timetable assignments';