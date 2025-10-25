/**
 * Unit tests for department helper functions.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getUserDepartmentViaProgramOrDirect, getUserDepartmentName } from '../departmentHelpers';
import { supabase } from '../../../../lib/supabase';

// Mock the supabase client
vi.mock('../../../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('departmentHelpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUserDepartmentViaProgramOrDirect', () => {
    it('should return explicit department_id for department heads', async () => {
      const mockUserId = 'user-123';
      const mockDeptId = 'dept-456';

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: {
                department_id: mockDeptId,
                program: null,
              },
              error: null,
            }),
          }),
        }),
      });

      (supabase.from as ReturnType<typeof vi.fn>).mockImplementation(mockFrom);

      const result = await getUserDepartmentViaProgramOrDirect(mockUserId);

      expect(result).toBe(mockDeptId);
      expect(mockFrom).toHaveBeenCalledWith('profiles');
    });

    it('should infer department_id through program for program heads', async () => {
      const mockUserId = 'user-123';
      const mockDeptId = 'dept-789';

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: {
                department_id: null,
                program: {
                  department_id: mockDeptId,
                },
              },
              error: null,
            }),
          }),
        }),
      });

      (supabase.from as ReturnType<typeof vi.fn>).mockImplementation(mockFrom);

      const result = await getUserDepartmentViaProgramOrDirect(mockUserId);

      expect(result).toBe(mockDeptId);
    });

    it('should return null for admins (no department assignment)', async () => {
      const mockUserId = 'admin-123';

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: {
                department_id: null,
                program: null,
              },
              error: null,
            }),
          }),
        }),
      });

      (supabase.from as ReturnType<typeof vi.fn>).mockImplementation(mockFrom);

      const result = await getUserDepartmentViaProgramOrDirect(mockUserId);

      expect(result).toBeNull();
    });

    it('should return null on error', async () => {
      const mockUserId = 'user-123';

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: new Error('Database error'),
            }),
          }),
        }),
      });

      (supabase.from as ReturnType<typeof vi.fn>).mockImplementation(mockFrom);

      const result = await getUserDepartmentViaProgramOrDirect(mockUserId);

      expect(result).toBeNull();
    });
  });

  describe('getUserDepartmentName', () => {
    it('should return department name when found', async () => {
      const mockUserId = 'user-123';
      const mockDeptId = 'dept-456';
      const mockDeptName = 'Computer Science';

      // Mock the first call (getUserDepartmentViaProgramOrDirect logic)
      const mockProfilesFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: {
                department_id: mockDeptId,
                program: null,
              },
              error: null,
            }),
          }),
        }),
      });

      // Mock the second call (departments lookup)
      const mockDepartmentsFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: {
                name: mockDeptName,
              },
              error: null,
            }),
          }),
        }),
      });

      // Setup from mock to return different mocks based on table name
      (supabase.from as ReturnType<typeof vi.fn>).mockImplementation((table: string) => {
        if (table === 'profiles') return mockProfilesFrom(table);
        if (table === 'departments') return mockDepartmentsFrom(table);
        return mockProfilesFrom(table);
      });

      const result = await getUserDepartmentName(mockUserId);

      expect(result).toBe(mockDeptName);
    });

    it('should return null when department_id is not found', async () => {
      const mockUserId = 'admin-123';

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: {
                department_id: null,
                program: null,
              },
              error: null,
            }),
          }),
        }),
      });

      (supabase.from as ReturnType<typeof vi.fn>).mockImplementation(mockFrom);

      const result = await getUserDepartmentName(mockUserId);

      expect(result).toBeNull();
    });
  });
});
