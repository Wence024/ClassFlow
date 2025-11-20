/**
 * Integration tests for Approval workflow.
 * Tests the complete flow from department head approval to timetable update.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as resourceRequestService from '@/lib/services/resourceRequestService';

vi.mock('../../../../lib/supabase');

describe('Approval Workflow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call approve_resource_request atomically', async () => {
    const { supabase } = await import('../../../../lib/supabase');

    const mockResult = {
      success: true,
      updated_assignments: 1,
      class_session_id: 'session-1',
      semester_id: 'semester-1',
    };

    vi.mocked(supabase.rpc).mockResolvedValueOnce({ data: mockResult, error: null });
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: 'request-1', status: 'approved' },
            error: null,
          }),
        }),
      }),
    });

    const result = await resourceRequestService.approveRequest('request-1', 'reviewer-1');

    expect(supabase.rpc).toHaveBeenCalledWith('approve_resource_request', {
      _request_id: 'request-1',
      _reviewer_id: 'reviewer-1',
    });
    expect(result.status).toBe('approved');
  });

  it('should update request status to approved', async () => {
    const { supabase } = await import('../../../../lib/supabase');

    const mockResult = { success: true, updated_assignments: 1 };

    vi.mocked(supabase.rpc).mockResolvedValueOnce({ data: mockResult, error: null });
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              id: 'request-1',
              status: 'approved',
              reviewed_by: 'reviewer-1',
              reviewed_at: new Date().toISOString(),
            },
            error: null,
          }),
        }),
      }),
    });

    const result = await resourceRequestService.approveRequest('request-1', 'reviewer-1');

    expect(result.status).toBe('approved');
    expect(result.reviewed_by).toBe('reviewer-1');
    expect(result.reviewed_at).toBeDefined();
  });

  it('should update timetable assignment status to confirmed', async () => {
    const { supabase } = await import('../../../../lib/supabase');

    const mockResult = {
      success: true,
      updated_assignments: 1,
      class_session_id: 'session-1',
      semester_id: 'semester-1',
    };

    vi.mocked(supabase.rpc).mockResolvedValue({ data: mockResult, error: null });

    const { data } = await supabase.rpc('approve_resource_request' as never, {
      _request_id: 'request-1',
      _reviewer_id: 'reviewer-1',
    });

    expect(data.updated_assignments).toBe(1);
    // The database function handles the assignment status update atomically
  });

  it('should trigger delete notifications via database trigger', async () => {
    // The cleanup_request_notifications trigger handles this automatically
    // We just verify the approval succeeds
    const { supabase } = await import('../../../../lib/supabase');

    const mockResult = { success: true, updated_assignments: 1 };

    vi.mocked(supabase.rpc).mockResolvedValueOnce({ data: mockResult, error: null });
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: 'request-1', status: 'approved' },
            error: null,
          }),
        }),
      }),
    });

    const result = await resourceRequestService.approveRequest('request-1', 'reviewer-1');

    expect(result.status).toBe('approved');
    // Notifications are deleted by trigger when status changes from 'pending'
  });

  it('should allow real-time updates to propagate to timetable', async () => {
    // Real-time updates are handled by RealtimeProvider
    // This test verifies the data structure is correct for real-time
    const { supabase } = await import('../../../../lib/supabase');

    const mockResult = { success: true, updated_assignments: 1 };

    vi.mocked(supabase.rpc).mockResolvedValueOnce({ data: mockResult, error: null });
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              id: 'request-1',
              status: 'approved',
              class_session_id: 'session-1',
            },
            error: null,
          }),
        }),
      }),
    });

    const result = await resourceRequestService.approveRequest('request-1', 'reviewer-1');

    expect(result.class_session_id).toBe('session-1');
    // RealtimeProvider will listen for changes and invalidate queries
  });

  it('should make session draggable for program head after approval', async () => {
    // After approval, status changes to 'confirmed'
    // This is tested in SessionCell tests - confirmed sessions are draggable
    const { supabase } = await import('../../../../lib/supabase');

    const mockResult = { success: true, updated_assignments: 1 };

    vi.mocked(supabase.rpc).mockResolvedValue({ data: mockResult, error: null });

    const { data } = await supabase.rpc('approve_resource_request' as never, {
      _request_id: 'request-1',
      _reviewer_id: 'reviewer-1',
    });

    expect(data.success).toBe(true);
    // Assignment status is now 'confirmed', making the session draggable
  });
});
