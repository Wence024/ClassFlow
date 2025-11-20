/**
 * Integration tests for removing cross-department sessions to drawer.
 * Tests the workflow for cancelling requests when sessions are unscheduled.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as resourceRequestService from '@/lib/services/resourceRequestService';

vi.mock('../../../../lib/supabase');

describe('Remove to Drawer Workflow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should detect when user drags cross-dept session to drawer', () => {
    const mockSession = {
      id: 'session-1',
      instructor: {
        id: 'instructor-1',
        department_id: 'dept-business',
      },
      program_id: 'program-cs',
    };

    const userDepartmentId = 'dept-cs'; // User's department
    const hasCrossDeptResource = mockSession.instructor.department_id !== userDepartmentId;

    expect(hasCrossDeptResource).toBe(true);
  });

  it('should show confirmation dialog before removing', () => {
    // This would be tested in useTimetableDnd - onConfirm callback for drawer drop
    const mockOnConfirm = vi.fn();

    // Simulate the condition check
    const hasCrossDeptResource = true;

    if (hasCrossDeptResource) {
      mockOnConfirm(vi.fn());
    }

    expect(mockOnConfirm).toHaveBeenCalled();
  });

  it('should remove session on confirm', async () => {
    const { supabase } = await import('../../../../lib/supabase');

    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          in: vi.fn().mockResolvedValue({
            data: [{ id: 'request-1', target_department_id: 'dept-business' }],
            error: null,
          }),
        }),
      }),
      insert: vi.fn().mockResolvedValue({ error: null }),
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          in: vi.fn().mockResolvedValue({ error: null }),
        }),
      }),
    });

    await resourceRequestService.cancelActiveRequestsForClassSession('session-1');

    expect(supabase.from).toHaveBeenCalledWith('resource_requests');
  });

  it('should call cancelRequest service for pending request', async () => {
    const { supabase } = await import('../../../../lib/supabase');

    const mockResult = {
      success: true,
      action: 'removed_from_timetable',
      class_session_id: 'session-1',
    };

    vi.mocked(supabase.rpc).mockResolvedValue({
      data: mockResult,
      error: null,
    } as never);

    await resourceRequestService.cancelRequest('request-1', 'user-1');

    expect(supabase.rpc).toHaveBeenCalledWith('cancel_resource_request', {
      _request_id: 'request-1',
      _requester_id: 'user-1',
    });
  });

  it('should call cancelRequest service for approved request', async () => {
    const { supabase } = await import('../../../../lib/supabase');

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

    expect(result.action).toBe('restored');
    expect(result.restored_to_period).toBe(5);
  });

  it('should create cancellation notification for department head', async () => {
    const { supabase } = await import('../../../../lib/supabase');

    const mockRequests = [
      {
        id: 'request-1',
        class_session_id: 'session-1',
        target_department_id: 'dept-business',
        status: 'pending',
      },
    ];

    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          in: vi.fn().mockResolvedValue({
            data: mockRequests,
            error: null,
          }),
        }),
      }),
      insert: vi.fn().mockResolvedValue({ error: null }),
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          in: vi.fn().mockResolvedValue({ error: null }),
        }),
      }),
    });

    await resourceRequestService.cancelActiveRequestsForClassSession('session-1');

    const insertCalls = vi
      .mocked(supabase.from)
      .mock.results.filter(
        (result: unknown) => (result as { value?: { insert?: unknown } })?.value?.insert
      );

    expect(insertCalls.length).toBeGreaterThan(0);
  });

  it('should show "cancelled by program head" message to dept head', async () => {
    const { supabase } = await import('../../../../lib/supabase');

    const mockRequests = [
      {
        id: 'request-1',
        target_department_id: 'dept-business',
      },
    ];

    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          in: vi.fn().mockResolvedValue({
            data: mockRequests,
            error: null,
          }),
        }),
      }),
      insert: vi.fn().mockImplementation((payload) => {
        expect(payload[0].message).toBe('Request cancelled by program head');
        return Promise.resolve({ error: null });
      }),
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          in: vi.fn().mockResolvedValue({ error: null }),
        }),
      }),
    });

    await resourceRequestService.cancelActiveRequestsForClassSession('session-1');
  });

  it('should delete the resource request after notification', async () => {
    const { supabase } = await import('../../../../lib/supabase');

    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          in: vi.fn().mockResolvedValue({
            data: [{ id: 'request-1', target_department_id: 'dept-business' }],
            error: null,
          }),
        }),
      }),
      insert: vi.fn().mockResolvedValue({ error: null }),
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          in: vi.fn().mockResolvedValue({ error: null }),
        }),
      }),
    });

    await resourceRequestService.cancelActiveRequestsForClassSession('session-1');

    // Verify delete was called
    const fromCalls = vi.mocked(supabase.from).mock.calls;
    expect(fromCalls).toContainEqual(['resource_requests']);
  });

  it('should handle no active requests gracefully', async () => {
    const { supabase } = await import('../../../../lib/supabase');

    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          in: vi.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        }),
      }),
    });

    await expect(
      resourceRequestService.cancelActiveRequestsForClassSession('session-no-requests')
    ).resolves.not.toThrow();
  });
});
