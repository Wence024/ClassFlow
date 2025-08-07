import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../auth/hooks/useAuth';
import * as instructorsService from '../services/instructorsService';
import type { Instructor, InstructorInsert, InstructorUpdate } from '../types/instructor';

export function useInstructors() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['instructors', user?.id];

  const {
    data: instructors = [],
    isLoading,
    isFetching,
    error,
  } = useQuery<Instructor[]>({
    queryKey,
    queryFn: () => (user ? instructorsService.getInstructors(user.id) : Promise.resolve([])),
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: (data: InstructorInsert) =>
      instructorsService.addInstructor({ ...data, user_id: user!.id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: InstructorUpdate }) =>
      instructorsService.updateInstructor(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => instructorsService.removeInstructor(id, user!.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const loading =
    isLoading ||
    isFetching ||
    addMutation.isPending ||
    updateMutation.isPending ||
    removeMutation.isPending;

  return {
    instructors,
    loading,
    error: error ? (error as Error).message : null,
    addInstructor: addMutation.mutateAsync,
    updateInstructor: (id: string, data: InstructorUpdate) =>
      updateMutation.mutateAsync({ id, data }),
    removeInstructor: removeMutation.mutateAsync,
  };
}
