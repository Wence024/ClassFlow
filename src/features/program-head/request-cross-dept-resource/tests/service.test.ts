/**
 * Unit tests for request-cross-dept-resource service layer.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as service from '../service';
import { supabase } from '@/lib/supabase';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    rpc: vi.fn(),
    from: vi.fn(),
  },
}));

vi.mock('@/lib/services/resourceRequestService', () => ({
  createRequest: vi.fn(),
  getMyRequests: vi.fn(),
}));

describe('Request Cross-Dept Resource Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('checkCrossDepartmentResource', () => {
    it('should detect cross-department instructor', async () => {
      vi.mocked(supabase.rpc).mockResolvedValue({ data: true, error: null });
      
      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { department_id: 'dept-2' },
              error: null,
            }),
          }),
        }),
      });
      vi.mocked(supabase.from).mockImplementation(mockFrom);

      const result = await service.checkCrossDepartmentResource('prog-1', 'inst-1');

      expect(result).toEqual({
        isCrossDept: true,
        resourceType: 'instructor',
        resourceId: 'inst-1',
        departmentId: 'dept-2',
      });
    });

    it('should detect cross-department classroom', async () => {
      vi.mocked(supabase.rpc).mockResolvedValue({ data: true, error: null });
      
      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { preferred_department_id: 'dept-3' },
              error: null,
            }),
          }),
        }),
      });
      vi.mocked(supabase.from).mockImplementation(mockFrom);

      const result = await service.checkCrossDepartmentResource(
        'prog-1',
        undefined,
        'class-1'
      );

      expect(result).toEqual({
        isCrossDept: true,
        resourceType: 'classroom',
        resourceId: 'class-1',
        departmentId: 'dept-3',
      });
    });

    it('should return false when RPC returns false', async () => {
      vi.mocked(supabase.rpc).mockResolvedValue({ data: false, error: null });

      const result = await service.checkCrossDepartmentResource('prog-1', 'inst-1');

      expect(result.isCrossDept).toBe(false);
    });

    it('should handle RPC errors gracefully', async () => {
      vi.mocked(supabase.rpc).mockResolvedValue({
        data: null,
        error: new Error('RPC error'),
      });

      const result = await service.checkCrossDepartmentResource('prog-1', 'inst-1');

      expect(result.isCrossDept).toBe(false);
    });
  });
});
