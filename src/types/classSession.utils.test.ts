import { describe, it, expect } from 'vitest';
import {
  isIncompleteSession,
  isPartiallyCompleteSession,
  isCompleteSession,
  getMissingResources,
  getResourceCompletionStatus
} from './classSession.utils';
import { ClassSession } from './classSession';

// Mock data
const mockCourse = { id: 'course-1', name: 'Math 101' };
const mockGroup = { id: 'group-1', name: 'Group A' };
const mockInstructor = { id: 'instructor-1', name: 'Dr. Smith' };
const mockClassroom = { id: 'classroom-1', name: 'Room 101' };

describe('isIncompleteSession', () => {
  it('returns true when both resources are null', () => {
    const session: ClassSession = {
      id: '1',
      course: mockCourse,
      group: mockGroup,
      instructor: null,
      classroom: null,
      period_count: 1,
      program_id: 'prog-1'
    };
    expect(isIncompleteSession(session)).toBe(true);
  });

  it('returns false when one resource is assigned', () => {
    const session: ClassSession = {
      id: '1',
      course: mockCourse,
      group: mockGroup,
      instructor: mockInstructor,
      classroom: null,
      period_count: 1,
      program_id: 'prog-1'
    };
    expect(isIncompleteSession(session)).toBe(false);
  });

  it('returns false when both resources are assigned', () => {
    const session: ClassSession = {
      id: '1',
      course: mockCourse,
      group: mockGroup,
      instructor: mockInstructor,
      classroom: mockClassroom,
      period_count: 1,
      program_id: 'prog-1'
    };
    expect(isIncompleteSession(session)).toBe(false);
  });
});

describe('getMissingResources', () => {
  it('returns both resources when both null', () => {
    const session: ClassSession = {
      id: '1',
      course: mockCourse,
      group: mockGroup,
      instructor: null,
      classroom: null,
      period_count: 1,
      program_id: 'prog-1'
    };
    expect(getMissingResources(session)).toEqual(['instructor', 'classroom']);
  });

  it('returns only instructor when classroom is assigned', () => {
    const session: ClassSession = {
      id: '1',
      course: mockCourse,
      group: mockGroup,
      instructor: null,
      classroom: mockClassroom,
      period_count: 1,
      program_id: 'prog-1'
    };
    expect(getMissingResources(session)).toEqual(['instructor']);
  });

  it('returns only classroom when instructor is assigned', () => {
    const session: ClassSession = {
      id: '1',
      course: mockCourse,
      group: mockGroup,
      instructor: mockInstructor,
      classroom: null,
      period_count: 1,
      program_id: 'prog-1'
    };
    expect(getMissingResources(session)).toEqual(['classroom']);
  });

  it('returns empty array when complete', () => {
    const session: ClassSession = {
      id: '1',
      course: mockCourse,
      group: mockGroup,
      instructor: mockInstructor,
      classroom: mockClassroom,
      period_count: 1,
      program_id: 'prog-1'
    };
    expect(getMissingResources(session)).toEqual([]);
  });
});

describe('isPartiallyCompleteSession', () => {
  it('returns true when only instructor is assigned', () => {
    const session: ClassSession = {
      id: '1',
      course: mockCourse,
      group: mockGroup,
      instructor: mockInstructor,
      classroom: null,
      period_count: 1,
      program_id: 'prog-1'
    };
    expect(isPartiallyCompleteSession(session)).toBe(true);
  });

  it('returns true when only classroom is assigned', () => {
    const session: ClassSession = {
      id: '1',
      course: mockCourse,
      group: mockGroup,
      instructor: null,
      classroom: mockClassroom,
      period_count: 1,
      program_id: 'prog-1'
    };
    expect(isPartiallyCompleteSession(session)).toBe(true);
  });

  it('returns false when both assigned', () => {
    const session: ClassSession = {
      id: '1',
      course: mockCourse,
      group: mockGroup,
      instructor: mockInstructor,
      classroom: mockClassroom,
      period_count: 1,
      program_id: 'prog-1'
    };
    expect(isPartiallyCompleteSession(session)).toBe(false);
  });

  it('returns false when both null', () => {
    const session: ClassSession = {
      id: '1',
      course: mockCourse,
      group: mockGroup,
      instructor: null,
      classroom: null,
      period_count: 1,
      program_id: 'prog-1'
    };
    expect(isPartiallyCompleteSession(session)).toBe(false);
  });
});

describe('isCompleteSession', () => {
  it('returns true when both resources are assigned', () => {
    const session: ClassSession = {
      id: '1',
      course: mockCourse,
      group: mockGroup,
      instructor: mockInstructor,
      classroom: mockClassroom,
      period_count: 1,
      program_id: 'prog-1'
    };
    expect(isCompleteSession(session)).toBe(true);
  });

  it('returns false when instructor is null', () => {
    const session: ClassSession = {
      id: '1',
      course: mockCourse,
      group: mockGroup,
      instructor: null,
      classroom: mockClassroom,
      period_count: 1,
      program_id: 'prog-1'
    };
    expect(isCompleteSession(session)).toBe(false);
  });

  it('returns false when classroom is null', () => {
    const session: ClassSession = {
      id: '1',
      course: mockCourse,
      group: mockGroup,
      instructor: mockInstructor,
      classroom: null,
      period_count: 1,
      program_id: 'prog-1'
    };
    expect(isCompleteSession(session)).toBe(false);
  });

  it('returns false when both resources are null', () => {
    const session: ClassSession = {
      id: '1',
      course: mockCourse,
      group: mockGroup,
      instructor: null,
      classroom: null,
      period_count: 1,
      program_id: 'prog-1'
    };
    expect(isCompleteSession(session)).toBe(false);
  });
});

describe('getResourceCompletionStatus', () => {
  it('returns correct status for incomplete session', () => {
    const session: ClassSession = {
      id: '1',
      course: mockCourse,
      group: mockGroup,
      instructor: null,
      classroom: null,
      period_count: 1,
      program_id: 'prog-1'
    };
    expect(getResourceCompletionStatus(session)).toBe('incomplete');
  });

  it('returns correct status for partially complete session (instructor only)', () => {
    const session: ClassSession = {
      id: '1',
      course: mockCourse,
      group: mockGroup,
      instructor: mockInstructor,
      classroom: null,
      period_count: 1,
      program_id: 'prog-1'
    };
    expect(getResourceCompletionStatus(session)).toBe('partial');
  });

  it('returns correct status for partially complete session (classroom only)', () => {
    const session: ClassSession = {
      id: '1',
      course: mockCourse,
      group: mockGroup,
      instructor: null,
      classroom: mockClassroom,
      period_count: 1,
      program_id: 'prog-1'
    };
    expect(getResourceCompletionStatus(session)).toBe('partial');
  });

  it('returns correct status for complete session', () => {
    const session: ClassSession = {
      id: '1',
      course: mockCourse,
      group: mockGroup,
      instructor: mockInstructor,
      classroom: mockClassroom,
      period_count: 1,
      program_id: 'prog-1'
    };
    expect(getResourceCompletionStatus(session)).toBe('complete');
  });
});