/**
 * Integration tests for useManageClassrooms hook.
 * Tests classroom CRUD operations with department prioritization for admins.
 */

import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useManageClassrooms } from '../hook';
import * as classroomService from '@/lib/services/classroomService';
import { AuthContext } from '../../../shared/auth/contexts/AuthContext';
import type { User, AuthContextType } from '../../../shared/auth/types/auth';
import type { Classroom } from '@/types/classroom';

vi.mock('@/lib/services/classroomService');

const mockedService = vi.mocked(classroomService);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const mockAdminUser: User = {
  id: 'admin1',
  name: 'Admin User',
  email: 'admin@test.com',
  role: 'admin',
  program_id: null,
  department_id: 'd1',
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const authContextValue: AuthContextType = {
    user: mockAdminUser,
    loading: false,
    error: null,
    role: 'admin',
    departmentId: 'd1',
    login: vi.fn(),
    logout: vi.fn(),
    clearError: vi.fn(),
    updateMyProfile: vi.fn(),
    isAdmin: () => true,
    isDepartmentHead: () => false,
    isProgramHead: () => false,
    canManageInstructors: () => true,
    canManageClassrooms: () => true,
    canReviewRequestsForDepartment: () => true,
    canManageInstructorRow: () => true,
    canManageAssignmentsForProgram: () => true,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>
    </QueryClientProvider>
  );
};

const mockClassrooms: Classroom[] = [
  {
    id: 'c1',
    name: 'Room 101',
    code: 'R101',
    capacity: 30,
    location: 'Building A',
    preferred_department_id: 'd1',
    preferred_department_name: 'Computer Science',
    color: null,
    created_by: null,
    created_at: '2024-01-01',
  },
  {
    id: 'c2',
    name: 'Room 202',
    code: 'R202',
    capacity: 25,
    location: 'Building B',
    preferred_department_id: 'd2',
    preferred_department_name: 'Mathematics',
    color: null,
    created_by: null,
    created_at: '2024-01-02',
  },
];

describe('useManageClassrooms Hook', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    queryClient.clear();
  });

  it('should fetch all classrooms', async () => {
    mockedService.getAllClassrooms.mockResolvedValue(mockClassrooms);

    const { result } = renderHook(() => useManageClassrooms(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.classrooms).toHaveLength(2);
    expect(mockedService.getAllClassrooms).toHaveBeenCalled();
  });

  it('should prioritize classrooms from user department first', async () => {
    mockedService.getAllClassrooms.mockResolvedValue(mockClassrooms);

    const { result } = renderHook(() => useManageClassrooms(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // User's department (d1) classrooms should come first
    expect(result.current.classrooms[0].preferred_department_id).toBe('d1');
    expect(result.current.classrooms[1].preferred_department_id).toBe('d2');
  });

  it('should add a new classroom', async () => {
    const newClassroom = {
      name: 'Room 303',
      code: 'R303',
      capacity: 40,
      location: 'Building C',
      preferred_department_id: 'd1',
    };

    mockedService.getAllClassrooms.mockResolvedValue(mockClassrooms);
    mockedService.addClassroom.mockResolvedValue({
      id: 'c3',
      ...newClassroom,
      color: null,
      created_by: null,
      created_at: '2024-01-03',
      preferred_department_name: 'Computer Science',
    });

    const { result } = renderHook(() => useManageClassrooms(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.addClassroom(newClassroom);
    });

    expect(mockedService.addClassroom).toHaveBeenCalledWith(newClassroom);
  });

  it('should update an existing classroom', async () => {
    const updates = {
      capacity: 35,
      location: 'Building A - Floor 2',
    };

    mockedService.getAllClassrooms.mockResolvedValue(mockClassrooms);
    mockedService.updateClassroom.mockResolvedValue({
      ...mockClassrooms[0],
      ...updates,
    });

    const { result } = renderHook(() => useManageClassrooms(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.updateClassroom('c1', updates);
    });

    expect(mockedService.updateClassroom).toHaveBeenCalledWith('c1', updates);
  });

  it('should delete a classroom', async () => {
    mockedService.getAllClassrooms.mockResolvedValue(mockClassrooms);
    mockedService.removeClassroom.mockResolvedValue(undefined);

    const { result } = renderHook(() => useManageClassrooms(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.removeClassroom('c1');
    });

    expect(mockedService.removeClassroom).toHaveBeenCalledWith('c1');
  });

  it('should validate if classroom can be deleted', async () => {
    mockedService.getAllClassrooms.mockResolvedValue(mockClassrooms);

    const { result } = renderHook(() => useManageClassrooms(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const classSessions = [
      { id: 's1', classroom: { id: 'c1' } },
    ];

    const canDelete = result.current.canDeleteClassroom('c1', classSessions);
    expect(canDelete).toBe(false);

    const canDeleteUnused = result.current.canDeleteClassroom('c2', classSessions);
    expect(canDeleteUnused).toBe(true);
  });

  it('should get first other department index correctly', async () => {
    mockedService.getAllClassrooms.mockResolvedValue(mockClassrooms);

    const { result } = renderHook(() => useManageClassrooms(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const index = result.current.getFirstOtherIndex(result.current.classrooms);
    expect(index).toBe(1); // Second classroom is from different department
  });

  it('should handle errors during creation', async () => {
    const error = new Error('Failed to create classroom');
    mockedService.getAllClassrooms.mockResolvedValue(mockClassrooms);
    mockedService.addClassroom.mockRejectedValue(error);

    const { result } = renderHook(() => useManageClassrooms(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await expect(
      act(async () => {
        await result.current.addClassroom({
          name: 'Test',
          code: 'T1',
          capacity: 30,
        });
      })
    ).rejects.toThrow('Failed to create classroom');
  });

  it('should handle foreign key errors during deletion', async () => {
    const error = new Error('foreign key constraint violation');
    mockedService.getAllClassrooms.mockResolvedValue(mockClassrooms);
    mockedService.removeClassroom.mockRejectedValue(error);

    const { result } = renderHook(() => useManageClassrooms(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await expect(
      act(async () => {
        await result.current.removeClassroom('c1');
      })
    ).rejects.toThrow('foreign key');
  });
});
