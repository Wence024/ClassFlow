-- Phase 1: Make instructor_id and classroom_id nullable in class_sessions
-- This allows creating incomplete sessions that can be assigned resources later via timetable drag-and-drop

-- Make columns nullable
ALTER TABLE class_sessions 
ALTER COLUMN instructor_id DROP NOT NULL,
ALTER COLUMN classroom_id DROP NOT NULL;

-- Add constraint: Sessions can have both resources, one resource, or no resources
-- This is permissive to support incomplete sessions
ALTER TABLE class_sessions 
ADD CONSTRAINT check_resources_valid 
CHECK (
  (instructor_id IS NOT NULL AND classroom_id IS NOT NULL) OR
  (instructor_id IS NOT NULL AND classroom_id IS NULL) OR
  (instructor_id IS NULL AND classroom_id IS NOT NULL) OR
  (instructor_id IS NULL AND classroom_id IS NULL)
);

-- Add index for querying incomplete sessions (where either resource is missing)
CREATE INDEX idx_incomplete_sessions 
ON class_sessions (program_id, created_at) 
WHERE instructor_id IS NULL OR classroom_id IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN class_sessions.instructor_id IS 'Instructor assigned to this session. Can be null for incomplete sessions that will be assigned via timetable drag-and-drop.';
COMMENT ON COLUMN class_sessions.classroom_id IS 'Classroom assigned to this session. Can be null for incomplete sessions that will be assigned via timetable drag-and-drop.';