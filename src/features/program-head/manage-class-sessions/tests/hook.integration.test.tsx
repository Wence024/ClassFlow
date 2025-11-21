/**
 * Integration tests for useManageClassSessions hook.
 * Tests class session CRUD operations for program heads.
 */

import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useManageClassSessions } from '../hook';
import * as classSessionService from '@/lib/services/classSessionService';
import { AuthContext } from '../../../shared/auth/contexts/AuthContext';
import type { User, AuthContextType } from '../../../shared/auth/types/auth';

// Mocks
vi.mock('@/lib/services/classSessionService');

const mockedService = vi.mocked(classSessionService);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const mockUser: User = {
  id: 'user1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'program_head',
  program_id: 'p1',
  department_id: 'd1',
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const authContextValue: AuthContextType = {
    user: mockUser,
    loading: false,
    error: null,
    role: 'program_head',
    departmentId: 'd1',
    login: vi.fn(),
    logout: vi.fn(),
    clearError: vi.fn(),
    updateMyProfile: vi.fn(),
    isAdmin: () => false,
    isDepartmentHead: () => false,
    isProgramHead: () => true,
    canManageInstructors: () => false,
    canManageClassrooms: () => false,
    canReviewRequestsForDepartment: () => false,
    canManageInstructorRow: () => false,
    canManageAssignmentsForProgram: () => true,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>
    </QueryClientProvider>
  );
};

const mockClassSessions = [
  {
    id: 'session1',
    course: { id: 'c1', name: 'Math', code: 'MATH101' },
    group: { id: 'g1', name: 'Group A' },
    instructor: { id: 'i1', first_name: 'John', last_name: 'Doe' },
    classroom: { id: 'r1', name: 'Room 101' },
    period_count: 1,
    program_id: 'p1',
  },
];

describe('useManageClassSessions Hook', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    queryClient.clear();
  });

  it('should fetch class sessions for program', async () => {
    mockedService.getClassSessions.mockResolvedValue(mockClassSessions);

    const { result } = renderHook(() => useManageClassSessions(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.sessions).toEqual(mockClassSessions);
    });

    expect(mockedService.getClassSessions).toHaveBeenCalledWith('user1');
  });

  it('should add a new class session', async () => {
    const newSession = {
      course_id: 'c2',
      class_group_id: 'g2',
      instructor_id: 'i2',
      classroom_id: 'r2',
      period_count: 2,
    };

    mockedService.getClassSessions.mockResolvedValue(mockClassSessions);
    mockedService.addClassSession.mockResolvedValue({ id: 'session2', ...newSession });

    const { result } = renderHook(() => useManageClassSessions(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Since we're mocking the infra service directly, we don't need to check the service layer calls
    await act(async () => {
      await result.current.createSession(newSession);
    });

    // Check that the mutation was called with the correct parameters
    expect(mockedService.addClassSession).toHaveBeenCalledWith({
      ...newSession,
      user_id: 'user1',
      program_id: 'p1',
    });
  });

  it('should update an existing class session', async () => {
    const updates = {
      period_count: 3,
    };

    mockedService.getClassSessions.mockResolvedValue(mockClassSessions);
    mockedService.updateClassSession.mockResolvedValue({ ...mockClassSessions[0], ...updates });

    const { result } = renderHook(() => useManageClassSessions(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.updateSession('session1', updates);
    });

    expect(mockedService.updateClassSession).toHaveBeenCalledWith('session1', updates);
  });

  it('should remove a class session', async () => {
    mockedService.getClassSessions.mockResolvedValue(mockClassSessions);
    mockedService.removeClassSession.mockResolvedValue(undefined);

    const { result } = renderHook(() => useManageClassSessions(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.deleteSession('session1');
    });

    expect(mockedService.removeClassSession).toHaveBeenCalledWith('session1', 'user1');
  });

  it('should handle fetch errors', async () => {
    const error = new Error('Failed to fetch sessions');
    mockedService.getClassSessions.mockRejectedValue(error);

    const { result } = renderHook(() => useManageClassSessions(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });
  });
});
