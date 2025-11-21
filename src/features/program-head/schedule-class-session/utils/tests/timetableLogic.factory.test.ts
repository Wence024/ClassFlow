import { describe, it, expect } from 'vitest';
import { buildTimetableGrid } from '../timetableLogic';
import type { ClassGroup, Classroom, Instructor } from '../../../classSessionComponents/types';
import type { ClassSession } from '../../../classSessions/types/classSession';
import type { HydratedTimetableAssignment } from '../../types/timetable';
import type { Course } from '../../../classSessionComponents/types/course';

const MOCK_USER_ID = 'user1';
const MOCK_CREATED_AT = new Date().toISOString();

const mockCourse: Course = {
  id: 'course1',
  name: 'Test Course',
  code: 'TEST101',
  created_at: MOCK_CREATED_AT,
  color: '#db2777',
  program_id: 'p1',
  created_by: MOCK_USER_ID,
};

const mockGroup: ClassGroup = {
  id: 'group1',
  name: 'Group A',
  user_id: MOCK_USER_ID,
  created_at: MOCK_CREATED_AT,
  code: 'GA',
  color: '#4f46e5',
  student_count: 25,
  program_id: 'p1',
};

const mockClassroom: Classroom = {
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

const mockInstructor: Instructor = {
  id: 'instructor1',
  first_name: 'Test',
  last_name: 'Instructor',
  email: 'test@example.com',
  created_at: MOCK_CREATED_AT,
  code: 'TI',
  color: '#ca8a04',
  prefix: null,
  suffix: null,
  phone: null,
  contract_type: null,
  created_by: MOCK_USER_ID,
  department_id: 'd1',
};

const mockSession: ClassSession = {
  id: 'session1',
  course: mockCourse,
  group: mockGroup,
  instructor: mockInstructor,
  classroom: mockClassroom,
  period_count: 1,
  program_id: 'p1',
};

const mockAssignment: HydratedTimetableAssignment = {
  id: 'assign1',
  user_id: MOCK_USER_ID,
  class_group_id: 'group1',
  period_index: 0,
  created_at: MOCK_CREATED_AT,
  class_session: mockSession,
  semester_id: 'sem1',
};

describe('buildTimetableGrid (factory function)', () => {
  const totalPeriods = 16;

  it('should build class-group view grid by default', () => {
    const grid = buildTimetableGrid([mockAssignment], 'class-group', [mockGroup], totalPeriods);

    expect(grid.size).toBe(1);
    expect(grid.has('group1')).toBe(true);
    expect(grid.get('group1')?.[0]).toEqual([mockSession]);
  });

  it('should build classroom view grid when viewMode is classroom', () => {
    const grid = buildTimetableGrid([mockAssignment], 'classroom', [mockClassroom], totalPeriods);

    expect(grid.size).toBe(1);
    expect(grid.has('classroom1')).toBe(true);
    expect(grid.get('classroom1')?.[0]).toEqual([mockSession]);
  });

  it('should build instructor view grid when viewMode is instructor', () => {
    const grid = buildTimetableGrid([mockAssignment], 'instructor', [mockInstructor], totalPeriods);

    expect(grid.size).toBe(1);
    expect(grid.has('instructor1')).toBe(true);
    expect(grid.get('instructor1')?.[0]).toEqual([mockSession]);
  });

  it('should handle empty resources for all view modes', () => {
    const gridClassGroup = buildTimetableGrid([], 'class-group', [], totalPeriods);
    const gridClassroom = buildTimetableGrid([], 'classroom', [], totalPeriods);
    const gridInstructor = buildTimetableGrid([], 'instructor', [], totalPeriods);

    expect(gridClassGroup.size).toBe(0);
    expect(gridClassroom.size).toBe(0);
    expect(gridInstructor.size).toBe(0);
  });
});
