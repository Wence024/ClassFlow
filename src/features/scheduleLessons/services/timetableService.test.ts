import { vi } from 'vitest';
import { assignSessionToTimetable } from './timetableService';

interface TimetableAssignmentInput {
  class_group_id: string;
  period_index: number;
  class_session_id: string;
  user_id: string;
  data_version?: number;
  created_at: string | null;
}

interface TimetableAssignment extends TimetableAssignmentInput {
  id: string;
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
  single: vi.Mock<
    Promise<{ data: TimetableAssignment | null; error: { message: string } | null }>,
    []
  >;
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

// Mock data with ID (full TimetableAssignment)
const mockAssignmentWithId: TimetableAssignment = {
  id: '123',
  class_group_id: 'group1',
  period_index: 1,
  class_session_id: 'session1',
  user_id: 'user1',
  created_at: null,
};

// Mock input data without ID (TimetableAssignmentInput)
const mockAssignmentInput = {
  class_group_id: '11111111-1111-1111-1111-111111111111',
  period_index: 1,
  class_session_id: '22222222-2222-2222-2222-222222222222',
  user_id: '33333333-3333-3333-3333-333333333333',
  created_at: null,
};

describe('assignSessionToTimetable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should insert assignment without id and return assigned with id', async () => {
    // Setup mocks to return the query builder for chaining
    mockSupabaseQueryBuilder.upsert.mockReturnValueOnce(mockSupabaseQueryBuilder);
    // Setup single() to resolve with expected data and no error
    mockSupabaseQueryBuilder.single.mockResolvedValueOnce({
      data: mockAssignmentWithId,
      error: null,
    });

    const result = await assignSessionToTimetable(mockAssignmentInput);

    expect(mockSupabaseQueryBuilder.upsert).toHaveBeenCalledWith(
      [{ ...mockAssignmentInput, data_version: 2 }],
      { onConflict: 'user_id,class_group_id,period_index' }
    );

    expect(result).toEqual(mockAssignmentWithId);
  });

  test('should handle error returned from single', async () => {
    const errorMessage = 'Insert failed';
    mockSupabaseQueryBuilder.upsert.mockReturnValueOnce(mockSupabaseQueryBuilder);
    mockSupabaseQueryBuilder.single.mockResolvedValueOnce({
      data: null,
      error: { message: errorMessage },
    });

    await expect(assignSessionToTimetable(mockAssignmentInput)).rejects.toThrow(errorMessage);

    expect(mockSupabaseQueryBuilder.upsert).toHaveBeenCalledWith(
      [{ ...mockAssignmentInput, data_version: 2 }],
      { onConflict: 'user_id,class_group_id,period_index' }
    );
  });

  test('should add data_version before upserting', async () => {
    mockSupabaseQueryBuilder.upsert.mockReturnValueOnce(mockSupabaseQueryBuilder);
    mockSupabaseQueryBuilder.single.mockResolvedValueOnce({
      data: mockAssignmentWithId,
      error: null,
    });

    await assignSessionToTimetable(mockAssignmentInput);

    expect(mockSupabaseQueryBuilder.upsert).toHaveBeenCalledWith(
      [{ ...mockAssignmentInput, data_version: 2 }],
      { onConflict: 'user_id,class_group_id,period_index' }
    );
  });

  // Additional tests can be added here to cover other behavior
});
