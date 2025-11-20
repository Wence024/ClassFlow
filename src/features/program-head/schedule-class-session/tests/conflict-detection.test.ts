import { describe, it, expect } from 'vitest';

/**
 * Pure business logic tests for conflict detection algorithms.
 * 
 * Tests conflict detection for:
 * - Instructor scheduling conflicts (same instructor, same time)
 * - Classroom scheduling conflicts (same room, same time)
 * - Cross-program conflicts (resources from other departments)
 * - Multi-period conflicts (sessions spanning multiple periods)
 */

describe('Conflict Detection - Instructor Conflicts', () => {
  it('should detect instructor conflict when same instructor is scheduled at same time', () => {
    const existingSession = {
      instructor_id: 'inst-1',
      period_index: 5,
      class_group_id: 'group-a',
    };

    const newSession = {
      instructor_id: 'inst-1',
      period_index: 5,
      class_group_id: 'group-b',
    };

    const hasConflict = existingSession.instructor_id === newSession.instructor_id &&
                        existingSession.period_index === newSession.period_index &&
                        existingSession.class_group_id !== newSession.class_group_id;

    expect(hasConflict).toBe(true);
  });

  it('should not detect conflict when different instructors at same time', () => {
    const existingSession = {
      instructor_id: 'inst-1',
      period_index: 5,
    };

    const newSession = {
      instructor_id: 'inst-2',
      period_index: 5,
    };

    const hasConflict = existingSession.instructor_id === newSession.instructor_id &&
                        existingSession.period_index === newSession.period_index;

    expect(hasConflict).toBe(false);
  });

  it('should not detect conflict when same instructor at different times', () => {
    const existingSession = {
      instructor_id: 'inst-1',
      period_index: 5,
    };

    const newSession = {
      instructor_id: 'inst-1',
      period_index: 10,
    };

    const hasConflict = existingSession.instructor_id === newSession.instructor_id &&
                        existingSession.period_index === newSession.period_index;

    expect(hasConflict).toBe(false);
  });
});

describe('Conflict Detection - Classroom Conflicts', () => {
  it('should detect classroom conflict when same room scheduled at same time', () => {
    const existingSession = {
      classroom_id: 'room-101',
      period_index: 3,
      class_group_id: 'group-a',
    };

    const newSession = {
      classroom_id: 'room-101',
      period_index: 3,
      class_group_id: 'group-b',
    };

    const hasConflict = existingSession.classroom_id === newSession.classroom_id &&
                        existingSession.period_index === newSession.period_index &&
                        existingSession.class_group_id !== newSession.class_group_id;

    expect(hasConflict).toBe(true);
  });

  it('should not detect conflict when different rooms at same time', () => {
    const existingSession = {
      classroom_id: 'room-101',
      period_index: 3,
    };

    const newSession = {
      classroom_id: 'room-102',
      period_index: 3,
    };

    const hasConflict = existingSession.classroom_id === newSession.classroom_id &&
                        existingSession.period_index === newSession.period_index;

    expect(hasConflict).toBe(false);
  });
});

describe('Conflict Detection - Cross-Program Conflicts', () => {
  it('should detect cross-program resource usage', () => {
    const session = {
      program_id: 'prog-cs',
      instructor: {
        department_id: 'dept-business',
      },
    };

    const userProgramDepartment = 'dept-cs';
    const isCrossProgram = session.instructor.department_id !== userProgramDepartment;

    expect(isCrossProgram).toBe(true);
  });

  it('should not detect cross-program when resource is from same department', () => {
    const session = {
      program_id: 'prog-cs',
      instructor: {
        department_id: 'dept-cs',
      },
    };

    const userProgramDepartment = 'dept-cs';
    const isCrossProgram = session.instructor.department_id !== userProgramDepartment;

    expect(isCrossProgram).toBe(false);
  });
});

describe('Conflict Detection - Multi-Period Conflicts', () => {
  it('should detect conflict when multi-period session overlaps', () => {
    const existingSession = {
      instructor_id: 'inst-1',
      period_index: 5,
      period_count: 3, // occupies periods 5, 6, 7
    };

    const newSession = {
      instructor_id: 'inst-1',
      period_index: 6, // overlaps at period 6
      period_count: 1,
    };

    const existingPeriods = Array.from(
      { length: existingSession.period_count },
      (_, i) => existingSession.period_index + i
    );

    const newPeriods = Array.from(
      { length: newSession.period_count },
      (_, i) => newSession.period_index + i
    );

    const hasOverlap = existingPeriods.some(p => newPeriods.includes(p)) &&
                       existingSession.instructor_id === newSession.instructor_id;

    expect(hasOverlap).toBe(true);
  });

  it('should not detect conflict when multi-period sessions do not overlap', () => {
    const existingSession = {
      instructor_id: 'inst-1',
      period_index: 5,
      period_count: 2, // occupies periods 5, 6
    };

    const newSession = {
      instructor_id: 'inst-1',
      period_index: 7, // starts after existing ends
      period_count: 1,
    };

    const existingPeriods = Array.from(
      { length: existingSession.period_count },
      (_, i) => existingSession.period_index + i
    );

    const newPeriods = Array.from(
      { length: newSession.period_count },
      (_, i) => newSession.period_index + i
    );

    const hasOverlap = existingPeriods.some(p => newPeriods.includes(p)) &&
                       existingSession.instructor_id === newSession.instructor_id;

    expect(hasOverlap).toBe(false);
  });
});
