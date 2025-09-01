import { describe, it, expect, beforeEach } from 'vitest';
import checkConflicts, { type TimetableGrid } from '../checkConflicts';
import type {
  Instructor,
  Classroom,
  ClassGroup,
  Course,
} from '../../../classSessionComponents/types';
import type { ClassSession } from '../../../classSessions/types/classSession';
import type { ScheduleConfig } from '../../../scheduleConfig/types/scheduleConfig';

// --- FIXED: Updated Mock Data Setup ---
const MOCK_USER_ID = 'user-mock-123';
const MOCK_CREATED_AT = new Date().toISOString();

// Mock Settings (no changes needed)
const mockSettings: ScheduleConfig = {
  id: 'settings1',
  created_at: MOCK_CREATED_AT,
  periods_per_day: 4,
  class_days_per_week: 5,
  start_time: '09:00',
  period_duration_mins: 90,
};
const totalPeriods = mockSettings.periods_per_day * mockSettings.class_days_per_week;

// FIXED: Instructors now have the full set of properties
const mockInstructor1: Instructor = {
  id: 'inst1',
  first_name: 'Jerry',
  last_name: 'Smith',
  email: 'smith@test.com',
  user_id: MOCK_USER_ID,
  created_at: MOCK_CREATED_AT,
  code: 'JS',
  color: '#FF0000',
  contract_type: null,
  phone: null,
  prefix: null,
  suffix: null,
};
const mockInstructor2: Instructor = {
  id: 'inst2',
  first_name: 'Barney',
  last_name: 'Jones',
  email: 'jones@test.com',
  user_id: MOCK_USER_ID,
  created_at: MOCK_CREATED_AT,
  code: 'BJ',
  color: '#00FF00',
  contract_type: null,
  phone: null,
  prefix: null,
  suffix: null,
};

// FIXED: Classrooms now have the full set of properties
const mockClassroom1: Classroom = {
  id: 'room1',
  name: 'Room 101',
  user_id: MOCK_USER_ID,
  capacity: 30,
  created_at: MOCK_CREATED_AT,
  code: 'R101',
  color: '#0000FF',
  location: 'A',
};
const mockClassroom2: Classroom = {
  id: 'room2',
  name: 'Room 202',
  user_id: MOCK_USER_ID,
  capacity: 30,
  created_at: MOCK_CREATED_AT,
  code: 'R202',
  color: '#FFFF00',
  location: 'B',
};

// FIXED: Class Groups now have the full set of properties
const mockGroup1: ClassGroup = {
  id: 'group1',
  name: 'CS-1A',
  user_id: MOCK_USER_ID,
  created_at: MOCK_CREATED_AT,
  code: 'CS1A',
  color: '#FF00FF',
  student_count: 25,
};
const mockGroup2: ClassGroup = {
  id: 'group2',
  name: 'CS-1B',
  user_id: MOCK_USER_ID,
  created_at: MOCK_CREATED_AT,
  code: 'CS1B',
  color: '#00FFFF',
  student_count: 28,
};

// FIXED: Courses no longer have number_of_periods
const mockCourse1: Course = {
  id: 'course1',
  name: 'Intro to CS',
  code: 'CS101',
  user_id: MOCK_USER_ID,
  created_at: MOCK_CREATED_AT,
  color: '#C0C0C0',
};
const mockCourse2: Course = {
  id: 'course2',
  name: 'Data Structures',
  code: 'CS201',
  user_id: MOCK_USER_ID,
  created_at: MOCK_CREATED_AT,
  color: '#808080',
};

// FIXED: Class Sessions now have the `period_count` property
const classSession1: ClassSession = {
  id: 'session1',
  course: mockCourse1,
  group: mockGroup1,
  instructor: mockInstructor1,
  classroom: mockClassroom1,
  period_count: 1, // <-- Duration is here now
};
const classSession2: ClassSession = {
  id: 'session2',
  course: mockCourse2,
  group: mockGroup2,
  instructor: mockInstructor2,
  classroom: mockClassroom2,
  period_count: 2, // <-- Duration is here now
};
const conflictingInstructorSession: ClassSession = {
  id: 'session3',
  course: mockCourse2,
  group: mockGroup2,
  instructor: mockInstructor1, // Same instructor as session1
  classroom: mockClassroom2,
  period_count: 2,
};
const conflictingClassroomSession: ClassSession = {
  id: 'session4',
  course: mockCourse2,
  group: mockGroup2,
  instructor: mockInstructor2,
  classroom: mockClassroom1, // Same classroom as session1
  period_count: 2,
};

