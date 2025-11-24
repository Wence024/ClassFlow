import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  checkViewModeCompliant,
  getResourceChangeInfo
} from '../../src/features/program-head/schedule-class-session/utils/timetableDnd';
import { ClassSession } from '../../src/types/classSession';

// Mock data
const mockCourse = { id: 'course-1', name: 'Math 101' };
const mockGroup = { id: 'group-1', name: 'Group A' };
const mockInstructor = { id: 'instructor-1', name: 'Dr. Smith' };
const mockClassroom = { id: 'classroom-1', name: 'Room 101' };

describe('checkViewModeCompliant', () => {
  let mockSession: ClassSession;

  beforeEach(() => {
    mockSession = {
      id: 'session-1',
      course: mockCourse,
      group: mockGroup,
      instructor: mockInstructor,
      classroom: mockClassroom,
      period_count: 1,
      program_id: 'program-1'
    };
  });

  it('allows any group in class-group view', () => {
    const result = checkViewModeCompliant('class-group', mockSession, 'any-group-id');
    expect(result).toBe(true);
  });

  it('allows any group in drawer drops for resource views', () => {
    const incompleteSession = { ...mockSession, instructor: null, classroom: null };
    const result = checkViewModeCompliant('instructor', incompleteSession, 'different-group-id');
    expect(result).toBe(true);
  });

  it('allows same instructor in instructor view', () => {
    const result = checkViewModeCompliant('instructor', mockSession, 'instructor-1');
    expect(result).toBe(true);
  });

  it('allows different instructor for incomplete session in instructor view', () => {
    const incompleteSession = { ...mockSession, instructor: null };
    const result = checkViewModeCompliant('instructor', incompleteSession, 'instructor-2');
    expect(result).toBe(true);
  });

  it('allows same classroom in classroom view', () => {
    const result = checkViewModeCompliant('classroom', mockSession, 'classroom-1');
    expect(result).toBe(true);
  });

  it('allows different classroom for incomplete session in classroom view', () => {
    const incompleteSession = { ...mockSession, classroom: null };
    const result = checkViewModeCompliant('classroom', incompleteSession, 'classroom-2');
    expect(result).toBe(true);
  });
});

describe('getResourceChangeInfo', () => {
  it('detects instructor reassignment', () => {
    const session = {
      id: 'session-1',
      instructor: { id: 'instructor-1', name: 'Dr. Smith' },
      classroom: { id: 'classroom-1', name: 'Room 101' }
    };
    
    const result = getResourceChangeInfo(session, 'instructor', 'instructor-2', 'Dr. Jones');
    
    expect(result).toEqual({
      isChanging: true,
      resourceType: 'instructor',
      fromName: 'Dr. Smith',
      toName: 'Dr. Jones',
      fromId: 'instructor-1',
      toId: 'instructor-2'
    });
  });

  it('detects classroom reassignment', () => {
    const session = {
      id: 'session-1',
      instructor: { id: 'instructor-1', name: 'Dr. Smith' },
      classroom: { id: 'classroom-1', name: 'Room 101' }
    };
    
    const result = getResourceChangeInfo(session, 'classroom', 'classroom-2', 'Room 202');
    
    expect(result).toEqual({
      isChanging: true,
      resourceType: 'classroom',
      fromName: 'Room 101',
      toName: 'Room 202',
      fromId: 'classroom-1',
      toId: 'classroom-2'
    });
  });

  it('returns null for no change', () => {
    const session = {
      id: 'session-1',
      instructor: { id: 'instructor-1', name: 'Dr. Smith' },
      classroom: { id: 'classroom-1', name: 'Room 101' }
    };
    
    const result = getResourceChangeInfo(session, 'instructor', 'instructor-1', 'Dr. Smith');
    
    expect(result).toBeNull();
  });

  it('detects first-time resource assignment', () => {
    const session = {
      id: 'session-1',
      instructor: null,
      classroom: { id: 'classroom-1', name: 'Room 101' }
    };
    
    const result = getResourceChangeInfo(session, 'instructor', 'instructor-1', 'Dr. Smith');
    
    expect(result).toEqual({
      isChanging: true,
      resourceType: 'instructor',
      fromName: 'Unassigned',
      toName: 'Dr. Smith',
      fromId: null,
      toId: 'instructor-1'
    });
  });
});