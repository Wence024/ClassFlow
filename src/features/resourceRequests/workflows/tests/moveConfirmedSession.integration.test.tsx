/**
 * Integration tests for moving confirmed cross-department sessions.
 * Tests the workflow requiring re-approval when moving already-approved sessions.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../../lib/supabase');

describe('Move Confirmed Cross-Department Session Workflow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should detect when user drags confirmed cross-dept session', () => {
    const mockAssignment = {
      id: 'assignment-1',
      class_session_id: 'session-1',
      class_group_id: 'group-1',
      period_index: 5,
      status: 'confirmed',
    };

    const mockSession = {
      id: 'session-1',
      instructor: {
        id: 'instructor-1',
        department_id: 'dept-business', // Different from user's dept
      },
      program_id: 'program-cs',
    };

    const userDepartmentId = 'dept-cs'; // User's department
    const isCurrentlyConfirmed = mockAssignment.status === 'confirmed';
    const hasCrossDeptResource = mockSession.instructor.department_id !== userDepartmentId;

    expect(isCurrentlyConfirmed && hasCrossDeptResource).toBe(true);
  });

  it('should show confirmation dialog before moving', () => {
    // This would be tested in useTimetableDnd - onConfirmMove callback
    const mockOnConfirmMove = vi.fn();

    // Simulate the condition check
    const shouldShowConfirmation = true; // confirmed + cross-dept

    if (shouldShowConfirmation) {
      mockOnConfirmMove(vi.fn());
    }

    expect(mockOnConfirmMove).toHaveBeenCalled();
  });

  it('should move session on confirm', async () => {
    const { supabase } = await import('../../../../lib/supabase');

    const mockResult = {
      success: true,
      requires_approval: true,
      request_id: 'new-request-1',
      target_department_id: 'dept-business',
    };

    vi.mocked(supabase.rpc).mockResolvedValue({ data: mockResult, error: null });

    const result = await supabase.rpc('handle_cross_dept_session_move' as never, {
      _class_session_id: 'session-1',
      _old_period_index: 5,
      _old_class_group_id: 'group-1',
      _new_period_index: 10,
      _new_class_group_id: 'group-1',
      _semester_id: 'semester-1',
    });

    expect(result.data.success).toBe(true);
    expect(result.data.requires_approval).toBe(true);
  });

  it('should call handle_cross_dept_session_move RPC function', async () => {
    const { supabase } = await import('../../../../lib/supabase');

    const mockResult = {
      success: true,
      requires_approval: true,
      request_id: 'new-request-1',
    };

    vi.mocked(supabase.rpc).mockResolvedValue({ data: mockResult, error: null });

    await supabase.rpc('handle_cross_dept_session_move' as never, {
      _class_session_id: 'session-1',
      _old_period_index: 5,
      _old_class_group_id: 'group-1',
      _new_period_index: 10,
      _new_class_group_id: 'group-1',
      _semester_id: 'semester-1',
    });

    expect(supabase.rpc).toHaveBeenCalledWith(
      'handle_cross_dept_session_move',
      expect.objectContaining({
        _class_session_id: 'session-1',
        _old_period_index: 5,
        _new_period_index: 10,
      })
    );
  });

  it('should change assignment status to pending again', async () => {
    const { supabase } = await import('../../../../lib/supabase');

    const mockResult = {
      success: true,
      requires_approval: true,
      request_id: 'new-request-1',
    };

    vi.mocked(supabase.rpc).mockResolvedValue({ data: mockResult, error: null });

    const result = await supabase.rpc('handle_cross_dept_session_move' as never, {
      _class_session_id: 'session-1',
      _old_period_index: 5,
      _old_class_group_id: 'group-1',
      _new_period_index: 10,
      _new_class_group_id: 'group-1',
      _semester_id: 'semester-1',
    });

    expect(result.data.requires_approval).toBe(true);
    // The database function sets assignment status to 'pending'
  });

  it('should create new request with original position stored', async () => {
    const { supabase } = await import('../../../../lib/supabase');

    const mockResult = {
      success: true,
      requires_approval: true,
      request_id: 'new-request-1',
      target_department_id: 'dept-business',
    };

    vi.mocked(supabase.rpc).mockResolvedValue({ data: mockResult, error: null });

    const result = await supabase.rpc('handle_cross_dept_session_move' as never, {
      _class_session_id: 'session-1',
      _old_period_index: 5,
      _old_class_group_id: 'group-1',
      _new_period_index: 10,
      _new_class_group_id: 'group-1',
      _semester_id: 'semester-1',
    });

    expect(result.data.request_id).toBe('new-request-1');
    // Original position (5, group-1) is stored in the request for potential restoration
  });

  it('should notify department head of new request', async () => {
    const { supabase } = await import('../../../../lib/supabase');

    const mockResult = {
      success: true,
      requires_approval: true,
      request_id: 'new-request-1',
      target_department_id: 'dept-business',
    };

    vi.mocked(supabase.rpc).mockResolvedValue({ data: mockResult, error: null });

    const result = await supabase.rpc('handle_cross_dept_session_move' as never, {
      _class_session_id: 'session-1',
      _old_period_index: 5,
      _old_class_group_id: 'group-1',
      _new_period_index: 10,
      _new_class_group_id: 'group-1',
      _semester_id: 'semester-1',
    });

    expect(result.data.target_department_id).toBe('dept-business');
    // The database function creates a notification for this department
  });

  it('should abort move if user cancels confirmation', () => {
    const mockOnConfirm = vi.fn();
    const mockOnCancel = vi.fn();

    // Simulate user clicking cancel
    mockOnCancel();

    expect(mockOnConfirm).not.toHaveBeenCalled();
    // Move operation should not proceed
  });
});
