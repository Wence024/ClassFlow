/**
 * Integration tests for useClassGroups hook.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useClassGroups } from '@/features/classSessionComponents/hooks/useClassGroups';
import * as classGroupsService from '@/lib/services/classGroupService';
import { AuthContext } from '@/features/shared/auth/contexts/AuthContext';
import type { AuthContextType } from '@/features/shared/auth/types/auth';
import type { ClassGroup } from '@/types/classGroup';

vi.mock('@/features/classSessionComponents/services/classGroupsService');

const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  role: 'program_head' as const,
  program_id: 'prog-1',
  department_id: 'dept-1',
  full_name: 'Test User',
};

const mockClassGroups: ClassGroup[] = [
  {
    id: 'group-1',
    name: 'CS 1A',
    code: '1A',
    program_id: 'prog-1',
    user_id: 'user-1',
    student_count: 30,
    color: '#4f46e5',
    created_at: '2025-01-01',
  },
  {
    id: 'group-2',
    name: 'CS 2B',
    code: '2B',
    program_id: 'prog-1',
    user_id: 'user-1',
    student_count: 25,
    color: '#10b981',
    created_at: '2025-01-02',
  },
];

const createWrapper = (authValue: Partial<AuthContextType> = {}) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  const defaultAuthValue: AuthContextType = {
    user: mockUser,
    loading: false,
    signIn: vi.fn(),
    signOut: vi.fn(),
    ...authValue,
  };

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={defaultAuthValue}>{children}</AuthContext.Provider>
    </QueryClientProvider>
  );
};

describe('useClassGroups', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetching class groups', () => {
    it('should fetch class groups for user program', async () => {
      vi.mocked(classGroupsService.getClassGroupsByProgram).mockResolvedValue(mockClassGroups);

      const { result } = renderHook(() => useClassGroups(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.classGroups).toHaveLength(2);
      expect(result.current.classGroups[0].code).toBe('1A');
      expect(classGroupsService.getClassGroupsByProgram).toHaveBeenCalledWith('prog-1');
    });

    it('should not fetch when user has no program', () => {
      vi.mocked(classGroupsService.getClassGroupsByProgram).mockResolvedValue([]);

      const { result } = renderHook(() => useClassGroups(), {
        wrapper: createWrapper({ user: { ...mockUser, program_id: null } }),
      });

      expect(result.current.classGroups).toHaveLength(0);
      expect(classGroupsService.getClassGroupsByProgram).not.toHaveBeenCalled();
    });

    it('should handle fetch errors', async () => {
      vi.mocked(classGroupsService.getClassGroupsByProgram).mockRejectedValue(
        new Error('Fetch failed')
      );

      const { result } = renderHook(() => useClassGroups(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.error).toBe('Fetch failed');
    });
  });

  describe('addClassGroup', () => {
    it('should add a new class group', async () => {
      vi.mocked(classGroupsService.getClassGroupsByProgram).mockResolvedValue(mockClassGroups);
      vi.mocked(classGroupsService.addClassGroup).mockResolvedValue(mockClassGroups[0]);

      const { result } = renderHook(() => useClassGroups(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const newGroup = {
        name: 'CS 3C',
        code: '3C',
        student_count: 28,
      };

      await result.current.addClassGroup(newGroup);

      expect(classGroupsService.addClassGroup).toHaveBeenCalledWith({
        ...newGroup,
        user_id: 'user-1',
        program_id: 'prog-1',
      });
    });

    it('should reject when user has no program', async () => {
      vi.mocked(classGroupsService.getClassGroupsByProgram).mockResolvedValue([]);

      const { result } = renderHook(() => useClassGroups(), {
        wrapper: createWrapper({ user: { ...mockUser, program_id: null } }),
      });

      const newGroup = {
        name: 'CS 3C',
        code: '3C',
        student_count: 28,
      };

      await expect(result.current.addClassGroup(newGroup)).rejects.toThrow(
        'You must be assigned to a program'
      );
    });
  });

  describe('updateClassGroup', () => {
    it('should update an existing class group', async () => {
      vi.mocked(classGroupsService.getClassGroupsByProgram).mockResolvedValue(mockClassGroups);
      vi.mocked(classGroupsService.updateClassGroup).mockResolvedValue(mockClassGroups[0]);

      const { result } = renderHook(() => useClassGroups(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await result.current.updateClassGroup('group-1', { student_count: 35 });

      expect(classGroupsService.updateClassGroup).toHaveBeenCalledWith('group-1', {
        student_count: 35,
      });
    });
  });

  describe('removeClassGroup', () => {
    it('should remove a class group', async () => {
      vi.mocked(classGroupsService.getClassGroupsByProgram).mockResolvedValue(mockClassGroups);
      vi.mocked(classGroupsService.removeClassGroup).mockResolvedValue();

      const { result } = renderHook(() => useClassGroups(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await result.current.removeClassGroup('group-1');

      expect(classGroupsService.removeClassGroup).toHaveBeenCalledWith('group-1', 'user-1');
    });

    it('should handle foreign key constraint errors', async () => {
      vi.mocked(classGroupsService.getClassGroupsByProgram).mockResolvedValue(mockClassGroups);
      vi.mocked(classGroupsService.removeClassGroup).mockRejectedValue(
        new Error('foreign key violation')
      );

      const { result } = renderHook(() => useClassGroups(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await expect(result.current.removeClassGroup('group-1')).rejects.toThrow();
    });
  });
});
