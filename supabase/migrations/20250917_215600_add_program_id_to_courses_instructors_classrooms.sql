-- Add program_id column to courses table
ALTER TABLE public.courses 
ADD COLUMN program_id uuid 
REFERENCES public.programs(id) ON DELETE SET NULL;

-- Add program_id column to instructors table
ALTER TABLE public.instructors 
ADD COLUMN program_id uuid 
REFERENCES public.programs(id) ON DELETE SET NULL;

-- Add program_id column to classrooms table
ALTER TABLE public.classrooms 
ADD COLUMN program_id uuid 
REFERENCES public.programs(id) ON DELETE SET NULL;

-- Optional: Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_courses_program_id ON public.courses(program_id);
CREATE INDEX IF NOT EXISTS idx_instructors_program_id ON public.instructors(program_id);
CREATE INDEX IF NOT EXISTS idx_classrooms_program_id ON public.classrooms(program_id);
