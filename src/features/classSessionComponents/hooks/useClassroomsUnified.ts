import { useAuth } from '../../auth/hooks/useAuth';
import { useClassrooms } from './useClassrooms';
import { useAllClassrooms } from './useAllClassrooms';
import type { ClassroomInsert, ClassroomUpdate } from '../types/classroom';

/**
 * Unified hook for classroom data that adapts based on user role.
 *
 * - Admins/Dept Heads: Full CRUD access with prioritized list
 * - Program Heads: Read-only access to all classrooms.
 *
 * This hook consolidates the dual-hook pattern to follow React's Rules of Hooks
 * and simplify component logic and testing.
 *
 * @returns Classroom data and operations appropriate for the user's role.
 */
export function useClassroomsUnified() {
  const { canManageClassrooms } = useAuth();
  const canManage = canManageClassrooms();

  // Call both hooks unconditionally (React Rules of Hooks)
  const managementHook = useClassrooms();
  const browseHook = useAllClassrooms();

  // Return appropriate interface based on role
  if (canManage) {
    return {
      classrooms: managementHook.classrooms,
      isLoading: managementHook.isLoading,
      error: managementHook.error,
      addClassroom: managementHook.addClassroom,
      updateClassroom: managementHook.updateClassroom,
      removeClassroom: managementHook.removeClassroom,
      isSubmitting: managementHook.isSubmitting,
      isRemoving: managementHook.isRemoving,
      canManage: true,
    };
  }

  // Browse-only mode for non-managers
  return {
    classrooms: browseHook.classrooms,
    isLoading: browseHook.isLoading,
    error: browseHook.error,
    addClassroom: async (_data: ClassroomInsert) => {
      throw new Error('Not authorized');
    },
    updateClassroom: async (_id: string, _data: ClassroomUpdate) => {
      throw new Error('Not authorized');
    },
    removeClassroom: async (_id: string) => {
      throw new Error('Not authorized');
    },
    isSubmitting: false,
    isRemoving: false,
    canManage: false,
  };
}
