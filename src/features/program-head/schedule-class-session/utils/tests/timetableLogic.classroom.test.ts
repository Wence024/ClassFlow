import { describe, it, expect } from 'vitest';
import { buildTimetableGridForClassrooms } from '../timetableLogic';
import type { Classroom } from '../../../classSessionComponents/types/classroom';
import type { ClassSession } from '../../../classSessions/types/classSession';
import type { HydratedTimetableAssignment } from '../../types/timetable';
import type { Course } from '../../../classSessionComponents/types/course';
import type { Instructor } from '../../../classSessionComponents/types/instructor';
import type { ClassGroup } from '../../../classSessionComponents/types';

const MOCK_USER_ID = 'user1';
const MOCK_CREATED_AT = new Date().toISOString();

const mockCourse: Course = {
  id: 'course1',
  name: 'Math 101',
  code: 'MATH101',
  created_at: MOCK_CREATED_AT,
  color: '#db2777',
  program_id: 'p1',
  created_by: MOCK_USER_ID,
};

const mockInstructor: Instructor = {
  id: 'instructor1',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  created_at: MOCK_CREATED_AT,
  code: 'JD',
  color: '#ca8a04',
  prefix: null,
  suffix: null,
  phone: null,
  contract_type: null,
  created_by: MOCK_USER_ID,
  department_id: 'd1',
};

const mockGroup1: ClassGroup = {
  id: 'group1',
  name: 'CS-1A',
  user_id: MOCK_USER_ID,
  created_at: MOCK_CREATED_AT,
  code: 'CS1A',
  color: '#4f46e5',
  student_count: 25,
  program_id: 'p1',
};

const mockGroup2: ClassGroup = {
  id: 'group2',
  name: 'CS-1B',
  user_id: MOCK_USER_ID,
  created_at: MOCK_CREATED_AT,
  code: 'CS1B',
  color: '#0d9488',
  student_count: 30,
  program_id: 'p1',
};

const mockClassroom1: Classroom = {
  id: 'classroom1',
  name: 'Room 101',
  location: 'Building A',
  capacity: 30,
  created_at: MOCK_CREATED_AT,
  code: 'R101',
  color: '#65a30d',
  created_by: MOCK_USER_ID,
  preferred_department_id: null,
};

const mockClassroom2: Classroom = {
  id: 'classroom2',
  name: 'Room 202',
  location: 'Building B',
  capacity: 40,
  created_at: MOCK_CREATED_AT,
  code: 'R202',
  color: '#7c3aed',
  created_by: MOCK_USER_ID,
  preferred_department_id: null,
};

