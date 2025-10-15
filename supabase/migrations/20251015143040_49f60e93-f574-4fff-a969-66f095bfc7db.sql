-- Add department_id foreign key to the programs table (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'programs' 
    AND column_name = 'department_id'
  ) THEN
    ALTER TABLE public.programs
    ADD COLUMN department_id uuid REFERENCES public.departments(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Add an index for faster lookups (if not exists)
CREATE INDEX IF NOT EXISTS idx_programs_department_id ON public.programs(department_id);