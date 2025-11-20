/**
 * Unit tests for reject request service layer.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as service from '../service';
import * as resourceRequestService from '@/lib/services/resourceRequestService';

vi.mock('@/lib/services/resourceRequestService');

describe('Reject Request Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rejectResourceRequest', () => {
    it('should call rejectRequest with correct parameters', async () => {
      vi.mocked(resourceRequestService.rejectRequest).mockResolvedValue();

      await service.rejectResourceRequest(
        'request-1',
        'reviewer-1',
        'Resource not available'
      );

      expect(resourceRequestService.rejectRequest).toHaveBeenCalledWith(
        'request-1',
        'reviewer-1',
        'Resource not available'
      );
    });

    it('should handle empty rejection message at service level', async () => {
      vi.mocked(resourceRequestService.rejectRequest).mockResolvedValue();

      await service.rejectResourceRequest('request-1', 'reviewer-1', '');

      expect(resourceRequestService.rejectRequest).toHaveBeenCalledWith(
        'request-1',
        'reviewer-1',
        ''
      );
    });

    it('should propagate errors from infrastructure layer', async () => {
      vi.mocked(resourceRequestService.rejectRequest).mockRejectedValue(
        new Error('Request not found')
      );

      await expect(
        service.rejectResourceRequest('invalid-id', 'reviewer-1', 'Test message')
      ).rejects.toThrow('Request not found');
    });

    it('should handle database errors', async () => {
      vi.mocked(resourceRequestService.rejectRequest).mockRejectedValue(
        new Error('Database connection failed')
      );

      await expect(
        service.rejectResourceRequest('request-1', 'reviewer-1', 'Test message')
      ).rejects.toThrow('Database connection failed');
    });
  });
});
