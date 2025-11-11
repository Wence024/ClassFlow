/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as usersService from '../usersService';
import { supabase } from '../../../../lib/supabase';

// Mock Supabase client
vi.mock('../../../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    rpc: vi.fn(),
  },
}));

describe('usersService Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should fetch all users with their profiles and roles', async () => {
      const mockProfiles = [
        { id: 'u1', full_name: 'Alice Admin', program_id: 'p1', department_id: null },
        { id: 'u2', full_name: 'Bob Program Head', program_id: 'p2', department_id: null },
      ];

      const mockRoleResponses = [
        { data: { role: 'admin' }, error: null },
        { data: { role: 'program_head' }, error: null },
      ];

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: mockProfiles,
            error: null,
          }),
        }),
      } as any);

      // Mock role queries
      let callCount = 0;
      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'user_roles') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue(mockRoleResponses[callCount++]),
              }),
            }),
          } as any;
        }
        return {
          select: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: mockProfiles,
              error: null,
            }),
          }),
        } as any;
      });

      const result = await usersService.getUsers();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 'u1',
        full_name: 'Alice Admin',
        role: 'admin',
        program_id: 'p1',
        department_id: null,
      });
      expect(result[1]).toEqual({
        id: 'u2',
        full_name: 'Bob Program Head',
        role: 'program_head',
        program_id: 'p2',
        department_id: null,
      });
    });

    it('should handle missing roles with default program_head', async () => {
      const mockProfiles = [
        { id: 'u1', full_name: 'Charlie User', program_id: null, department_id: 'd1' },
      ];

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: mockProfiles,
            error: null,
          }),
        }),
      } as any);

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'user_roles') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: null, error: null }),
              }),
            }),
          } as any;
        }
        return {
          select: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: mockProfiles,
              error: null,
            }),
          }),
        } as any;
      });

      const result = await usersService.getUsers();

      expect(result).toHaveLength(1);
      expect(result[0].role).toBe('program_head');
    });

    it('should throw an error if profile fetch fails', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database error' },
          }),
        }),
      } as any);

      await expect(usersService.getUsers()).rejects.toEqual({ message: 'Database error' });
    });
  });

  describe('updateUserProfile', () => {
    it('should call the admin RPC with correct parameters', async () => {
      const mockRpc = vi.fn().mockResolvedValue({ error: null });
      vi.mocked(supabase.rpc).mockImplementation(mockRpc as any);

      await usersService.updateUserProfile('u1', {
        role: 'department_head',
        program_id: 'p1',
        department_id: 'd1',
      });

      expect(mockRpc).toHaveBeenCalledWith('admin_update_user_profile', {
        target_user_id: 'u1',
        new_role: 'department_head',
        new_program_id: 'p1',
        new_department_id: 'd1',
      });
    });

    it('should throw an error if the RPC fails', async () => {
      const mockRpc = vi.fn().mockResolvedValue({ error: { message: 'Permission denied' } });
      vi.mocked(supabase.rpc).mockImplementation(mockRpc as any);

      await expect(
        usersService.updateUserProfile('u1', {
          role: 'admin',
          program_id: null,
          department_id: null,
        })
      ).rejects.toEqual({ message: 'Permission denied' });
    });
  });
});
