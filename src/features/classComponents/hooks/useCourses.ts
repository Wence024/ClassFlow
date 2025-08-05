import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../auth/useAuth';
import * as coursesService from '../services/coursesService';
import type { Course, CourseInsert, CourseUpdate } from '../types/course';

export function useCourses() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['courses', user?.id];

  const {
    data: courses = [],
    isLoading,
    isFetching,
    error,
  } = useQuery<Course[]>({
    queryKey,
    queryFn: () => (user ? coursesService.getCourses(user.id) : Promise.resolve([])),
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: (data: CourseInsert) => coursesService.addCourse({ ...data, user_id: user!.id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CourseUpdate }) =>
      coursesService.updateCourse(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => coursesService.removeCourse(id, user!.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const loading =
    isLoading ||
    isFetching ||
    addMutation.isPending ||
    updateMutation.isPending ||
    removeMutation.isPending;

  return {
    courses,
    loading,
    error: error ? (error as Error).message : null,
    addCourse: addMutation.mutateAsync,
    updateCourse: (id: string, data: CourseUpdate) => updateMutation.mutateAsync({ id, data }),
    removeCourse: removeMutation.mutateAsync,
  };
}
