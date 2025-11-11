import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAllClassrooms } from '../useAllClassrooms';
import type { User } from '../../../auth/types/auth';

// --- Mocks ---
vi.mock('../../../auth/hooks/useAuth');
vi.mock('../../services/classroomsService');

// --- Mock Data ---
const mockUser: User = {
  id: 'user1',
  email: 'test@example.com',
  role: 'program_head',
  program_id: 'p1',
  department_id: 'd1',
  first_name: 'Test',
  last_name: 'User',
};

const mockClassroomsFromDept1 = [
  {
    id: 'c1',
    name: 'Room 101',
    preferred_department_id: 'd1',
    preferred_department_name: 'Computer Science',
  },
  {
    id: 'c2',
    name: 'Room 102',
    preferred_department_id: 'd1',
    preferred_department_name: 'Computer Science',
  },
];

const mockClassroomsFromDept2 = [
  {
    id: 'c3',
    name: 'Math Lab',
    preferred_department_id: 'd2',
    preferred_department_name: 'Mathematics',
  },
];

const allMockClassrooms = [...mockClassroomsFromDept1, ...mockClassroomsFromDept2];

// --- Test Setup ---
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, staleTime: Infinity },
  },
});

/**
 * Wrapper component to provide React Query context.
 *
 * @param w - The props containing children to wrap.
 * @param w.children - The children to wrap.
 * @returns The wrapped component.
 */
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const createDelayedPromise = <T,>(data: T, delay: number): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

describe('useAllClassrooms Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('should fetch all classrooms regardless of user department', async () => {
    const mockUseAuth = vi.mocked(await import('../../../auth/hooks/useAuth')).useAuth;
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      isAdmin: () => false,
      isDepartmentHead: () => false,
      isProgramHead: () => true,
      canManageInstructors: () => false,
      canManageClassrooms: () => false,
      canReviewRequestsForDepartment: () => false,
      canManageInstructorRow: () => false,
      canManageAssignmentsForProgram: () => true,
      login: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
      updateMyProfile: vi.fn(),
      role: 'program_head',
      departmentId: 'd1',
      error: null,
    });

    const mockClassroomsService = vi.mocked(await import('../../services/classroomsService'));
    mockClassroomsService.getAllClassrooms.mockResolvedValue(allMockClassrooms);

    const { result } = renderHook(() => useAllClassrooms(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.classrooms).toHaveLength(3);
    expect(result.current.classrooms).toEqual(allMockClassrooms);
    expect(mockClassroomsService.getAllClassrooms).toHaveBeenCalledTimes(1);
  });

  it('should include preferred_department_name in classroom data', async () => {
    const mockUseAuth = vi.mocked(await import('../../../auth/hooks/useAuth')).useAuth;
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      isAdmin: () => false,
      isDepartmentHead: () => false,
      isProgramHead: () => true,
      canManageInstructors: () => false,
      canManageClassrooms: () => false,
      canReviewRequestsForDepartment: () => false,
      canManageInstructorRow: () => false,
      canManageAssignmentsForProgram: () => true,
      login: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
      updateMyProfile: vi.fn(),
      role: 'program_head',
      departmentId: 'd1',
      error: null,
    });

    const mockClassroomsService = vi.mocked(await import('../../services/classroomsService'));
    mockClassroomsService.getAllClassrooms.mockResolvedValue(allMockClassrooms);

    const { result } = renderHook(() => useAllClassrooms(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.classrooms[0]).toHaveProperty('preferred_department_name');
    expect(result.current.classrooms[0].preferred_department_name).toBe('Computer Science');
    expect(result.current.classrooms[2].preferred_department_name).toBe('Mathematics');
  });

  it('should handle loading state', async () => {
    const mockUseAuth = vi.mocked(await import('../../../auth/hooks/useAuth')).useAuth;
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      isAdmin: () => false,
      isDepartmentHead: () => false,
      isProgramHead: () => true,
      canManageInstructors: () => false,
      canManageClassrooms: () => false,
      canReviewRequestsForDepartment: () => false,
      canManageInstructorRow: () => false,
      canManageAssignmentsForProgram: () => true,
      login: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
      updateMyProfile: vi.fn(),
      role: 'program_head',
      departmentId: 'd1',
      error: null,
    });

    const mockClassroomsService = vi.mocked(await import('../../services/classroomsService'));
    mockClassroomsService.getAllClassrooms.mockImplementation(() =>
      createDelayedPromise(allMockClassrooms, 100)
    );

    const { result } = renderHook(() => useAllClassrooms(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.classrooms).toHaveLength(3);
  });

  it('should handle error state', async () => {
    const mockUseAuth = vi.mocked(await import('../../../auth/hooks/useAuth')).useAuth;
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      isAdmin: () => false,
      isDepartmentHead: () => false,
      isProgramHead: () => true,
      canManageInstructors: () => false,
      canManageClassrooms: () => false,
      canReviewRequestsForDepartment: () => false,
      canManageInstructorRow: () => false,
      canManageAssignmentsForProgram: () => true,
      login: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
      updateMyProfile: vi.fn(),
      role: 'program_head',
      departmentId: 'd1',
      error: null,
    });

    const mockClassroomsService = vi.mocked(await import('../../services/classroomsService'));
    mockClassroomsService.getAllClassrooms.mockRejectedValue(
      new Error('Failed to fetch classrooms')
    );

    const { result } = renderHook(() => useAllClassrooms(), { wrapper });

    await waitFor(() => {
      expect(result.current.error).toBe('Failed to fetch classrooms');
    });

    expect(result.current.classrooms).toHaveLength(0);
  });
});
