import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleResourceReassignment } from '../../src/features/program-head/schedule-class-session/workflows/resourceReassignment';
import { TimetableService } from '../../src/lib/services/timetableService';
import { ClassSessionService } from '../../src/lib/services/classSessionService';

// Mock services
vi.mock('../../src/lib/services/timetableService', () => ({
  TimetableService: {
    moveSessionWithResourceChange: vi.fn(),
  }
}));

vi.mock('../../src/lib/services/classSessionService', () => ({
  ClassSessionService: {
    reassignSessionResource: vi.fn(),
  }
}));

// Mock data
const mockCourse = { id: 'course-1', name: 'Math 101' };
const mockGroup = { id: 'group-1', name: 'Group A' };
const mockInstructor = { id: 'instructor-1', name: 'Dr. Smith' };
const mockClassroom = { id: 'classroom-1', name: 'Room 101' };

describe('handleResourceReassignment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('handles instructor reassignment correctly', async () => {
    const session = {
      id: 'session-1',
      course: mockCourse,
      group: mockGroup,
      instructor: { id: 'instructor-1', name: 'Dr. Smith' },
      classroom: { id: 'classroom-1', name: 'Room 101' },
      period_count: 1,
      program_id: 'program-1'
    };
    
    const mockUpdatedSession = {
      ...session,
      instructor: { id: 'instructor-2', name: 'Dr. Jones' }
    };
    
    (ClassSessionService.reassignSessionResource as vi.Mock).mockResolvedValue(mockUpdatedSession);
    
    await handleResourceReassignment(
      session,
      'instructor',
      'instructor-2',
      'Dr. Jones',
      'program-1',
      'semester-1'
    );
    
    expect(ClassSessionService.reassignSessionResource).toHaveBeenCalledWith(
      'session-1',
      'instructor',
      'instructor-2'
    );
    
    expect(TimetableService.moveSessionWithResourceChange).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Object),
      'session-1',
      expect.any(String), // user ID
      'instructor',
      'instructor-2',
      'confirmed'
    );
  });

  it('handles classroom reassignment correctly', async () => {
    const session = {
      id: 'session-1',
      course: mockCourse,
      group: mockGroup,
      instructor: { id: 'instructor-1', name: 'Dr. Smith' },
      classroom: { id: 'classroom-1', name: 'Room 101' },
      period_count: 1,
      program_id: 'program-1'
    };
    
    const mockUpdatedSession = {
      ...session,
      classroom: { id: 'classroom-2', name: 'Room 202' }
    };
    
    (ClassSessionService.reassignSessionResource as vi.Mock).mockResolvedValue(mockUpdatedSession);
    
    await handleResourceReassignment(
      session,
      'classroom',
      'classroom-2',
      'Room 202',
      'program-1',
      'semester-1'
    );
    
    expect(ClassSessionService.reassignSessionResource).toHaveBeenCalledWith(
      'session-1',
      'classroom',
      'classroom-2'
    );
    
    expect(TimetableService.moveSessionWithResourceChange).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Object),
      'session-1',
      expect.any(String), // user ID
      'classroom',
      'classroom-2',
      'confirmed'
    );
  });

  it('throws error when reassignment fails', async () => {
    const session = {
      id: 'session-1',
      course: mockCourse,
      group: mockGroup,
      instructor: { id: 'instructor-1', name: 'Dr. Smith' },
      classroom: { id: 'classroom-1', name: 'Room 101' },
      period_count: 1,
      program_id: 'program-1'
    };
    
    (ClassSessionService.reassignSessionResource as vi.Mock).mockRejectedValue(
      new Error('Resource not available')
    );
    
    await expect(
      handleResourceReassignment(
        session,
        'instructor',
        'instructor-2',
        'Dr. Jones',
        'program-1',
        'semester-1'
      )
    ).rejects.toThrow('Resource not available');
  });

  it('handles reassignment from unassigned state (first-time assignment)', async () => {
    const session = {
      id: 'session-1',
      course: mockCourse,
      group: mockGroup,
      instructor: null, // Currently unassigned
      classroom: { id: 'classroom-1', name: 'Room 101' },
      period_count: 1,
      program_id: 'program-1'
    };
    
    const mockUpdatedSession = {
      ...session,
      instructor: { id: 'instructor-1', name: 'Dr. Smith' }
    };
    
    (ClassSessionService.reassignSessionResource as vi.Mock).mockResolvedValue(mockUpdatedSession);
    
    await handleResourceReassignment(
      session,
      'instructor',
      'instructor-1',
      'Dr. Smith',
      'program-1',
      'semester-1'
    );
    
    expect(ClassSessionService.reassignSessionResource).toHaveBeenCalledWith(
      'session-1',
      'instructor',
      'instructor-1'
    );
    
    expect(TimetableService.moveSessionWithResourceChange).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Object),
      'session-1',
      expect.any(String), // user ID
      'instructor',
      'instructor-1',
      'confirmed'
    );
  });
});