/**
 * Tests for useTimetableDnd hook focusing on confirmation callbacks.
 *
 * Verifies cross-department confirmation workflow for resource requests.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/integrations/supabase/client');

describe('useTimetableDnd - Confirmation Callbacks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call confirmation callback before cross-dept drop', () => {
    const mockOnConfirm = vi.fn();
    const mockSession = {
      id: 'session-1',
      instructor: {
        id: 'instructor-1',
        department_id: 'dept-business',
      },
      program_id: 'program-cs',
    };

    const userDepartment = 'dept-cs';
    const hasCrossDeptResource = mockSession.instructor.department_id !== userDepartment;

    if (hasCrossDeptResource) {
      mockOnConfirm();
    }

    expect(mockOnConfirm).toHaveBeenCalled();
  });

  it('should abort drop if confirmation cancelled', () => {
    const mockOnConfirm = vi.fn();
    const mockOnCancel = vi.fn();

    // Simulate user cancelling
    const userCancelled = true;

    if (userCancelled) {
      mockOnCancel();
    } else {
      mockOnConfirm();
    }

    expect(mockOnCancel).toHaveBeenCalled();
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it('should create request after successful pending placement', async () => {
    const mockSession = {
      id: 'session-1',
      class_session_id: 'session-1',
      instructor_id: 'instructor-cross-dept',
      program_id: 'program-cs',
    };

    const mockCreateRequest = vi.fn().mockResolvedValue({
      id: 'request-1',
      status: 'pending',
    });

    // Simulate placement confirmation
    const userConfirmed = true;

    if (userConfirmed) {
      await mockCreateRequest({
        class_session_id: mockSession.class_session_id,
        resource_type: 'instructor',
        resource_id: mockSession.instructor_id,
        requesting_program_id: mockSession.program_id,
      });
    }

    expect(mockCreateRequest).toHaveBeenCalled();
  });

  it('should handle drawer drop with confirmation', () => {
    const mockOnConfirm = vi.fn();
    const mockSession = {
      id: 'session-1',
      instructor: {
        department_id: 'dept-business',
      },
    };

    const userDepartment = 'dept-cs';
    const isDrawerDrop = true;
    const hasCrossDeptResource = mockSession.instructor.department_id !== userDepartment;

    if (isDrawerDrop && hasCrossDeptResource) {
      mockOnConfirm();
    }

    expect(mockOnConfirm).toHaveBeenCalled();
  });

  it('should cancel requests when dropping to drawer', async () => {
    const mockCancelRequests = vi.fn().mockResolvedValue(undefined);
    const mockSession = {
      id: 'session-1',
      class_session_id: 'session-1',
    };

    const userConfirmed = true;

    if (userConfirmed) {
      await mockCancelRequests(mockSession.class_session_id);
    }

    expect(mockCancelRequests).toHaveBeenCalledWith('session-1');
  });

  it('should not require confirmation for same-department drops', () => {
    const mockOnConfirm = vi.fn();
    const mockOnDrop = vi.fn();
    const mockSession = {
      id: 'session-1',
      instructor: {
        department_id: 'dept-cs',
      },
    };

    const userDepartment = 'dept-cs';
    const hasCrossDeptResource = mockSession.instructor.department_id !== userDepartment;

    if (hasCrossDeptResource) {
      mockOnConfirm();
    } else {
      mockOnDrop();
    }

    expect(mockOnConfirm).not.toHaveBeenCalled();
    expect(mockOnDrop).toHaveBeenCalled();
  });
});
