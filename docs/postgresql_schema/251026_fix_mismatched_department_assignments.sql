-- Migration: Fix Mismatched Department Assignments
-- Date: 2025-10-26
-- Purpose: Correct department assignments where names indicate one department
--          but the assigned department_id points to a different department
--          (e.g., instructor/profile name contains "CBA" but assigned to CTELAN)

-- ============================================================================
-- STEP 1: Identify Mismatched Data (Query for Review)
-- ============================================================================

-- Preview instructors with potential mismatches
-- Run this query first to see what will be changed
SELECT 
  i.id,
  i.first_name || ' ' || i.last_name as instructor_name,
  i.code,
  i.email,
  d_current.code as current_dept_code,
  d_current.name as current_dept_name,
  CASE 
    WHEN i.first_name || ' ' || i.last_name ILIKE '%CBA%' OR i.code ILIKE '%CBA%' THEN 'CBA'
    WHEN i.first_name || ' ' || i.last_name ILIKE '%CTELAN%' OR i.code ILIKE '%CTELAN%' THEN 'CTELAN'
    WHEN i.first_name || ' ' || i.last_name ILIKE '%CECE%' OR i.code ILIKE '%CECE%' OR i.code ILIKE '%CS%' THEN 'CECE'
    WHEN i.first_name || ' ' || i.last_name ILIKE '%COE%' OR i.code ILIKE '%COE%' THEN 'COE'
    ELSE 'UNKNOWN'
  END as name_suggests_dept
FROM instructors i
LEFT JOIN departments d_current ON d_current.id = i.department_id
WHERE 
  -- Find mismatches where name suggests one dept but assigned to another
  (
    (i.first_name || ' ' || i.last_name ILIKE '%CBA%' OR i.code ILIKE '%CBA%') AND d_current.code != 'CBA'
    OR
    (i.first_name || ' ' || i.last_name ILIKE '%CTELAN%' OR i.code ILIKE '%CTELAN%') AND d_current.code != 'CTELAN'
    OR
    (i.first_name || ' ' || i.last_name ILIKE '%CECE%' OR i.code ILIKE '%CECE%' OR i.code ILIKE '%CS%') AND d_current.code != 'CECE'
    OR
    (i.first_name || ' ' || i.last_name ILIKE '%COE%' OR i.code ILIKE '%COE%') AND d_current.code != 'COE'
  )
ORDER BY instructor_name;

-- Preview profiles with potential mismatches
SELECT 
  p.id,
  p.full_name,
  p.email,
  ur.role,
  d_current.code as current_dept_code,
  d_current.name as current_dept_name,
  CASE 
    WHEN p.full_name ILIKE '%CBA%' THEN 'CBA'
    WHEN p.full_name ILIKE '%CTELAN%' THEN 'CTELAN'
    WHEN p.full_name ILIKE '%CECE%' OR p.full_name ILIKE '%CS%' THEN 'CECE'
    WHEN p.full_name ILIKE '%COE%' THEN 'COE'
    ELSE 'UNKNOWN'
  END as name_suggests_dept
FROM profiles p
LEFT JOIN user_roles ur ON ur.user_id = p.id
LEFT JOIN departments d_current ON d_current.id = p.department_id
WHERE 
  ur.role = 'department_head'
  AND (
    (p.full_name ILIKE '%CBA%' AND d_current.code != 'CBA')
    OR
    (p.full_name ILIKE '%CTELAN%' AND d_current.code != 'CTELAN')
    OR
    (p.full_name ILIKE '%CECE%' OR p.full_name ILIKE '%CS%') AND d_current.code != 'CECE'
    OR
    (p.full_name ILIKE '%COE%' AND d_current.code != 'COE')
  )
ORDER BY p.full_name;

-- ============================================================================
-- STEP 2: Fix Instructor Department Assignments
-- ============================================================================

