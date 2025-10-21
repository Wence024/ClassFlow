import { describe, it, expect, beforeEach } from 'vitest';
import checkTimetableConflicts, {
  findConflictingSessionsAtPeriod,
  type TimetableGrid,
} from '../checkConflicts';
import type {
  Instructor,
  Classroom,
  ClassGroup,
  Course,
} from '../../../classSessionComponents/types';
import type { ClassSession } from '../../../classSessions/types/classSession';
import type { ScheduleConfig } from '../../../scheduleConfig/types/scheduleConfig';

// --- Fully-Typed, Centralized Mock Data ---
const MOCK_USER_ID = 'user-mock-123';
const MOCK_CREATED_AT = new Date().toISOString();

// Mock Programs
const mockProgramCS = {
  id: 'prog_cs',
  name: 'Computer Science',
  created_at: MOCK_CREATED_AT,
  short_code: 'CS',
};
const mockProgramBus = {
  id: 'prog_bus',
  name: 'Business',
  created_at: MOCK_CREATED_AT,
  short_code: 'BUS',
};

// Mock Settings
const mockSettings: ScheduleConfig = {
  id: 'settings1',
  created_at: MOCK_CREATED_AT,
  periods_per_day: 4,
  class_days_per_week: 5,
  start_time: '09:00',
  period_duration_mins: 90,
  semester_id: 'sem1',
};
const totalPeriods = mockSettings.periods_per_day * mockSettings.class_days_per_week;

// Mock Instructors
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
  program_id: mockProgramCS.id,
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
  program_id: mockProgramCS.id,
};
const mockInstructorShared: Instructor = {
  id: 'inst_shared',
  first_name: 'Shared',
  last_name: 'Professor',
  email: 'shared@test.com',
  user_id: MOCK_USER_ID,
  created_at: MOCK_CREATED_AT,
  code: 'SP',
  color: '#FF0000',
  contract_type: 'Full-time',
  phone: '111-1111',
  prefix: 'Dr.',
  suffix: null,
  program_id: null,
};
const mockInstructorCS: Instructor = {
  id: 'inst_cs',
  first_name: 'CS',
  last_name: 'Only',
  email: 'cs@test.com',
  user_id: MOCK_USER_ID,
  created_at: MOCK_CREATED_AT,
  code: 'CSO',
  color: '#00FF00',
  contract_type: 'Part-time',
  phone: '222-2222',
  prefix: null,
  suffix: null,
  program_id: mockProgramCS.id,
};

// Mock Classrooms
const mockClassroom1: Classroom = {
  id: 'room1',
  name: 'Room 101',
  user_id: MOCK_USER_ID,
  capacity: 30,
  created_at: MOCK_CREATED_AT,
  code: 'R101',
  color: '#0000FF',
  location: 'A',
  program_id: mockProgramCS.id,
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
  program_id: mockProgramCS.id,
};

const mockClassroomShared: Classroom = {
  id: 'room_shared',
  name: 'Shared Auditorium',
  user_id: MOCK_USER_ID,
  capacity: 100,
  created_at: MOCK_CREATED_AT,
  code: 'AUD',
  color: '#0000FF',
  location: 'Main Building',
  program_id: null,
};
const mockClassroomCS: Classroom = {
  id: 'room_cs',
  name: 'CS Lab 1',
  user_id: MOCK_USER_ID,
  capacity: 30,
  created_at: MOCK_CREATED_AT,
  code: 'CSL1',
  color: '#FFFF00',
  location: 'Tech Building',
  program_id: mockProgramCS.id,
};

// Mock Class Groups
const mockGroup1: ClassGroup = {
  id: 'group1',
  name: 'CS-1A',
  user_id: MOCK_USER_ID,
  created_at: MOCK_CREATED_AT,
  code: 'CS1A',
  color: '#FF00FF',
  student_count: 25,
  program_id: mockProgramCS.id,
};
const mockGroup2: ClassGroup = {
  id: 'group2',
  name: 'CS-1B',
  user_id: MOCK_USER_ID,
  created_at: MOCK_CREATED_AT,
  code: 'CS1B',
  color: '#00FFFF',
  student_count: 28,
  program_id: mockProgramCS.id,
};

