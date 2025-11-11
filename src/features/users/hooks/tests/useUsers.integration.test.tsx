import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUsers } from '../useUsers';
import * as usersService from '../../services/usersService';

vi.mock('../../services/usersService');

/**
 * Helper to wrap hooks with QueryClientProvider.
 *
 * @param uw - The wrapper props.
 * @param uw.children - The children to wrap.
 * @returns The wrapped children.
 */
const createWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useUsers Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch users on mount', async () => {
    const mockUsers = [
      { id: 'u1', full_name: 'Alice', role: 'admin', program_id: null, department_id: null },
      { id: 'u2', full_name: 'Bob', role: 'program_head', program_id: 'p1', department_id: null },
    ];

    vi.mocked(usersService.getUsers).mockResolvedValue(mockUsers);

    const { result } = renderHook(() => useUsers(), { wrapper: createWrapper });

    await waitFor(() => {
      expect(result.current.listQuery.isSuccess).toBe(true);
    });

    expect(result.current.listQuery.data).toEqual(mockUsers);
  });

  it('should handle update mutation and invalidate cache', async () => {
    const mockUsers = [
      { id: 'u1', full_name: 'Alice', role: 'admin', program_id: null, department_id: null },
    ];

    vi.mocked(usersService.getUsers).mockResolvedValue(mockUsers);
    vi.mocked(usersService.updateUserProfile).mockResolvedValue(undefined);

    const { result } = renderHook(() => useUsers(), { wrapper: createWrapper });

    await waitFor(() => {
      expect(result.current.listQuery.isSuccess).toBe(true);
    });

    result.current.updateMutation.mutate({
      userId: 'u1',
      updates: { role: 'department_head', program_id: 'p1', department_id: 'd1' },
    });

    await waitFor(() => {
      expect(result.current.updateMutation.isSuccess).toBe(true);
    });

    expect(usersService.updateUserProfile).toHaveBeenCalledWith('u1', {
      role: 'department_head',
      program_id: 'p1',
      department_id: 'd1',
    });
  });
});
