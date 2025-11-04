-- Add units and contact hours to courses table
ALTER TABLE courses ADD COLUMN IF NOT EXISTS units DECIMAL(5,2);
ALTER TABLE courses ADD COLUMN IF NOT EXISTS lecture_hours DECIMAL(5,2);
ALTER TABLE courses ADD COLUMN IF NOT EXISTS lab_hours DECIMAL(5,2);

-- Add helpful comment
COMMENT ON COLUMN courses.units IS 'Course units - auto-calculated from lecture + lab hours, but can be customized';
COMMENT ON COLUMN courses.lecture_hours IS 'Weekly lecture contact hours for the course';
COMMENT ON COLUMN courses.lab_hours IS 'Weekly laboratory contact hours for the course';