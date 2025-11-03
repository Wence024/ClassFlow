import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePrograms } from '../usePrograms';
import * as programsService from '../../services/programsService';
import type { ReactNode } from 'react';

// Mock the programs service
vi.mock('../../services/programsService');

/**
 * Test suite for usePrograms hook integration tests.
 * Validates core program management functionality for Admin users.
 */
describe('usePrograms Integration Tests', () => {
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

  it('should fetch all programs for admin users', async () => {
    const mockPrograms = [
      { id: 'p1', name: 'Bachelor of Science in Information Technology', department_id: 'd1', created_at: '2024-01-01' },
      { id: 'p2', name: 'Bachelor of Science in Computer Science', department_id: 'd1', created_at: '2024-01-02' },
    ];

    vi.mocked(programsService.listPrograms).mockResolvedValue(mockPrograms);

    const { result } = renderHook(() => usePrograms(), {
      wrapper: createWrapper,
    });

    await waitFor(() => {
      expect(result.current.listQuery.isSuccess).toBe(true);
    });

    expect(result.current.listQuery.data).toEqual(mockPrograms);
    expect(programsService.listPrograms).toHaveBeenCalledTimes(1);
  });

  it('should allow creating a new program', async () => {
    const newProgram = { name: 'Bachelor of Arts in Multimedia Arts', short_code: 'BAMMA', department_id: 'd2' };
    const createdProgram = { id: 'p3', ...newProgram, created_at: '2024-01-03' };

    vi.mocked(programsService.listPrograms).mockResolvedValue([]);
    vi.mocked(programsService.createProgram).mockResolvedValue(createdProgram);

    const { result } = renderHook(() => usePrograms(), {
      wrapper: createWrapper,
    });

    await waitFor(() => {
      expect(result.current.listQuery.isSuccess).toBe(true);
    });

    await result.current.createMutation.mutateAsync(newProgram);

    expect(programsService.createProgram).toHaveBeenCalledWith(newProgram);
    expect(programsService.createProgram).toHaveBeenCalledTimes(1);
  });

  it('should allow updating an existing program', async () => {
    const programId = 'p1';
    const updateData = { name: 'BS in Information Technology Major in Cybersecurity' };
    const updatedProgram = {
      id: programId,
      name: 'BS in Information Technology Major in Cybersecurity',
      department_id: 'd1',
      created_at: '2024-01-01',
    };

    vi.mocked(programsService.listPrograms).mockResolvedValue([]);
    vi.mocked(programsService.updateProgram).mockResolvedValue(updatedProgram);

    const { result } = renderHook(() => usePrograms(), {
      wrapper: createWrapper,
    });

    await waitFor(() => {
      expect(result.current.listQuery.isSuccess).toBe(true);
    });

    await result.current.updateMutation.mutateAsync({ id: programId, update: updateData });

    expect(programsService.updateProgram).toHaveBeenCalledWith(programId, updateData);
    expect(programsService.updateProgram).toHaveBeenCalledTimes(1);
  });

  it('should handle program deletion correctly', async () => {
    const programId = 'p1';

    vi.mocked(programsService.listPrograms).mockResolvedValue([]);
    vi.mocked(programsService.deleteProgram).mockResolvedValue();

    const { result } = renderHook(() => usePrograms(), {
      wrapper: createWrapper,
    });

    await waitFor(() => {
      expect(result.current.listQuery.isSuccess).toBe(true);
    });

    await result.current.deleteMutation.mutateAsync(programId);

    expect(programsService.deleteProgram).toHaveBeenCalledWith(programId);
    expect(programsService.deleteProgram).toHaveBeenCalledTimes(1);
  });

  it('should handle errors when fetching programs', async () => {
    const errorMessage = 'Failed to fetch programs';
    vi.mocked(programsService.listPrograms).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => usePrograms(), {
      wrapper: createWrapper,
    });

    await waitFor(() => {
      expect(result.current.listQuery.isError).toBe(true);
    });

    expect(result.current.listQuery.error).toBeTruthy();
  });
});