-- Update instructors with names/codes indicating CBA but assigned elsewhere
UPDATE instructors i
SET department_id = (SELECT id FROM departments WHERE code = 'CBA' LIMIT 1)
WHERE 
  (i.first_name || ' ' || i.last_name ILIKE '%CBA%' OR i.code ILIKE '%CBA%')
  AND i.department_id != (SELECT id FROM departments WHERE code = 'CBA' LIMIT 1)
  AND EXISTS (SELECT 1 FROM departments WHERE code = 'CBA');

-- Update instructors with names/codes indicating CTELAN but assigned elsewhere
UPDATE instructors i
SET department_id = (SELECT id FROM departments WHERE code = 'CTELAN' LIMIT 1)
WHERE 
  (i.first_name || ' ' || i.last_name ILIKE '%CTELAN%' OR i.code ILIKE '%CTELAN%')
  AND i.department_id != (SELECT id FROM departments WHERE code = 'CTELAN' LIMIT 1)
  AND EXISTS (SELECT 1 FROM departments WHERE code = 'CTELAN');

-- Update instructors with names/codes indicating CECE/CS but assigned elsewhere
UPDATE instructors i
SET department_id = (SELECT id FROM departments WHERE code = 'CECE' LIMIT 1)
WHERE 
  (i.first_name || ' ' || i.last_name ILIKE '%CECE%' OR i.code ILIKE '%CECE%' OR i.code ILIKE '%CS%')
  AND i.department_id != (SELECT id FROM departments WHERE code = 'CECE' LIMIT 1)
  AND EXISTS (SELECT 1 FROM departments WHERE code = 'CECE');

-- Update instructors with names/codes indicating COE but assigned elsewhere
UPDATE instructors i
SET department_id = (SELECT id FROM departments WHERE code = 'COE' LIMIT 1)
WHERE 
  (i.first_name || ' ' || i.last_name ILIKE '%COE%' OR i.code ILIKE '%COE%')
  AND i.department_id != (SELECT id FROM departments WHERE code = 'COE' LIMIT 1)
  AND EXISTS (SELECT 1 FROM departments WHERE code = 'COE');

-- ============================================================================
-- STEP 3: Fix Department Head Profile Assignments
-- ============================================================================

-- Update department head profiles with names indicating CBA but assigned elsewhere
UPDATE profiles p
SET department_id = (SELECT id FROM departments WHERE code = 'CBA' LIMIT 1)
FROM user_roles ur
WHERE 
  ur.user_id = p.id
  AND ur.role = 'department_head'
  AND p.full_name ILIKE '%CBA%'
  AND p.department_id != (SELECT id FROM departments WHERE code = 'CBA' LIMIT 1)
  AND EXISTS (SELECT 1 FROM departments WHERE code = 'CBA');

-- Update department head profiles with names indicating CTELAN but assigned elsewhere
UPDATE profiles p
SET department_id = (SELECT id FROM departments WHERE code = 'CTELAN' LIMIT 1)
FROM user_roles ur
WHERE 
  ur.user_id = p.id
  AND ur.role = 'department_head'
  AND p.full_name ILIKE '%CTELAN%'
  AND p.department_id != (SELECT id FROM departments WHERE code = 'CTELAN' LIMIT 1)
  AND EXISTS (SELECT 1 FROM departments WHERE code = 'CTELAN');

-- Update department head profiles with names indicating CECE/CS but assigned elsewhere
UPDATE profiles p
SET department_id = (SELECT id FROM departments WHERE code = 'CECE' LIMIT 1)
FROM user_roles ur
WHERE 
  ur.user_id = p.id
  AND ur.role = 'department_head'
  AND (p.full_name ILIKE '%CECE%' OR p.full_name ILIKE '%CS%')
  AND p.department_id != (SELECT id FROM departments WHERE code = 'CECE' LIMIT 1)
  AND EXISTS (SELECT 1 FROM departments WHERE code = 'CECE');

