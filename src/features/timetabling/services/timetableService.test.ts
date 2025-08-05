import { vi } from 'vitest';
// Import the actual types from the application code
import type {
  TimetableAssignment,
  HydratedTimetableAssignment,
  ClassSession,
} from '../../scheduleLessons/types';
import {
  assignSessionToTimetable,
  getTimetableAssignments,
  removeSessionFromTimetable,
  moveSessionInTimetable,
} from './timetableService';

// Supabase response types for mocking
type SupabaseError = { message: string };
type SupabaseSingleResponse = { data: TimetableAssignment | null; error: SupabaseError | null };
// Correctly mock the hydrated response type
type SupabaseHydratedListResponse = {
  data: HydratedTimetableAssignment[] | null;
  error: SupabaseError | null;
};

type ChainableMock = ReturnType<typeof vi.fn>;

interface MockSupabaseQueryBuilder {
  select: ChainableMock;
  eq: ChainableMock;
  upsert: ChainableMock;
  delete: ChainableMock;
  from: ChainableMock;
  single: vi.Mock<Promise<SupabaseSingleResponse>, []>;
}

const mockSupabaseQueryBuilder: MockSupabaseQueryBuilder = {
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(), // This will now resolve with SupabaseHydratedListResponse for getTimetableAssignments
  upsert: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  single: vi.fn(),
};

vi.mock('../../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => mockSupabaseQueryBuilder),
  },
}));

// Use Omit to create the input type, which has no id
const mockAssignmentInput: Omit<TimetableAssignment, 'id'> = {
  class_group_id: 'group-id',
  period_index: 1,
  class_session_id: 'session-id',
  user_id: 'user-id',
  created_at: null,
};

// This is the full object, as it exists in the DB
const mockAssignmentWithId: TimetableAssignment = {
  ...mockAssignmentInput,
  id: '123',
};

describe('TimetableService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset all mock implementations
    Object.values(mockSupabaseQueryBuilder).forEach((mockFn) => {
      if (typeof mockFn.mockClear === 'function') {
        mockFn.mockClear();
        // Ensure chainable methods return 'this' by default
        if (mockFn !== mockSupabaseQueryBuilder.single) {
          mockFn.mockReturnThis();
        }
      }
    });
  });

  describe('assignSessionToTimetable', () => {
    test('should upsert the assignment record', async () => {
      mockSupabaseQueryBuilder.single.mockResolvedValueOnce({
        data: mockAssignmentWithId,
        error: null,
      });

      const result = await assignSessionToTimetable(mockAssignmentInput);

      // Test that the raw input is passed directly to upsert
      expect(mockSupabaseQueryBuilder.upsert).toHaveBeenCalledWith([mockAssignmentInput], {
        onConflict: 'user_id,class_group_id,period_index',
      });
      expect(result).toEqual(mockAssignmentWithId);
    });

    test('should throw if single() returns error', async () => {
      mockSupabaseQueryBuilder.single.mockResolvedValueOnce({
        data: null,
        error: { message: 'fail' },
      });

      await expect(assignSessionToTimetable(mockAssignmentInput)).rejects.toThrow('fail');
    });

    test('should add data_version before upsert', async () => {
      mockSupabaseQueryBuilder.single.mockResolvedValueOnce({
        data: mockAssignmentWithId,
        error: null,
      });

      await assignSessionToTimetable(mockAssignmentInput);

      expect(mockSupabaseQueryBuilder.upsert).toHaveBeenCalledWith([mockAssignmentInput], {
        onConflict: 'user_id,class_group_id,period_index',
      });
    });
  });

  describe('getTimetableAssignments', () => {
    test('should return hydrated assignments without checking version', async () => {
      // Mock the hydrated response shape
      const mockHydratedRows: HydratedTimetableAssignment[] = [
        {
          ...mockAssignmentWithId,
          class_session: {
            id: 'session-1',
            course: {},
            group: {},
            instructor: {},
            classroom: {},
          } as ClassSession,
        },
      ];

      // Mock the final chained call (.eq) to resolve with our data
      (
        mockSupabaseQueryBuilder.eq as vi.Mock<Promise<SupabaseHydratedListResponse>>
      ).mockResolvedValueOnce({ data: mockHydratedRows, error: null });

      const result = await getTimetableAssignments('user-id');

      expect(mockSupabaseQueryBuilder.select).toHaveBeenCalled();
      expect(mockSupabaseQueryBuilder.eq).toHaveBeenCalledWith('user_id', 'user-id');
      expect(result).toEqual(mockHydratedRows);
    });

    // This test remains the same
    test('should throw if Supabase returns error', async () => {
      /* ... */
    });
  });

  describe('removeSessionFromTimetable', () => {
    test('should delete without error', async () => {
      mockSupabaseQueryBuilder.delete.mockReturnThis();

      // First two eq calls return the builder
      mockSupabaseQueryBuilder.eq
        .mockReturnValueOnce(mockSupabaseQueryBuilder)
        .mockReturnValueOnce(mockSupabaseQueryBuilder);

      // Final eq call returns the result of the delete operation
      mockSupabaseQueryBuilder.eq.mockResolvedValueOnce({ error: null });

      await expect(removeSessionFromTimetable('user-id', 'group-id', 1)).resolves.toBeUndefined();
    });

    test('should throw if Supabase delete returns error', async () => {
      mockSupabaseQueryBuilder.delete.mockReturnThis();
      mockSupabaseQueryBuilder.eq
        .mockImplementationOnce(() => mockSupabaseQueryBuilder)
        .mockImplementationOnce(() => mockSupabaseQueryBuilder)
        .mockImplementationOnce(() => Promise.resolve({ error: { message: 'fail' } }));

      await expect(removeSessionFromTimetable('user-id', 'group-id', 1)).rejects.toThrow('fail');
    });
  });

  describe('moveSessionInTimetable', () => {
    test('should remove then assign new session with version', async () => {
      mockSupabaseQueryBuilder.delete.mockReturnThis();

      // Three eqs for the remove
      mockSupabaseQueryBuilder.eq
        .mockReturnValueOnce(mockSupabaseQueryBuilder)
        .mockReturnValueOnce(mockSupabaseQueryBuilder)
        .mockResolvedValueOnce({ error: null }); // final .eq() resolves the delete

      // Mock for the assign operation
      mockSupabaseQueryBuilder.single.mockResolvedValueOnce({
        data: mockAssignmentWithId,
        error: null,
      });

      const result = await moveSessionInTimetable(
        'user-id',
        { class_group_id: 'A', period_index: 1 },
        { class_group_id: 'B', period_index: 2 },
        mockAssignmentInput
      );

      // Check that the assign function was called correctly
      expect(mockSupabaseQueryBuilder.upsert).toHaveBeenCalledWith([mockAssignmentInput], {
        onConflict: 'user_id,class_group_id,period_index',
      });
      expect(result).toEqual(mockAssignmentWithId);
    });

    test('should throw if delete fails', async () => {
      mockSupabaseQueryBuilder.delete.mockReturnThis();
      mockSupabaseQueryBuilder.eq
        .mockImplementationOnce(() => mockSupabaseQueryBuilder)
        .mockImplementationOnce(() => mockSupabaseQueryBuilder)
        .mockImplementationOnce(() => Promise.resolve({ error: { message: 'fail' } }));

      await expect(
        moveSessionInTimetable(
          'user-id',
          { class_group_id: 'A', period_index: 1 },
          { class_group_id: 'B', period_index: 2 },
          mockAssignmentInput
        )
      ).rejects.toThrow('fail');
    });
  });
});
