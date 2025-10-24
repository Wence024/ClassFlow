/**
 * Hooks for managing class session components (courses, class groups, classrooms, instructors).
 *
 * Two patterns are provided:
 * 1. **CRUD/Management Hooks** (useCourses, useClassGroups, useClassrooms, useInstructors):
 *    - Filtered by user's role and department for management views
 *    - Include mutation functions (add, update, remove)
 *    - Used in: Admin panels, Department Head views, Program Head resource management
 *
 * 2. **Selection Hooks** (useAllInstructors, useAllClassrooms):
 *    - Fetch ALL resources regardless of department
 *    - Read-only (no mutations)
 *    - Include department information for prioritization
 *    - Used in: Class session authoring, Timetabling workflows
 */

export { useCourses } from './useCourses';
export { useClassGroups } from './useClassGroups';
export { useClassrooms } from './useClassrooms';
export { useInstructors } from './useInstructors';

// Selection hooks for cross-department workflows
export { useAllInstructors } from './useAllInstructors';
export { useAllClassrooms } from './useAllClassrooms';
