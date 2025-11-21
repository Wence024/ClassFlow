/**
 * Unit tests for approve request service layer.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as service from '../service';
import * as resourceRequestService from '@/lib/services/resourceRequestService';

vi.mock('@/lib/services/resourceRequestService');

describe('Approve Request Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('approveResourceRequest', () => {
    it('should call approveRequest with correct parameters', async () => {
      vi.mocked(resourceRequestService.approveRequest).mockResolvedValue();

      await service.approveResourceRequest('request-1', 'reviewer-1');

      expect(resourceRequestService.approveRequest).toHaveBeenCalledWith(
        'request-1',
        'reviewer-1'
      );
    });

    it('should propagate errors from infrastructure layer', async () => {
      vi.mocked(resourceRequestService.approveRequest).mockRejectedValue(
        new Error('Request not found')
      );

      await expect(
        service.approveResourceRequest('invalid-id', 'reviewer-1')
      ).rejects.toThrow('Request not found');
    });

    it('should handle database errors', async () => {
      vi.mocked(resourceRequestService.approveRequest).mockRejectedValue(
        new Error('Database connection failed')
      );

      await expect(
        service.approveResourceRequest('request-1', 'reviewer-1')
      ).rejects.toThrow('Database connection failed');
    });
  });
});
