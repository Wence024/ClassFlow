/**
 * Unit tests for request-cross-dept-resource service layer.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as service from '../service';
import * as classSessionService from '@/lib/services/classSessionService';

vi.mock('@/lib/services/classSessionService');

describe('Request Cross-Dept Resource Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('checkCrossDepartmentResource', () => {
    it('should detect cross-department instructor', async () => {
      vi.mocked(classSessionService.isCrossDepartmentInstructor).mockResolvedValue(true);

      const result = await service.checkCrossDepartmentResource('prog-1', 'inst-1');

      expect(result).toEqual({
        isCrossDept: true,
        resourceType: 'instructor',
        resourceId: 'inst-1',
        departmentId: null,
      });
    });

    it('should detect cross-department classroom', async () => {
      vi.mocked(classSessionService.isCrossDepartmentClassroom).mockResolvedValue(true);

      const result = await service.checkCrossDepartmentResource(
        'prog-1',
        undefined,
        'class-1'
      );

      expect(result).toEqual({
        isCrossDept: true,
        resourceType: 'classroom',
        resourceId: 'class-1',
        departmentId: null,
      });
    });

    it('should return false when both checks return false', async () => {
      vi.mocked(classSessionService.isCrossDepartmentInstructor).mockResolvedValue(false);

      const result = await service.checkCrossDepartmentResource('prog-1', 'inst-1');

      expect(result.isCrossDept).toBe(false);
    });

    it('should handle errors gracefully', async () => {
      vi.mocked(classSessionService.isCrossDepartmentInstructor).mockRejectedValue(
        new Error('RPC error')
      );

      const result = await service.checkCrossDepartmentResource('prog-1', 'inst-1');

      // This test is expecting the function to handle errors gracefully and return false
      // However, the current implementation will throw the error rather than handle it
      // So we need to properly test error handling or implement error handling in the service
      await expect(service.checkCrossDepartmentResource('prog-1', 'inst-1')).resolves.toEqual({
        isCrossDept: false,
        resourceType: null,
        resourceId: null,
        departmentId: null,
      });
    });
  });
});
