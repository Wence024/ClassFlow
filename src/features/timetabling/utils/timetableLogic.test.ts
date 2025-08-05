import { describe, it, expect } from 'vitest';
import { buildTimetableGrid } from './timetableLogic';

// --- Mock Data Setup ---

// Minimal valid mocks for hydrated ClassSession
import type { Course } from '../../classComponents/types/course';
import type { Instructor } from '../../classComponents/types/instructor';
import type { Classroom } from '../../classComponents/types/classroom';
import type { ClassSession } from '../../classes/classSession';
import type { ClassGroup, HydratedTimetableAssignment } from '../../scheduleLessons/types';

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

const mockSession1: ClassSession = {
  id: 'session1',
  course: mockCourse,
  group: mockGroup1,
  instructor: mockInstructor,
  classroom: mockClassroom,
};
const mockSession2: ClassSession = {
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
  class_session: mockSession1,
};

const mockAssignment2: HydratedTimetableAssignment = {
  id: 'assign2',
  user_id: 'user1',
  class_group_id: 'group2',
  period_index: 3,
  created_at: '',
  class_session: mockSession2,
};

describe('buildTimetableGrid', () => {
  it('should create an empty grid if no groups are provided', () => {
    const grid = buildTimetableGrid([], []);
    expect(grid.size).toBe(0);
  });

  it('should create a grid with empty rows for all class groups when there are no assignments', () => {
    const groups = [mockGroup1, mockGroup2];
    const grid = buildTimetableGrid([], groups);

    expect(grid.size).toBe(2);
    expect(grid.has('group1')).toBe(true);
    expect(grid.get('group1')?.length).toBe(16);
    expect(grid.get('group1')?.every((cell) => cell === null)).toBe(true);
    expect(grid.get('group2')?.every((cell) => cell === null)).toBe(true);
  });

  it('should correctly place assignments into the grid', () => {
    const groups = [mockGroup1, mockGroup2];
    const assignments = [mockAssignment1, mockAssignment2];
    const grid = buildTimetableGrid(assignments, groups);

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
    const grid = buildTimetableGrid(assignments, groups);

    expect(grid.size).toBe(1);
    expect(grid.has('group1')).toBe(true);
    expect(grid.has('group2')).toBe(false); // group2 row is not created
    expect(grid.get('group1')?.[0]).toEqual(mockAssignment1.class_session);
  });
});
