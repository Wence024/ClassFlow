import { describe, it, expect } from 'vitest';
import { 
  buildTimetableGrid, 
  buildTimetableGridForClassGroups,
  buildTimetableGridForClassrooms,
  buildTimetableGridForInstructors
} from '../timetableLogic';

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
  created_at: MOCK_CREATED_AT,
  color: '#db2777',
  program_id: 'p1',
  created_by: MOCK_USER_ID,
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
  created_at: MOCK_CREATED_AT,
  color: '#ffffff',
  program_id: 'p1',
  created_by: 'user1',
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

describe('buildTimetableGridForClassGroups', () => {
  const totalPeriods = 16;
  it('should create an empty grid if no groups are provided', () => {
    const grid = buildTimetableGridForClassGroups([], [], totalPeriods);
    expect(grid.size).toBe(0);
  });

  it('should create a grid with empty rows for all class groups when there are no assignments', () => {
    const groups = [mockGroup1, mockGroup2];
    const grid = buildTimetableGridForClassGroups([], groups, totalPeriods);

    expect(grid.size).toBe(2);
    expect(grid.has('group1')).toBe(true);
    expect(grid.get('group1')?.length).toBe(totalPeriods);
    expect(grid.get('group1')?.every((cell) => cell === null)).toBe(true);
    expect(grid.get('group2')?.every((cell) => cell === null)).toBe(true);
  });

  it('should correctly place single-session assignments into the grid', () => {
    const groups = [mockGroup1, mockGroup2];
    const assignments = [mockAssignment1, mockAssignment2];
    const grid = buildTimetableGridForClassGroups(assignments, groups, totalPeriods);

    // Expect cell to contain an array with the single session
    expect(grid.get('group1')?.[0]).toEqual([mockClassSession1]);
    expect(grid.get('group1')?.[1]).toBeNull();

    expect(grid.get('group2')?.[3]).toEqual([mockClassSession2]);
    expect(grid.get('group2')?.[4]).toBeNull();
  });

  it('should handle assignments for groups that might not be in the group list (graceful handling)', () => {
    const groups = [mockGroup1]; // mockGroup2 is not in this list
    const assignments = [mockAssignment1, mockAssignment2];
    const grid = buildTimetableGridForClassGroups(assignments, groups, totalPeriods);

    expect(grid.size).toBe(1);
    expect(grid.has('group1')).toBe(true);
    expect(grid.has('group2')).toBe(false); // Grid should not have a row for group2
    expect(grid.get('group1')?.[0]).toEqual([mockClassSession1]);
  });

  it('should create a "dense" grid for multi-period class sessions', () => {
    const groups = [mockGroup1];
    const assignments = [mockMultiPeriodAssignment];
    const totalPeriods = 10;
    const grid = buildTimetableGridForClassGroups(assignments, groups, totalPeriods);
    const group1Row = grid.get('group1');

    const expectedCellContent = [mockMultiPeriodSession];
    expect(group1Row?.[5]).toEqual(expectedCellContent);
    expect(group1Row?.[6]).toEqual(expectedCellContent);

    // Also check that the same array instance is used
    expect(group1Row?.[5]).toBe(group1Row?.[6]);

    expect(group1Row?.[4]).toBeNull();
    expect(group1Row?.[7]).toBeNull();
  });

  describe('Class Merging Logic', () => {
    it('should merge two sessions with the same course, instructor, and classroom', () => {
      // ARRANGE
      const totalPeriods = 10;
      const mergeableSession1: ClassSession = {
        id: 'merge_session1',
        course: mockCourse,
        instructor: mockInstructor,
        classroom: mockClassroom,
        group: mockGroup1,
        period_count: 2,
        program_id: 'p1',
      };

      const mergeableSession2: ClassSession = {
        id: 'merge_session2',
        course: mockCourse, // Same course
        instructor: mockInstructor, // Same instructor
        classroom: mockClassroom, // Same classroom
        group: mockGroup2, // Different group
        period_count: 2,
        program_id: 'p1',
      };

      const assignment1: HydratedTimetableAssignment = {
        id: 'merge_assign1',
        class_group_id: mockGroup1.id,
        period_index: 2,
        class_session: mergeableSession1,
        user_id: 'user1',
        created_at: '',
        semester_id: 'sem1',
      };

      const assignment2: HydratedTimetableAssignment = {
        id: 'merge_assign2',
        class_group_id: mockGroup2.id,
        period_index: 2, // Same period index
        class_session: mergeableSession2,
        user_id: 'user1',
        created_at: '',
        semester_id: 'sem1',
      };

      const assignments = [assignment1, assignment2];
      const groups = [mockGroup1, mockGroup2];

      // ACT
      const grid = buildTimetableGridForClassGroups(assignments, groups, totalPeriods);

      // ASSERT
      const group1Row = grid.get(mockGroup1.id);
      const group2Row = grid.get(mockGroup2.id);

      // 1. Check that the cell contains an array with both sessions
      const cellContent = group1Row?.[2];
      expect(cellContent).toBeInstanceOf(Array);
      expect(cellContent).toHaveLength(2);
      // Check if the array contains the correct sessions (order might not be guaranteed)
      expect(cellContent).toEqual(expect.arrayContaining([mergeableSession1, mergeableSession2]));

      // 2. Check that sessions are correctly placed for both groups
      const group1Cell = group1Row?.[2];
      const group2Cell = group2Row?.[2];
      expect(group1Cell).toEqual(expect.arrayContaining([mergeableSession1, mergeableSession2]));
      expect(group2Cell).toEqual(expect.arrayContaining([mergeableSession1, mergeableSession2]));

      // 3. Check that the session spans correctly for both groups, maintaining instance per-row
      expect(group1Row?.[3]).toBe(group1Cell); // Spanned cell should be same instance for row 1
      expect(group2Row?.[3]).toBe(group2Cell); // Spanned cell should be same instance for row 2
      expect(group1Cell).not.toBe(group2Cell); // Instances should be different between groups

      // 4. Check that other cells are null
      expect(group1Row?.[1]).toBeNull();
      expect(group1Row?.[4]).toBeNull();
      expect(group2Row?.[1]).toBeNull();
      expect(group2Row?.[4]).toBeNull();
    });

    it('should not merge sessions with different courses', () => {
      // ARRANGE
      const totalPeriods = 10;
      const session1: ClassSession = {
        id: 's1',
        course: mockCourse, // Course A
        instructor: mockInstructor,
        classroom: mockClassroom,
        group: mockGroup1,
        period_count: 1,
        program_id: 'p1',
      };
      const differentCourse: Course = { ...mockCourse, id: 'course2', name: 'Different Course', code: 'C102' };
      const session2: ClassSession = {
        id: 's2',
        course: differentCourse, // Course B
        instructor: mockInstructor,
        classroom: mockClassroom,
        group: mockGroup2,
        period_count: 1,
        program_id: 'p1',
      };
      const assignment1: HydratedTimetableAssignment = {
        id: 'a1',
        class_group_id: 'group1',
        period_index: 0,
        class_session: session1,
        user_id: 'u1',
        created_at: '',
        semester_id: 's1',
      };
      const assignment2: HydratedTimetableAssignment = {
        id: 'a2',
        class_group_id: 'group2',
        period_index: 0,
        class_session: session2,
        user_id: 'u1',
        created_at: '',
        semester_id: 's1',
      };

      // ACT
      const grid = buildTimetableGridForClassGroups([assignment1, assignment2], [mockGroup1, mockGroup2], totalPeriods);

      // ASSERT
      const group1Cell = grid.get('group1')?.[0];
      const group2Cell = grid.get('group2')?.[0];

      expect(group1Cell).toEqual([session1]);
      expect(group2Cell).toEqual([session2]);
      expect(group1Cell).not.toBe(group2Cell);
    });
  });
});