-- Update department head profiles with names indicating COE but assigned elsewhere
UPDATE profiles p
SET department_id = (SELECT id FROM departments WHERE code = 'COE' LIMIT 1)
FROM user_roles ur
WHERE 
  ur.user_id = p.id
  AND ur.role = 'department_head'
  AND p.full_name ILIKE '%COE%'
  AND p.department_id != (SELECT id FROM departments WHERE code = 'COE' LIMIT 1)
  AND EXISTS (SELECT 1 FROM departments WHERE code = 'COE');

-- ============================================================================
-- STEP 4: Verification Queries (Run After Updates)
-- ============================================================================

-- Verify instructor assignments are now correct
SELECT 
  i.id,
  i.first_name || ' ' || i.last_name as instructor_name,
  i.code,
  d.code as dept_code,
  d.name as dept_name
FROM instructors i
LEFT JOIN departments d ON d.id = i.department_id
WHERE 
  i.code ILIKE '%CBA%' OR 
  i.code ILIKE '%CTELAN%' OR 
  i.code ILIKE '%CECE%' OR 
  i.code ILIKE '%CS%' OR 
  i.code ILIKE '%COE%'
ORDER BY d.code, i.code;

-- Verify department head assignments are now correct
SELECT 
  p.full_name,
  p.email,
  ur.role,
  d.code as dept_code,
  d.name as dept_name
FROM profiles p
JOIN user_roles ur ON ur.user_id = p.id
LEFT JOIN departments d ON d.id = p.department_id
WHERE ur.role = 'department_head'
ORDER BY d.code, p.full_name;

-- Check if there are any remaining mismatches
SELECT 
  'instructor' as source_table,
  i.id,
  i.first_name || ' ' || i.last_name as name,
  i.code,
  d.code as assigned_dept,
  CASE 
    WHEN i.code ILIKE '%CBA%' THEN 'CBA'
    WHEN i.code ILIKE '%CTELAN%' THEN 'CTELAN'
    WHEN i.code ILIKE '%CECE%' OR i.code ILIKE '%CS%' THEN 'CECE'
    WHEN i.code ILIKE '%COE%' THEN 'COE'
  END as code_suggests
FROM instructors i
LEFT JOIN departments d ON d.id = i.department_id
WHERE 
  (i.code ILIKE '%CBA%' AND d.code != 'CBA')
  OR (i.code ILIKE '%CTELAN%' AND d.code != 'CTELAN')
  OR ((i.code ILIKE '%CECE%' OR i.code ILIKE '%CS%') AND d.code != 'CECE')
  OR (i.code ILIKE '%COE%' AND d.code != 'COE')

UNION ALL

SELECT 
  'profile' as source_table,
  p.id,
  p.full_name as name,
  NULL as code,
  d.code as assigned_dept,
  CASE 
    WHEN p.full_name ILIKE '%CBA%' THEN 'CBA'
    WHEN p.full_name ILIKE '%CTELAN%' THEN 'CTELAN'
    WHEN p.full_name ILIKE '%CECE%' OR p.full_name ILIKE '%CS%' THEN 'CECE'
    WHEN p.full_name ILIKE '%COE%' THEN 'COE'
  END as name_suggests
FROM profiles p
JOIN user_roles ur ON ur.user_id = p.id
LEFT JOIN departments d ON d.id = p.department_id
WHERE 
  ur.role = 'department_head'
  AND (
    (p.full_name ILIKE '%CBA%' AND d.code != 'CBA')
    OR (p.full_name ILIKE '%CTELAN%' AND d.code != 'CTELAN')
    OR ((p.full_name ILIKE '%CECE%' OR p.full_name ILIKE '%CS%') AND d.code != 'CECE')
    OR (p.full_name ILIKE '%COE%' AND d.code != 'COE')
  );

-- ============================================================================
-- USAGE INSTRUCTIONS
-- ============================================================================
-- 1. Run STEP 1 queries to preview what will be changed
-- 2. Review the results carefully
-- 3. Run STEP 2 queries to fix instructor assignments
-- 4. Run STEP 3 queries to fix department head profile assignments
-- 5. Run STEP 4 queries to verify all changes are correct
-- 6. The final query in STEP 4 should return 0 rows if all mismatches are fixed
