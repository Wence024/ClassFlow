import { vi } from 'vitest';
import {
  assignSessionToTimetable,
  getTimetableAssignments,
  removeSessionFromTimetable,
  moveSessionInTimetable,
  CURRENT_TIMETABLE_VERSION,
} from './timetableService';

interface TimetableAssignmentInput {
  class_group_id: string;
  period_index: number;
  class_session_id: string;
  user_id: string;
  created_at: string | null;
}

interface TimetableAssignment extends TimetableAssignmentInput {
  id: string;
  data_version: number;
}

type ChainableMock = ReturnType<typeof vi.fn>;

interface MockSupabaseQueryBuilder {
  select: ChainableMock;
  eq: ChainableMock;
  insert: ChainableMock;
  update: ChainableMock;
  upsert: ChainableMock;
  delete: ChainableMock;
  from: ChainableMock;
  single: vi.Mock<Promise<{ data: any; error: any }>, []>;
}

const mockSupabaseQueryBuilder: MockSupabaseQueryBuilder = {
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  upsert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  single: vi.fn(),
};

vi.mock('../../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => mockSupabaseQueryBuilder),
  },
}));

const mockAssignmentInput = {
  class_group_id: 'group-id',
  period_index: 1,
  class_session_id: 'session-id',
  user_id: 'user-id',
  created_at: null,
};

const mockAssignmentWithId = {
  ...mockAssignmentInput,
  id: '123',
  data_version: CURRENT_TIMETABLE_VERSION,
};

describe('TimetableService', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Ensure all chained methods return the builder
    mockSupabaseQueryBuilder.select.mockReturnThis();
    mockSupabaseQueryBuilder.eq.mockReturnThis();
    mockSupabaseQueryBuilder.insert.mockReturnThis();
    mockSupabaseQueryBuilder.upsert.mockReturnThis();
    mockSupabaseQueryBuilder.update.mockReturnThis();
    mockSupabaseQueryBuilder.delete.mockReturnThis();
    mockSupabaseQueryBuilder.from.mockReturnThis();
  });

  describe('assignSessionToTimetable', () => {
    test('should insert and return assigned record with id', async () => {
      mockSupabaseQueryBuilder.single.mockResolvedValueOnce({
        data: mockAssignmentWithId,
        error: null,
      });

      const result = await assignSessionToTimetable(mockAssignmentInput);

      expect(mockSupabaseQueryBuilder.upsert).toHaveBeenCalledWith(
        [{ ...mockAssignmentInput, data_version: CURRENT_TIMETABLE_VERSION }],
        { onConflict: 'user_id,class_group_id,period_index' }
      );
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

      expect(mockSupabaseQueryBuilder.upsert).toHaveBeenCalledWith(
        [{ ...mockAssignmentInput, data_version: CURRENT_TIMETABLE_VERSION }],
        { onConflict: 'user_id,class_group_id,period_index' }
      );
    });
  });

  describe('getTimetableAssignments', () => {
    test('should return assignments and check data_version', async () => {
      const mockRows = [{ ...mockAssignmentWithId }, { ...mockAssignmentWithId, data_version: 1 }];

      mockSupabaseQueryBuilder.eq.mockResolvedValueOnce({ data: mockRows, error: null });

      vi.spyOn(console, 'warn').mockImplementation(() => {}); // silence warning

      const result = await getTimetableAssignments('user-id');

      expect(result).toEqual(mockRows);
      expect(console.warn).toHaveBeenCalledWith(
        'Some timetable assignments are not at the current data version. Migration may be needed.'
      );
    });

    test('should throw if Supabase returns error', async () => {
      mockSupabaseQueryBuilder.eq.mockResolvedValueOnce({
        data: null,
        error: { message: 'fail' },
      });

      await expect(getTimetableAssignments('user-id')).rejects.toThrow('fail');
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

      // Then for upsert/assign
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
