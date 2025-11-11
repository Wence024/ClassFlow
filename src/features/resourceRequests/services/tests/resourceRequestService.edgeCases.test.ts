/**
 * Edge case tests for resource request service functions.
 *
 * Tests scenarios like:
 * - Resource deletion while requests are pending
 * - Session deletion during pending placement
 * - Duplicate request prevention
 * - Active semester changes.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { supabase } from '../../../../lib/supabase';
import * as resourceRequestService from '../resourceRequestService';
import type { ResourceRequestInsert } from '../../types/resourceRequest';

vi.mock('../../../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    rpc: vi.fn(),
    auth: {
      getUser: vi.fn(),
    },
  },
}));

describe('resourceRequestService - Edge Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createRequest - Duplicate Prevention', () => {
    it('should return existing request instead of creating duplicate', async () => {
      const existingRequest = {
        id: 'existing-request-id',
        class_session_id: 'session-123',
        status: 'pending',
      };

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            in: vi.fn().mockReturnValue({
              data: [existingRequest],
              error: null,
            }),
          }),
        }),
      });

      vi.mocked(supabase.from).mockImplementation(mockFrom);

      const payload: ResourceRequestInsert = {
        requester_id: 'user-1',
        class_session_id: 'session-123',
        resource_type: 'instructor',
        resource_id: 'instructor-1',
        target_department_id: 'dept-1',
        requesting_program_id: 'prog-1',
        status: 'pending',
      };

      const result = await resourceRequestService.createRequest(payload);

      expect(result).toEqual(existingRequest);
      expect(mockFrom).toHaveBeenCalledWith('resource_requests');
    });

    it('should create new request if none exists', async () => {
      const newRequest = {
        id: 'new-request-id',
        class_session_id: 'session-456',
        status: 'pending',
      };

      const mockFrom = vi
        .fn()
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              in: vi.fn().mockReturnValue({
                data: [],
                error: null,
              }),
            }),
          }),
        })
        .mockReturnValueOnce({
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: newRequest,
                error: null,
              }),
            }),
          }),
        })
        .mockReturnValueOnce({
          insert: vi.fn().mockResolvedValue({
            error: null,
          }),
        });

      vi.mocked(supabase.from).mockImplementation(mockFrom);

      const payload: ResourceRequestInsert = {
        requester_id: 'user-1',
        class_session_id: 'session-456',
        resource_type: 'instructor',
        resource_id: 'instructor-1',
        target_department_id: 'dept-1',
        requesting_program_id: 'prog-1',
        status: 'pending',
      };

      const result = await resourceRequestService.createRequest(payload);

      expect(result).toEqual(newRequest);
    });
  });

  describe('cancelActiveRequestsForResource', () => {
    it('should cancel all active requests for deleted instructor', async () => {
      const mockRequests = [
        { id: 'req-1', target_department_id: 'dept-1' },
        { id: 'req-2', target_department_id: 'dept-2' },
      ];

      const mockFrom = vi
        .fn()
        // First call: fetch requests
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                in: vi.fn().mockReturnValue({
                  data: mockRequests,
                  error: null,
                }),
              }),
            }),
          }),
        })
        // Second call: insert notification for req-1
        .mockReturnValueOnce({
          insert: vi.fn().mockResolvedValue({ error: null }),
        })
        // Third call: insert notification for req-2
        .mockReturnValueOnce({
          insert: vi.fn().mockResolvedValue({ error: null }),
        })
        // Fourth call: delete requests
        .mockReturnValueOnce({
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                in: vi.fn().mockResolvedValue({ error: null }),
              }),
            }),
          }),
        });

      vi.mocked(supabase.from).mockImplementation(mockFrom);

      await resourceRequestService.cancelActiveRequestsForResource('instructor', 'instructor-1');

      expect(mockFrom).toHaveBeenCalledWith('resource_requests');
      expect(mockFrom).toHaveBeenCalledWith('request_notifications');
    });

    it('should handle no active requests gracefully', async () => {
      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              in: vi.fn().mockReturnValue({
                data: [],
                error: null,
              }),
            }),
          }),
        }),
      });

      vi.mocked(supabase.from).mockImplementation(mockFrom);

      await expect(
        resourceRequestService.cancelActiveRequestsForResource('classroom', 'classroom-1')
      ).resolves.not.toThrow();
    });
  });

  describe('cancelActiveRequestsForClassSession', () => {
    it('should cancel all active requests when session is deleted', async () => {
      const mockRequests = [{ id: 'req-1', target_department_id: 'dept-1', status: 'pending' }];

      const mockFrom = vi
        .fn()
        // Fetch requests
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              in: vi.fn().mockReturnValue({
                data: mockRequests,
                error: null,
              }),
            }),
          }),
        })
        // Insert notification
        .mockReturnValueOnce({
          insert: vi.fn().mockResolvedValue({ error: null }),
        })
        // Delete requests
        .mockReturnValueOnce({
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              in: vi.fn().mockResolvedValue({ error: null }),
            }),
          }),
        });

      vi.mocked(supabase.from).mockImplementation(mockFrom);

      await resourceRequestService.cancelActiveRequestsForClassSession('session-123');

      expect(mockFrom).toHaveBeenCalledWith('resource_requests');
      expect(mockFrom).toHaveBeenCalledWith('request_notifications');
    });
  });

  describe('cancelRequest', () => {
    it('should cancel pending request and remove from timetable', async () => {
      const mockResult = {
        success: true,
        action: 'removed_from_timetable',
        class_session_id: 'session-1',
      };

      vi.mocked(supabase.rpc).mockResolvedValue({
        data: mockResult,
        error: null,
      } as never);

      const result = await resourceRequestService.cancelRequest('request-1', 'user-1');

      expect(result).toEqual(mockResult);
      expect(supabase.rpc).toHaveBeenCalledWith('cancel_resource_request', {
        _request_id: 'request-1',
        _requester_id: 'user-1',
      });
    });

    it('should cancel approved request and restore to original position', async () => {
      const mockResult = {
        success: true,
        action: 'restored',
        class_session_id: 'session-1',
        restored_to_period: 5,
      };

      vi.mocked(supabase.rpc).mockResolvedValue({
        data: mockResult,
        error: null,
      } as never);

      const result = await resourceRequestService.cancelRequest('request-2', 'user-1');

      expect(result).toEqual(mockResult);
      expect(result.action).toBe('restored');
      expect(result.restored_to_period).toBe(5);
    });

    it('should throw error if requester lacks permission', async () => {
      const mockError = {
        success: false,
        error: 'Permission denied: You can only cancel your own requests',
      };

      vi.mocked(supabase.rpc).mockResolvedValue({
        data: mockError,
        error: null,
      } as never);

      await expect(resourceRequestService.cancelRequest('request-1', 'wrong-user')).rejects.toThrow(
        'Permission denied'
      );
    });

    it('should throw error if request not found', async () => {
      const mockError = {
        success: false,
        error: 'Resource request not found',
      };

      vi.mocked(supabase.rpc).mockResolvedValue({
        data: mockError,
        error: null,
      } as never);

      await expect(
        resourceRequestService.cancelRequest('nonexistent-id', 'user-1')
      ).rejects.toThrow('Resource request not found');
    });

    it('should throw error if RPC call fails', async () => {
      vi.mocked(supabase.rpc).mockResolvedValue({
        data: null,
        error: { message: 'Database error', code: 'DB_ERROR' },
      } as never);

      await expect(resourceRequestService.cancelRequest('request-1', 'user-1')).rejects.toThrow(
        'Failed to cancel request: Database error'
      );
    });
  });
});
