import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../auth/hooks/useAuth';
import * as classroomsService from '../services/classroomsService';
import type { Classroom, ClassroomInsert, ClassroomUpdate } from '../types/classroom';

export function useClassrooms() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const queryKey = ['classrooms', user?.id];

  const {
    data: classrooms = [],
    isLoading,
    isFetching,
    error,
  } = useQuery<Classroom[]>({
    queryKey,
    queryFn: () => (user ? classroomsService.getClassrooms(user.id) : Promise.resolve([])),
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: (data: ClassroomInsert) =>
      classroomsService.addClassroom({ ...data, user_id: user!.id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ClassroomUpdate }) =>
      classroomsService.updateClassroom(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => classroomsService.removeClassroom(id, user!.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    classrooms,
    isLoading: isLoading || isFetching,
    error: error ? (error as Error).message : null,
    addClassroom: addMutation.mutateAsync,
    updateClassroom: (id: string, data: ClassroomUpdate) =>
      updateMutation.mutateAsync({ id, data }),
    removeClassroom: removeMutation.mutateAsync,
  };
}