describe('checkConflicts', () => {
  let timetable: TimetableGrid;

  beforeEach(() => {
    timetable = new Map();
    timetable.set(mockGroup1.id, Array(totalPeriods).fill(null));
    timetable.set(mockGroup2.id, Array(totalPeriods).fill(null));
    // Pre-populate with a 1-period class
    timetable.get(mockGroup1.id)![0] = classSession1;
  });

  describe('Multi-Period Conflict Logic', () => {
    it('should return no conflict when placing a multi-period class in an empty range', () => {
      const result = checkConflicts(timetable, classSession2, mockSettings, mockGroup2.id, 10);
      expect(result).toBe('');
    });

    it('should detect a group conflict if any part of the multi-period class overlaps', () => {
      timetable.get(mockGroup2.id)![2] = classSession1; // Existing class
      // Try to place a 2-period class at index 1, which overlaps at index 2
      const result = checkConflicts(timetable, classSession2, mockSettings, mockGroup2.id, 1);
      expect(result).toContain('Conflict');
      expect(result).toContain('CS-1A'); //Group Name
    });

    it('should detect a group conflict when a multi-period class completely overlaps an existing class', () => {
      // ARRANGE
      timetable.get(mockGroup2.id)![1] = classSession1;
      timetable.get(mockGroup2.id)![2] = classSession1;

      // ACT
      const result = checkConflicts(timetable, classSession2, mockSettings, mockGroup2.id, 1);

      // ASSERT
      expect(result).toContain('Conflict');
      expect(result).toContain('CS-1A'); //Group Name
    });

    it('should detect an instructor conflict in the second period of a multi-period class', () => {
      // Try to place a 2-period class at index 0, which conflicts with instructor1 at period 0
      const result = checkConflicts(
        timetable,
        conflictingInstructorSession,
        mockSettings,
        mockGroup2.id,
        0
      );
      expect(result).toContain('Instructor conflict: Jerry Smith');
    });

    it('should detect a classroom conflict in the second period of a multi-period class', () => {
      // Place conflicting session for classroom at period 1
      timetable.get(mockGroup1.id)![1] = {
        ...classSession1,
        id: 'session-other',
        instructor: mockInstructor2,
      }; // same classroom1
      // Try to place a 2-period class starting at index 0
      const result = checkConflicts(
        timetable,
        conflictingClassroomSession,
        mockSettings,
        mockGroup2.id,
        0
      );
      expect(result).toContain('Classroom conflict: Room 101');
    });

    it('should return a boundary conflict if the class duration extends beyond the periods in a day', () => {
      const lastPeriodOfDay1 = mockSettings.periods_per_day - 1; // index 3
      // Try to place a 2-period class here, it would spill to index 4 (next day)
      const result = checkConflicts(
        timetable,
        classSession2,
        mockSettings,
        mockGroup1.id,
        lastPeriodOfDay1
      );
      expect(result).toBe('Placement conflict: Class cannot span across multiple days.');
    });

    it('should return a boundary conflict if the class duration extends beyond the total periods', () => {
      const lastPeriod = totalPeriods - 1; // index 19
      // Try to place a 2-period class here, it would spill to index 20
      const result = checkConflicts(
        timetable,
        classSession2,
        mockSettings,
        mockGroup1.id,
        lastPeriod
      );
      expect(result).toBe('Placement conflict: Class extends beyond the available timetable days.');
    });

    it('should not report a conflict with itself when moving a multi-period class', () => {
      timetable.get(mockGroup2.id)![5] = classSession2;
      const result = checkConflicts(timetable, classSession2, mockSettings, mockGroup2.id, 10);
      expect(result).toBe('');
    });
  });

  it('should detect a group conflict when moving a session backward to overlap an existing session', () => {
    // ARRANGE: Set up a specific, tricky timetable layout.
    // Session A is at [1, 2], Session B is at [3, 4].
    const sessionA = { ...classSession2, id: 'sessionA' };
    const sessionB = { ...classSession2, id: 'sessionB' };

    const groupSessions = timetable.get(mockGroup1.id)!;
    groupSessions[1] = sessionA;
    groupSessions[2] = sessionA;
    groupSessions[3] = sessionB;
    groupSessions[4] = sessionB;

    // Define the move operation
    const targetPeriodIndex = 2; // Target is [2, 3]

    // ACT: Attempt to move session B from index 3 to index 2.
    // This should conflict with session A, which occupies index 2.
    const result = checkConflicts(
      timetable,
      sessionB,
      mockSettings,
      mockGroup1.id,
      targetPeriodIndex
    );

    // ASSERT: The function must detect the conflict and not return an empty string.
    expect(result).not.toBe('');
    expect(result).toContain('Conflict');
    expect(result).toContain('CS-1B');
  });
});
