-- Add status column to timetable_assignments
ALTER TABLE public.timetable_assignments
ADD COLUMN status TEXT NOT NULL DEFAULT 'confirmed'
CHECK (status IN ('pending', 'confirmed', 'rejected'));

-- Add index for performance
CREATE INDEX idx_timetable_assignments_status ON public.timetable_assignments(status);

-- Create helper function to check if a resource is from a different department
CREATE OR REPLACE FUNCTION public.is_cross_department_resource(
  _program_id uuid,
  _instructor_id uuid DEFAULT NULL,
  _classroom_id uuid DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  program_dept_id uuid;
  resource_dept_id uuid;
BEGIN
  -- Get the department_id for the program
  SELECT department_id INTO program_dept_id
  FROM public.programs
  WHERE id = _program_id;

  -- If no program found, return false
  IF program_dept_id IS NULL THEN
    RETURN false;
  END IF;

  -- Check instructor department if provided
  IF _instructor_id IS NOT NULL THEN
    SELECT department_id INTO resource_dept_id
    FROM public.instructors
    WHERE id = _instructor_id;
    
    -- If instructor has a department and it's different from program's department
    IF resource_dept_id IS NOT NULL AND resource_dept_id != program_dept_id THEN
      RETURN true;
    END IF;
  END IF;

  -- Check classroom department if provided
  IF _classroom_id IS NOT NULL THEN
    SELECT preferred_department_id INTO resource_dept_id
    FROM public.classrooms
    WHERE id = _classroom_id;
    
    -- If classroom has a preferred department and it's different from program's department
    IF resource_dept_id IS NOT NULL AND resource_dept_id != program_dept_id THEN
      RETURN true;
    END IF;
  END IF;

  -- No cross-department resource found
  RETURN false;
END;
$$;