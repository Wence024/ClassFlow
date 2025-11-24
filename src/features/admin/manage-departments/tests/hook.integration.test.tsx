/**
 * Integration tests for useManageDepartments hook.
 * Tests department CRUD operations for admins.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useManageDepartments } from '../hook';
import * as departmentService from '@/lib/services/departmentService';
import type { Department } from '@/types/department';

vi.mock('@/lib/services/departmentService');

const mockedService = {
  listDepartments: vi.mocked(departmentService.listDepartments),
  createDepartment: vi.mocked(departmentService.createDepartment),
  updateDepartment: vi.mocked(departmentService.updateDepartment),
  deleteDepartment: vi.mocked(departmentService.deleteDepartment),
};

const mockDepartments: Department[] = [
  {
    id: 'd1',
    name: 'Computer Science',
    code: 'CS',
    created_at: '2024-01-01',
  },
  {
    id: 'd2',
    name: 'Mathematics',
    code: 'MATH',
    created_at: '2024-01-02',
  },
];

describe('useManageDepartments Hook', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should fetch all departments on mount', async () => {
    mockedService.listDepartments.mockResolvedValue(mockDepartments);

    const { result } = renderHook(() => useManageDepartments());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.departments).toEqual(mockDepartments);
    expect(mockedService.listDepartments).toHaveBeenCalled();
  });

  it('should create a new department', async () => {
    const newDepartment = {
      name: 'Engineering',
      code: 'ENG',
    };

    mockedService.listDepartments.mockResolvedValue(mockDepartments);
    mockedService.createDepartment.mockResolvedValue({
      id: 'd3',
      ...newDepartment,
      created_at: '2024-01-03',
    });

    const { result } = renderHook(() => useManageDepartments());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let success: boolean = false;
    await act(async () => {
      success = await result.current.createDepartment(newDepartment);
    });

    expect(success).toBe(true);
    expect(mockedService.createDepartment).toHaveBeenCalledWith(newDepartment);
  });

  it('should update an existing department', async () => {
    const updates = {
      name: 'Computer Science & Engineering',
    };

    mockedService.listDepartments.mockResolvedValue(mockDepartments);
    mockedService.updateDepartment.mockResolvedValue({
      ...mockDepartments[0],
      ...updates,
    });

    const { result } = renderHook(() => useManageDepartments());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let success: boolean = false;
    await act(async () => {
      success = await result.current.updateDepartment('d1', updates);
    });

    expect(success).toBe(true);
    expect(mockedService.updateDepartment).toHaveBeenCalledWith('d1', updates);
  });

  it('should delete a department', async () => {
    mockedService.listDepartments.mockResolvedValue(mockDepartments);
    mockedService.deleteDepartment.mockResolvedValue();

    const { result } = renderHook(() => useManageDepartments());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let success: boolean = false;
    await act(async () => {
      success = await result.current.deleteDepartment('d1');
    });

    expect(success).toBe(true);
    expect(mockedService.deleteDepartment).toHaveBeenCalledWith('d1');
  });

  it('should handle errors during creation', async () => {
    const error = new Error('Code already exists');
    mockedService.listDepartments.mockResolvedValue(mockDepartments);
    mockedService.createDepartment.mockRejectedValue(error);

    const { result } = renderHook(() => useManageDepartments());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let success: boolean = true;
    await act(async () => {
      success = await result.current.createDepartment({
        name: 'Test',
        code: 'CS',
      });
    });

    expect(success).toBe(false);
  });

  it('should handle errors during update', async () => {
    const error = new Error('Department not found');
    mockedService.listDepartments.mockResolvedValue(mockDepartments);
    mockedService.updateDepartment.mockRejectedValue(error);

    const { result } = renderHook(() => useManageDepartments());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let success: boolean = true;
    await act(async () => {
      success = await result.current.updateDepartment('invalid-id', { name: 'Test' });
    });

    expect(success).toBe(false);
  });

  it('should handle errors during deletion', async () => {
    const error = new Error('Cannot delete department with programs');
    mockedService.listDepartments.mockResolvedValue(mockDepartments);
    mockedService.deleteDepartment.mockRejectedValue(error);

    const { result } = renderHook(() => useManageDepartments());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let success: boolean = true;
    await act(async () => {
      success = await result.current.deleteDepartment('d1');
    });

    expect(success).toBe(false);
  });

  it('should refetch data manually', async () => {
    mockedService.listDepartments.mockResolvedValue(mockDepartments);

    const { result } = renderHook(() => useManageDepartments());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockedService.listDepartments).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.refetch();
    });

    expect(mockedService.listDepartments).toHaveBeenCalledTimes(2);
  });
});
