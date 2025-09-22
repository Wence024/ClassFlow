
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { usePrograms } from '../usePrograms';
import { supabase } from '@/lib/supabase';
import type { Program } from '@/features/programs/types/program';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

const MOCK_CREATED_AT = new Date().toISOString();

// Mock the supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn(),
  },
}));

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
  it('should fetch and return a list of all programs', async () => {
    const mockPrograms: Program[] = [
      { id: '1', name: 'Computer Science', short_code: "BSCS", created_at: MOCK_CREATED_AT},
      { id: '2', name: 'Mathematics', short_code: "MATH", created_at: MOCK_CREATED_AT },
    ];

    (supabase.from('programs').select as vi.Mock).mockResolvedValueOnce({ data: mockPrograms, error: null });

    const { result } = renderHook(() => usePrograms(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.programs).toEqual(mockPrograms);
  });

  it('should return an empty array if no programs exist', async () => {
    (supabase.from('programs').select as vi.Mock).mockResolvedValueOnce({ data: [], error: null });

    const { result } = renderHook(() => usePrograms(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.programs).toEqual([]);
  });

  it('should correctly handle and throw an error if the Supabase query fails', async () => {
    const errorMessage = 'Supabase query failed';
    (supabase.from('programs').select as vi.Mock).mockResolvedValueOnce({ data: null, error: { message: errorMessage } });

    const { result } = renderHook(() => usePrograms(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toContain(errorMessage);
  });
});
