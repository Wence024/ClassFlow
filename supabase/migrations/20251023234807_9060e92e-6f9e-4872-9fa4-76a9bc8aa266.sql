-- Update RLS policies for courses table to allow program heads to manage courses in their program

-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Allow users to manage their own courses" ON public.courses;

-- Create policy for INSERT (program heads can create courses for their program)
CREATE POLICY "Users can insert courses for their program"
ON public.courses
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = created_by 
  AND (
    public.has_role(auth.uid(), 'admin'::user_role)
    OR (
      public.has_role(auth.uid(), 'program_head'::user_role)
      AND program_id = public.get_user_program_id(auth.uid())
    )
  )
);

-- Create policy for UPDATE (admins or program heads of the same program)
CREATE POLICY "Users can update courses in their program"
ON public.courses
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::user_role)
  OR (
    public.has_role(auth.uid(), 'program_head'::user_role)
    AND program_id = public.get_user_program_id(auth.uid())
  )
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::user_role)
  OR (
    public.has_role(auth.uid(), 'program_head'::user_role)
    AND program_id = public.get_user_program_id(auth.uid())
  )
);

-- Create policy for DELETE (admins or program heads of the same program)
CREATE POLICY "Users can delete courses in their program"
ON public.courses
FOR DELETE
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::user_role)
  OR (
    public.has_role(auth.uid(), 'program_head'::user_role)
    AND program_id = public.get_user_program_id(auth.uid())
  )
);

-- Keep existing SELECT policy (all authenticated users can read courses)
-- No changes needed to "Allow authenticated users to read all courses"