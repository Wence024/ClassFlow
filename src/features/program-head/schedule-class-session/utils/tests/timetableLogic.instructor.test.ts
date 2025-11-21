import { describe, it, expect } from 'vitest';
import { buildTimetableGridForInstructors } from '../timetableLogic';
import type { Instructor } from '../../../classSessionComponents/types/instructor';
import type { ClassSession } from '../../../classSessions/types/classSession';
import type { HydratedTimetableAssignment } from '../../types/timetable';
import type { Course } from '../../../classSessionComponents/types/course';
import type { Classroom } from '../../../classSessionComponents/types/classroom';
import type { ClassGroup } from '../../../classSessionComponents/types';

const MOCK_USER_ID = 'user1';
const MOCK_CREATED_AT = new Date().toISOString();

const mockCourse: Course = {
  id: 'course1',
  name: 'Physics 101',
  code: 'PHYS101',
  created_at: MOCK_CREATED_AT,
  color: '#db2777',
  program_id: 'p1',
  created_by: MOCK_USER_ID,
};

const mockInstructor1: Instructor = {
  id: 'instructor1',
  first_name: 'Jane',
  last_name: 'Smith',
  email: 'jane.smith@example.com',
  created_at: MOCK_CREATED_AT,
  code: 'JS',
  color: '#ca8a04',
  prefix: 'Dr.',
  suffix: null,
  phone: null,
  contract_type: 'Full-time',
  created_by: MOCK_USER_ID,
  department_id: 'd1',
};

const mockInstructor2: Instructor = {
  id: 'instructor2',
  first_name: 'Bob',
  last_name: 'Johnson',
  email: 'bob.johnson@example.com',
  created_at: MOCK_CREATED_AT,
  code: 'BJ',
  color: '#7c3aed',
  prefix: 'Prof.',
  suffix: null,
  phone: null,
  contract_type: 'Part-time',
  created_by: MOCK_USER_ID,
  department_id: 'd1',
};

const mockGroup1: ClassGroup = {
  id: 'group1',
  name: 'IT-1A',
  user_id: MOCK_USER_ID,
  created_at: MOCK_CREATED_AT,
  code: 'IT1A',
  color: '#4f46e5',
  student_count: 25,
  program_id: 'p1',
};

const mockGroup2: ClassGroup = {
  id: 'group2',
  name: 'IT-1B',
  user_id: MOCK_USER_ID,
  created_at: MOCK_CREATED_AT,
  code: 'IT1B',
  color: '#0d9488',
  student_count: 30,
  program_id: 'p1',
};

const mockClassroom: Classroom = {
  id: 'classroom1',
  name: 'Lab 301',
  location: 'Building C',
  capacity: 35,
  created_at: MOCK_CREATED_AT,
  code: 'L301',
  color: '#65a30d',
  created_by: MOCK_USER_ID,
  preferred_department_id: null,
};

