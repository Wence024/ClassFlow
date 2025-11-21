/**
 * Integration tests for useCourses hook.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCourses } from '@/features/program-head/manage-components/hooks/useCourses';
import * as coursesService from '@/lib/services/courseService';
import { AuthContext } from '@/features/shared/auth/contexts/AuthContext';
import type { AuthContextType } from '@/features/shared/auth/types/auth';
import type { Course, CourseInsert } from '@/types/course';

vi.mock('@/features/classSessionComponents/services/coursesService');

const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  role: 'program_head' as const,
  program_id: 'prog-1',
  department_id: 'dept-1',
  full_name: 'Test User',
};

const mockCourses: Course[] = [
  {
    id: 'course-1',
    code: 'CS101',
    name: 'Introduction to Programming',
    program_id: 'prog-1',
    created_by: 'user-1',
    created_at: '2025-01-01',
    color: '#4f46e5',
    units: 3,
    lecture_hours: 3,
    lab_hours: 0,
  },
  {
    id: 'course-2',
    code: 'CS102',
    name: 'Data Structures',
    program_id: 'prog-1',
    created_by: 'user-1',
    created_at: '2025-01-02',
    color: '#10b981',
    units: 4,
    lecture_hours: 3,
    lab_hours: 3,
  },
];

const createWrapper = (authValue: Partial<AuthContextType> = {}) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  const defaultAuthValue: AuthContextType = {
    user: mockUser,
    loading: false,
    signIn: vi.fn(),
    signOut: vi.fn(),
    ...authValue,
  };

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={defaultAuthValue}>{children}</AuthContext.Provider>
    </QueryClientProvider>
  );
};

describe('useCourses', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetching courses', () => {
    it('should fetch courses for user program', async () => {
      vi.mocked(coursesService.getCoursesByProgram).mockResolvedValue(mockCourses);

      const { result } = renderHook(() => useCourses(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.courses).toHaveLength(2);
      expect(result.current.courses[0].code).toBe('CS101');
      expect(coursesService.getCoursesByProgram).toHaveBeenCalledWith('prog-1');
    });

    it('should not fetch when user has no program', () => {
      vi.mocked(coursesService.getCoursesByProgram).mockResolvedValue([]);

      const { result } = renderHook(() => useCourses(), {
        wrapper: createWrapper({ user: { ...mockUser, program_id: null } }),
      });

      expect(result.current.courses).toHaveLength(0);
      expect(coursesService.getCoursesByProgram).not.toHaveBeenCalled();
    });

    it('should handle fetch errors', async () => {
      vi.mocked(coursesService.getCoursesByProgram).mockRejectedValue(
        new Error('Fetch failed')
      );

      const { result } = renderHook(() => useCourses(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.error).toBe('Fetch failed');
    });
  });

  describe('addCourse', () => {
    it('should add a new course', async () => {
      vi.mocked(coursesService.getCoursesByProgram).mockResolvedValue(mockCourses);
      vi.mocked(coursesService.addCourse).mockResolvedValue(mockCourses[0]);

      const { result } = renderHook(() => useCourses(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const newCourse: CourseInsert = {
        code: 'CS103',
        name: 'Algorithms',
        program_id: 'prog-1',
        created_by: 'user-1',
        units: 3,
        lecture_hours: 3,
        lab_hours: 0,
      };

      await result.current.addCourse(newCourse);

      expect(coursesService.addCourse).toHaveBeenCalledWith(newCourse);
    });

    it('should handle add errors', async () => {
      vi.mocked(coursesService.getCoursesByProgram).mockResolvedValue(mockCourses);
      vi.mocked(coursesService.addCourse).mockRejectedValue(new Error('Add failed'));

      const { result } = renderHook(() => useCourses(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const newCourse: CourseInsert = {
        code: 'CS103',
        name: 'Algorithms',
        program_id: 'prog-1',
        created_by: 'user-1',
        units: 3,
        lecture_hours: 3,
        lab_hours: 0,
      };

      await expect(result.current.addCourse(newCourse)).rejects.toThrow('Add failed');
    });
  });

  describe('updateCourse', () => {
    it('should update an existing course', async () => {
      vi.mocked(coursesService.getCoursesByProgram).mockResolvedValue(mockCourses);
      vi.mocked(coursesService.updateCourse).mockResolvedValue(mockCourses[0]);

      const { result } = renderHook(() => useCourses(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await result.current.updateCourse('course-1', { name: 'Updated Course Name' });

      expect(coursesService.updateCourse).toHaveBeenCalledWith('course-1', {
        name: 'Updated Course Name',
      });
    });
  });

  describe('removeCourse', () => {
    it('should remove a course', async () => {
      vi.mocked(coursesService.getCoursesByProgram).mockResolvedValue(mockCourses);
      vi.mocked(coursesService.removeCourse).mockResolvedValue();

      const { result } = renderHook(() => useCourses(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await result.current.removeCourse('course-1');

      expect(coursesService.removeCourse).toHaveBeenCalledWith('course-1', 'user-1');
    });

    it('should handle foreign key constraint errors', async () => {
      vi.mocked(coursesService.getCoursesByProgram).mockResolvedValue(mockCourses);
      vi.mocked(coursesService.removeCourse).mockRejectedValue(
        new Error('foreign key violation')
      );

      const { result } = renderHook(() => useCourses(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await expect(result.current.removeCourse('course-1')).rejects.toThrow();
    });
  });
});
