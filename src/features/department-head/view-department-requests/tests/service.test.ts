/**
 * Unit tests for view department requests service layer.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as service from '../service';
import * as resourceRequestService from '@/lib/services/resourceRequestService';

vi.mock('@/lib/services/resourceRequestService');

describe('View Department Requests Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchDepartmentRequests', () => {
    it('should call getRequestsForDepartment with correct department ID', async () => {
      const mockRequests = [
        { id: 'req-1', status: 'pending' },
        { id: 'req-2', status: 'approved' },
      ];
      vi.mocked(resourceRequestService.getRequestsForDepartment).mockResolvedValue(
        mockRequests as any
      );

      const result = await service.fetchDepartmentRequests('dept-1');

      expect(resourceRequestService.getRequestsForDepartment).toHaveBeenCalledWith('dept-1');
      expect(result).toEqual(mockRequests);
    });

    it('should return empty array if no requests found', async () => {
      vi.mocked(resourceRequestService.getRequestsForDepartment).mockResolvedValue([]);

      const result = await service.fetchDepartmentRequests('dept-1');

      expect(result).toEqual([]);
    });

    it('should propagate errors from infrastructure layer', async () => {
      vi.mocked(resourceRequestService.getRequestsForDepartment).mockRejectedValue(
        new Error('Department not found')
      );

      await expect(service.fetchDepartmentRequests('invalid-dept')).rejects.toThrow(
        'Department not found'
      );
    });

    it('should handle database errors', async () => {
      vi.mocked(resourceRequestService.getRequestsForDepartment).mockRejectedValue(
        new Error('Database connection failed')
      );

      await expect(service.fetchDepartmentRequests('dept-1')).rejects.toThrow(
        'Database connection failed'
      );
    });
  });
});
