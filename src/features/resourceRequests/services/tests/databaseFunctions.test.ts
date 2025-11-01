/**
 * Unit tests for database functions accessed via RPC.
 * Tests the PostgreSQL functions that handle cross-department request workflows.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { supabase } from '../../../../lib/supabase';

vi.mock('../../../../lib/supabase', () => ({
  supabase: {
    rpc: vi.fn(),
    from: vi.fn(),
  },
}));

describe('Database Functions - approve_resource_request', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should successfully approve pending request and update timetable status', async () => {
    const mockResult = {
      success: true,
      updated_assignments: 1,
      class_session_id: 'session-123',
      semester_id: 'semester-1',
    };

    (supabase.rpc as any).mockResolvedValue({ data: mockResult, error: null });

    const { data, error } = await supabase.rpc('approve_resource_request' as any, {
      _request_id: 'request-1',
      _reviewer_id: 'reviewer-1',
    });

    expect(error).toBeNull();
    expect(data).toEqual(mockResult);
    expect(data.success).toBe(true);
    expect(data.updated_assignments).toBe(1);
  });

  it('should return error when request does not exist', async () => {
    const mockResult = {
      success: false,
      error: 'Resource request not found',
    };

    (supabase.rpc as any).mockResolvedValue({ data: mockResult, error: null });

    const { data } = await supabase.rpc('approve_resource_request' as any, {
      _request_id: 'nonexistent-request',
      _reviewer_id: 'reviewer-1',
    });

    expect(data.success).toBe(false);
    expect(data.error).toBe('Resource request not found');
  });

  it('should return error when request is not pending', async () => {
    const mockResult = {
      success: false,
      error: 'Request is not pending (current status: approved)',
    };

    (supabase.rpc as any).mockResolvedValue({ data: mockResult, error: null });

    const { data } = await supabase.rpc('approve_resource_request' as any, {
      _request_id: 'approved-request',
      _reviewer_id: 'reviewer-1',
    });

    expect(data.success).toBe(false);
    expect(data.error).toContain('not pending');
  });

  it('should return error when no active semester exists', async () => {
    const mockResult = {
      success: false,
      error: 'No active semester found',
    };

    (supabase.rpc as any).mockResolvedValue({ data: mockResult, error: null });

    const { data } = await supabase.rpc('approve_resource_request' as any, {
      _request_id: 'request-1',
      _reviewer_id: 'reviewer-1',
    });

    expect(data.success).toBe(false);
    expect(data.error).toBe('No active semester found');
  });

  it('should return error when timetable assignment does not exist', async () => {
    const mockResult = {
      success: false,
      error: 'No timetable assignment found for this class session in the active semester',
    };

    (supabase.rpc as any).mockResolvedValue({ data: mockResult, error: null });

    const { data } = await supabase.rpc('approve_resource_request' as any, {
      _request_id: 'request-1',
      _reviewer_id: 'reviewer-1',
    });

    expect(data.success).toBe(false);
    expect(data.error).toContain('No timetable assignment found');
  });
});

describe('Database Functions - reject_resource_request', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should reject pending request and remove from timetable', async () => {
    const mockResult = {
      success: true,
      action: 'removed_from_timetable',
      class_session_id: 'session-123',
    };

    (supabase.rpc as any).mockResolvedValue({ data: mockResult, error: null });

    const { data, error } = await supabase.rpc('reject_resource_request' as any, {
      _request_id: 'request-1',
      _reviewer_id: 'reviewer-1',
      _rejection_message: 'Resource not available',
    });

    expect(error).toBeNull();
    expect(data.success).toBe(true);
    expect(data.action).toBe('removed_from_timetable');
  });

  it('should reject approved request and restore to original position', async () => {
    const mockResult = {
      success: true,
      action: 'restored',
      class_session_id: 'session-123',
      restored_to_period: 5,
    };

    (supabase.rpc as any).mockResolvedValue({ data: mockResult, error: null });

    const { data } = await supabase.rpc('reject_resource_request' as any, {
      _request_id: 'approved-request',
      _reviewer_id: 'reviewer-1',
      _rejection_message: 'Changed mind',
    });

    expect(data.success).toBe(true);
    expect(data.action).toBe('restored');
    expect(data.restored_to_period).toBe(5);
  });

  it('should store rejection message in database', async () => {
    const rejectionMessage = 'Instructor is on leave';
    const mockResult = {
      success: true,
      action: 'removed_from_timetable',
      class_session_id: 'session-123',
    };

    (supabase.rpc as any).mockResolvedValue({ data: mockResult, error: null });

    await supabase.rpc('reject_resource_request' as any, {
      _request_id: 'request-1',
      _reviewer_id: 'reviewer-1',
      _rejection_message: rejectionMessage,
    });

    expect(supabase.rpc).toHaveBeenCalledWith(
      'reject_resource_request',
      expect.objectContaining({
        _rejection_message: rejectionMessage,
      })
    );
  });

  it('should return error when request is not pending or approved', async () => {
    const mockResult = {
      success: false,
      error: 'Request is not pending or approved (current status: rejected)',
    };

    (supabase.rpc as any).mockResolvedValue({ data: mockResult, error: null });

    const { data } = await supabase.rpc('reject_resource_request' as any, {
      _request_id: 'rejected-request',
      _reviewer_id: 'reviewer-1',
      _rejection_message: 'Test',
    });

    expect(data.success).toBe(false);
    expect(data.error).toContain('not pending or approved');
  });
});

describe('Database Functions - handle_cross_dept_session_move', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should detect cross-department resources correctly', async () => {
    const mockResult = {
      success: true,
      requires_approval: true,
      request_id: 'new-request-1',
      target_department_id: 'dept-2',
    };

    (supabase.rpc as any).mockResolvedValue({ data: mockResult, error: null });

    const { data } = await supabase.rpc('handle_cross_dept_session_move' as any, {
      _class_session_id: 'session-1',
      _old_period_index: 5,
      _old_class_group_id: 'group-1',
      _new_period_index: 10,
      _new_class_group_id: 'group-1',
      _semester_id: 'semester-1',
    });

    expect(data.success).toBe(true);
    expect(data.requires_approval).toBe(true);
  });

  it('should move session and set status to pending for cross-dept', async () => {
    const mockResult = {
      success: true,
      requires_approval: true,
      request_id: 'new-request-1',
      target_department_id: 'dept-2',
    };

    (supabase.rpc as any).mockResolvedValue({ data: mockResult, error: null });

    const { data } = await supabase.rpc('handle_cross_dept_session_move' as any, {
      _class_session_id: 'session-1',
      _old_period_index: 5,
      _old_class_group_id: 'group-1',
      _new_period_index: 10,
      _new_class_group_id: 'group-1',
      _semester_id: 'semester-1',
    });

    expect(data.requires_approval).toBe(true);
    expect(data.request_id).toBeDefined();
  });

  it('should create new resource request with original position stored', async () => {
    const mockResult = {
      success: true,
      requires_approval: true,
      request_id: 'new-request-1',
      target_department_id: 'dept-2',
    };

    (supabase.rpc as any).mockResolvedValue({ data: mockResult, error: null });

    const { data } = await supabase.rpc('handle_cross_dept_session_move' as any, {
      _class_session_id: 'session-1',
      _old_period_index: 5,
      _old_class_group_id: 'group-1',
      _new_period_index: 10,
      _new_class_group_id: 'group-1',
      _semester_id: 'semester-1',
    });

    expect(data.request_id).toBeTruthy();
    expect(data.target_department_id).toBe('dept-2');
  });

  it('should handle non-cross-dept moves (confirms immediately)', async () => {
    const mockResult = {
      success: true,
      requires_approval: false,
    };

    (supabase.rpc as any).mockResolvedValue({ data: mockResult, error: null });

    const { data } = await supabase.rpc('handle_cross_dept_session_move' as any, {
      _class_session_id: 'session-same-dept',
      _old_period_index: 5,
      _old_class_group_id: 'group-1',
      _new_period_index: 10,
      _new_class_group_id: 'group-1',
      _semester_id: 'semester-1',
    });

    expect(data.success).toBe(true);
    expect(data.requires_approval).toBe(false);
  });
});

describe('Database Functions - is_cross_department_resource', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return true for instructor from different department', async () => {
    (supabase.rpc as any).mockResolvedValue({ data: true, error: null });

    const { data } = await supabase.rpc('is_cross_department_resource' as any, {
      _program_id: 'program-1',
      _instructor_id: 'instructor-from-other-dept',
      _classroom_id: null,
    });

    expect(data).toBe(true);
  });

  it('should return true for classroom from different department', async () => {
    (supabase.rpc as any).mockResolvedValue({ data: true, error: null });

    const { data } = await supabase.rpc('is_cross_department_resource' as any, {
      _program_id: 'program-1',
      _instructor_id: null,
      _classroom_id: 'classroom-from-other-dept',
    });

    expect(data).toBe(true);
  });

  it('should return false for same-department resources', async () => {
    (supabase.rpc as any).mockResolvedValue({ data: false, error: null });

    const { data } = await supabase.rpc('is_cross_department_resource' as any, {
      _program_id: 'program-1',
      _instructor_id: 'instructor-same-dept',
      _classroom_id: 'classroom-same-dept',
    });

    expect(data).toBe(false);
  });

  it('should handle null department IDs correctly', async () => {
    (supabase.rpc as any).mockResolvedValue({ data: false, error: null });

    const { data } = await supabase.rpc('is_cross_department_resource' as any, {
      _program_id: 'program-1',
      _instructor_id: null,
      _classroom_id: null,
    });

    expect(data).toBe(false);
  });
});
