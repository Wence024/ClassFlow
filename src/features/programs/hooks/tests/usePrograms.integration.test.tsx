import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePrograms } from '../usePrograms';
import * as programService from '../../services/programsService';
import type { Program } from '@/features/programs/types/program';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

const MOCK_CREATED_AT = new Date().toISOString();

// Mock the program service
vi.mock('../../services/programsService');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('usePrograms', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should fetch and return a list of all programs', async () => {
    const mockPrograms: Program[] = [
      { id: '1', name: 'Computer Science', short_code: 'BSCS', created_at: MOCK_CREATED_AT },
      { id: '2', name: 'Mathematics', short_code: 'MATH', created_at: MOCK_CREATED_AT },
    ];

    vi.mocked(programService.listPrograms).mockResolvedValueOnce(mockPrograms);

    const { result } = renderHook(() => usePrograms(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.listQuery.isSuccess).toBe(true));

    expect(result.current.listQuery.data).toEqual(mockPrograms);
  });

  it('should return an empty array if no programs exist', async () => {
    vi.mocked(programService.listPrograms).mockResolvedValueOnce([]);

    const { result } = renderHook(() => usePrograms(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.listQuery.isSuccess).toBe(true));

    expect(result.current.listQuery.data).toEqual([]);
  });

  it('should correctly handle and throw an error if the Supabase query fails', async () => {
    const errorMessage = 'Supabase query failed';
    vi.mocked(programService.listPrograms).mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => usePrograms(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.listQuery.isError).toBe(true));

    expect(result.current.listQuery.error?.message).toContain(errorMessage);
  });
});
