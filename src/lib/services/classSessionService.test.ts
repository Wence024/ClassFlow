import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  createIncompleteClassSession,
  assignResourcesToSession,
  reassignSessionResource,
  getIncompleteSessionsForProgram
} from '../../lib/services/classSessionService';
import { isIncompleteSession } from '../../src/types/classSession.utils';

// Mock the database client
vi.mock('@supabase/supabase-js', () => {
  const mockSupabase = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    filter: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn(),
    data: { test: 'data' },
    error: null
  };
  
  return {
    createClient: vi.fn(() => mockSupabase)
  };
});

// Mock data
const mockCourse = { id: 'course-1', name: 'Math 101' };
const mockGroup = { id: 'group-1', name: 'Group A' };
const mockInstructor = { id: 'instructor-1', name: 'Dr. Smith' };
const mockClassroom = { id: 'classroom-1', name: 'Room 101' };
const mockProgram = { id: 'program-1', name: 'Computer Science' };

describe('createIncompleteClassSession', () => {
  it('creates session with null resources', async () => {
    const mockSession = {
      id: 'session-1',
      course: mockCourse,
      group: mockGroup,
      instructor: null,
      classroom: null,
      period_count: 2,
      program_id: 'program-1'
    };
    
    // Mock the Supabase insert operation to return our test session
    const mockSupabase = require('@supabase/supabase-js').createClient();
    mockSupabase.insert.mockResolvedValue({ data: { ...mockSession }, error: null });
    
    const data = {
      course_id: 'course-1',
      class_group_id: 'group-1',
      instructor_id: null,
      classroom_id: null,
      period_count: 2,
      user_id: 'user-1',
      program_id: 'program-1'
    };

    const session = await createIncompleteClassSession(data);

    expect(session.instructor).toBeNull();
    expect(session.classroom).toBeNull();
    expect(session.course).toBeDefined();
    expect(session.group).toBeDefined();
    expect(session.period_count).toBe(2);
  });
});

describe('assignResourcesToSession', () => {
  it('assigns instructor and classroom to incomplete session', async () => {
    // First create an incomplete session
    const incompleteSession = {
      id: 'session-1',
      course: mockCourse,
      group: mockGroup,
      instructor: null,
      classroom: null,
      period_count: 2,
      program_id: 'program-1'
    };
    
    const mockUpdatedSession = {
      id: 'session-1',
      course: mockCourse,
      group: mockGroup,
      instructor: mockInstructor,
      classroom: mockClassroom,
      period_count: 2,
      program_id: 'program-1'
    };
    
    // Mock the Supabase update operation to return our test session
    const mockSupabase = require('@supabase/supabase-js').createClient();
    mockSupabase.update.mockResolvedValue({ data: [mockUpdatedSession], error: null });
    
    const complete = await assignResourcesToSession(
      'session-1',
      'instructor-1',
      'classroom-1'
    );

    expect(complete.instructor).toBeDefined();
    expect(complete.classroom).toBeDefined();
    expect(complete.instructor?.id).toBe('instructor-1');
    expect(complete.classroom?.id).toBe('classroom-1');
  });

  it('assigns only instructor when classroom is null', async () => {
    const mockUpdatedSession = {
      id: 'session-1',
      course: mockCourse,
      group: mockGroup,
      instructor: mockInstructor,
      classroom: null,
      period_count: 2,
      program_id: 'program-1'
    };
    
    // Mock the Supabase update operation
    const mockSupabase = require('@supabase/supabase-js').createClient();
    mockSupabase.update.mockResolvedValue({ data: [mockUpdatedSession], error: null });
    
    const partial = await assignResourcesToSession(
      'session-1',
      'instructor-1',
      null
    );

    expect(partial.instructor).toBeDefined();
    expect(partial.classroom).toBeNull();
    expect(partial.instructor?.id).toBe('instructor-1');
  });

  it('assigns only classroom when instructor is null', async () => {
    const mockUpdatedSession = {
      id: 'session-1',
      course: mockCourse,
      group: mockGroup,
      instructor: null,
      classroom: mockClassroom,
      period_count: 2,
      program_id: 'program-1'
    };
    
    // Mock the Supabase update operation
    const mockSupabase = require('@supabase/supabase-js').createClient();
    mockSupabase.update.mockResolvedValue({ data: [mockUpdatedSession], error: null });
    
    const partial = await assignResourcesToSession(
      'session-1',
      null,
      'classroom-1'
    );

    expect(partial.instructor).toBeNull();
    expect(partial.classroom).toBeDefined();
    expect(partial.classroom?.id).toBe('classroom-1');
  });
});

describe('reassignSessionResource', () => {
  it('reassigns instructor correctly', async () => {
    const mockSession = {
      id: 'session-1',
      course: mockCourse,
      group: mockGroup,
      instructor: mockInstructor,
      classroom: mockClassroom,
      period_count: 2,
      program_id: 'program-1'
    };
    
    const mockUpdatedSession = {
      id: 'session-1',
      course: mockCourse,
      group: mockGroup,
      instructor: { id: 'instructor-2', name: 'Dr. Jones' },
      classroom: mockClassroom,
      period_count: 2,
      program_id: 'program-1'
    };
    
    // Mock the Supabase update operation
    const mockSupabase = require('@supabase/supabase-js').createClient();
    mockSupabase.update.mockResolvedValue({ data: [mockUpdatedSession], error: null });
    
    const updatedSession = await reassignSessionResource('session-1', 'instructor', 'instructor-2');

    expect(updatedSession.instructor?.id).toBe('instructor-2');
    expect(updatedSession.classroom?.id).toBe('classroom-1');
  });

  it('reassigns classroom correctly', async () => {
    const mockSession = {
      id: 'session-1',
      course: mockCourse,
      group: mockGroup,
      instructor: mockInstructor,
      classroom: mockClassroom,
      period_count: 2,
      program_id: 'program-1'
    };
    
    const mockUpdatedSession = {
      id: 'session-1',
      course: mockCourse,
      group: mockGroup,
      instructor: mockInstructor,
      classroom: { id: 'classroom-2', name: 'Room 202' },
      period_count: 2,
      program_id: 'program-1'
    };
    
    // Mock the Supabase update operation
    const mockSupabase = require('@supabase/supabase-js').createClient();
    mockSupabase.update.mockResolvedValue({ data: [mockUpdatedSession], error: null });
    
    const updatedSession = await reassignSessionResource('session-1', 'classroom', 'classroom-2');

    expect(updatedSession.classroom?.id).toBe('classroom-2');
    expect(updatedSession.instructor?.id).toBe('instructor-1');
  });
});

describe('getIncompleteSessionsForProgram', () => {
  it('returns only sessions with missing resources', async () => {
    const mockIncompleteSession = {
      id: 'session-1',
      course: mockCourse,
      group: mockGroup,
      instructor: null,
      classroom: null,
      period_count: 2,
      program_id: 'program-1'
    };
    
    // Mock the Supabase select operation
    const mockSupabase = require('@supabase/supabase-js').createClient();
    mockSupabase.or.mockReturnThis().eq.mockReturnThis().select.mockResolvedValue({
      data: [mockIncompleteSession],
      error: null
    });
    
    const incompleteSessions = await getIncompleteSessionsForProgram('program-1');

    // Verify only incomplete sessions are returned
    expect(incompleteSessions.length).toBe(1);
    expect(isIncompleteSession(incompleteSessions[0])).toBe(true);
  });
});

// Integration test for checkTimetableConflicts
describe('checkTimetableConflicts', () => {
  // Since this function is in a different module, we'll create a separate test file
  // for the conflicts utility
});