const mockGroupCS1A: ClassGroup = {
  id: 'groupCS1A',
  name: 'CS-1A',
  user_id: MOCK_USER_ID,
  created_at: MOCK_CREATED_AT,
  code: 'CS1A',
  color: '#FF00FF',
  student_count: 25,
  program_id: mockProgramCS.id,
};
const mockGroupBus101: ClassGroup = {
  id: 'groupBus101',
  name: 'Business 101',
  user_id: MOCK_USER_ID,
  created_at: MOCK_CREATED_AT,
  code: 'BUS101',
  color: '#00FFFF',
  student_count: 50,
  program_id: mockProgramBus.id,
};

const mockCourse1: Course = {
  id: 'course1',
  name: 'Intro to CS',
  code: 'CS101',
  user_id: MOCK_USER_ID,
  created_at: MOCK_CREATED_AT,
  color: '#C0C0C0',
  program_id: mockProgramCS.id,
};
const mockCourse2: Course = {
  id: 'course2',
  name: 'Data Structures',
  code: 'CS201',
  user_id: MOCK_USER_ID,
  created_at: MOCK_CREATED_AT,
  color: '#808080',
  program_id: mockProgramCS.id,
};

// Mock Courses
const mockCourseCS: Course = {
  id: 'course_cs',
  name: 'Intro to CS',
  code: 'CS101',
  user_id: MOCK_USER_ID,
  created_at: MOCK_CREATED_AT,
  color: '#C0C0C0',
  program_id: mockProgramCS.id,
};
const mockCourseBus: Course = {
  id: 'course_bus',
  name: 'Intro to Marketing',
  code: 'MKT101',
  user_id: MOCK_USER_ID,
  created_at: MOCK_CREATED_AT,
  color: '#808080',
  program_id: mockProgramBus.id,
};

const mockCourseShared: Course = {
  id: 'course_shared',
  name: 'Shared Course',
  code: 'SHR101',
  user_id: MOCK_USER_ID,
  created_at: MOCK_CREATED_AT,
  color: '#777777',
  program_id: null, // or make it available to both programs
};

const classSession1: ClassSession = {
  id: 'session1',
  course: mockCourse1,
  group: mockGroup1,
  instructor: mockInstructor1,
  classroom: mockClassroom1,
  period_count: 1,
  program_id: 'mockProgram',
};

const classSession2: ClassSession = {
  id: 'session2',
  course: mockCourse2,
  group: mockGroup2,
  instructor: mockInstructor2,
  classroom: mockClassroom2,
  period_count: 2,
  program_id: 'mockProgram',
};

const conflictingInstructorSession: ClassSession = {
  id: 'session3',
  course: mockCourse2,
  group: mockGroup2,
  instructor: mockInstructor1,
  classroom: mockClassroom2,
  period_count: 2,
  program_id: 'mockProgram',
};

const conflictingClassroomSession: ClassSession = {
  id: 'session4',
  course: mockCourse2,
  group: mockGroup2,
  instructor: mockInstructor2,
  classroom: mockClassroom1,
  period_count: 2,
  program_id: 'mockProgram',
};

