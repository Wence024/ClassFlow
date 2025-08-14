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

// Define a common user_id and created_at for all mock data to satisfy the types.
const MOCK_USER_ID = 'user-mock-123';
const MOCK_CREATED_AT = new Date().toISOString();

const mockScheduleConfiguration: ScheduleConfig = {
  id: 'schedule-123',
  class_days_per_week: 5,
  period_duration_mins: 45,
  periods_per_day: 8,
  start_time: '08:00',
  created_at: MOCK_CREATED_AT,
};

// Create mock entities that fully conform to the Supabase types.
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
  location: 'Building A',
  user_id: MOCK_USER_ID,
  created_at: MOCK_CREATED_AT,
  capacity: 30, // ✅ Required field
};

const mockClassroom2: Classroom = {
  id: 'room2',
  name: 'Room 202',
  location: 'Building B',
  user_id: MOCK_USER_ID,
  created_at: MOCK_CREATED_AT,
  capacity: 25, // ✅ Required field
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

const mockCourse1: Course = {
  id: 'course1',
  name: 'Intro to CS',
  code: 'CS101',
  user_id: MOCK_USER_ID,
  created_at: MOCK_CREATED_AT,
  number_of_periods: 1, // ✅ Required field
};

const mockCourse2: Course = {
  id: 'course2',
  name: 'Data Structures',
  code: 'CS201',
  user_id: MOCK_USER_ID,
  created_at: MOCK_CREATED_AT,
  number_of_periods: 1, // ✅ Required field
};

// Create fully-hydrated mock ClassSession objects. These are now type-safe.
const classSession1: ClassSession = {
  id: 'session1',
  course: mockCourse1,
  group: mockGroup1,
  instructor: mockInstructor1,
  classroom: mockClassroom1,
};

const classSession2: ClassSession = {
  id: 'session2',
  course: mockCourse2,
  group: mockGroup2,
  instructor: mockInstructor2,
  classroom: mockClassroom2,
};

const conflictingClassSession: ClassSession = {
  id: 'session3',
  course: mockCourse2,
  group: mockGroup2,
  instructor: mockInstructor1, // Same instructor as session1
  classroom: mockClassroom2,
};

const classroomConflictClassSession: ClassSession = {
  id: 'session4',
  course: mockCourse2,
  group: mockGroup2,
  instructor: mockInstructor2,
  classroom: mockClassroom1, // Same classroom as session1
};

describe('checkConflicts', () => {
  let timetable: TimetableGrid;

  beforeEach(() => {
    // Initialize a fresh timetable for each test
    timetable = new Map<string, (ClassSession | null)[]>();
    timetable.set(mockGroup1.id, Array(16).fill(null));
    timetable.set(mockGroup2.id, Array(16).fill(null));

    // Pre-populate the timetable with an existing class session
    timetable.get(mockGroup1.id)![0] = classSession1;
  });

  // --- Test Scenarios (No changes needed in the test logic itself) ---

  it('should return an empty string when there are no conflicts', () => {
    const result = checkConflicts(
      timetable,
      classSession2,
      mockScheduleConfiguration,
      mockGroup2.id,
      1
    );
    expect(result).toBe('');
  });

  it('should return a group conflict message if the target cell is already occupied', () => {
    const result = checkConflicts(
      timetable,
      classSession2,
      mockScheduleConfiguration,
      mockGroup1.id,
      0
    );
    expect(result).toContain('Group conflict');
    expect(result).toContain(classSession2.group.name);
  });

  it('should return an instructor conflict message if the same instructor is scheduled at the same time in a different group', () => {
    const result = checkConflicts(
      timetable,
      conflictingClassSession,
      mockScheduleConfiguration,
      mockGroup2.id,
      0
    );
    expect(result).toContain('Instructor conflict');
    expect(result).toContain(mockInstructor1.name);
    expect(result).toContain(classSession1.group.name);
  });

  it('should return a classroom conflict message if the same classroom is in use at the same time', () => {
    const result = checkConflicts(
      timetable,
      classroomConflictClassSession,
      mockScheduleConfiguration,
      mockGroup2.id,
      0
    );
    expect(result).toContain('Classroom conflict');
    expect(result).toContain(mockClassroom1.name);
    expect(result).toContain(classSession1.group.name);
  });

  it('should NOT return a conflict when moving a class session to an empty cell', () => {
    const source = { class_group_id: mockGroup1.id, period_index: 0 };
    const result = checkConflicts(
      timetable,
      classSession1,
      mockScheduleConfiguration,
      mockGroup1.id,
      1,
      source
    );
    expect(result).toBe('');
  });

  it('should NOT return a self-conflict when a class session is moved to its own original spot', () => {
    const source = { class_group_id: mockGroup1.id, period_index: 0 };
    const result = checkConflicts(
      timetable,
      classSession1,
      mockScheduleConfiguration,
      mockGroup1.id,
      0,
      source
    );
    expect(result).toBe('');
  });

  it('should NOT return an instructor/classroom conflict with the source cell when moving a class session', () => {
    timetable.get(mockGroup2.id)![1] = classSession2;
    const source = { class_group_id: mockGroup1.id, period_index: 0 };
    const result = checkConflicts(
      timetable,
      classSession1,
      mockScheduleConfiguration,
      mockGroup1.id,
      2,
      source
    );
    expect(result).toBe('');
  });
});
