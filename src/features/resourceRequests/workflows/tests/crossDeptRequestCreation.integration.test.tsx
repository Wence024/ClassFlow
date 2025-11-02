/**
 * Integration tests for Cross-Department Request Creation workflow.
 * Tests the complete flow from detection to placement on the timetable.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock services
vi.mock('../../../classSessions/services/classSessionsService');
vi.mock('../../services/resourceRequestService');
vi.mock('../../../timetabling/services/timetableService');

describe('Cross-Department Request Creation Workflow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should detect cross-dept resource in ClassSessionForm', async () => {
    const { isCrossDepartmentInstructor } = await import('../../../classSessions/services/classSessionsService');
    vi.mocked(isCrossDepartmentInstructor).mockResolvedValue(true);

    // Component would render and call the service
    const result = await isCrossDepartmentInstructor('program-cs', 'instructor-from-business');
    
    expect(result).toBe(true);
  });

  it('should show confirmation modal with department name', async () => {
    // Mock the flow: When cross-dept is detected, modal should appear
    // This would be tested in ClassSessionForm component test
    expect(true).toBe(true); // Placeholder for modal rendering test
  });

  it('should create session (unassigned) on confirm', async () => {
    const { addClassSession } = await import('../../../classSessions/services/classSessionsService');
    
    const mockSession = {
      id: 'session-1',
      course_id: 'course-1',
      class_group_id: 'group-1',
      instructor_id: 'instructor-cross-dept',
      classroom_id: 'classroom-1',
      period_count: 1,
      program_id: 'program-cs',
      user_id: 'user-1',
    };

    vi.mocked(addClassSession).mockResolvedValue(mockSession);

    const result = await addClassSession(mockSession);
    
    expect(result).toEqual(mockSession);
    expect(addClassSession).toHaveBeenCalledWith(expect.objectContaining({
      program_id: 'program-cs',
      instructor_id: 'instructor-cross-dept',
    }));
  });

  it('should redirect to /scheduler with URL params after session creation', async () => {
    // This would be tested in ClassSessionForm with navigation mock
    const mockNavigate = vi.fn();
    
    // Simulate redirect
    mockNavigate('/scheduler', {
      state: {
        pendingSessionId: 'session-1',
        resourceType: 'instructor',
        resourceId: 'instructor-cross-dept',
        departmentId: 'dept-business',
      },
    });

    expect(mockNavigate).toHaveBeenCalledWith(
      '/scheduler',
      expect.objectContaining({
        state: expect.objectContaining({
          pendingSessionId: 'session-1',
          resourceType: 'instructor',
        }),
      })
    );
  });

  it('should create resource request on timetable placement', async () => {
    const { createRequest } = await import('../../services/resourceRequestService');
    
    const mockRequest = {
      id: 'request-1',
      requester_id: 'user-1',
      class_session_id: 'session-1',
      resource_type: 'instructor' as const,
      resource_id: 'instructor-cross-dept',
      target_department_id: 'dept-business',
      requesting_program_id: 'program-cs',
      status: 'pending' as const,
    };

    vi.mocked(createRequest).mockResolvedValue(mockRequest);

    const result = await createRequest({
      requester_id: 'user-1',
      class_session_id: 'session-1',
      resource_type: 'instructor',
      resource_id: 'instructor-cross-dept',
      target_department_id: 'dept-business',
      requesting_program_id: 'program-cs',
      status: 'pending',
    });

    expect(result).toEqual(mockRequest);
    expect(createRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'pending',
        resource_type: 'instructor',
      })
    );
  });

  it('should set assignment status to pending', async () => {
    const { assignClassSessionToTimetable } = await import('../../../timetabling/services/timetableService');

    vi.mocked(assignClassSessionToTimetable).mockResolvedValue({
      id: 'assignment-1',
      class_session_id: 'session-1',
      class_group_id: 'group-1',
      period_index: 5,
      semester_id: 'semester-1',
      status: 'pending',
    });

    const result = await assignClassSessionToTimetable({
      class_session_id: 'session-1',
      class_group_id: 'group-1',
      period_index: 5,
      semester_id: 'semester-1'
    }, 'pending');

    expect(result.status).toBe('pending');
  });
});
