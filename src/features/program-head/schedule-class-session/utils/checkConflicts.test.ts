import { describe, it, expect } from 'vitest';
import { checkTimetableConflicts } from '../../src/features/program-head/schedule-class-session/utils/checkConflicts';
import { ClassSession } from '../../src/types/classSession';

// Mock data
const mockCourse = { id: 'course-1', name: 'Math 101' };
const mockGroup = { id: 'group-1', name: 'Group A' };
const mockInstructor = { id: 'instructor-1', name: 'Dr. Smith' };
const mockClassroom = { id: 'classroom-1', name: 'Room 101' };

// Mock timetable structure
const mockTimetable = new Map();

describe('checkTimetableConflicts', () => {
  it('does not check instructor conflicts when instructor is null', () => {
    const session: ClassSession = {
      id: 'session-1',
      course: mockCourse,
      group: mockGroup,
      instructor: null,  // No instructor assigned
      classroom: mockClassroom,
      period_count: 1,
      program_id: 'program-1'
    };
    
    // This should not fail due to instructor conflicts since instructor is null
    const conflicts = checkTimetableConflicts(
      session,
      mockTimetable,
      'classroom',  // target view
      'class-group', // source view
      false // allowResourceChanges
    );
    
    // We expect no instructor conflicts since instructor is null
    const instructorConflicts = conflicts.filter(conflict => 
      conflict.type === 'instructor_availability'
    );
    expect(instructorConflicts.length).toBe(0);
  });

  it('does not check classroom conflicts when classroom is null', () => {
    const session: ClassSession = {
      id: 'session-1',
      course: mockCourse,
      group: mockGroup,
      instructor: mockInstructor,
      classroom: null,  // No classroom assigned
      period_count: 1,
      program_id: 'program-1'
    };
    
    // This should not fail due to classroom conflicts since classroom is null
    const conflicts = checkTimetableConflicts(
      session,
      mockTimetable,
      'instructor',  // target view
      'class-group', // source view
      false // allowResourceChanges
    );
    
    // We expect no classroom conflicts since classroom is null
    const classroomConflicts = conflicts.filter(conflict => 
      conflict.type === 'classroom_availability'
    );
    expect(classroomConflicts.length).toBe(0);
  });

  it('allows resource changes when allowResourceChanges is true', () => {
    const session: ClassSession = {
      id: 'session-1',
      course: mockCourse,
      group: mockGroup,
      instructor: mockInstructor,
      classroom: mockClassroom,
      period_count: 1,
      program_id: 'program-1'
    };
    
    // In resource views, with allowResourceChanges=true, should not have resource mismatch conflicts
    const conflicts = checkTimetableConflicts(
      session,
      mockTimetable,
      'instructor',  // target view
      'class-group', // source view
      true // allowResourceChanges
    );
    
    // We expect no resource mismatch conflicts with allowResourceChanges=true
    const mismatchConflicts = conflicts.filter(conflict => 
      conflict.type === 'resource_mismatch'
    );
    expect(mismatchConflicts.length).toBe(0);
  });
});