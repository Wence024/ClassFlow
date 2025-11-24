/**
 * Integration tests for useManageUsers hook.
 * Tests user CRUD operations and filtering for admins.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useManageUsers } from '../hook';
import * as userService from '@/lib/services/userService';
import type { UserProfile } from '@/types/user';

vi.mock('@/lib/services/userService');

const mockedService = {
  getUsers: vi.mocked(userService.getUsers),
  deleteUser: vi.mocked(userService.deleteUser),
  updateUserProfile: vi.mocked(userService.updateUserProfile),
};

const mockUsers: UserProfile[] = [
  {
    id: 'u1',
    full_name: 'John Doe',
    role: 'admin',
    department_id: 'd1',
    program_id: null,
  },
  {
    id: 'u2',
    full_name: 'Jane Smith',
    role: 'department_head',
    department_id: 'd1',
    program_id: null,
  },
  {
    id: 'u3',
    full_name: 'Bob Johnson',
    role: 'program_head',
    department_id: 'd2',
    program_id: 'p1',
  },
];

describe('useManageUsers Hook', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should fetch all users on mount', async () => {
    mockedService.getUsers.mockResolvedValue(mockUsers);

    const { result } = renderHook(() => useManageUsers());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.users).toEqual(mockUsers);
    expect(mockedService.getUsers).toHaveBeenCalled();
  });

  it('should filter users by role', async () => {
    mockedService.getUsers.mockResolvedValue(mockUsers);

    const { result } = renderHook(() => useManageUsers());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setFilters({ role: 'program_head' });
    });

    expect(result.current.filteredUsers).toHaveLength(1);
    expect(result.current.filteredUsers[0].role).toBe('program_head');
  });

  it('should filter users by department', async () => {
    mockedService.getUsers.mockResolvedValue(mockUsers);

    const { result } = renderHook(() => useManageUsers());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setFilters({ departmentId: 'd1' });
    });

    expect(result.current.filteredUsers).toHaveLength(2);
    expect(result.current.filteredUsers.every((u) => u.department_id === 'd1')).toBe(true);
  });

  it('should filter users by search term', async () => {
    mockedService.getUsers.mockResolvedValue(mockUsers);

    const { result } = renderHook(() => useManageUsers());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setFilters({ searchTerm: 'jane' });
    });

    expect(result.current.filteredUsers).toHaveLength(1);
    expect(result.current.filteredUsers[0].full_name).toBe('Jane Smith');
  });

  it('should apply multiple filters', async () => {
    mockedService.getUsers.mockResolvedValue(mockUsers);

    const { result } = renderHook(() => useManageUsers());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setFilters({
        role: 'department_head',
        departmentId: 'd1',
      });
    });

    expect(result.current.filteredUsers).toHaveLength(1);
    expect(result.current.filteredUsers[0].full_name).toBe('Jane Smith');
  });

  it('should update a user', async () => {
    mockedService.getUsers.mockResolvedValue(mockUsers);
    mockedService.updateUserProfile.mockResolvedValue({
      id: 'u2',
      role: 'admin',
      full_name: 'Jane Smith',
      department_id: 'd1',
      program_id: null,
    });

    const { result } = renderHook(() => useManageUsers());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let success: boolean = false;
    await act(async () => {
      success = await result.current.updateUser('u2', {
        role: 'admin',
      });
    });

    expect(success).toBe(true);
    expect(mockedService.updateUserProfile).toHaveBeenCalledWith('u2', {
      role: 'admin',
    });
  });

  it('should delete a user', async () => {
    mockedService.getUsers.mockResolvedValue(mockUsers);
    mockedService.deleteUser.mockResolvedValue();

    const { result } = renderHook(() => useManageUsers());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let success: boolean = false;
    await act(async () => {
      success = await result.current.deleteUser('u3');
    });

    expect(success).toBe(true);
    expect(mockedService.deleteUser).toHaveBeenCalledWith('u3');
  });

  it('should handle errors during user update', async () => {
    const error = new Error('Permission denied');
    mockedService.getUsers.mockResolvedValue(mockUsers);
    mockedService.updateUserProfile.mockRejectedValue(error);

    const { result } = renderHook(() => useManageUsers());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let success: boolean = true;
    await act(async () => {
      success = await result.current.updateUser('u1', { role: 'admin' });
    });

    expect(success).toBe(false);
  });

  it('should handle errors during user deletion', async () => {
    const error = new Error('Cannot delete user with active sessions');
    mockedService.getUsers.mockResolvedValue(mockUsers);
    mockedService.deleteUser.mockRejectedValue(error);

    const { result } = renderHook(() => useManageUsers());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let success: boolean = true;
    await act(async () => {
      success = await result.current.deleteUser('u1');
    });

    expect(success).toBe(false);
  });

  it('should refetch users manually', async () => {
    mockedService.getUsers.mockResolvedValue(mockUsers);

    const { result } = renderHook(() => useManageUsers());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockedService.getUsers).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.refetch();
    });

    expect(mockedService.getUsers).toHaveBeenCalledTimes(2);
  });
});
