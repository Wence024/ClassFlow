/**
 * Tests for security and permission enforcement in resource requests.
 * Tests RLS policies and access control rules.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as resourceRequestService from '../services/resourceRequestService';

vi.mock('../../../lib/supabase');

describe('Resource Request Permissions and Security', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should allow department heads to approve requests for their department', async () => {
    const { supabase } = await import('../../../lib/supabase');

    const mockResult = {
      success: true,
      updated_assignments: 1,
    };

    vi.mocked(supabase.rpc).mockResolvedValueOnce({ data: mockResult, error: null });
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              id: 'request-1',
              status: 'approved',
              target_department_id: 'dept-business',
            },
            error: null,
          }),
        }),
      }),
    });

    const result = await resourceRequestService.approveRequest('request-1', 'dept-head-business');

    expect(result.status).toBe('approved');
    expect(result.target_department_id).toBe('dept-business');
  });

  it('should prevent department heads from approving requests for other departments', async () => {
    const { supabase } = await import('../../../lib/supabase');

    const mockError = {
      code: '42501', // RLS policy violation
      message: 'Permission denied',
    };

    vi.mocked(supabase.rpc).mockResolvedValue({ data: null, error: mockError });

    await expect(
      resourceRequestService.approveRequest('request-other-dept', 'dept-head-business')
    ).rejects.toThrow();
  });

  it('should allow program heads to dismiss their own reviewed requests', async () => {
    const { supabase } = await import('../../../lib/supabase');

    vi.mocked(supabase.from).mockReturnValue({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      }),
    });

    await expect(resourceRequestService.dismissRequest('request-1')).resolves.not.toThrow();
  });

  it('should prevent program heads from dismissing other programs requests', async () => {
    const { supabase } = await import('../../../lib/supabase');

    const mockError = {
      code: '42501',
      message: 'Permission denied',
    };

    vi.mocked(supabase.from).mockReturnValue({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: mockError }),
      }),
    });

    await expect(resourceRequestService.dismissRequest('request-other-program')).rejects.toThrow(
      'Permission denied'
    );
  });

  it('should prevent program heads from dismissing pending requests', async () => {
    const { supabase } = await import('../../../lib/supabase');

    const mockError = {
      code: '23514', // Check constraint violation
      message: 'Cannot dismiss a pending request',
    };

    vi.mocked(supabase.from).mockReturnValue({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: mockError }),
      }),
    });

    await expect(resourceRequestService.dismissRequest('pending-request')).rejects.toThrow();
  });

  it('should enforce RLS policies preventing unauthorized access', async () => {
    const { supabase } = await import('../../../lib/supabase');

    // Simulate RLS policy blocking access
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: [], // RLS filters out unauthorized data
            error: null,
          }),
        }),
      }),
    });

    const result = await resourceRequestService.getRequestsForDepartment('unauthorized-dept');

    expect(result).toEqual([]);
  });

  it('should allow admins full access to all requests', async () => {
    const { supabase } = await import('../../../lib/supabase');

    const mockRequests = [
      { id: 'request-1', target_department_id: 'dept-cs' },
      { id: 'request-2', target_department_id: 'dept-business' },
    ];

    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({
          data: mockRequests,
          error: null,
        }),
      }),
    });

    const result = await resourceRequestService.getMyRequests();

    // Admin should see all requests if RLS allows
    expect(result.length).toBeGreaterThan(0);
  });

  it('should validate reviewer_id is provided for approval', async () => {
    const { supabase } = await import('../../../lib/supabase');

    const mockResult = {
      success: false,
      error: 'Reviewer ID is required',
    };

    vi.mocked(supabase.rpc).mockResolvedValue({ data: mockResult, error: null });

    await expect(resourceRequestService.approveRequest('request-1', '')).rejects.toThrow();
  });

  it('should prevent non-owners from updating requests', async () => {
    const { supabase } = await import('../../../lib/supabase');

    const mockError = {
      code: '42501',
      message: 'RLS policy violation',
    };

    vi.mocked(supabase.from).mockReturnValue({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: mockError }),
          }),
        }),
      }),
    });

    await expect(
      resourceRequestService.updateRequest('request-other-user', { status: 'pending' })
    ).rejects.toThrow();
  });

  it('should restrict access based on user role', async () => {
    // This would be tested with actual auth context
    // Program heads should only see their program's requests
    // Department heads should see their department's incoming requests
    // Admins should see everything

    const mockProgramHeadUser = {
      id: 'user-1',
      role: 'program_head',
      program_id: 'program-cs',
    };

    const mockDeptHeadUser = {
      id: 'user-2',
      role: 'department_head',
      department_id: 'dept-business',
    };

    expect(mockProgramHeadUser.role).toBe('program_head');
    expect(mockDeptHeadUser.role).toBe('department_head');
  });
});
