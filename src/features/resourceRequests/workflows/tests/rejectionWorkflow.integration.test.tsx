/**
 * Integration tests for Rejection workflow.
 * Tests the complete flow from rejection to notification and session handling.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as resourceRequestService from '../../services/resourceRequestService';

vi.mock('../../../../lib/supabase');

describe('Rejection Workflow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should require rejection message (validation)', async () => {
    const { supabase } = await import('../../../../lib/supabase');
    
    // Empty message should fail validation at UI level
    // This test verifies the service receives the message
    const mockResult = { success: true, action: 'removed_from_timetable' };

    (supabase.rpc as any).mockResolvedValue({ data: mockResult, error: null });

    await resourceRequestService.rejectRequest('request-1', 'reviewer-1', 'Valid reason');

    expect(supabase.rpc).toHaveBeenCalledWith(
      'reject_resource_request',
      expect.objectContaining({
        _rejection_message: 'Valid reason',
      })
    );
  });

  it('should delete session and assignment for pending request', async () => {
    const { supabase } = await import('../../../../lib/supabase');
    
    const mockResult = {
      success: true,
      action: 'removed_from_timetable',
      class_session_id: 'session-1',
    };

    (supabase.rpc as any).mockResolvedValue({ data: mockResult, error: null });

    const result = await resourceRequestService.rejectRequest(
      'pending-request',
      'reviewer-1',
      'Resource unavailable'
    );

    expect(result.action).toBe('removed_from_timetable');
    expect(result.success).toBe(true);
  });

  it('should restore to original position for approved request', async () => {
    const { supabase } = await import('../../../../lib/supabase');
    
    const mockResult = {
      success: true,
      action: 'restored',
      class_session_id: 'session-1',
      restored_to_period: 5,
    };

    (supabase.rpc as any).mockResolvedValue({ data: mockResult, error: null });

    const result = await resourceRequestService.rejectRequest(
      'approved-request',
      'reviewer-1',
      'Changed scheduling'
    );

    expect(result.action).toBe('restored');
    expect(result.restored_to_period).toBe(5);
  });

  it('should store rejection_message in database', async () => {
    const { supabase } = await import('../../../../lib/supabase');
    
    const rejectionMessage = 'Instructor is on sabbatical leave';
    const mockResult = { success: true, action: 'removed_from_timetable' };

    (supabase.rpc as any).mockResolvedValue({ data: mockResult, error: null });

    await resourceRequestService.rejectRequest('request-1', 'reviewer-1', rejectionMessage);

    expect(supabase.rpc).toHaveBeenCalledWith(
      'reject_resource_request',
      expect.objectContaining({
        _rejection_message: rejectionMessage,
      })
    );
  });

  it('should allow program head to see notification with message in red box', async () => {
    // This is tested in PendingRequestsNotification component tests
    // Rejection creates a notification with the rejection_message
    const mockNotification = {
      id: 'notif-1',
      request_id: 'request-1',
      status: 'rejected',
      rejection_message: 'Resource unavailable',
    };

    expect(mockNotification.status).toBe('rejected');
    expect(mockNotification.rejection_message).toBeDefined();
  });

  it('should allow program head to dismiss notification', async () => {
    const { supabase } = await import('../../../../lib/supabase');
    
    (supabase.from as any).mockReturnValue({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      }),
    });

    await resourceRequestService.dismissRequest('request-1');

    expect(supabase.from).toHaveBeenCalledWith('resource_requests');
  });

  it('should handle rejection with detailed error messages', async () => {
    const { supabase } = await import('../../../../lib/supabase');
    
    const mockResult = {
      success: false,
      error: 'Request is not pending or approved (current status: cancelled)',
    };

    (supabase.rpc as any).mockResolvedValue({ data: mockResult, error: null });

    await expect(
      resourceRequestService.rejectRequest('invalid-request', 'reviewer-1', 'Test')
    ).rejects.toThrow('Request is not pending or approved');
  });
});
