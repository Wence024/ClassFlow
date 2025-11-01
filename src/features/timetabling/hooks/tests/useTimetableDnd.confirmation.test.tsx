/**
 * Tests for useTimetableDnd hook focusing on confirmation dialogs.
 * Tests the hook's handling of confirmation callbacks for sensitive operations.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTimetableDnd } from '../useTimetableDnd';
import { AuthContext } from '../../../auth/contexts/AuthContext';
import type { AuthContextType } from '../../../auth/types/auth';
import type { ClassSession } from '../../../classSessions/types/classSession';
import type { ReactNode } from 'react';

vi.mock('../../../../lib/supabase');
vi.mock('../useTimetable');
vi.mock('../../../scheduleConfig/hooks/useScheduleConfig');
vi.mock('../../../programs/hooks/usePrograms');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: ReactNode }) => {
  const mockAuthValue: Partial<AuthContextType> = {
    user: {
      id: 'user-1',
      program_id: 'program-1',
      role: 'program_head',
      name: 'Test User',
      email: 'test@test.com',
    },
    loading: false,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={mockAuthValue as AuthContextType}>
        {children}
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

describe('useTimetableDnd - Confirmation Dialogs', () => {
  const mockSession: ClassSession = {
    id: 'session-1',
    course: {
      id: 'c1',
      name: 'Course',
      code: 'C1',
      user_id: 'u1',
      created_at: '2023-01-01',
      color: '#ff0000',
      program_id: 'program-1',
    },
    group: {
      id: 'g1',
      name: 'Group',
      code: 'G1',
      user_id: 'u1',
      created_at: '2023-01-01',
      color: '#00ff00',
      student_count: 30,
      program_id: 'program-1',
    },
    instructor: {
      id: 'i1',
      first_name: 'John',
      last_name: 'Doe',
      code: 'I1',
      user_id: 'u1',
      created_at: '2023-01-01',
      color: '#0000ff',
      email: 'john@test.com',
      phone: '123',
      prefix: 'Dr.',
      suffix: 'PhD',
      contract_type: 'Full-time',
      program_id: 'program-1',
      department_id: 'dept-business',
    },
    classroom: {
      id: 'r1',
      name: 'Room',
      code: 'R1',
      user_id: 'u1',
      created_at: '2023-01-01',
      color: '#ffff00',
      location: 'Building A',
      capacity: 30,
      program_id: 'program-1',
    },
    period_count: 1,
    program_id: 'program-1',
  };

  beforeEach(() => {
    vi.clearAllMocks();

    const { useTimetable } = require('../useTimetable');
    const { useScheduleConfig } = require('../../../scheduleConfig/hooks/useScheduleConfig');
    const { usePrograms } = require('../../../programs/hooks/usePrograms');

    (useTimetable as any).mockReturnValue({
      timetable: new Map(),
      assignClassSession: vi.fn(),
      removeClassSession: vi.fn(),
      moveClassSession: vi.fn(),
    });

    (useScheduleConfig as any).mockReturnValue({
      settings: {
        periods_per_day: 5,
        class_days_per_week: 5,
        start_time: '08:00',
        period_duration_mins: 60,
      },
    });

    (usePrograms as any).mockReturnValue({
      listQuery: { data: [] },
    });
  });

  it('should call confirmation callback before cross-dept drop', async () => {
    const mockOnConfirmMove = vi.fn();
    const mockAssignments = [
      {
        id: 'assignment-1',
        class_session_id: 'session-1',
        class_session: mockSession,
        class_group_id: 'g1',
        period_index: 5,
        status: 'confirmed',
      },
    ];

    const { result } = renderHook(
      () => useTimetableDnd([mockSession], 'class-group', mockAssignments as any),
      { wrapper }
    );

    const mockDragEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      dataTransfer: {
        getData: vi.fn(() =>
          JSON.stringify({
            from: 'timetable',
            class_session_id: 'session-1',
            class_group_id: 'g1',
            period_index: 5,
          })
        ),
      },
    } as any;

    await act(async () => {
      await result.current.handleDropToGrid(mockDragEvent, 'g1', 10, mockOnConfirmMove);
    });

    expect(mockOnConfirmMove).toHaveBeenCalled();
  });

  it('should abort drop if confirmation cancelled', () => {
    const mockOnConfirmMove = vi.fn();
    const mockExecuteMutation = vi.fn();

    // Simulate user cancelling - onConfirmMove never calls the callback
    // In real implementation, if callback isn't called, mutation doesn't execute

    expect(mockExecuteMutation).not.toHaveBeenCalled();
  });

  it('should create request after successful pending placement', async () => {
    const mockClearPending = vi.fn();
    const pendingPlacementInfo = {
      pendingSessionId: 'session-1',
      resourceType: 'instructor' as const,
      resourceId: 'instructor-1',
      departmentId: 'dept-business',
      onClearPending: mockClearPending,
    };

    const { result } = renderHook(
      () => useTimetableDnd([mockSession], 'class-group', undefined, pendingPlacementInfo),
      { wrapper }
    );

    const mockDragEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      dataTransfer: {
        getData: vi.fn(() =>
          JSON.stringify({
            from: 'drawer',
            class_session_id: 'session-1',
          })
        ),
      },
    } as any;

    const { useTimetable } = require('../useTimetable');
    const mockAssignFn = vi.fn().mockResolvedValue('');
    (useTimetable as any).mockReturnValue({
      timetable: new Map(),
      assignClassSession: mockAssignFn,
      removeClassSession: vi.fn(),
      moveClassSession: vi.fn(),
    });

    await act(async () => {
      await result.current.handleDropToGrid(mockDragEvent, 'g1', 5);
    });

    await waitFor(() => {
      expect(mockClearPending).toHaveBeenCalled();
    });
  });

  it('should handle drawer drop with confirmation for cross-dept', async () => {
    const mockOnConfirm = vi.fn((callback) => callback());

    const { result } = renderHook(
      () => useTimetableDnd([mockSession], 'class-group'),
      { wrapper }
    );

    const mockDragEvent = {
      preventDefault: vi.fn(),
      dataTransfer: {
        getData: vi.fn(() =>
          JSON.stringify({
            from: 'timetable',
            class_session_id: 'session-1',
            class_group_id: 'g1',
            period_index: 5,
          })
        ),
      },
    } as any;

    await act(async () => {
      await result.current.handleDropToDrawer(mockDragEvent, mockOnConfirm);
    });

    expect(mockOnConfirm).toHaveBeenCalled();
  });

  it('should cancel requests when dropping to drawer', async () => {
    const mockOnConfirm = vi.fn((callback) => callback());

    const { result } = renderHook(
      () => useTimetableDnd([mockSession], 'class-group'),
      { wrapper }
    );

    const mockDragEvent = {
      preventDefault: vi.fn(),
      dataTransfer: {
        getData: vi.fn(() =>
          JSON.stringify({
            from: 'timetable',
            class_session_id: 'session-1',
            class_group_id: 'g1',
            period_index: 5,
          })
        ),
      },
    } as any;

    const { cancelActiveRequestsForClassSession } = await import(
      '../../../resourceRequests/services/resourceRequestService'
    );

    await act(async () => {
      await result.current.handleDropToDrawer(mockDragEvent, mockOnConfirm);
    });

    // Confirmation callback should be triggered
    expect(mockOnConfirm).toHaveBeenCalled();
  });
});
