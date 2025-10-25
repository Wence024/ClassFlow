-- Optional Migration: Assign Preferred Departments to Classrooms
-- Date: 2025-10-25
-- Purpose: Assign preferred_department_id to existing classrooms based on naming patterns
--          This improves department prioritization in selector modals for program heads

-- ============================================================================
-- IMPORTANT: Review and adjust department IDs before running
-- ============================================================================
-- This migration uses pattern matching on classroom names to assign departments.
-- You MUST verify the department UUIDs match your actual database before executing.

-- Get your department IDs first:
-- SELECT id, code, name FROM public.departments ORDER BY code;

-- ============================================================================
-- Example assignments (UPDATE THESE UUIDs!)
-- ============================================================================

-- Example: Assign Computer/IT labs to CECE (Computer Education) department
-- UPDATE public.classrooms 
-- SET preferred_department_id = 'ce65053a-4f2c-4f14-aee2-16592777f31e'  -- Replace with your CECE department ID
-- WHERE preferred_department_id IS NULL
--   AND (
--     name ILIKE '%IT%' 
--     OR name ILIKE '%Computer%' 
--     OR name ILIKE '%CS%'
--     OR code ILIKE '%IT%'
--   );

-- Example: Assign Business/Accounting rooms to CBA department
-- UPDATE public.classrooms 
-- SET preferred_department_id = 'd9445bfa-ecff-4753-95e7-b23c3fb79668'  -- Replace with your CBA department ID
-- WHERE preferred_department_id IS NULL
--   AND (
--     name ILIKE '%Business%' 
--     OR name ILIKE '%Accounting%'
--     OR name ILIKE '%Finance%'
--     OR code ILIKE '%CBA%'
--   );

-- Example: Assign Teacher Education rooms to CTELAN department
-- UPDATE public.classrooms 
-- SET preferred_department_id = '7c8e7e3c-8f3c-4d3c-9f3c-8f3c4d3c9f3c'  -- Replace with your CTELAN department ID
-- WHERE preferred_department_id IS NULL
--   AND (
--     name ILIKE '%Education%' 
--     OR name ILIKE '%Teacher%'
--     OR code ILIKE '%CTELAN%'
--   );

-- ============================================================================
-- Verification: Check classroom department assignments
-- ============================================================================

-- See current assignment status:
-- SELECT 
--   c.code,
--   c.name,
--   c.preferred_department_id,
--   d.code as dept_code,
--   d.name as dept_name
-- FROM public.classrooms c
-- LEFT JOIN public.departments d ON d.id = c.preferred_department_id
-- ORDER BY c.code;

-- Count unassigned classrooms:
-- SELECT 
--   COUNT(*) FILTER (WHERE preferred_department_id IS NULL) as unassigned,
--   COUNT(*) FILTER (WHERE preferred_department_id IS NOT NULL) as assigned,
--   COUNT(*) as total
-- FROM public.classrooms;