describe('buildTimetableGridForClassrooms', () => {
  const totalPeriods = 16;

  it('should create an empty grid if no classrooms are provided', () => {
    const grid = buildTimetableGridForClassrooms([], [], totalPeriods);
    expect(grid.size).toBe(0);
  });

  it('should create a grid with empty rows for all classrooms when there are no assignments', () => {
    const classrooms = [mockClassroom1, mockClassroom2];
    const grid = buildTimetableGridForClassrooms([], classrooms, totalPeriods);

    expect(grid.size).toBe(2);
    expect(grid.has('classroom1')).toBe(true);
    expect(grid.get('classroom1')?.length).toBe(totalPeriods);
    expect(grid.get('classroom1')?.every((cell) => cell === null)).toBe(true);
    expect(grid.get('classroom2')?.every((cell) => cell === null)).toBe(true);
  });

  it('should place sessions in the correct classroom row', () => {
    const session1: ClassSession = {
      id: 'session1',
      course: mockCourse,
      group: mockGroup1,
      instructor: mockInstructor,
      classroom: mockClassroom1,
      period_count: 1,
      program_id: 'p1',
    };

    const session2: ClassSession = {
      id: 'session2',
      course: mockCourse,
      group: mockGroup2,
      instructor: mockInstructor,
      classroom: mockClassroom2,
      period_count: 1,
      program_id: 'p1',
    };

    const assignment1: HydratedTimetableAssignment = {
      id: 'assign1',
      user_id: MOCK_USER_ID,
      class_group_id: 'group1',
      period_index: 0,
      created_at: MOCK_CREATED_AT,
      class_session: session1,
      semester_id: 'sem1',
    };

    const assignment2: HydratedTimetableAssignment = {
      id: 'assign2',
      user_id: MOCK_USER_ID,
      class_group_id: 'group2',
      period_index: 3,
      created_at: MOCK_CREATED_AT,
      class_session: session2,
      semester_id: 'sem1',
    };

    const classrooms = [mockClassroom1, mockClassroom2];
    const assignments = [assignment1, assignment2];
    const grid = buildTimetableGridForClassrooms(assignments, classrooms, totalPeriods);

    expect(grid.get('classroom1')?.[0]).toEqual([session1]);
    expect(grid.get('classroom2')?.[3]).toEqual([session2]);
  });

  it('should merge sessions with the same classroom, course, and instructor', () => {
    const session1: ClassSession = {
      id: 'session1',
      course: mockCourse,
      group: mockGroup1,
      instructor: mockInstructor,
      classroom: mockClassroom1,
      period_count: 2,
      program_id: 'p1',
    };

    const session2: ClassSession = {
      id: 'session2',
      course: mockCourse,
      group: mockGroup2,
      instructor: mockInstructor,
      classroom: mockClassroom1,
      period_count: 2,
      program_id: 'p1',
    };

    const assignment1: HydratedTimetableAssignment = {
      id: 'assign1',
      user_id: MOCK_USER_ID,
      class_group_id: 'group1',
      period_index: 2,
      created_at: MOCK_CREATED_AT,
      class_session: session1,
      semester_id: 'sem1',
    };

    const assignment2: HydratedTimetableAssignment = {
      id: 'assign2',
      user_id: MOCK_USER_ID,
      class_group_id: 'group2',
      period_index: 2,
      created_at: MOCK_CREATED_AT,
      class_session: session2,
      semester_id: 'sem1',
    };

    const classrooms = [mockClassroom1, mockClassroom2];
    const assignments = [assignment1, assignment2];
    const grid = buildTimetableGridForClassrooms(assignments, classrooms, totalPeriods);

    const classroom1Row = grid.get('classroom1');
    const cellContent = classroom1Row?.[2];

    expect(cellContent).toBeInstanceOf(Array);
    expect(cellContent).toHaveLength(2);
    expect(cellContent).toEqual(expect.arrayContaining([session1, session2]));

    // Check spanning
    expect(classroom1Row?.[3]).toBe(cellContent);
    expect(classroom1Row?.[1]).toBeNull();
    expect(classroom1Row?.[4]).toBeNull();
  });

  it('should handle multi-period sessions correctly', () => {
    const session: ClassSession = {
      id: 'session1',
      course: mockCourse,
      group: mockGroup1,
      instructor: mockInstructor,
      classroom: mockClassroom1,
      period_count: 3,
      program_id: 'p1',
    };

    const assignment: HydratedTimetableAssignment = {
      id: 'assign1',
      user_id: MOCK_USER_ID,
      class_group_id: 'group1',
      period_index: 5,
      created_at: MOCK_CREATED_AT,
      class_session: session,
      semester_id: 'sem1',
    };

    const classrooms = [mockClassroom1];
    const grid = buildTimetableGridForClassrooms([assignment], classrooms, totalPeriods);

    const classroom1Row = grid.get('classroom1');
    const expectedCell = [session];

    expect(classroom1Row?.[5]).toEqual(expectedCell);
    expect(classroom1Row?.[6]).toEqual(expectedCell);
    expect(classroom1Row?.[7]).toEqual(expectedCell);
    expect(classroom1Row?.[5]).toBe(classroom1Row?.[6]);
    expect(classroom1Row?.[6]).toBe(classroom1Row?.[7]);
    expect(classroom1Row?.[4]).toBeNull();
    expect(classroom1Row?.[8]).toBeNull();
  });
});
