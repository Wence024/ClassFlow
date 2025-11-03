import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDepartments } from '../useDepartments';
import * as departmentsService from '../../services/departmentsService';
import type { ReactNode } from 'react';

// Mock the departments service
vi.mock('../../services/departmentsService');

/**
 * Test suite for useDepartments hook integration tests.
 * Validates core department management functionality for Admin users.
 */
describe('useDepartments Integration Tests', () => {
  let queryClient: QueryClient;

  /**
   * Creates a wrapper component with QueryClient for testing hooks.
   *
   * @param cw - The wrapper props.
   * @param cw.children - The child components to wrap.
   * @returns The wrapper component.
   */
  const createWrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  it('should fetch all departments for admin users', async () => {
    const mockDepartments = [
      { id: 'd1', name: 'Computer Science', code: 'CS', created_at: '2024-01-01' },
      { id: 'd2', name: 'Mathematics', code: 'MATH', created_at: '2024-01-02' },
    ];

    vi.mocked(departmentsService.listDepartments).mockResolvedValue(mockDepartments);

    const { result } = renderHook(() => useDepartments(), {
      wrapper: createWrapper,
    });

    await waitFor(() => {
      expect(result.current.listQuery.isSuccess).toBe(true);
    });

    expect(result.current.listQuery.data).toEqual(mockDepartments);
    expect(departmentsService.listDepartments).toHaveBeenCalledTimes(1);
  });

  it('should allow admin users to create a new department', async () => {
    const newDepartment = { name: 'Engineering', code: 'ENG' };
    const createdDepartment = { id: 'd3', ...newDepartment, created_at: '2024-01-03' };

    vi.mocked(departmentsService.listDepartments).mockResolvedValue([]);
    vi.mocked(departmentsService.createDepartment).mockResolvedValue(createdDepartment);

    const { result } = renderHook(() => useDepartments(), {
      wrapper: createWrapper,
    });

    await waitFor(() => {
      expect(result.current.listQuery.isSuccess).toBe(true);
    });

    await result.current.createMutation.mutateAsync(newDepartment);

    expect(departmentsService.createDepartment).toHaveBeenCalledWith(newDepartment);
    expect(departmentsService.createDepartment).toHaveBeenCalledTimes(1);
  });

  it('should allow admin users to update an existing department', async () => {
    const departmentId = 'd1';
    const updateData = { name: 'Computer Science & IT' };
    const updatedDepartment = {
      id: departmentId,
      name: 'Computer Science & IT',
      code: 'CS',
      created_at: '2024-01-01',
    };

    vi.mocked(departmentsService.listDepartments).mockResolvedValue([]);
    vi.mocked(departmentsService.updateDepartment).mockResolvedValue(updatedDepartment);

    const { result } = renderHook(() => useDepartments(), {
      wrapper: createWrapper,
    });

    await waitFor(() => {
      expect(result.current.listQuery.isSuccess).toBe(true);
    });

    await result.current.updateMutation.mutateAsync({ id: departmentId, update: updateData });

    expect(departmentsService.updateDepartment).toHaveBeenCalledWith(departmentId, updateData);
    expect(departmentsService.updateDepartment).toHaveBeenCalledTimes(1);
  });

  it('should handle department deletion correctly', async () => {
    const departmentId = 'd1';

    vi.mocked(departmentsService.listDepartments).mockResolvedValue([]);
    vi.mocked(departmentsService.deleteDepartment).mockResolvedValue();

    const { result } = renderHook(() => useDepartments(), {
      wrapper: createWrapper,
    });

    await waitFor(() => {
      expect(result.current.listQuery.isSuccess).toBe(true);
    });

    await result.current.deleteMutation.mutateAsync(departmentId);

    expect(departmentsService.deleteDepartment).toHaveBeenCalledWith(departmentId);
    expect(departmentsService.deleteDepartment).toHaveBeenCalledTimes(1);
  });

  it('should handle errors when fetching departments', async () => {
    const errorMessage = 'Failed to fetch departments';
    vi.mocked(departmentsService.listDepartments).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useDepartments(), {
      wrapper: createWrapper,
    });

    await waitFor(() => {
      expect(result.current.listQuery.isError).toBe(true);
    });

    expect(result.current.listQuery.error).toBeTruthy();
  });
});