/**
 * Hooks for managing class session components (courses, class groups, classrooms, instructors).
 *
 * Three patterns are provided:
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
 *
 * 3. **Unified Hooks** (useClassroomsUnified, useInstructorsUnified):
 *    - Adapt based on user role (management vs browse mode)
 *    - Follow React Rules of Hooks by calling all hooks unconditionally
 *    - Simplify component logic and testing
 *    - Used in: Component UIs that support both admin and program head views
 */

export { useCourses } from './useCourses';
export { useClassGroups } from './useClassGroups';
export { useClassrooms } from './useClassrooms';
export { useInstructors } from './useInstructors';

// Selection hooks for cross-department workflows
export { useAllInstructors } from './useAllInstructors';
export { useAllClassrooms } from './useAllClassrooms';
export { useAllCourses } from './useAllCourses';

// Unified hooks that adapt to user role
export { useClassroomsUnified } from './useClassroomsUnified';
export { useInstructorsUnified } from './useInstructorsUnified';