describe('buildTimetableGridForInstructors', () => {
  const totalPeriods = 16;

  it('should create an empty grid if no instructors are provided', () => {
    const grid = buildTimetableGridForInstructors([], [], totalPeriods);
    expect(grid.size).toBe(0);
  });

  it('should create a grid with empty rows for all instructors when there are no assignments', () => {
    const instructors = [mockInstructor1, mockInstructor2];
    const grid = buildTimetableGridForInstructors([], instructors, totalPeriods);

    expect(grid.size).toBe(2);
    expect(grid.has('instructor1')).toBe(true);
    expect(grid.get('instructor1')?.length).toBe(totalPeriods);
    expect(grid.get('instructor1')?.every((cell) => cell === null)).toBe(true);
    expect(grid.get('instructor2')?.every((cell) => cell === null)).toBe(true);
  });

  it('should place sessions in the correct instructor row', () => {
    const session1: ClassSession = {
      id: 'session1',
      course: mockCourse,
      group: mockGroup1,
      instructor: mockInstructor1,
      classroom: mockClassroom,
      period_count: 1,
      program_id: 'p1',
    };

    const session2: ClassSession = {
      id: 'session2',
      course: mockCourse,
      group: mockGroup2,
      instructor: mockInstructor2,
      classroom: mockClassroom,
      period_count: 1,
      program_id: 'p1',
    };

    const assignment1: HydratedTimetableAssignment = {
      id: 'assign1',
      user_id: MOCK_USER_ID,
      class_group_id: 'group1',
      period_index: 1,
      created_at: MOCK_CREATED_AT,
      class_session: session1,
      semester_id: 'sem1',
    };

    const assignment2: HydratedTimetableAssignment = {
      id: 'assign2',
      user_id: MOCK_USER_ID,
      class_group_id: 'group2',
      period_index: 4,
      created_at: MOCK_CREATED_AT,
      class_session: session2,
      semester_id: 'sem1',
    };

    const instructors = [mockInstructor1, mockInstructor2];
    const assignments = [assignment1, assignment2];
    const grid = buildTimetableGridForInstructors(assignments, instructors, totalPeriods);

    expect(grid.get('instructor1')?.[1]).toEqual([session1]);
    expect(grid.get('instructor2')?.[4]).toEqual([session2]);
  });

  it('should merge sessions with the same instructor, course, and classroom', () => {
    const session1: ClassSession = {
      id: 'session1',
      course: mockCourse,
      group: mockGroup1,
      instructor: mockInstructor1,
      classroom: mockClassroom,
      period_count: 2,
      program_id: 'p1',
    };

    const session2: ClassSession = {
      id: 'session2',
      course: mockCourse,
      group: mockGroup2,
      instructor: mockInstructor1,
      classroom: mockClassroom,
      period_count: 2,
      program_id: 'p1',
    };

    const assignment1: HydratedTimetableAssignment = {
      id: 'assign1',
      user_id: MOCK_USER_ID,
      class_group_id: 'group1',
      period_index: 8,
      created_at: MOCK_CREATED_AT,
      class_session: session1,
      semester_id: 'sem1',
    };

    const assignment2: HydratedTimetableAssignment = {
      id: 'assign2',
      user_id: MOCK_USER_ID,
      class_group_id: 'group2',
      period_index: 8,
      created_at: MOCK_CREATED_AT,
      class_session: session2,
      semester_id: 'sem1',
    };

    const instructors = [mockInstructor1, mockInstructor2];
    const assignments = [assignment1, assignment2];
    const grid = buildTimetableGridForInstructors(assignments, instructors, totalPeriods);

    const instructor1Row = grid.get('instructor1');
    const cellContent = instructor1Row?.[8];

    expect(cellContent).toBeInstanceOf(Array);
    expect(cellContent).toHaveLength(2);
    expect(cellContent).toEqual(expect.arrayContaining([session1, session2]));

    // Check spanning
    expect(instructor1Row?.[9]).toBe(cellContent);
    expect(instructor1Row?.[7]).toBeNull();
    expect(instructor1Row?.[10]).toBeNull();
  });

  it('should handle multi-period sessions correctly', () => {
    const session: ClassSession = {
      id: 'session1',
      course: mockCourse,
      group: mockGroup1,
      instructor: mockInstructor1,
      classroom: mockClassroom,
      period_count: 4,
      program_id: 'p1',
    };

    const assignment: HydratedTimetableAssignment = {
      id: 'assign1',
      user_id: MOCK_USER_ID,
      class_group_id: 'group1',
      period_index: 10,
      created_at: MOCK_CREATED_AT,
      class_session: session,
      semester_id: 'sem1',
    };

    const instructors = [mockInstructor1];
    const grid = buildTimetableGridForInstructors([assignment], instructors, totalPeriods);

    const instructor1Row = grid.get('instructor1');
    const expectedCell = [session];

    expect(instructor1Row?.[10]).toEqual(expectedCell);
    expect(instructor1Row?.[11]).toEqual(expectedCell);
    expect(instructor1Row?.[12]).toEqual(expectedCell);
    expect(instructor1Row?.[13]).toEqual(expectedCell);
    expect(instructor1Row?.[10]).toBe(instructor1Row?.[11]);
    expect(instructor1Row?.[11]).toBe(instructor1Row?.[12]);
    expect(instructor1Row?.[12]).toBe(instructor1Row?.[13]);
    expect(instructor1Row?.[9]).toBeNull();
    expect(instructor1Row?.[14]).toBeNull();
  });
});
