import { describe, it, expect } from 'vitest';
import { buildTimetableGrid } from '../timetableLogic';

// --- Mock Data Setup ---

import type { Course } from '../../../classSessionComponents/types/course';
import type { Instructor } from '../../../classSessionComponents/types/instructor';
import type { Classroom } from '../../../classSessionComponents/types/classroom';
import type { ClassSession } from '../../../classSessions/types/classSession';
import type { ClassGroup } from '../../../classSessionComponents/types';
import type { HydratedTimetableAssignment } from '../../types/timetable';

const MOCK_USER_ID = 'user1';
const MOCK_CREATED_AT = new Date().toISOString();

const mockCourse: Course = {
  id: 'course1',
  name: 'Course 1',
  code: 'C101',
  user_id: MOCK_USER_ID,
  created_at: MOCK_CREATED_AT,
  color: '#db2777',
  program_id: 'p1',
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

const mockInstructor: Instructor = {
  id: 'instructor1',

  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  user_id: MOCK_USER_ID,
  created_at: MOCK_CREATED_AT,

  code: 'JD',
  color: '#ca8a04',
  prefix: null,
  suffix: null,
  phone: null,
  contract_type: null,
  program_id: 'p1',
};

const mockClassroom: Classroom = {
  id: 'classroom1',
  name: 'Room 101',
  location: 'Building A',
  capacity: 30,
  user_id: MOCK_USER_ID,
  created_at: MOCK_CREATED_AT,
  code: 'R101',
  color: '#65a30d',
  program_id: 'p1',
};

const mockClassSession1: ClassSession = {
  id: 'session1',
  course: mockCourse,
  group: mockGroup1,
  instructor: mockInstructor,
  classroom: mockClassroom,
  period_count: 1,
  program_id: mockGroup1.program_id,
};

const mockClassSession2: ClassSession = {
  id: 'session2',
  course: mockCourse,
  group: mockGroup2,
  instructor: mockInstructor,
  classroom: mockClassroom,
  period_count: 1,
  program_id: mockGroup2.program_id,
};

// --- (No changes needed for the rest of the file from here) ---

const mockAssignment1: HydratedTimetableAssignment = {
  id: 'assign1',
  user_id: 'user1',
  class_group_id: 'group1',
  period_index: 0,
  created_at: '',
  class_session: mockClassSession1,
  semester_id: 'sem1',
};

const mockAssignment2: HydratedTimetableAssignment = {
  id: 'assign2',
  user_id: 'user1',
  class_group_id: 'group2',
  period_index: 3,
  created_at: '',
  class_session: mockClassSession2,
  semester_id: 'sem1',
};

const mockMultiPeriodCourse: Course = {
  id: 'course-multi',
  name: 'Multi-Period Course',
  code: 'MP202',
  user_id: 'user1',
  created_at: MOCK_CREATED_AT,
  color: '#ffffff',
  program_id: 'p1',
};

const mockMultiPeriodSession: ClassSession = {
  id: 'session-multi',
  course: mockMultiPeriodCourse,
  group: mockGroup1,
  instructor: mockInstructor,
  classroom: mockClassroom,
  period_count: 2,
  program_id: mockGroup1.program_id,
};

const mockMultiPeriodAssignment: HydratedTimetableAssignment = {
  id: 'assign-multi',
  user_id: 'user1',
  class_group_id: 'group1',
  period_index: 5,
  created_at: '',
  class_session: mockMultiPeriodSession,
  semester_id: 'sem1',
};

describe('buildTimetableGrid', () => {
  const totalPeriods = 16;
  it('should create an empty grid if no groups are provided', () => {
    const grid = buildTimetableGrid([], [], totalPeriods);
    expect(grid.size).toBe(0);
  });

  it('should create a grid with empty rows for all class groups when there are no assignments', () => {
    const groups = [mockGroup1, mockGroup2];
    const grid = buildTimetableGrid([], groups, totalPeriods);

    expect(grid.size).toBe(2);
    expect(grid.has('group1')).toBe(true);
    expect(grid.get('group1')?.length).toBe(totalPeriods);
    expect(grid.get('group1')?.every((cell) => cell === null)).toBe(true);
    expect(grid.get('group2')?.every((cell) => cell === null)).toBe(true);
  });

  it('should correctly place assignments into the grid', () => {
    const groups = [mockGroup1, mockGroup2];
    const assignments = [mockAssignment1, mockAssignment2];
    const grid = buildTimetableGrid(assignments, groups, totalPeriods);

    expect(grid.get('group1')?.[0]).toEqual(mockAssignment1.class_session);
    expect(grid.get('group1')?.[1]).toBeNull();

    expect(grid.get('group2')?.[3]).toEqual(mockAssignment2.class_session);
    expect(grid.get('group2')?.[4]).toBeNull();
  });

  it('should handle assignments for groups that might not be in the group list (graceful handling)', () => {
    const groups = [mockGroup1];
    const assignments = [mockAssignment1, mockAssignment2];
    const grid = buildTimetableGrid(assignments, groups, totalPeriods);

    expect(grid.size).toBe(1);
    expect(grid.has('group1')).toBe(true);
    expect(grid.has('group2')).toBe(false);
    expect(grid.get('group1')?.[0]).toEqual(mockAssignment1.class_session);
  });

  it('should create a "dense" grid for multi-period class sessions', () => {
    const groups = [mockGroup1];
    const assignments = [mockMultiPeriodAssignment];
    const totalPeriods = 10;
    const grid = buildTimetableGrid(assignments, groups, totalPeriods);
    const group1Row = grid.get('group1');

    expect(group1Row?.[5]).toEqual(mockMultiPeriodSession);
    expect(group1Row?.[6]).toEqual(mockMultiPeriodSession);
    expect(group1Row?.[4]).toBeNull();
    expect(group1Row?.[7]).toBeNull();
  });
});
