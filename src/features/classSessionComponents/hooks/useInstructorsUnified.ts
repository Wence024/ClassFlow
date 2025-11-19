import { useAuth } from '../../shared/auth/hooks/useAuth';
import { useInstructors } from './useInstructors';
import { useAllInstructors } from './useAllInstructors';
import type { InstructorInsert, InstructorUpdate } from '../types/instructor';

/**
 * Unified hook for instructor data that adapts based on user role.
 *
 * - Admins/Dept Heads: Full CRUD access to department instructors
 * - Program Heads: Read-only access to all instructors.
 *
 * This hook consolidates the dual-hook pattern to follow React's Rules of Hooks
 * and simplify component logic and testing.
 *
 * @returns Instructor data and operations appropriate for the user's role.
 */
export function useInstructorsUnified() {
  const { canManageInstructors } = useAuth();
  const canManage = canManageInstructors();

  // Call both hooks unconditionally (React Rules of Hooks)
  const managementHook = useInstructors();
  const browseHook = useAllInstructors();

  // Return appropriate interface based on role
  if (canManage) {
    return {
      instructors: managementHook.instructors,
      isLoading: managementHook.isLoading,
      error: managementHook.error,
      addInstructor: managementHook.addInstructor,
      updateInstructor: managementHook.updateInstructor,
      removeInstructor: managementHook.removeInstructor,
      isSubmitting: managementHook.isSubmitting,
      isRemoving: managementHook.isRemoving,
      canManage: true,
    };
  }

  // Browse-only mode for non-managers
  return {
    instructors: browseHook.instructors,
    isLoading: browseHook.isLoading,
    error: browseHook.error,
    addInstructor: async (_data: InstructorInsert) => {
      throw new Error('Not authorized');
    },
    updateInstructor: async (_id: string, _data: InstructorUpdate) => {
      throw new Error('Not authorized');
    },
    removeInstructor: async (_id: string) => {
      throw new Error('Not authorized');
    },
    isSubmitting: false,
    isRemoving: false,
    canManage: false,
  };
}
