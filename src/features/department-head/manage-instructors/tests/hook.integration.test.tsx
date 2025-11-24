/**
 * Integration tests for useManageInstructors hook.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useManageInstructors } from '../hook';
import * as instructorService from '@/lib/services/instructorService';
import { useAuth } from '@/features/shared/auth/hooks/useAuth';
import type { Instructor, InstructorInsert, InstructorUpdate } from '@/types/instructor';

vi.mock('@/lib/services/instructorService');
vi.mock('@/features/shared/auth/hooks/useAuth');
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

/**
 * Test wrapper with QueryClient provider.
 *
 * @returns A React component that provides QueryClient context.
 */
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useManageInstructors', () => {
  const mockUser = {
    id: 'user-1',
    role: 'department_head',
    department_id: 'dept-1',
  };

  const mockInstructors: Instructor[] = [
    {
      id: 'inst-1',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      department_id: 'dept-1',
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    },
    {
      id: 'inst-2',
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane@example.com',
      department_id: 'dept-1',
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    },
  ];

  const mockedService = {
    getAllInstructors: vi.mocked(instructorService.getAllInstructors),
    addInstructor: vi.mocked(instructorService.addInstructor),
    updateInstructor: vi.mocked(instructorService.updateInstructor),
    removeInstructor: vi.mocked(instructorService.removeInstructor),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      isAdmin: () => false,
    } as ReturnType<typeof useAuth>);
    vi.mocked(instructorService.getAllInstructors).mockResolvedValue(mockInstructors);
  });

  describe('Fetch Instructors', () => {
    it('should fetch instructors for department head', async () => {
      const { result } = renderHook(() => useManageInstructors(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(mockedService.getAllInstructors).toHaveBeenCalled();
      expect(result.current.instructors).toEqual(mockInstructors);
    });

    it('should handle admin role', async () => {
      vi.mocked(useAuth).mockReturnValue({
        user: { ...mockUser, role: 'admin', department_id: null },
        isAdmin: () => true,
      } as ReturnType<typeof useAuth>);

      const { result } = renderHook(() => useManageInstructors(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.isAdmin).toBe(true);
      expect(result.current.departmentId).toBe(null);
    });
  });

  describe('Add Instructor', () => {
    it('should add instructor successfully', async () => {
      const newInstructor: InstructorInsert = {
        first_name: 'Bob',
        last_name: 'Johnson',
        email: 'bob@example.com',
        department_id: 'dept-1',
      };

      const createdInstructor: Instructor = {
        id: 'inst-3',
        ...newInstructor,
        created_at: '2025-01-01',
        updated_at: '2025-01-01',
      };

      vi.mocked(instructorService.addInstructor).mockResolvedValue(createdInstructor);

      const { result } = renderHook(() => useManageInstructors(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await result.current.addInstructor(newInstructor);

      expect(mockedService.addInstructor).toHaveBeenCalledWith(newInstructor);
    });

    it('should handle add instructor error', async () => {
      vi.mocked(instructorService.addInstructor).mockRejectedValue(
        new Error('Failed to add instructor')
      );

      const { result } = renderHook(() => useManageInstructors(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await expect(
        result.current.addInstructor({
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
          department_id: 'dept-1',
        })
      ).rejects.toThrow();
    });
  });

  describe('Update Instructor', () => {
    it('should update instructor successfully', async () => {
      const updateData: InstructorUpdate = {
        first_name: 'John Updated',
      };

      const updatedInstructor: Instructor = {
        ...mockInstructors[0],
        ...updateData,
      };

      vi.mocked(instructorService.updateInstructor).mockResolvedValue(updatedInstructor);

      const { result } = renderHook(() => useManageInstructors(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await result.current.updateInstructor('inst-1', updateData);

      expect(mockedService.updateInstructor).toHaveBeenCalledWith('inst-1', updateData);
    });

    it('should handle department change for admin', async () => {
      vi.mocked(useAuth).mockReturnValue({
        user: { ...mockUser, role: 'admin' },
        isAdmin: () => true,
      } as ReturnType<typeof useAuth>);

      const updateData: InstructorUpdate = {
        department_id: 'dept-2',
      };

      vi.mocked(instructorService.updateInstructor).mockResolvedValue({
        ...mockInstructors[0],
        ...updateData,
      });

      const { result } = renderHook(() => useManageInstructors(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await result.current.updateInstructor('inst-1', updateData);

      expect(mockedService.updateInstructor).toHaveBeenCalledWith('inst-1', updateData);
    });
  });

  describe('Delete Instructor', () => {
    it('should delete instructor successfully', async () => {
      vi.mocked(instructorService.removeInstructor).mockResolvedValue();

      const { result } = renderHook(() => useManageInstructors(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await result.current.removeInstructor('inst-1');

      expect(mockedService.removeInstructor).toHaveBeenCalledWith('inst-1');
    });

    it('should handle foreign key constraint error', async () => {
      vi.mocked(instructorService.removeInstructor).mockRejectedValue(
        new Error('foreign key constraint violation')
      );

      const { result } = renderHook(() => useManageInstructors(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await expect(result.current.removeInstructor('inst-1')).rejects.toThrow();
    });
  });

  describe('Helper Functions', () => {
    it('should validate if instructor can be deleted', () => {
      const { result } = renderHook(() => useManageInstructors(), {
        wrapper: createWrapper(),
      });

      const classSessions = [
        { id: 'session-1', instructor: { id: 'inst-1' } },
      ];

      expect(result.current.canDeleteInstructor('inst-1', classSessions)).toBe(false);
      expect(result.current.canDeleteInstructor('inst-2', classSessions)).toBe(true);
    });
  });
});
