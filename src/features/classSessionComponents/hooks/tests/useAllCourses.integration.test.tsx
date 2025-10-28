import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAllCourses } from '../useAllCourses';
import * as coursesService from '../../services/coursesService';
import { AuthContext } from '../../../auth/contexts/AuthContext';
import type { User } from '../../../auth/types/auth';
import type { Course } from '../../types/course';

// Mocks
vi.mock('../../services/coursesService');

const mockedCoursesService = vi.mocked(coursesService, true);

const queryClient = new QueryClient();

const TestWrapper = ({ children, user }: { children: React.ReactNode; user: User | null }) => (
  <QueryClientProvider client={queryClient}>
    <AuthContext.Provider value={{ user } as any}>
      {children}
    </AuthContext.Provider>
  </QueryClientProvider>
);

describe('useAllCourses', () => {
  const mockUser: User = {
    id: 'user1',
    name: 'Test User',
    email: 'test@user.com',
    role: 'program_head',
    program_id: 'p1',
    department_id: 'd1',
  };

  const mockCourses: Course[] = [
    { id: 'c1', name: 'Course 1', code: 'C1', program_id: 'p1', created_at: '', color: '#fff', created_by: 'u1' },
    { id: 'c2', name: 'Course 2', code: 'C2', program_id: 'p2', created_at: '', color: '#fff', created_by: 'u1' },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
    queryClient.clear();
  });

  it('should fetch all courses for an authenticated user', async () => {
    mockedCoursesService.getAllCourses.mockResolvedValue(mockCourses);

    const { result } = renderHook(() => useAllCourses(), {
      wrapper: ({ children }) => <TestWrapper user={mockUser}>{children}</TestWrapper>,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.courses).toEqual(mockCourses);
    expect(mockedCoursesService.getAllCourses).toHaveBeenCalledTimes(1);
  });
});
