import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAllInstructors } from '../useAllInstructors';
import type { User } from '../../../shared/auth/types/auth';

// --- Mocks ---
vi.mock('../../../shared/auth/hooks/useAuth');
vi.mock('../../services/instructorsService');

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

const mockInstructorsFromDept1 = [
  {
    id: 'i1',
    first_name: 'John',
    last_name: 'Doe',
    department_id: 'd1',
    department_name: 'Computer Science',
  },
  {
    id: 'i2',
    first_name: 'Jane',
    last_name: 'Smith',
    department_id: 'd1',
    department_name: 'Computer Science',
  },
];

const mockInstructorsFromDept2 = [
  {
    id: 'i3',
    first_name: 'Bob',
    last_name: 'Johnson',
    department_id: 'd2',
    department_name: 'Mathematics',
  },
];

const allMockInstructors = [...mockInstructorsFromDept1, ...mockInstructorsFromDept2];

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

describe('useAllInstructors Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('should fetch all instructors regardless of user department', async () => {
    const mockUseAuth = vi.mocked(await import('../../../shared/auth/hooks/useAuth')).useAuth;
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

    const mockInstructorsService = vi.mocked(await import('../../services/instructorsService'));
    mockInstructorsService.getAllInstructors.mockResolvedValue(allMockInstructors);

    const { result } = renderHook(() => useAllInstructors(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.instructors).toHaveLength(3);
    expect(result.current.instructors).toEqual(allMockInstructors);
    expect(mockInstructorsService.getAllInstructors).toHaveBeenCalledTimes(1);
  });

  it('should include department_name in instructor data', async () => {
    const mockUseAuth = vi.mocked(await import('../../../shared/auth/hooks/useAuth')).useAuth;
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

    const mockInstructorsService = vi.mocked(await import('../../services/instructorsService'));
    mockInstructorsService.getAllInstructors.mockResolvedValue(allMockInstructors);

    const { result } = renderHook(() => useAllInstructors(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.instructors[0]).toHaveProperty('department_name');
    expect(result.current.instructors[0].department_name).toBe('Computer Science');
    expect(result.current.instructors[2].department_name).toBe('Mathematics');
  });

  it('should handle loading state', async () => {
    const mockUseAuth = vi.mocked(await import('../../../shared/auth/hooks/useAuth')).useAuth;
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

    const mockInstructorsService = vi.mocked(await import('../../services/instructorsService'));
    mockInstructorsService.getAllInstructors.mockImplementation(() =>
      createDelayedPromise(allMockInstructors, 100)
    );

    const { result } = renderHook(() => useAllInstructors(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.instructors).toHaveLength(3);
  });

  it('should handle error state', async () => {
    const mockUseAuth = vi.mocked(await import('../../../shared/auth/hooks/useAuth')).useAuth;
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

    const mockInstructorsService = vi.mocked(await import('../../services/instructorsService'));
    mockInstructorsService.getAllInstructors.mockRejectedValue(
      new Error('Failed to fetch instructors')
    );

    const { result } = renderHook(() => useAllInstructors(), { wrapper });

    await waitFor(() => {
      expect(result.current.error).toBe('Failed to fetch instructors');
    });

    expect(result.current.instructors).toHaveLength(0);
  });
});
