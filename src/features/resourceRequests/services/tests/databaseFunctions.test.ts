/**
 * Unit tests for database functions (RPC) used in cross-department request approval.
 * Tests the PostgreSQL functions via Supabase RPC calls.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as resourceRequestService from '../resourceRequestService';

vi.mock('../../../../lib/supabase');

describe('Database Functions (RPC)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('approve_resource_request', () => {
    it('should successfully approve pending request and update timetable status', async () => {
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

    it('should return error when request does not exist', async () => {
      const { supabase } = await import('../../../../lib/supabase');

      const mockResult = {
        success: false,
        error: 'Request not found',
      };

      vi.mocked(supabase.rpc).mockResolvedValue({ data: mockResult, error: null });

      await expect(
        resourceRequestService.approveRequest('nonexistent-request', 'reviewer-1')
      ).rejects.toThrow('Request not found');
    });

    it('should return error when request is not pending', async () => {
      const { supabase } = await import('../../../../lib/supabase');

      const mockResult = {
        success: false,
        error: 'Request is not pending',
      };

      vi.mocked(supabase.rpc).mockResolvedValue({ data: mockResult, error: null });

      await expect(
        resourceRequestService.approveRequest('approved-request', 'reviewer-1')
      ).rejects.toThrow('Request is not pending');
    });

    it('should validate reviewer_id is provided', async () => {
      const { supabase } = await import('../../../../lib/supabase');

      const mockResult = {
        success: false,
        error: 'Reviewer ID is required',
      };

      vi.mocked(supabase.rpc).mockResolvedValue({ data: mockResult, error: null });

      await expect(resourceRequestService.approveRequest('request-1', '')).rejects.toThrow();
    });

    it('should return error when no active semester exists', async () => {
      const { supabase } = await import('../../../../lib/supabase');

      const mockResult = {
        success: false,
        error: 'No active semester found',
      };

      vi.mocked(supabase.rpc).mockResolvedValue({ data: mockResult, error: null });

      await expect(
        resourceRequestService.approveRequest('request-1', 'reviewer-1')
      ).rejects.toThrow('No active semester found');
    });

    it('should return error when timetable assignment does not exist', async () => {
      const { supabase } = await import('../../../../lib/supabase');

      const mockResult = {
        success: false,
        error: 'Timetable assignment not found',
      };

      vi.mocked(supabase.rpc).mockResolvedValue({ data: mockResult, error: null });

      await expect(
        resourceRequestService.approveRequest('request-1', 'reviewer-1')
      ).rejects.toThrow('Timetable assignment not found');
    });
  });

  describe('reject_resource_request', () => {
    it('should reject pending request and delete session/assignment', async () => {
      const { supabase } = await import('../../../../lib/supabase');

      const mockResult = {
        success: true,
        action: 'removed_from_timetable',
        class_session_id: 'session-1',
      };

      vi.mocked(supabase.rpc).mockResolvedValue({ data: mockResult, error: null });

      const result = await resourceRequestService.rejectRequest(
        'pending-request',
        'reviewer-1',
        'Resource unavailable'
      );

      expect(result.action).toBe('removed_from_timetable');
      expect(result.success).toBe(true);
    });

    it('should reject approved request and restore to original position', async () => {
      const { supabase } = await import('../../../../lib/supabase');

      const mockResult = {
        success: true,
        action: 'restored',
        class_session_id: 'session-1',
        restored_to_period: 5,
      };

      vi.mocked(supabase.rpc).mockResolvedValue({ data: mockResult, error: null });

      const result = await resourceRequestService.rejectRequest(
        'approved-request',
        'reviewer-1',
        'Changed scheduling'
      );

      expect(result.action).toBe('restored');
      expect(result.restored_to_period).toBe(5);
    });

    it('should store rejection message in database', async () => {
      const { supabase } = await import('../../../../lib/supabase');

      const rejectionMessage = 'Instructor is on sabbatical leave';
      const mockResult = { success: true, action: 'removed_from_timetable' };

      vi.mocked(supabase.rpc).mockResolvedValue({ data: mockResult, error: null });

      await resourceRequestService.rejectRequest('request-1', 'reviewer-1', rejectionMessage);

      expect(supabase.rpc).toHaveBeenCalledWith(
        'reject_resource_request',
        expect.objectContaining({
          _rejection_message: rejectionMessage,
        })
      );
    });

    it('should return correct action taken (removed vs restored)', async () => {
      const { supabase } = await import('../../../../lib/supabase');

      // Test removed action
      vi.mocked(supabase.rpc).mockResolvedValueOnce({
        data: { success: true, action: 'removed_from_timetable' },
        error: null,
      });

      const removedResult = await resourceRequestService.rejectRequest(
        'pending-request',
        'reviewer-1',
        'Test'
      );
      expect(removedResult.action).toBe('removed_from_timetable');

      // Test restored action
      vi.mocked(supabase.rpc).mockResolvedValueOnce({
        data: { success: true, action: 'restored', restored_to_period: 10 },
        error: null,
      });

      const restoredResult = await resourceRequestService.rejectRequest(
        'approved-request',
        'reviewer-1',
        'Test'
      );
      expect(restoredResult.action).toBe('restored');
    });
  });

  describe('handle_cross_dept_session_move', () => {
    it('should detect cross-department resources correctly', async () => {
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

      expect(result.data.requires_approval).toBe(true);
    });

    it('should move session and set status to pending', async () => {
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
    });

    it('should create new resource request with original position stored', async () => {
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
    });

    it('should create notification for department head', async () => {
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
    });

    it('should handle non-cross-dept moves (confirms immediately)', async () => {
      const { supabase } = await import('../../../../lib/supabase');

      const mockResult = {
        success: true,
        requires_approval: false,
      };

      vi.mocked(supabase.rpc).mockResolvedValue({ data: mockResult, error: null });

      const result = await supabase.rpc('handle_cross_dept_session_move' as never, {
        _class_session_id: 'session-same-dept',
        _old_period_index: 5,
        _old_class_group_id: 'group-1',
        _new_period_index: 10,
        _new_class_group_id: 'group-1',
        _semester_id: 'semester-1',
      });

      expect(result.data.requires_approval).toBe(false);
    });
  });

  describe('is_cross_department_resource', () => {
    it('should return true for instructor from different department', async () => {
      const { isCrossDepartmentInstructor } = await import(
        '../../../classSessions/services/classSessionsService'
      );
      const { supabase } = await import('../../../../lib/supabase');

      vi.mocked(supabase.rpc).mockResolvedValue({ data: true, error: null });

      const result = await isCrossDepartmentInstructor('program-cs', 'instructor-business');

      expect(result).toBe(true);
    });

    it('should return true for classroom from different department', async () => {
      const { isCrossDepartmentClassroom } = await import(
        '../../../classSessions/services/classSessionsService'
      );
      const { supabase } = await import('../../../../lib/supabase');

      vi.mocked(supabase.rpc).mockResolvedValue({ data: true, error: null });

      const result = await isCrossDepartmentClassroom('program-cs', 'classroom-business');

      expect(result).toBe(true);
    });

    it('should return false for same-department resources', async () => {
      const { isCrossDepartmentInstructor } = await import(
        '../../../classSessions/services/classSessionsService'
      );
      const { supabase } = await import('../../../../lib/supabase');

      vi.mocked(supabase.rpc).mockResolvedValue({ data: false, error: null });

      const result = await isCrossDepartmentInstructor('program-cs', 'instructor-cs');

      expect(result).toBe(false);
    });

    it('should handle null department IDs correctly', async () => {
      const { isCrossDepartmentInstructor } = await import(
        '../../../classSessions/services/classSessionsService'
      );
      const { supabase } = await import('../../../../lib/supabase');

      vi.mocked(supabase.rpc).mockResolvedValue({ data: false, error: null });

      const result = await isCrossDepartmentInstructor('program-cs', 'instructor-no-dept');

      expect(result).toBe(false);
    });
  });
});
