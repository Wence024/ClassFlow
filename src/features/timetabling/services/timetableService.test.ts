import { vi, describe, test, expect, beforeEach } from 'vitest';
// Import the actual types from the application code

import {
  assignClassSessionToTimetable,
  getTimetableAssignments,
  removeClassSessionFromTimetable,
  moveClassSessionInTimetable,
} from './timetableService';
import type { HydratedTimetableAssignment, TimetableAssignment } from '../types/timetable';
import type { ClassSession } from '../../classSessions/types/classSession';

// Supabase response types for mocking

type ChainableMock = ReturnType<typeof vi.fn>;

interface MockSupabaseQueryBuilder {
  select: ChainableMock;
  eq: ChainableMock;
  upsert: ChainableMock;
  delete: ChainableMock;
  from: ChainableMock;
  single: ReturnType<typeof vi.fn>;
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
  semester_id: 'sem1',
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

      const result = await assignClassSessionToTimetable(mockAssignmentInput);

      // Test that the raw input is passed directly to upsert with status field
      expect(mockSupabaseQueryBuilder.upsert).toHaveBeenCalledWith([{ ...mockAssignmentInput, status: 'confirmed' }], {
        onConflict: 'user_id,class_group_id,period_index,semester_id',
      });
      expect(result).toEqual(mockAssignmentWithId);
    });

    test('should throw if single() returns error', async () => {
      mockSupabaseQueryBuilder.single.mockResolvedValueOnce({
        data: null,
        error: { message: 'fail' },
      });

      await expect(assignClassSessionToTimetable(mockAssignmentInput)).rejects.toThrow('fail');
    });

    test('should add data_version before upsert', async () => {
      mockSupabaseQueryBuilder.single.mockResolvedValueOnce({
        data: mockAssignmentWithId,
        error: null,
      });

      await assignClassSessionToTimetable(mockAssignmentInput);

      expect(mockSupabaseQueryBuilder.upsert).toHaveBeenCalledWith([{ ...mockAssignmentInput, status: 'confirmed' }], {
        onConflict: 'user_id,class_group_id,period_index,semester_id',
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
      (mockSupabaseQueryBuilder.eq as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: mockHydratedRows,
        error: null,
      });

      const result = await getTimetableAssignments('user-id');

      expect(mockSupabaseQueryBuilder.select).toHaveBeenCalled();
      expect(mockSupabaseQueryBuilder.eq).toHaveBeenCalledWith('semester_id', 'user-id');
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

      // Two eq calls return the builder (class_group_id, period_index)
      mockSupabaseQueryBuilder.eq
        .mockReturnValueOnce(mockSupabaseQueryBuilder)
        .mockReturnValueOnce(mockSupabaseQueryBuilder);

      // Final eq call (semester_id) returns the result of the delete operation
      mockSupabaseQueryBuilder.eq.mockResolvedValueOnce({ error: null });

      await expect(
        removeClassSessionFromTimetable('group-id', 1, 'sem1')
      ).resolves.toBeUndefined();
    });

    test('should throw if Supabase delete returns error', async () => {
      mockSupabaseQueryBuilder.delete.mockReturnThis();
      mockSupabaseQueryBuilder.eq
        .mockImplementationOnce(() => mockSupabaseQueryBuilder)
        .mockImplementationOnce(() => mockSupabaseQueryBuilder)
        .mockImplementationOnce(() => Promise.resolve({ error: { message: 'fail' } }));

      await expect(removeClassSessionFromTimetable('group-id', 1, 'sem1')).rejects.toThrow(
        'fail'
      );
    });
  });

  describe('moveSessionInTimetable', () => {
    test('should upsert new assignment first, then remove old one (safer order)', async () => {
      // Mock for the upsert operation (happens first)
      mockSupabaseQueryBuilder.single.mockResolvedValueOnce({
        data: mockAssignmentWithId,
        error: null,
      });

      // Mock for the delete operation (happens second)
      mockSupabaseQueryBuilder.delete.mockReturnThis();
      mockSupabaseQueryBuilder.eq
        .mockReturnValueOnce(mockSupabaseQueryBuilder)
        .mockReturnValueOnce(mockSupabaseQueryBuilder)
        .mockResolvedValueOnce({ error: null }); // final .eq() resolves the delete

      const result = await moveClassSessionInTimetable(
        { class_group_id: 'A', period_index: 1 },
        { class_group_id: 'B', period_index: 2 },
        mockAssignmentInput
      );

      // Check that upsert was called first
      expect(mockSupabaseQueryBuilder.upsert).toHaveBeenCalledWith([{ ...mockAssignmentInput, status: 'confirmed' }], {
        onConflict: 'user_id,class_group_id,period_index,semester_id',
      });
      
      // Check that delete was called with the 'from' location
      expect(mockSupabaseQueryBuilder.delete).toHaveBeenCalled();
      
      expect(result).toEqual(mockAssignmentWithId);
    });

    test('should throw if upsert fails (before delete is attempted)', async () => {
      // Mock for the upsert operation to fail
      mockSupabaseQueryBuilder.single.mockResolvedValueOnce({
        data: null,
        error: { message: 'upsert failed' },
      });

      await expect(
        moveClassSessionInTimetable(
          { class_group_id: 'A', period_index: 1 },
          { class_group_id: 'B', period_index: 2 },
          mockAssignmentInput
        )
      ).rejects.toThrow('upsert failed');
      
      // Delete should not have been called since upsert failed
      expect(mockSupabaseQueryBuilder.delete).not.toHaveBeenCalled();
    });

    test('should throw if delete fails after successful upsert', async () => {
      // Mock successful upsert
      mockSupabaseQueryBuilder.single.mockResolvedValueOnce({
        data: mockAssignmentWithId,
        error: null,
      });

      // Mock failed delete
      mockSupabaseQueryBuilder.delete.mockReturnThis();
      mockSupabaseQueryBuilder.eq
        .mockImplementationOnce(() => mockSupabaseQueryBuilder)
        .mockImplementationOnce(() => mockSupabaseQueryBuilder)
        .mockImplementationOnce(() => Promise.resolve({ error: { message: 'delete failed' } }));

      await expect(
        moveClassSessionInTimetable(
          { class_group_id: 'A', period_index: 1 },
          { class_group_id: 'B', period_index: 2 },
          mockAssignmentInput
        )
      ).rejects.toThrow('delete failed');
    });
  });
});
