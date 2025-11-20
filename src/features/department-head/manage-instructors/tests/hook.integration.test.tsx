/**
 * Integration tests for useManageInstructors hook.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useManageInstructors } from '../hook';
import * as service from '../service';
import { useAuth } from '@/features/shared/auth/hooks/useAuth';
import type { Instructor, InstructorInsert, InstructorUpdate } from '@/types/instructor';

vi.mock('../service');
vi.mock('@/features/shared/auth/hooks/useAuth');
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

/**
 * Test wrapper with QueryClient provider.
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

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser as any,
      isAdmin: () => false,
    } as any);
    vi.mocked(service.fetchInstructors).mockResolvedValue(mockInstructors);
  });

  describe('Fetch Instructors', () => {
    it('should fetch instructors for department head', async () => {
      const { result } = renderHook(() => useManageInstructors(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(service.fetchInstructors).toHaveBeenCalledWith({
        role: 'department_head',
        departmentId: 'dept-1',
      });
      expect(result.current.instructors).toEqual(mockInstructors);
    });

    it('should handle admin role', async () => {
      vi.mocked(useAuth).mockReturnValue({
        user: { ...mockUser, role: 'admin', department_id: null } as any,
        isAdmin: () => true,
      } as any);

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

      vi.mocked(service.createInstructor).mockResolvedValue(createdInstructor);

      const { result } = renderHook(() => useManageInstructors(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await result.current.addInstructor(newInstructor);

      expect(service.createInstructor).toHaveBeenCalledWith(newInstructor);
    });

    it('should handle add instructor error', async () => {
      vi.mocked(service.createInstructor).mockRejectedValue(
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

      vi.mocked(service.modifyInstructor).mockResolvedValue(updatedInstructor);

      const { result } = renderHook(() => useManageInstructors(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await result.current.updateInstructor('inst-1', updateData);

      expect(service.modifyInstructor).toHaveBeenCalledWith('inst-1', updateData);
    });

    it('should handle department change for admin', async () => {
      vi.mocked(useAuth).mockReturnValue({
        user: { ...mockUser, role: 'admin' } as any,
        isAdmin: () => true,
      } as any);

      const updateData: InstructorUpdate = {
        department_id: 'dept-2',
      };

      vi.mocked(service.modifyInstructor).mockResolvedValue({
        ...mockInstructors[0],
        ...updateData,
      });

      const { result } = renderHook(() => useManageInstructors(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await result.current.updateInstructor('inst-1', updateData);

      expect(service.modifyInstructor).toHaveBeenCalledWith('inst-1', updateData);
    });
  });

  describe('Delete Instructor', () => {
    it('should delete instructor successfully', async () => {
      vi.mocked(service.deleteInstructor).mockResolvedValue();

      const { result } = renderHook(() => useManageInstructors(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await result.current.removeInstructor('inst-1');

      expect(service.deleteInstructor).toHaveBeenCalledWith('inst-1');
    });

    it('should handle foreign key constraint error', async () => {
      vi.mocked(service.deleteInstructor).mockRejectedValue(
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
