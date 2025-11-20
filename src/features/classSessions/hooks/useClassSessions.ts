import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '../../shared/auth/hooks/useAuth';
import * as classSessionsService from '@/lib/services/classSessionService';
import type { ClassSession, ClassSessionInsert, ClassSessionUpdate } from '@/types/classSession';

/**
 * Custom hook to manage class sessions data.
 *
 * This hook provides a reactive interface to the user's class sessions. It handles
 * fetching, creating, updating, and deleting sessions using React Query for robust
 * server state management, including caching and automatic data refetching.
 *
 * @returns An object containing the class sessions data, granular loading and error states, and mutation functions.
 *
 * @example
 * const { classSessions, loading, addClassSession } = useClassSessions();
 *
 * const handleCreate = () => {
 *   addClassSession({
 *     course_id: '...',
 *     instructor_id: '...',
 *     // ... other foreign keys
 *   });
 * };
 */
export function useClassSessions() {
  const { user } = useAuth(); // Your user object now contains program_id
  const queryClient = useQueryClient();

  /**
   * The React Query key for this data. It includes the user's ID to ensure
   * that each user's data is cached separately.
   */
  const queryKey = ['classSessions', user?.id];

  const {
    data: classSessions = [],
    isLoading: isListLoading,
    isFetching,
    error,
  } = useQuery<ClassSession[]>({
    queryKey,
    // The query function is only called if the user is authenticated.
    queryFn: () => (user ? classSessionsService.getClassSessions(user.id) : Promise.resolve([])),
    enabled: !!user, // The query will not execute until a user is available.
  });

  // Mutation for adding a new class session.
  const addMutation = useMutation({
    mutationFn: (data: ClassSessionInsert) => {
      if (!user?.program_id) {
        throw new Error('Cannot create class session: User is not assigned to a program.');
      }
      // Add the user's program_id to the new class session
      const sessionData = { ...data, user_id: user.id, program_id: user.program_id };
      return classSessionsService.addClassSession(sessionData);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  // Mutation for updating an existing class session.
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ClassSessionUpdate }) =>
      classSessionsService.updateClassSession(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  // Mutation for removing a class session.
  const removeMutation = useMutation({
    mutationFn: (id: string) => classSessionsService.removeClassSession(id, user!.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    onError: (error: Error) => {
      if (error.message.includes('foreign key') || error.message.includes('violates')) {
        toast.error('Cannot delete class session', {
          description:
            'This class session is being used in timetable assignments and cannot be deleted.',
        });
      } else {
        toast.error('Failed to delete class session', {
          description: error.message,
        });
      }
    },
  });

  return {
    /** The cached array of the user's class sessions. Defaults to an empty array. */
    classSessions,

    /** A boolean indicating if any data fetching or mutation is currently active. */
    isLoading: isListLoading || isFetching,

    /** A boolean indicating if a create or update operation is in progress. */
    isSubmitting: addMutation.isPending || updateMutation.isPending,

    /** A boolean indicating if a delete operation is in progress. */
    isRemoving: removeMutation.isPending,

    /** An error message string if the query fails, otherwise null. */
    error: error ? (error as Error).message : null,

    /** An async function to add a new class session. Requires an object with foreign keys. */
    addClassSession: addMutation.mutateAsync,

    /**
     * An async function to update a class session. Requires the session ID and the update data.
     *
     * @param id The ID of the class session to update.
     * @param data The data to update the class session with.
     * @returns A promise that resolves when the update is complete.
     */
    updateClassSession: (id: string, data: ClassSessionUpdate) =>
      updateMutation.mutateAsync({ id, data }),

    /** An async function to remove a class session by its ID. */
    removeClassSession: removeMutation.mutateAsync,
  };
}

/**
 * Helper function to check if a class session uses cross-department resources.
 *
 * @param data - The class session form data.
 * @param data.instructor_id - The ID of the instructor for the session.
 * @param data.classroom_id - The ID of the classroom for the session.
 * @param programId - The program ID to check against.
 * @returns An object with cross-department detection results.
 */
export async function checkCrossDepartmentResources(
  data: { instructor_id: string; classroom_id: string },
  programId: string
): Promise<{
  isCrossDept: boolean;
  resourceType: 'instructor' | 'classroom' | null;
  resourceId: string | null;
  departmentId: string | null;
}> {
  const { isCrossDepartmentInstructor, isCrossDepartmentClassroom, getResourceDepartmentId } =
    await import('../../classSessions/services/classSessionsService');

  const isInstructorCrossDept = await isCrossDepartmentInstructor(programId, data.instructor_id);
  const isClassroomCrossDept = await isCrossDepartmentClassroom(programId, data.classroom_id);

  if (isInstructorCrossDept) {
    const deptId = await getResourceDepartmentId(data.instructor_id, undefined);
    return {
      isCrossDept: true,
      resourceType: 'instructor',
      resourceId: data.instructor_id,
      departmentId: deptId,
    };
  }

  if (isClassroomCrossDept) {
    const deptId = await getResourceDepartmentId(undefined, data.classroom_id);
    return {
      isCrossDept: true,
      resourceType: 'classroom',
      resourceId: data.classroom_id,
      departmentId: deptId,
    };
  }

  return { isCrossDept: false, resourceType: null, resourceId: null, departmentId: null };
}
