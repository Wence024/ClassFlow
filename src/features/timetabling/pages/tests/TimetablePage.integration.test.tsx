import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import TimetablePage from '../TimetablePage';
import { AuthContext } from '../../../auth/contexts/AuthContext';
import * as timetableHooks from '../../hooks/useTimetable';
import * as sessionHooks from '../../../classSessions/hooks/useClassSessions';
import * as scheduleHooks from '../../../scheduleConfig/hooks/useScheduleConfig';
import type {
  ClassGroup,
  Classroom,
  Course,
  Instructor,
} from '../../../classSessionComponents/types';
import type { ClassSession } from '../../../classSessions/types/classSession';
import type { ScheduleConfig } from '../../../scheduleConfig/types/scheduleConfig';

// Mock data
const mockSettings: ScheduleConfig = {
  id: 'settings1',
  created_at: new Date().toISOString(),
  periods_per_day: 4,
  class_days_per_week: 1, // Simplified to one day for testing
  start_time: '09:00',
  period_duration_mins: 60,
};

const mockInstructor: Instructor = {
  id: 'inst1',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@doe.com',
  user_id: 'u1',
  created_at: '',
  code: 'JD',
  color: '#fff',
  contract_type: null,
  phone: null,
  prefix: null,
  suffix: null,
};
const mockCourse: Course = {
  id: 'course1',
  name: 'Test Course',
  code: 'T101',
  user_id: 'u1',
  created_at: '',
  color: '#fff',
};
const mockClassroom: Classroom = {
  id: 'room1',
  name: 'Room 1',
  capacity: 30,
  user_id: 'u1',
  created_at: '',
  code: 'R1',
  color: '#fff',
  location: null,
};
const mockGroup: ClassGroup = {
  id: 'group1',
  name: 'Group 1',
  student_count: 20,
  user_id: 'u1',
  created_at: '',
  code: 'G1',
  color: '#fff',
};

const mockSession1: ClassSession = {
  id: 'session1',
  period_count: 1,
  course: mockCourse,
  instructor: mockInstructor,
  classroom: mockClassroom,
  group: mockGroup,
};

const mockSession2: ClassSession = {
  id: 'session2',
  period_count: 1,
  course: { ...mockCourse, id: 'course2', name: 'Another Course' },
  instructor: { ...mockInstructor, id: 'inst2', first_name: 'Jane' },
  classroom: { ...mockClassroom, id: 'room2', name: 'Room 2' },
  group: { ...mockGroup, id: 'group2', name: 'Group 2' },
};

// Mock hooks
vi.mock('../../hooks/useTimetable');
vi.mock('../../../classSessions/hooks/useClassSessions');
vi.mock('../../../scheduleConfig/hooks/useScheduleConfig');
vi.mock('../../../../../lib/notificationsService');

const queryClient = new QueryClient();

type AuthContextType = React.ContextType<typeof AuthContext>;
const renderComponent = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ user: { id: 'u1' } } as AuthContextType}>
        <MemoryRouter>
          <TimetablePage />
        </MemoryRouter>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

