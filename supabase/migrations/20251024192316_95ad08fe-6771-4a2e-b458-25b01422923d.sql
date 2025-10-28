-- Backfill NULL program_id values in courses table
-- Set program_id to the creator's program_id for courses with NULL program_id
UPDATE public.courses
SET program_id = (
  SELECT p.program_id 
  FROM public.profiles p 
  WHERE p.id = courses.created_by
)
WHERE program_id IS NULL;

-- Add NOT NULL constraint to program_id column
ALTER TABLE public.courses
ALTER COLUMN program_id SET NOT NULL;