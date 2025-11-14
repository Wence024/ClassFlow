import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTimetableDnd } from '../useTimetableDnd';
import * as useTimetableHook from '../useTimetable';
import * as useScheduleConfigHook from '../../../scheduleConfig/hooks/useScheduleConfig';
import * as useProgramsHook from '../../../programs/hooks/usePrograms';
import { AuthContext } from '../../../auth/contexts/AuthContext';
import type { ClassSession } from '../../../classSessions/types/classSession';
import type { User } from '../../../auth/types/auth';
import type { DragSource } from '../../types/DragSource';
import type { TimetableGrid } from '../../utils/timetableLogic';
import type {
  ClassGroup,
  Course,
  Instructor,
  Classroom,
} from '../../../classSessionComponents/types';

vi.mock('../useTimetable');

const queryClient = new QueryClient();

/**
 * Test suite for useTimetableDnd hook.
 *
 * Verifies drag-and-drop functionality for the timetabling feature, including:
 * - Drag state management
 * - Visual feedback for available slots
 * - Permission checks for moving sessions
 * - Drop handling for grid and drawer.
 */
describe('useTimetableDnd', () => {
  const mockUser: User = {
    id: 'u1',
    name: 'Test User',
    email: 'test@example.com',
    program_id: 'p1',
    role: 'program_head',
  };

  const mockClassGroup: ClassGroup = {
    id: 'g1',
    name: 'Group 1',
    user_id: 'u1',
    created_at: '2025-01-01T00:00:00Z',
    program_id: 'p1',
    code: 'G1',
    color: '#fff',
    student_count: 30,
  };

  const mockOwnedSession: ClassSession = {
    id: 's1',
    period_count: 1,
    program_id: 'p1',
    user_id: 'u1',
    course_id: 'c1',
    class_group_id: 'g1',
    classroom_id: 'r1',
    instructor_id: 'i1',
    created_at: '2025-01-01T00:00:00Z',
    course: {
      id: 'c1',
      name: 'Math 101',
      code: 'MATH101',
      user_id: 'u1',
      created_at: '2025-01-01T00:00:00Z',
      color: '#ff0000',
      program_id: 'p1',
    } as Course,
    group: mockClassGroup,
    instructor: {
      id: 'i1',
      first_name: 'John',
      last_name: 'Doe',
      user_id: 'u1',
      created_at: '2025-01-01T00:00:00Z',
      program_id: 'p1',
    } as Instructor,
    classroom: {
      id: 'r1',
      name: 'Room 101',
      user_id: 'u1',
      created_at: '2025-01-01T00:00:00Z',
      program_id: 'p1',
    } as Classroom,
  };

  const mockOtherProgramSession: ClassSession = {
    ...mockOwnedSession,
    id: 's2',
    program_id: 'p2',
    user_id: 'u2',
  };

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider
        value={{
          user: mockUser,
          loading: false,
          role: 'program_head',
          login: vi.fn(),
          logout: vi.fn(),
          error: null,
          clearError: vi.fn(),
        }}
      >
        {children}
      </AuthContext.Provider>
    </QueryClientProvider>
  );

  const mockTimetable: TimetableGrid = new Map([['g1', [null, [mockOwnedSession], null]]]);

  const mockTimetableOperations = {
    timetable: mockTimetable,
    assignClassSession: vi.fn().mockResolvedValue(''),
    removeClassSession: vi.fn().mockResolvedValue(undefined),
    moveClassSession: vi.fn().mockResolvedValue(''),
    groups: [mockClassGroup],
    loading: false,
    error: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();

    vi.spyOn(useTimetableHook, 'useTimetable').mockReturnValue(mockTimetableOperations);
    vi.spyOn(useScheduleConfigHook, 'useScheduleConfig').mockReturnValue({
      settings: {
        id: 'config1',
        periods_per_day: 8,
        class_days_per_week: 5,
        start_time: '08:00',
        period_duration_mins: 45,
        created_at: '2025-01-01T00:00:00Z',
        semester_id: 'sem1',
      },
      isLoading: false,
      isUpdating: false,
      updateSettings: vi.fn(),
      error: null,
    });
    vi.spyOn(useProgramsHook, 'usePrograms').mockReturnValue({
      listQuery: {
        data: [{ id: 'p1', name: 'Program 1' }],
        isLoading: false,
        error: null,
      },
    } as ReturnType<typeof useProgramsHook.usePrograms>);
  });

  it('should initialize with null drag state', () => {
    const { result } = renderHook(() => useTimetableDnd([mockOwnedSession], 'class-group', 'dept-cs'), {
      wrapper,
    });

    expect(result.current.activeDraggedSession).toBeNull();
    expect(result.current.dragOverCell).toBeNull();
  });

  it('should update drag state on drag start', () => {
    const { result } = renderHook(() => useTimetableDnd([mockOwnedSession], 'class-group', 'dept-cs'), {
      wrapper,
    });

    const dragSource: DragSource = {
      from: 'drawer',
      class_session_id: 's1',
    };

    const mockEvent = {
      dataTransfer: {
        setData: vi.fn(),
        effectAllowed: '',
      },
    } as unknown as React.DragEvent;

    act(() => {
      result.current.handleDragStart(mockEvent, dragSource);
    });

    expect(result.current.activeDraggedSession).toEqual(mockOwnedSession);
  });

  it('should return false for slot availability when dragging other program session from timetable', () => {
    const { result } = renderHook(() => useTimetableDnd([mockOtherProgramSession], 'class-group', 'dept-cs'), {
      wrapper,
    });

    const dragSource: DragSource = {
      from: 'timetable',
      class_session_id: 's2',
      class_group_id: 'g1',
      period_index: 0,
    };

    const mockEvent = {
      dataTransfer: {
        setData: vi.fn(),
        effectAllowed: '',
      },
    } as unknown as React.DragEvent;

    act(() => {
      result.current.handleDragStart(mockEvent, dragSource);
    });

    // Should not allow moving other program's sessions
    const isAvailable = result.current.isSlotAvailable('g1', 2);
    expect(isAvailable).toBe(false);
  });

  it('should allow slot availability when dragging from drawer', () => {
    const { result } = renderHook(() => useTimetableDnd([mockOwnedSession], 'class-group', 'dept-cs'), {
      wrapper,
    });

    const dragSource: DragSource = {
      from: 'drawer',
      class_session_id: 's1',
    };

    const mockEvent = {
      dataTransfer: {
        setData: vi.fn(),
        effectAllowed: '',
      },
    } as unknown as React.DragEvent;

    act(() => {
      result.current.handleDragStart(mockEvent, dragSource);
    });

    // Should allow dragging from drawer to any empty slot
    const isAvailable = result.current.isSlotAvailable('g1', 2);
    expect(isAvailable).toBe(true);
  });

  it('should prevent moving session to different group row when dragging from timetable', () => {
    const { result } = renderHook(() => useTimetableDnd([mockOwnedSession], 'class-group', 'dept-cs'), {
      wrapper,
    });

    const dragSource: DragSource = {
      from: 'timetable',
      class_session_id: 's1',
      class_group_id: 'g1',
      period_index: 1,
    };

    const mockEvent = {
      dataTransfer: {
        setData: vi.fn(),
        effectAllowed: '',
      },
    } as unknown as React.DragEvent;

    act(() => {
      result.current.handleDragStart(mockEvent, dragSource);
    });

    // Should not allow moving to a different group
    const isAvailable = result.current.isSlotAvailable('g2', 0);
    expect(isAvailable).toBe(false);
  });

  it('should call assignClassSession when dropping from drawer', async () => {
    const { result } = renderHook(() => useTimetableDnd([mockOwnedSession], 'class-group', 'dept-cs'), {
      wrapper,
    });

    const dragSource: DragSource = {
      from: 'drawer',
      class_session_id: 's1',
    };

    const mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      dataTransfer: {
        getData: vi.fn().mockReturnValue(JSON.stringify(dragSource)),
      },
    } as unknown as React.DragEvent;

    await result.current.handleDropToGrid(mockEvent, 'g1', 0);

    await waitFor(() => {
      expect(mockTimetableOperations.assignClassSession).toHaveBeenCalledWith(
        'g1',
        0,
        mockOwnedSession
      );
    });
  });

  it('should call moveClassSession when dropping from timetable to different cell', async () => {
    const { result } = renderHook(() => useTimetableDnd([mockOwnedSession], 'class-group', 'dept-cs'), {
      wrapper,
    });

    const dragSource: DragSource = {
      from: 'timetable',
      class_session_id: 's1',
      class_group_id: 'g1',
      period_index: 1,
    };

    const mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      dataTransfer: {
        getData: vi.fn().mockReturnValue(JSON.stringify(dragSource)),
      },
    } as unknown as React.DragEvent;

    await result.current.handleDropToGrid(mockEvent, 'g1', 2);

    await waitFor(() => {
      expect(mockTimetableOperations.moveClassSession).toHaveBeenCalledWith(
        { class_group_id: 'g1', period_index: 1 },
        { class_group_id: 'g1', period_index: 2 },
        mockOwnedSession
      );
    });
  });

  it('should not call moveClassSession when dropping on same cell', async () => {
    const { result } = renderHook(() => useTimetableDnd([mockOwnedSession], 'class-group', 'dept-cs'), {
      wrapper,
    });

    const dragSource: DragSource = {
      from: 'timetable',
      class_session_id: 's1',
      class_group_id: 'g1',
      period_index: 1,
    };

    const mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      dataTransfer: {
        getData: vi.fn().mockReturnValue(JSON.stringify(dragSource)),
      },
    } as unknown as React.DragEvent;

    await result.current.handleDropToGrid(mockEvent, 'g1', 1);

    // Should abort silently without calling mutation
    expect(mockTimetableOperations.moveClassSession).not.toHaveBeenCalled();
  });

  it('should call removeClassSession when dropping on drawer', async () => {
    const { result } = renderHook(() => useTimetableDnd([mockOwnedSession], 'class-group', 'dept-cs'), {
      wrapper,
    });

    const dragSource: DragSource = {
      from: 'timetable',
      class_session_id: 's1',
      class_group_id: 'g1',
      period_index: 1,
    };

    const mockEvent = {
      preventDefault: vi.fn(),
      dataTransfer: {
        getData: vi.fn().mockReturnValue(JSON.stringify(dragSource)),
      },
    } as unknown as React.DragEvent;

    await result.current.handleDropToDrawer(mockEvent);

    await waitFor(() => {
      expect(mockTimetableOperations.removeClassSession).toHaveBeenCalledWith('g1', 1);
    });
  });

  it('should prevent moving other program session from timetable', async () => {
    const { result } = renderHook(() => useTimetableDnd([mockOtherProgramSession], 'class-group', 'dept-cs'), {
      wrapper,
    });

    const dragSource: DragSource = {
      from: 'timetable',
      class_session_id: 's2',
      class_group_id: 'g1',
      period_index: 1,
    };

    const mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      dataTransfer: {
        getData: vi.fn().mockReturnValue(JSON.stringify(dragSource)),
      },
    } as unknown as React.DragEvent;

    await result.current.handleDropToGrid(mockEvent, 'g1', 2);

    // Should not call moveClassSession due to permission check
    expect(mockTimetableOperations.moveClassSession).not.toHaveBeenCalled();
  });

  it('should allow moving sessions to different rows in classroom view when classroom matches', () => {
    const { result } = renderHook(() => useTimetableDnd([mockOwnedSession], 'classroom', 'dept-cs'), {
      wrapper,
    });

    const dragSource: DragSource = {
      from: 'timetable',
      class_session_id: 's1',
      class_group_id: 'g1',
      period_index: 1,
    };

    const mockEvent = {
      dataTransfer: {
        setData: vi.fn(),
        effectAllowed: '',
      },
    } as unknown as React.DragEvent;

    act(() => {
      result.current.handleDragStart(mockEvent, dragSource);
    });

    // In classroom view, should allow moving to different group rows
    // as long as the classroom resource matches
    const isAvailable = result.current.isSlotAvailable('r1', 0);
    expect(isAvailable).toBe(true);
  });

  it('should allow moving sessions to different rows in instructor view when instructor matches', () => {
    const { result } = renderHook(() => useTimetableDnd([mockOwnedSession], 'instructor', 'dept-cs'), {
      wrapper,
    });

    const dragSource: DragSource = {
      from: 'timetable',
      class_session_id: 's1',
      class_group_id: 'g1',
      period_index: 1,
    };

    const mockEvent = {
      dataTransfer: {
        setData: vi.fn(),
        effectAllowed: '',
      },
    } as unknown as React.DragEvent;

    act(() => {
      result.current.handleDragStart(mockEvent, dragSource);
    });

    // In instructor view, should allow moving to different group rows
    // as long as the instructor resource matches
    const isAvailable = result.current.isSlotAvailable('i1', 0);
    expect(isAvailable).toBe(true);
  });

  it('should pass correct class_group_id when dropping from drawer in classroom view', async () => {
    const { result } = renderHook(() => useTimetableDnd([mockOwnedSession], 'classroom', 'dept-cs'), {
      wrapper,
    });

    const dragSource: DragSource = {
      from: 'drawer',
      class_session_id: 's1',
    };

    const mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      dataTransfer: {
        getData: vi.fn().mockReturnValue(JSON.stringify(dragSource)),
      },
    } as unknown as React.DragEvent;

    // Drop onto classroom row 'r1' (UI row ID)
    await result.current.handleDropToGrid(mockEvent, 'r1', 0);

    await waitFor(() => {
      // Should call assignClassSession with the session's actual class_group_id, not 'r1'
      expect(mockTimetableOperations.assignClassSession).toHaveBeenCalledWith(
        'g1', // session.group.id, not 'r1'
        0,
        mockOwnedSession
      );
    });
  });

  it('should pass correct class_group_id when moving within instructor view', async () => {
    const { result } = renderHook(() => useTimetableDnd([mockOwnedSession], 'instructor', 'dept-cs'), {
      wrapper,
    });

    const dragSource: DragSource = {
      from: 'timetable',
      class_session_id: 's1',
      class_group_id: 'g1',
      period_index: 1,
    };

    const mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      dataTransfer: {
        getData: vi.fn().mockReturnValue(JSON.stringify(dragSource)),
      },
    } as unknown as React.DragEvent;

    // Move to different period in instructor row 'i1' (UI row ID)
    await result.current.handleDropToGrid(mockEvent, 'i1', 3);

    await waitFor(() => {
      // Should call moveClassSession with the session's actual class_group_id, not 'i1'
      expect(mockTimetableOperations.moveClassSession).toHaveBeenCalledWith(
        { class_group_id: 'g1', period_index: 1 },
        { class_group_id: 'g1', period_index: 3 }, // session.group.id, not 'i1'
        mockOwnedSession
      );
    });
  });

  it('should handle mutation errors without throwing uncaught promises', async () => {
    const errorMessage = 'Foreign key constraint violation';
    mockTimetableOperations.assignClassSession.mockResolvedValue(errorMessage);

    const { result } = renderHook(() => useTimetableDnd([mockOwnedSession], 'classroom', 'dept-cs'), {
      wrapper,
    });

    const dragSource: DragSource = {
      from: 'drawer',
      class_session_id: 's1',
    };

    const mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      dataTransfer: {
        getData: vi.fn().mockReturnValue(JSON.stringify(dragSource)),
      },
    } as unknown as React.DragEvent;

    // This should not throw an uncaught error
    await expect(async () => {
      await result.current.handleDropToGrid(mockEvent, 'r1', 0);
    }).not.toThrow();

    await waitFor(() => {
      expect(mockTimetableOperations.assignClassSession).toHaveBeenCalled();
    });
  });

  it('should detect same cell correctly in classroom view (period-only comparison)', async () => {
    const { result } = renderHook(() => useTimetableDnd([mockOwnedSession], 'classroom', 'dept-cs'), {
      wrapper,
    });

    const dragSource: DragSource = {
      from: 'timetable',
      class_session_id: 's1',
      class_group_id: 'g1',
      period_index: 1,
    };

    const mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      dataTransfer: {
        getData: vi.fn().mockReturnValue(JSON.stringify(dragSource)),
      },
    } as unknown as React.DragEvent;

    // Drop on same period within classroom view (same period = same cell)
    await result.current.handleDropToGrid(mockEvent, 'r1', 1);

    // Should NOT call moveClassSession (silent abort)
    expect(mockTimetableOperations.moveClassSession).not.toHaveBeenCalled();
  });

  it('should detect same cell correctly in instructor view (period-only comparison)', async () => {
    const { result } = renderHook(() => useTimetableDnd([mockOwnedSession], 'instructor', 'dept-cs'), {
      wrapper,
    });

    const dragSource: DragSource = {
      from: 'timetable',
      class_session_id: 's1',
      class_group_id: 'g1',
      period_index: 2,
    };

    const mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      dataTransfer: {
        getData: vi.fn().mockReturnValue(JSON.stringify(dragSource)),
      },
    } as unknown as React.DragEvent;

    // Drop on same period within instructor view
    await result.current.handleDropToGrid(mockEvent, 'i1', 2);

    // Should NOT call moveClassSession (silent abort)
    expect(mockTimetableOperations.moveClassSession).not.toHaveBeenCalled();
  });
});
