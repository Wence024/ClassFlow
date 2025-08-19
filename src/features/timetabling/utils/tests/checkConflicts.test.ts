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

// --- Mock Data Setup ---
const MOCK_USER_ID = 'user-mock-123';
const MOCK_CREATED_AT = new Date().toISOString();

const mockSettings: ScheduleConfig = {
  id: 'settings1',
  created_at: MOCK_CREATED_AT,
  periods_per_day: 4,
  class_days_per_week: 5,
  start_time: '09:00',
  period_duration_mins: 90,
};
const totalPeriods = mockSettings.periods_per_day * mockSettings.class_days_per_week; // 20

const mockInstructor1: Instructor = {
  id: 'inst1',
  name: 'Dr. Smith',
  email: 'smith@test.com',
  user_id: MOCK_USER_ID,
  created_at: MOCK_CREATED_AT,
};
const mockInstructor2: Instructor = {
  id: 'inst2',
  name: 'Prof. Jones',
  email: 'jones@test.com',
  user_id: MOCK_USER_ID,
  created_at: MOCK_CREATED_AT,
};

const mockClassroom1: Classroom = {
  id: 'room1',
  name: 'Room 101',
  location: 'A',
  user_id: MOCK_USER_ID,
  capacity: 30,
  created_at: MOCK_CREATED_AT,
};
const mockClassroom2: Classroom = {
  id: 'room2',
  name: 'Room 202',
  location: 'B',
  user_id: MOCK_USER_ID,
  capacity: 30,
  created_at: MOCK_CREATED_AT,
};

const mockGroup1: ClassGroup = {
  id: 'group1',
  name: 'CS-1A',
  user_id: MOCK_USER_ID,
  created_at: MOCK_CREATED_AT,
};
const mockGroup2: ClassGroup = {
  id: 'group2',
  name: 'CS-1B',
  user_id: MOCK_USER_ID,
  created_at: MOCK_CREATED_AT,
};

const mockCourse1Period: Course = {
  id: 'course1',
  name: 'Intro to CS',
  code: 'CS101',
  number_of_periods: 1,
  user_id: MOCK_USER_ID,
  created_at: MOCK_CREATED_AT,
};
const mockCourse2Periods: Course = {
  id: 'course2',
  name: 'Data Structures',
  code: 'CS201',
  number_of_periods: 2,
  user_id: MOCK_USER_ID,
  created_at: MOCK_CREATED_AT,
};

const classSession1: ClassSession = {
  id: 'session1',
  course: mockCourse1Period,
  group: mockGroup1,
  instructor: mockInstructor1,
  classroom: mockClassroom1,
};
const classSession2: ClassSession = {
  id: 'session2',
  course: mockCourse2Periods,
  group: mockGroup2,
  instructor: mockInstructor2,
  classroom: mockClassroom2,
};
const conflictingInstructorSession: ClassSession = {
  id: 'session3',
  course: mockCourse2Periods,
  group: mockGroup2,
  instructor: mockInstructor1,
  classroom: mockClassroom2,
};
const conflictingClassroomSession: ClassSession = {
  id: 'session4',
  course: mockCourse2Periods,
  group: mockGroup2,
  instructor: mockInstructor2,
  classroom: mockClassroom1,
};

describe('checkConflicts', () => {
  let timetable: TimetableGrid;

  beforeEach(() => {
    timetable = new Map<string, (ClassSession | null)[]>();
    timetable.set(mockGroup1.id, Array(totalPeriods).fill(null));
    timetable.set(mockGroup2.id, Array(totalPeriods).fill(null));
    timetable.get(mockGroup1.id)![0] = classSession1; // Pre-populate with a 1-period class
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
      expect(result).toContain('Group conflict');
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
      expect(result).toContain('Instructor conflict: Dr. Smith');
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
      const source = { class_group_id: mockGroup2.id, period_index: 5 };
      timetable.get(mockGroup2.id)![5] = classSession2;
      const result = checkConflicts(
        timetable,
        classSession2,
        mockSettings,
        mockGroup2.id,
        10,
        source
      );
      expect(result).toBe('');
    });
  });
});
