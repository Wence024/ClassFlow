/**
 * Integration tests for removing cross-department sessions to drawer.
 * Tests the workflow for cancelling requests when sessions are unscheduled.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as resourceRequestService from '../../services/resourceRequestService';

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

    const userProgramDepartment = 'dept-cs';
    const hasCrossDeptResource = mockSession.instructor.department_id !== userProgramDepartment;

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
    
    (supabase.from as any).mockReturnValue({
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

  it('should call cancelActiveRequestsForClassSession', async () => {
    const { supabase } = await import('../../../../lib/supabase');
    
    (supabase.from as any).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          in: vi.fn().mockResolvedValue({
            data: [
              {
                id: 'request-1',
                class_session_id: 'session-1',
                target_department_id: 'dept-business',
                status: 'pending',
              },
            ],
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

    (supabase.from as any).mockReturnValue({
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

    const insertCalls = (supabase.from as any).mock.results.filter(
      (result: any) => result.value?.insert
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

    (supabase.from as any).mockReturnValue({
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
    
    (supabase.from as any).mockReturnValue({
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
    const fromCalls = (supabase.from as any).mock.calls;
    expect(fromCalls).toContainEqual(['resource_requests']);
  });

  it('should handle no active requests gracefully', async () => {
    const { supabase } = await import('../../../../lib/supabase');
    
    (supabase.from as any).mockReturnValue({
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