describe('checkConflicts', () => {
  let timetable: TimetableGrid;

  beforeEach(() => {
    timetable = new Map();
    timetable.set(mockGroup1.id, Array(totalPeriods).fill(null));
    timetable.set(mockGroup2.id, Array(totalPeriods).fill(null));
    timetable.set(mockGroupCS1A.id, Array(totalPeriods).fill(null));
    timetable.set(mockGroupBus101.id, Array(totalPeriods).fill(null));
  });

  describe('Multi-Period Conflict Logic', () => {
    it('should return no conflict when placing a multi-period class in an empty range', () => {
      const result = checkTimetableConflicts(
        timetable,
        classSession2,
        mockSettings,
        mockGroup2.id,
        0,
        [mockProgramCS, mockProgramBus]
      );
      expect(result).toBe('');
    });

    it('should detect a group conflict if any part of the multi-period class overlaps', () => {
      timetable.get(mockGroup2.id)![2] = [classSession1]; // Existing class
      // Try to place a 2-period class at index 1, which overlaps at index 2
      const result = checkTimetableConflicts(
        timetable,
        classSession2,
        mockSettings,
        mockGroup2.id,
        1,
        [mockProgramCS, mockProgramBus]
      );
      expect(result).toContain('conflict');
      expect(result).toContain('CS-1A'); //Group Name
    });

    it('should detect a group conflict when a multi-period class completely overlaps an existing class', () => {
      // ARRANGE
      timetable.get(mockGroup2.id)![1] = [classSession1];
      timetable.get(mockGroup2.id)![2] = [classSession1];

      // ACT
      const result = checkTimetableConflicts(
        timetable,
        classSession2,
        mockSettings,
        mockGroup2.id,
        1,
        [mockProgramCS, mockProgramBus]
      );

      // ASSERT
      expect(result).toContain('conflict');
      expect(result).toContain('CS-1A'); //Group Name
    });

    it('returns multiple conflicts if multiple other groups have sessions at that period', () => {
      const otherGroup: ClassGroup = {
        id: 'group3',
        name: 'CS-1C',
        user_id: MOCK_USER_ID,
        created_at: MOCK_CREATED_AT,
        code: 'CS1C',
        color: '#123456',
        student_count: 24,
        program_id: mockProgramCS.id,
      };

      const otherSession: ClassSession = {
        ...classSession2,
        id: 'session-other',
        group: otherGroup,
      };

      timetable.set(otherGroup.id, Array(totalPeriods).fill(null));
      timetable.get(mockGroup2.id)![1] = [conflictingInstructorSession];
      timetable.get(otherGroup.id)![1] = [otherSession];

      const result = findConflictingSessionsAtPeriod(timetable, 1, mockGroup1.id, classSession1);

      // ✅ Extracted outside of the nested call
      const conflictingIds = [];
      for (const session of result) {
        conflictingIds.push(session.id);
      }

      expect(result).toHaveLength(2);
      expect(conflictingIds).toContain('session3');
      expect(conflictingIds).toContain('session-other');
    });

    it('should detect an instructor conflict in the second period of a multi-period class', () => {
      // Setup existing session that conflicts
      timetable.get(mockGroup1.id)![0] = [{
        ...classSession1,
        instructor: mockInstructor1,
      }];

      // Try to place a 2-period class at index 0, which conflicts with instructor1 at period 0
      const result = checkTimetableConflicts(
        timetable,
        conflictingInstructorSession,
        mockSettings,
        mockGroup2.id,
        0,
        [mockProgramCS, mockProgramBus]
      );
      expect(result).toContain('Instructor conflict: Jerry Smith');
    });

    it('should detect a classroom conflict in the second period of a multi-period class', () => {
      // Place conflicting session for classroom at period 1
      timetable.get(mockGroup1.id)![1] = [{
        ...classSession1,
        id: 'session-other',
        instructor: mockInstructor1,
      }]; // same classroom1

      // Try to place a 2-period class starting at index 0
      const result = checkTimetableConflicts(
        timetable,
        conflictingClassroomSession,
        mockSettings,
        mockGroup2.id,
        0,
        [mockProgramCS, mockProgramBus]
      );
      expect(result).toContain('Classroom conflict');
      expect(result).toContain('Room 101');
      expect(result).toContain('CS-1A');
    });

    it('should return a boundary conflict if the class duration extends beyond the periods in a day', () => {
      const lastPeriodOfDay1 = mockSettings.periods_per_day - 1; // index 3
      // Try to place a 2-period class here, it would spill to index 4 (next day)
      const result = checkTimetableConflicts(
        timetable,
        classSession2,
        mockSettings,
        mockGroup1.id,
        lastPeriodOfDay1,
        [mockProgramCS, mockProgramBus]
      );
      expect(result).toBe(
        'Placement conflict: Class cannot span multiple days (spans from day 1 to day 2).'
      );
    });

    it('should return a boundary conflict if the class duration extends beyond the total periods', () => {
      const lastPeriod = totalPeriods - 1; // index 19
      // Try to place a 2-period class here, it would spill to index 20
      const result = checkTimetableConflicts(
        timetable,
        classSession2,
        mockSettings,
        mockGroup1.id,
        lastPeriod,
        [mockProgramCS, mockProgramBus]
      );
      expect(result).toBe(
        'Placement conflict: Class extends beyond timetable limit of 20 periods.'
      );
    });

    it('should not report a conflict with itself when moving a multi-period class', () => {
      timetable.get(mockGroup2.id)![5] = [classSession2];
      const result = checkTimetableConflicts(
        timetable,
        classSession2,
        mockSettings,
        mockGroup2.id,
        10,
        [mockProgramCS, mockProgramBus]
      );
      expect(result).toBe('');
    });
  });

  it('should detect a group conflict when moving a session backward to overlap an existing session', () => {
    // ARRANGE: Set up a specific, tricky timetable layout.
    // Session A is at [1, 2], Session B is at [3, 4].
    const sessionA = { ...classSession1, id: 'sessionA', program_id: 'mockProgram' };
    const sessionB = { ...classSession1, id: 'sessionB', program_id: 'mockProgram' };

    const groupSessions = timetable.get(mockGroup1.id)!;
    groupSessions[1] = [sessionA];
    groupSessions[2] = [sessionA];
    groupSessions[3] = [sessionB];
    groupSessions[4] = [sessionB];

    // Define the move operation
    const targetPeriodIndex = 2; // Target is [2, 3]

    // ACT: Attempt to move session B from index 3 to index 2.
    // This should conflict with session A, which occupies index 2.
    const result = checkTimetableConflicts(
      timetable,
      sessionB,
      mockSettings,
      mockGroup1.id,
      targetPeriodIndex,
      [mockProgramCS, mockProgramBus]
    );

    // ASSERT: The function must detect the conflict and not return an empty string.
    expect(result).not.toBe('');
    expect(result).toContain('conflict');
    expect(result).toContain('CS-1A');
  });

  describe('Cross-Program Conflict Detection', () => {
    beforeEach(() => {
      // Pre-schedule a session for the Business program using shared resources
      const existingBusinessSession: ClassSession = {
        id: 'sessionBus',
        instructor: mockInstructorShared,
        classroom: mockClassroomShared,
        group: mockGroupBus101,
        course: mockCourseBus,
        period_count: 2,
        program_id: mockProgramBus.id,
      };
      // Place it at period 5 (and 6 because its duration is 2)
      timetable.get(mockGroupBus101.id)![5] = [existingBusinessSession];
      timetable.get(mockGroupBus101.id)![6] = [existingBusinessSession];
    });

    it('should DETECT an instructor conflict with a session from another program', () => {
      const conflictingCSSession: ClassSession = {
        id: 'sessionCS_conflict_inst',
        instructor: mockInstructorShared, // Same instructor as the Business session
        classroom: mockClassroomCS, // Different classroom
        group: mockGroupCS1A,
        course: mockCourseCS,
        period_count: 1,
        program_id: mockProgramCS.id,
      };

      const result = checkTimetableConflicts(
        timetable,
        conflictingCSSession,
        mockSettings,
        mockGroupCS1A.id,
        5,
        [mockProgramCS, mockProgramBus]
      );
      expect(result).toContain('Instructor conflict');
      expect(result).toContain('Shared Professor');
      expect(result).toContain('Business 101');
      expect(result).toContain('(Program: Business)'); // Check for the program name
    });

    it('should DETECT a classroom conflict with a session from another program', () => {
      const conflictingCSSession: ClassSession = {
        id: 'sessionCS_conflict_room',
        instructor: mockInstructorCS, // Different instructor
        classroom: mockClassroomShared, // Same classroom
        group: mockGroupCS1A,
        course: mockCourseCS,
        period_count: 1,
        program_id: mockProgramCS.id,
      };

      const result = checkTimetableConflicts(
        timetable,
        conflictingCSSession,
        mockSettings,
        mockGroupCS1A.id,
        6,
        [mockProgramCS, mockProgramBus]
      ); // Check against 2nd period of the business class
      expect(result).toContain('Classroom conflict');
      expect(result).toContain('Shared Auditorium');
      expect(result).toContain('Business 101');
    });

    it('should NOT detect a conflict when resources are different', () => {
      const nonConflictingCSSession: ClassSession = {
        id: 'sessionCS_no_conflict',
        instructor: mockInstructorCS,
        classroom: mockClassroomCS,
        group: mockGroupCS1A,
        course: mockCourseCS,
        period_count: 1,
        program_id: mockProgramCS.id,
      };

      const result = checkTimetableConflicts(
        timetable,
        nonConflictingCSSession,
        mockSettings,
        mockGroupCS1A.id,
        5,
        [mockProgramCS, mockProgramBus]
      );
      expect(result).toBe('');
    });
  });

  describe('Class Merging Scenarios', () => {
    it('should NOT return a conflict for sessions with the same course, instructor, and classroom', () => {
      // ARRANGE
      // Session for Group 1, using shared resources
      const sessionForGroup1: ClassSession = {
        id: 'sessionG1',
        course: mockCourseShared,
        instructor: mockInstructorShared,
        classroom: mockClassroomShared,
        group: mockGroup1,
        period_count: 2,
        program_id: mockGroup1.program_id,
      };

      // Session for Group 2, using the exact same shared resources
      const sessionForGroup2: ClassSession = {
        id: 'sessionG2',
        course: mockCourseShared, // Same course
        instructor: mockInstructorShared, // Same instructor
        classroom: mockClassroomShared, // Same classroom
        group: mockGroup2,
        period_count: 2,
        program_id: mockGroup2.program_id,
      };

      // Place session for Group 1 on the timetable at period 5
      timetable.get(mockGroup1.id)![5] = [sessionForGroup1];
      timetable.get(mockGroup1.id)![6] = [sessionForGroup1];

      // ACT
      // Try to place the session for Group 2 at the same time slot
      const result = checkTimetableConflicts(
        timetable,
        sessionForGroup2,
        mockSettings,
        mockGroup2.id,
        5,
        [mockProgramCS, mockProgramBus]
      );

      // ASSERT
      // There should be no conflict, as this is a valid merge
      expect(result).toBe('');
    });

    it('should STILL return an instructor conflict for sessions with the same instructor but different courses', () => {
      // ARRANGE
      // Session for Group 1
      const sessionForGroup1: ClassSession = {
        id: 'sessionG1_inst_conflict',
        course: mockCourse1, // Course 1
        instructor: mockInstructorShared, // Shared instructor
        classroom: mockClassroom1,
        group: mockGroup1,
        period_count: 1,
        program_id: mockGroup1.program_id,
      };

      // Session for Group 2 with the same instructor but a different course
      const sessionForGroup2: ClassSession = {
        id: 'sessionG2_inst_conflict',
        course: mockCourse2, // Course 2 (DIFFERENT)
        instructor: mockInstructorShared, // Shared instructor (SAME)
        classroom: mockClassroom2,
        group: mockGroup2,
        period_count: 1,
        program_id: mockGroup2.program_id,
      };

      // Place session for Group 1 on the timetable
      timetable.get(mockGroup1.id)![8] = [sessionForGroup1];

      // ACT
      // Try to place the session for Group 2 at the same time
      const result = checkTimetableConflicts(
        timetable,
        sessionForGroup2,
        mockSettings,
        mockGroup2.id,
        8,
        [mockProgramCS, mockProgramBus]
      );

      // ASSERT
      // This should be a conflict because the courses are different
      expect(result).toContain('Instructor conflict');
      expect(result).toContain('Shared Professor');
    });

    it('should STILL return a classroom conflict for sessions with the same classroom but different courses', () => {
      // ARRANGE
      // Session for Group 1
      const sessionForGroup1: ClassSession = {
        id: 'sessionG1_room_conflict',
        course: mockCourse1, // Course 1
        instructor: mockInstructor1,
        classroom: mockClassroomShared, // Shared classroom
        group: mockGroup1,
        period_count: 1,
        program_id: mockGroup1.program_id,
      };

      // Session for Group 2 with the same classroom but a different course
      const sessionForGroup2: ClassSession = {
        id: 'sessionG2_room_conflict',
        course: mockCourse2, // Course 2 (DIFFERENT)
        instructor: mockInstructor2,
        classroom: mockClassroomShared, // Shared classroom (SAME)
        group: mockGroup2,
        period_count: 1,
        program_id: mockGroup2.program_id,
      };

      // Place session for Group 1 on the timetable
      timetable.get(mockGroup1.id)![9] = [sessionForGroup1];

      // ACT
      // Try to place the session for Group 2 at the same time
      const result = checkTimetableConflicts(
        timetable,
        sessionForGroup2,
        mockSettings,
        mockGroup2.id,
        9,
        [mockProgramCS, mockProgramBus]
      );

      // ASSERT
      // This should be a conflict because the courses are different
      expect(result).toContain('Classroom conflict');
      expect(result).toContain('Shared Auditorium');
    });
  });

  describe('Group Mismatch Detection', () => {
    it('should return a group mismatch error when trying to move a session to a different class group row', () => {
      // ARRANGE
      const sessionForGroup1: ClassSession = {
        id: 's1',
        course: mockCourse1,
        group: mockGroup1,
        instructor: mockInstructor1,
        classroom: mockClassroom1,
        period_count: 1,
        user_id: MOCK_USER_ID,
        created_at: MOCK_CREATED_AT,
      };
      
      const timetable = new Map();
      timetable.set(mockGroup1.id, new Array(40).fill(null));
      timetable.set(mockGroup2.id, new Array(40).fill(null));

      // ACT
      // Try to move a session from Group 1 to Group 2's row
      const result = checkTimetableConflicts(
        timetable,
        sessionForGroup1,
        mockSettings,
        mockGroup2.id, // Target group is different from session's group
        5,
        [mockProgramCS],
        'class-group',
        true // This is a move operation
      );

      // ASSERT
      expect(result).toContain('Group mismatch');
      expect(result).toContain('Cannot move session for class group');
      expect(result).toContain(mockGroup1.name); // CS-1A
      expect(result).toContain(mockGroup2.id); // group2
    });

    it('should NOT return a group mismatch error when moving a session within its own class group row', () => {
      // ARRANGE
      const sessionForGroup1: ClassSession = {
        id: 's1',
        course: mockCourse1,
        group: mockGroup1,
        instructor: mockInstructor1,
        classroom: mockClassroom1,
        period_count: 1,
        user_id: MOCK_USER_ID,
        created_at: MOCK_CREATED_AT,
      };
      
      const timetable = new Map();
      timetable.set(mockGroup1.id, new Array(40).fill(null));

      // ACT
      // Try to move a session within the same group's row
      const result = checkTimetableConflicts(
        timetable,
        sessionForGroup1,
        mockSettings,
        mockGroup1.id, // Target group is the same as session's group
        5,
        [mockProgramCS],
        'class-group',
        true // This is a move operation
      );

      // ASSERT
      // Should not contain group mismatch error (may contain other conflicts, but not group mismatch)
      expect(result).not.toContain('Group mismatch');
    });
  });

  describe('View-Specific Resource Mismatch Detection', () => {
    it('should return classroom mismatch error in classroom view when moving to different classroom row', () => {
      // ARRANGE
      const sessionWithClassroom1: ClassSession = {
        id: 's1',
        course: mockCourse1,
        group: mockGroup1,
        instructor: mockInstructor1,
        classroom: mockClassroom1,
        period_count: 1,
        user_id: MOCK_USER_ID,
        created_at: MOCK_CREATED_AT,
      };
      
      const timetable = new Map();
      timetable.set(mockClassroom1.id, new Array(40).fill(null));
      timetable.set(mockClassroom2.id, new Array(40).fill(null));

      // ACT
      // Try to move a session from Classroom 1's row to Classroom 2's row in classroom view
      const result = checkTimetableConflicts(
        timetable,
        sessionWithClassroom1,
        mockSettings,
        mockClassroom2.id, // Target is different classroom
        5,
        [mockProgramCS],
        'classroom',
        true // This is a move operation
      );

      // ASSERT
      expect(result).toContain('Classroom mismatch');
      expect(result).toContain('Cannot move session using classroom');
      expect(result).toContain(mockClassroom1.name);
    });

    it('should return instructor mismatch error in instructor view when moving to different instructor row', () => {
      // ARRANGE
      const sessionWithInstructor1: ClassSession = {
        id: 's1',
        course: mockCourse1,
        group: mockGroup1,
        instructor: mockInstructor1,
        classroom: mockClassroom1,
        period_count: 1,
        user_id: MOCK_USER_ID,
        created_at: MOCK_CREATED_AT,
      };
      
      const timetable = new Map();
      timetable.set(mockInstructor1.id, new Array(40).fill(null));
      timetable.set(mockInstructor2.id, new Array(40).fill(null));

      // ACT
      // Try to move a session from Instructor 1's row to Instructor 2's row in instructor view
      const result = checkTimetableConflicts(
        timetable,
        sessionWithInstructor1,
        mockSettings,
        mockInstructor2.id, // Target is different instructor
        5,
        [mockProgramCS],
        'instructor',
        true // This is a move operation
      );

      // ASSERT
      expect(result).toContain('Instructor mismatch');
      expect(result).toContain('Cannot move session taught by');
      expect(result).toContain(mockInstructor1.first_name);
      expect(result).toContain(mockInstructor1.last_name);
    });

    it('should allow moving within same classroom row in classroom view', () => {
      // ARRANGE
      const sessionWithClassroom1: ClassSession = {
        id: 's1',
        course: mockCourse1,
        group: mockGroup1,
        instructor: mockInstructor1,
        classroom: mockClassroom1,
        period_count: 1,
        user_id: MOCK_USER_ID,
        created_at: MOCK_CREATED_AT,
      };
      
      const timetable = new Map();
      timetable.set(mockClassroom1.id, new Array(40).fill(null));

      // ACT
      // Move within the same classroom row
      const result = checkTimetableConflicts(
        timetable,
        sessionWithClassroom1,
        mockSettings,
        mockClassroom1.id, // Same classroom
        5,
        [mockProgramCS],
        'classroom',
        true // This is a move operation
      );

      // ASSERT
      expect(result).not.toContain('Classroom mismatch');
    });

    it('should allow moving within same instructor row in instructor view', () => {
      // ARRANGE
      const sessionWithInstructor1: ClassSession = {
        id: 's1',
        course: mockCourse1,
        group: mockGroup1,
        instructor: mockInstructor1,
        classroom: mockClassroom1,
        period_count: 1,
        user_id: MOCK_USER_ID,
        created_at: MOCK_CREATED_AT,
      };
      
      const timetable = new Map();
      timetable.set(mockInstructor1.id, new Array(40).fill(null));

      // ACT
      // Move within the same instructor row
      const result = checkTimetableConflicts(
        timetable,
        sessionWithInstructor1,
        mockSettings,
        mockInstructor1.id, // Same instructor
        5,
        [mockProgramCS],
        'instructor',
        true // This is a move operation
      );

      // ASSERT
      expect(result).not.toContain('Instructor mismatch');
    });

    it('should use class-group validation as default when viewMode is not specified', () => {
      // ARRANGE
      const sessionForGroup1: ClassSession = {
        id: 's1',
        course: mockCourse1,
        group: mockGroup1,
        instructor: mockInstructor1,
        classroom: mockClassroom1,
        period_count: 1,
        user_id: MOCK_USER_ID,
        created_at: MOCK_CREATED_AT,
      };
      
      const timetable = new Map();
      timetable.set(mockGroup1.id, new Array(40).fill(null));
      timetable.set(mockGroup2.id, new Array(40).fill(null));

      // ACT
      // Call without viewMode (should default to 'class-group')
      const result = checkTimetableConflicts(
        timetable,
        sessionForGroup1,
        mockSettings,
        mockGroup2.id,
        5,
        [mockProgramCS],
        undefined, // No viewMode parameter
        true // This is a move operation
      );

      // ASSERT
      expect(result).toContain('Group mismatch');
    });

    it('should allow assigning sessions from drawer to any row in classroom/instructor views', () => {
      // ARRANGE
      // Session has classroom1, but we're assigning (not moving) to classroom2's row
      const sessionWithClassroom1: ClassSession = {
        id: 's1',
        course: mockCourse1,
        group: mockGroup1,
        instructor: mockInstructor1,
        classroom: mockClassroom1,
        period_count: 1,
        user_id: MOCK_USER_ID,
        created_at: MOCK_CREATED_AT,
      };
      
      const timetable = new Map();
      timetable.set(mockClassroom1.id, new Array(40).fill(null));
      timetable.set(mockClassroom2.id, new Array(40).fill(null));

      // ACT - Drawer assignment (isMovingSession = false) to different classroom row
      const resultClassroom = checkTimetableConflicts(
        timetable,
        sessionWithClassroom1,
        mockSettings,
        mockClassroom2.id, // Different classroom than session's classroom
        5,
        [mockProgramCS],
        'classroom',
        false // This is an assignment from drawer, not a move
      );

      // Test instructor view as well
      const timetableInstructor = new Map();
      timetableInstructor.set(mockInstructor1.id, new Array(40).fill(null));
      timetableInstructor.set(mockInstructor2.id, new Array(40).fill(null));

      const resultInstructor = checkTimetableConflicts(
        timetableInstructor,
        sessionWithClassroom1,
        mockSettings,
        mockInstructor2.id, // Different instructor than session's instructor
        5,
        [mockProgramCS],
        'instructor',
        false // This is an assignment from drawer, not a move
      );

      // ASSERT
      // When assigning from drawer, resource mismatch checks should NOT apply
      expect(resultClassroom).not.toContain('Classroom mismatch');
      expect(resultInstructor).not.toContain('Instructor mismatch');
    });
  });

});