describe('TimetablePage Drag and Drop Visual Feedback', () => {
  beforeEach(() => {
    // Clear and reset mocks before each test
    vi.clearAllMocks();
    // No timers needed for these interaction tests

    // Re-mock hooks for each test to ensure isolation
    type UseTimetableHooksReturn = ReturnType<typeof timetableHooks.useTimetable>;
    vi.spyOn(timetableHooks, 'useTimetable').mockReturnValue({
      timetable: new Map([
        // Use a new map for each test
        ['group1', [mockSession1, null, null, null]],
        ['group2', [null, null, null, null]],
      ]),
      groups: [mockGroup, { ...mockGroup, id: 'group2', name: 'Group 2' }],
      loading: false,
      assignClassSession: vi.fn().mockResolvedValue(''),
      removeClassSession: vi.fn().mockResolvedValue(undefined),
      moveClassSession: vi.fn().mockResolvedValue(''),
    } as unknown as UseTimetableHooksReturn);

    type UseClassSessionsReturn = ReturnType<typeof sessionHooks.useClassSessions>;
    vi.spyOn(sessionHooks, 'useClassSessions').mockReturnValue({
      classSessions: [mockSession1, mockSession2],
    } as UseClassSessionsReturn);

    type UseScheduleConfigReturn = ReturnType<typeof scheduleHooks.useScheduleConfig>;
    vi.spyOn(scheduleHooks, 'useScheduleConfig').mockReturnValue({
      settings: mockSettings,
      isLoading: false,
    } as UseScheduleConfigReturn);
  });

  it('shows a green overlay on an available empty cell when dragging over it', async () => {
    renderComponent();

    const draggable = screen.getByText('Another Course - Group 2');
    const dropTargetCell = screen.getByTestId('cell-group2-1');
    const dropTargetDiv = dropTargetCell.firstChild as HTMLElement;

    fireEvent.dragStart(draggable, {
      dataTransfer: {
        setData: vi.fn(),
        getData: vi.fn((type) => {
          return type === 'text/plain'
            ? JSON.stringify({ class_session_id: 'session2', source: 'drawer' })
            : '';
        }),
        effectAllowed: 'move',
      },
    });
    fireEvent.dragEnter(dropTargetDiv);

    await waitFor(() => {
      const overlay = dropTargetDiv.querySelector('div');
      expect(overlay).toHaveClass('bg-green-200/50');
    });
  });

  it('shows a red overlay on a cell with a conflict when dragging from the drawer', async () => {
    renderComponent();

    const draggable = screen.getByText('Another Course - Group 2');
    const dropTargetCell = screen.getByTestId('cell-group1-0'); // Occupied by mockSession1
    const dropZone = dropTargetCell.querySelector('[class="flex-1"]');

    expect(dropZone).toBeInTheDocument();

    fireEvent.dragStart(draggable, {
      dataTransfer: {
        setData: vi.fn(),
        getData: vi.fn((type) => {
          return type === 'text/plain'
            ? JSON.stringify({ class_session_id: 'session2', source: 'drawer' })
            : '';
        }),
        effectAllowed: 'move',
      },
    });
    if (dropZone) {
      fireEvent.dragEnter(dropZone);
    }

    await waitFor(() => {
      const overlay = dropZone?.querySelector('div');
      expect(overlay).toHaveClass('bg-red-200', 'bg-opacity-50');
    });
  });

  it('shows a green overlay on an available empty cell when moving an existing session', async () => {
    renderComponent();

    const draggable = screen.getByTestId('session-card-session1');
    const dropTargetCell = screen.getByTestId('cell-group1-2');
    const dropTargetDiv = dropTargetCell.firstChild as HTMLElement;

    fireEvent.dragStart(draggable, {
      dataTransfer: {
        setData: vi.fn(),
        getData: vi.fn((type) => {
          return type === 'text/plain'
            ? JSON.stringify({
                class_session_id: 'session1',
                source: 'grid',
                from: { groupId: 'group1', periodIndex: 0 },
              })
            : '';
        }),
        effectAllowed: 'move',
      },
    });
    fireEvent.dragEnter(dropTargetDiv);

    await waitFor(() => {
      const overlay = dropTargetDiv.querySelector('div');
      expect(overlay).toHaveClass('bg-green-200/50');
    });
  });

  it('shows a red overlay on a conflicting cell when moving an existing session', async () => {
    // This test needs careful setup for the conflict
    const customTimetable = new Map([
      ['group1', [mockSession1, null, null, null]],
      // Place a session that will conflict with mockSession1 if moved
      ['group2', [null, { ...mockSession2, instructor: mockInstructor }, null, null]],
    ]);

    type UseTimetableHooksReturn = ReturnType<typeof timetableHooks.useTimetable>;
    vi.spyOn(timetableHooks, 'useTimetable').mockReturnValue({
      timetable: customTimetable,
      groups: [mockGroup, { ...mockGroup, id: 'group2', name: 'Group 2' }],
      loading: false,
      assignClassSession: vi.fn(),
      removeClassSession: vi.fn(),
      moveClassSession: vi.fn().mockResolvedValue('Instructor conflict'), // Ensure move returns a conflict
    } as unknown as UseTimetableHooksReturn);

    renderComponent();

    const draggable = screen.getByTestId('session-card-session1');
    // Target the cell where the conflicting session is
    const dropTargetCell = screen.getByTestId('cell-group2-1');
    const dropZone = dropTargetCell.querySelector('[class="flex-1"]');
    expect(dropZone).toBeInTheDocument();

    fireEvent.dragStart(draggable, {
      dataTransfer: {
        setData: vi.fn(),
        getData: vi.fn((type) => {
          return type === 'text/plain'
            ? JSON.stringify({
                class_session_id: 'session1',
                source: 'grid',
                from: { groupId: 'group1', periodIndex: 0 },
              })
            : '';
        }),
        effectAllowed: 'move',
      },
    });
    if (dropZone) {
      fireEvent.dragEnter(dropZone);
    }

    await waitFor(() => {
      const overlay = dropZone?.querySelector('div');
      expect(overlay).toHaveClass('bg-red-200', 'bg-opacity-50');
    });
  });

  it('removes the overlay when the dragged item leaves an available cell', async () => {
    renderComponent();

    const draggable = screen.getByText('Another Course - Group 2');
    const dropTargetCell = screen.getByTestId('cell-group2-1');
    const dropTargetDiv = dropTargetCell.firstChild as HTMLElement;

    // Enter the cell
    fireEvent.dragStart(draggable, {
      dataTransfer: {
        setData: vi.fn(),
        getData: vi.fn((type) => {
          return type === 'text/plain'
            ? JSON.stringify({ class_session_id: 'session2', source: 'drawer' })
            : '';
        }),
        effectAllowed: 'move',
      },
    });
    fireEvent.dragEnter(dropTargetDiv);
    await waitFor(() => {
      const overlay = dropTargetDiv.querySelector('div');
      expect(overlay).toHaveClass('bg-green-200/50');
    });

    // Leave the cell
    fireEvent.dragLeave(dropTargetDiv);
    await waitFor(() => {
      // Overlay should be removed when not hovered
      const overlay = dropTargetDiv.querySelector('[class*="bg-green-200"], [class*="bg-red-200"]');
      expect(overlay).toBeNull();
    });
  });

  it('shows a red overlay when attempting to move a session to a different group row', async () => {
    renderComponent();

    const draggable = screen.getByTestId('session-card-session1'); // Belongs to group1
    const dropTargetCell = screen.getByTestId('cell-group2-2'); // A cell in group2's row
    const dropZone = dropTargetCell.firstChild as HTMLElement;

    fireEvent.dragStart(draggable, {
      dataTransfer: {
        setData: vi.fn(),
        getData: vi.fn((type) => {
          return type === 'text/plain'
            ? JSON.stringify({
                class_session_id: 'session1',
                source: 'grid',
                from: { groupId: 'group1', periodIndex: 0 },
              })
            : '';
        }),
        effectAllowed: 'move',
      },
    });
    fireEvent.dragEnter(dropZone);

    await waitFor(() => {
      const overlay = dropZone.querySelector('div');
      expect(overlay).toHaveClass('bg-red-200/50');
    });
  });
});
