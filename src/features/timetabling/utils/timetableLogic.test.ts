import { describe, it, expect } from 'vitest';
import { buildTimetableGrid } from './timetableLogic';

// --- Mock Data Setup ---

// Minimal valid mocks for hydrated ClassSession
import type { Course } from '../../classSessionComponents/types/course';
import type { Instructor } from '../../classSessionComponents/types/instructor';
import type { Classroom } from '../../classSessionComponents/types/classroom';
import type { ClassSession } from '../../classSessions/classSession';
import type { ClassGroup } from '../../classSessionComponents/types';
import type { HydratedTimetableAssignment } from '../types/timetable';

const mockCourse: Course = {
  id: 'course1',
  name: 'Course 1',
  code: 'C101',
  user_id: 'user1',
  created_at: null,
};
const mockGroup1: ClassGroup = { id: 'group1', name: 'CS-1A', user_id: 'user1', created_at: '' };
const mockGroup2: ClassGroup = { id: 'group2', name: 'CS-1B', user_id: 'user1', created_at: '' };

const mockInstructor: Instructor = {
  id: 'instructor1',
  name: 'Instructor 1',
  email: 'instructor1@example.com',
  user_id: 'user1',
  created_at: null,
};
const mockClassroom: Classroom = {
  id: 'classroom1',
  name: 'Room 101',
  location: 'Building A',
  user_id: 'user1',
  created_at: null,
};

const mockClassSession1: ClassSession = {
  id: 'session1',
  course: mockCourse,
  group: mockGroup1,
  instructor: mockInstructor,
  classroom: mockClassroom,
};
const mockClassSession2: ClassSession = {
  id: 'session2',
  course: mockCourse,
  group: mockGroup2,
  instructor: mockInstructor,
  classroom: mockClassroom,
};

const mockAssignment1: HydratedTimetableAssignment = {
  id: 'assign1',
  user_id: 'user1',
  class_group_id: 'group1',
  period_index: 0,
  created_at: '',
  class_session: mockClassSession1,
};

const mockAssignment2: HydratedTimetableAssignment = {
  id: 'assign2',
  user_id: 'user1',
  class_group_id: 'group2',
  period_index: 3,
  created_at: '',
  class_session: mockClassSession2,
};

describe('buildTimetableGrid', () => {
  const totalPeriods = 16;
  it('should create an empty grid if no groups are provided', () => {
    const grid = buildTimetableGrid([], [], totalPeriods);
    expect(grid.size).toBe(0);
  });

  it('should create a grid with empty rows for all class groups when there are no assignments', () => {
    const groups = [mockGroup1, mockGroup2];
    const totalPeriods = 16;
    const grid = buildTimetableGrid([], groups, totalPeriods);

    expect(grid.size).toBe(2);
    expect(grid.has('group1')).toBe(true);
    expect(grid.get('group1')?.length).toBe(16);
    expect(grid.get('group1')?.every((cell) => cell === null)).toBe(true);
    expect(grid.get('group2')?.every((cell) => cell === null)).toBe(true);
  });

  it('should correctly place assignments into the grid', () => {
    const groups = [mockGroup1, mockGroup2];
    const assignments = [mockAssignment1, mockAssignment2];
    const totalPeriods = 16;
    const grid = buildTimetableGrid(assignments, groups, totalPeriods);

    // Check Group 1
    expect(grid.get('group1')?.[0]).toEqual(mockAssignment1.class_session);
    expect(grid.get('group1')?.[1]).toBeNull();

    // Check Group 2
    expect(grid.get('group2')?.[3]).toEqual(mockAssignment2.class_session);
    expect(grid.get('group2')?.[4]).toBeNull();
  });

  it('should handle assignments for groups that might not be in the group list (graceful handling)', () => {
    const groups = [mockGroup1]; // Only provide group1
    const assignments = [mockAssignment1, mockAssignment2]; // But have an assignment for group2
    const totalPeriods = 16;
    const grid = buildTimetableGrid(assignments, groups, totalPeriods);

    expect(grid.size).toBe(1);
    expect(grid.has('group1')).toBe(true);
    expect(grid.has('group2')).toBe(false); // group2 row is not created
    expect(grid.get('group1')?.[0]).toEqual(mockAssignment1.class_session);
  });
});
