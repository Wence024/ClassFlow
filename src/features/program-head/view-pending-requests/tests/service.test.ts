/**
 * Unit tests for view-pending-requests service layer.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as service from '../service';
import * as resourceRequestService from '@/lib/services/resourceRequestService';

vi.mock('@/lib/services/resourceRequestService');

describe('View Pending Requests Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchMyRequests', () => {
    it('should call getMyRequests from infrastructure service', async () => {
      const mockRequests = [
        { id: 'req-1', status: 'pending' },
        { id: 'req-2', status: 'approved' },
      ];

      vi.mocked(resourceRequestService.getMyRequests).mockResolvedValue(mockRequests);

      const result = await service.fetchMyRequests();

      expect(result).toEqual(mockRequests);
      expect(resourceRequestService.getMyRequests).toHaveBeenCalled();
    });
  });

  describe('dismissRequest', () => {
    it('should call updateRequest with dismissed flag', async () => {
      vi.mocked(resourceRequestService.updateRequest).mockResolvedValue();

      await service.dismissRequest('req-1');

      expect(resourceRequestService.updateRequest).toHaveBeenCalledWith('req-1', {
        dismissed: true,
      });
    });

    it('should propagate errors from updateRequest', async () => {
      vi.mocked(resourceRequestService.updateRequest).mockRejectedValue(
        new Error('Update failed')
      );

      await expect(service.dismissRequest('req-1')).rejects.toThrow('Update failed');
    });
  });

  describe('cancelMyRequest', () => {
    it('should call cancelRequest with requestId and requesterId', async () => {
      vi.mocked(resourceRequestService.cancelRequest).mockResolvedValue();

      await service.cancelMyRequest('req-1', 'user-1');

      expect(resourceRequestService.cancelRequest).toHaveBeenCalledWith('req-1', 'user-1');
    });

    it('should handle cancellation errors', async () => {
      vi.mocked(resourceRequestService.cancelRequest).mockRejectedValue(
        new Error('Cancellation failed')
      );

      await expect(service.cancelMyRequest('req-1', 'user-1')).rejects.toThrow(
        'Cancellation failed'
      );
    });
  });
});
