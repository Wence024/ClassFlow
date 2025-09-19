// src/features/timetabling/pages/tests/TimetablePage.integration.test.tsx

import { render, screen, within, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TimetablePage from '../TimetablePage';
import * as useTimetableHook from '../../hooks/useTimetable';
import * as useTimetableDndHook from '../../hooks/useTimetableDnd';
import * as classSessionsService from '../../../classSessions/services/classSessionsService';
import * as useScheduleConfigHook from '../../../scheduleConfig/hooks/useScheduleConfig';
import { TimetableGroup, TimetableMap } from '../../types/timetable';
import type { ClassSession } from '../../../classSessions/types/classSession';
import { AuthContext } from '../../../auth/contexts/AuthContext';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <AuthContext.Provider value={{ user: { id: 'u1', program_id: 'p1', role: 'program_head' } }}>
      {children}
    </AuthContext.Provider>
  </QueryClientProvider>
);

describe('TimetablePage Integration Tests', () => {
  const mockDnd = {
    activeDraggedSession: null,
    dragOverCell: null,
    isSlotAvailable: () => true,
    handleDragStart: vi.fn(),
    handleDragOver: vi.fn(),
    handleDragEnter: vi.fn(),
    handleDragLeave: vi.fn(),
    handleDropToGrid: vi.fn(),
    handleDropToDrawer: vi.fn(),
  };

  let useTimetable;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(useTimetableDndHook, 'useTimetableDnd').mockReturnValue(mockDnd);
    vi.spyOn(classSessionsService, 'getAllClassSessions').mockResolvedValue([]);
    vi.spyOn(useScheduleConfigHook, 'useScheduleConfig').mockReturnValue({
      settings: {
        id: 'config1',
        semester_id: 'sem1',
        periods_per_day: 8,
        class_days_per_week: 5,
        start_time: '09:00',
        period_duration_mins: 60,
        created_at: '2023-01-01T00:00:00Z',
      },
      isLoading: false,
      isUpdating: false,
      error: null,
      updateSettings: vi.fn(),
    });
    useTimetable = vi.spyOn(useTimetableHook, 'useTimetable');
  });

  it("should render the user's own groups first, followed by a separator and other groups", async () => {
    const myGroups: TimetableGroup[] = [
      { id: 'g1', name: 'My Group 1', isOwner: true, program_id: 'p1' },
    ];
    const otherGroups: TimetableGroup[] = [
      { id: 'g2', name: 'Other Group 1', isOwner: false, program_id: 'p2' },
    ];
    const allGroups = [...myGroups, ...otherGroups];

    useTimetable.mockReturnValue({
      groups: allGroups,
      timetable: new Map([
        ['g1', []],
        ['g2', []]
      ]),
      loading: false,
      error: null
    });

    render(<TimetablePage />, { wrapper });

    await waitFor(() => {
      expect(screen.queryByText('Loading Timetable...')).not.toBeInTheDocument();
      expect(screen.queryByTestId('session-card-s1')).toBeInTheDocument();
    });

    // Find group rows by looking for group names in table cells
    const myGroupCell = screen.getByText('My Group 1');
    const otherGroupCell = screen.getByText('Other Group 1');
    
    // Check for the separator
    const separator = screen.getByText('Schedules from Other Programs');
    expect(separator).toBeInTheDocument();
    
    // Verify ordering - my group should come before separator
    expect(myGroupCell.compareDocumentPosition(separator)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(separator.compareDocumentPosition(otherGroupCell)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it('should render owned sessions with full color and non-owned sessions as grayed out', async () => {
    const groups: TimetableGroup[] = [
      { id: 'g1', name: 'My Group', isOwner: true, program_id: 'p1' },
      { id: 'g2', name: 'Other Group', isOwner: false, program_id: 'p2' },
    ];
    const timetable: TimetableMap = new Map([
      [
        'g1',
        [
          {
            id: 's1',
            course: { 
              id: 'c1', 
              name: 'Owned Course', 
              color: '#ff0000',
              code: 'COURSE1',
              created_at: '2023-01-01T00:00:00Z',
              user_id: 'u1'
            },
            group: { 
              id: 'g1', 
              name: 'My Group',
              code: 'GROUP1',
              color: '#ff0000',
              created_at: '2023-01-01T00:00:00Z',
              program_id: 'p1',
              student_count: 30,
              user_id: 'u1'
            },
            isOwner: true,
            period_count: 1,
            instructor: { 
              id: 'i1', 
              name: 'Instructor 1',
              first_name: 'John',
              last_name: 'Doe',
              email: 'john@example.com',
              phone: '123-456-7890',
              created_at: '2023-01-01T00:00:00Z',
              user_id: 'u1'
            },
            classroom: { id: 'r1', name: 'Room 1' },
            program_id: 'p1',
          },
        ],
      ],
      [
        'g2',
        [
          {
            id: 's2',
            course: { 
              id: 'c2', 
              name: 'Other Course', 
              color: '#00ff00',
              code: 'COURSE2',
              created_at: '2023-01-01T00:00:00Z',
              user_id: 'u2'
            },
            group: { 
              id: 'g2', 
              name: 'Other Group',
              code: 'GROUP2',
              color: '#00ff00',
              created_at: '2023-01-01T00:00:00Z',
              program_id: 'p2',
              student_count: 25,
              user_id: 'u2'
            },
            isOwner: false,
            period_count: 1,
            instructor: { 
              id: 'i2', 
              name: 'Instructor 2',
              first_name: 'Jane',
              last_name: 'Smith',
              email: 'jane@example.com',
              phone: '987-654-3210',
              created_at: '2023-01-01T00:00:00Z',
              user_id: 'u2'
            },
            classroom: { id: 'r2', name: 'Room 2' },
            program_id: 'p2',
          },
        ],
      ],
    });

    useTimetable.mockReturnValue({
      groups,
      timetable,
      loading: false,
      error: null
    });

    render(<TimetablePage />, { wrapper });

    await waitFor(() => {
      expect(screen.queryByText('Loading Timetable...')).not.toBeInTheDocument();
      expect(screen.queryByTestId('session-card-s1')).toBeInTheDocument();
      expect(screen.queryByTestId('session-card-s2')).toBeInTheDocument();
    });

    const ownedSession = screen.getByTestId('session-card-s1');
    const otherSession = screen.getByTestId('session-card-s2');

    expect(ownedSession).not.toHaveClass('opacity-60');
    expect(otherSession).toHaveClass('opacity-60');
  });

  it('should render a fallback UI for sessions with invalid/orphaned data', async () => {
    const groups: TimetableGroup[] = [
      { id: 'g1', name: 'My Group', isOwner: true, program_id: 'p1' },
    ];
    const timetable: TimetableMap = new Map([
      [
        'g1',
        [
          // @ts-expect-error - Intentionally testing invalid data
          { id: 's1', course: null, group: { name: 'My Group' }, isOwner: true, period_count: 1 },
        ],
      ],
    ]);

    useTimetable.mockReturnValue({
      groups,
      timetable,
      loading: false,
    });

    render(<TimetablePage />, { wrapper });

    await waitFor(() => {
      expect(screen.queryByText('Loading Timetable...')).not.toBeInTheDocument();
      expect(screen.queryByText('Invalid Session Data')).toBeInTheDocument();
    });

    expect(screen.getByText('Invalid Session Data')).toBeInTheDocument();
    expect(
      screen.getByText(
        'This session is missing critical information (e.g., course or instructor) and cannot be displayed.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'This session is missing critical information (e.g., course or instructor) and cannot be displayed.'
      )
    ).toBeInTheDocument();
  });

  it('should display unassigned class sessions from all programs in the drawer', async () => {
    const assignedSession: ClassSession = {
      id: 's1',
      course: { id: 'c1', name: 'Course 1', color: '#ff0000' },
      group: { id: 'g1', name: 'Group 1' },
      isOwner: true,
      period_count: 1,
      instructor: { id: 'i1', name: 'Instructor 1' },
    };
    const unassignedOwnSession: ClassSession = {
      id: 's2',
      course: { id: 'c2', name: 'Course 2', color: '#ff0000' },
      group: { id: 'g1', name: 'Group 1' },
      isOwner: true,
      period_count: 1,
      instructor: { id: 'i1', name: 'Instructor 1' },
    };
    const unassignedOtherSession: ClassSession = {
      id: 's3',
      course: { id: 'c3', name: 'Course 3', color: '#ff0000' },
      group: { id: 'g2', name: 'Group 2' },
      isOwner: false,
      period_count: 1,
      instructor: { id: 'i2', name: 'Instructor 2' },
    };

    useTimetable.mockReturnValue({
      groups: [{ id: 'g1', name: 'Group 1', isOwner: true, program_id: 'p1' }],
      timetable: new Map([['g1', [assignedSession]]]),
      loading: false,
      error: null
    });

    vi.spyOn(classSessionsService, 'getAllClassSessions').mockResolvedValue([
      assignedSession,
      unassignedOwnSession,
      unassignedOtherSession
    ].map(session => ({
      ...session,
      course: { 
        ...session.course, 
        code: 'COURSE', 
        created_at: '2023-01-01T00:00:00Z', 
        user_id: 'u1' 
      },
      group: { 
        ...session.group, 
        code: 'GROUP', 
        color: '#000', 
        created_at: '2023-01-01T00:00:00Z', 
        program_id: 'p1', 
        student_count: 20, 
        user_id: 'u1' 
      },
      instructor: { 
        ...session.instructor, 
        first_name: 'Test', 
        last_name: 'Instructor', 
        email: 'test@example.com', 
        phone: '123-456-7890',
        contract_type: 'full-time',
        prefix: '',
        suffix: '',
        created_at: '2023-01-01T00:00:00Z',
        user_id: 'u1'
      }
    })));

    render(<TimetablePage />, { wrapper });

    // Wait for the query to resolve and the drawer to update
    await screen.findByText('Available Classes');

    // Find drawer content by visible text instead of test ID
    const drawerContent = screen.getByText('Available Classes').closest('div')?.parentElement;
    expect(drawerContent).toBeInTheDocument();

    // Should see both unassigned sessions
    expect(screen.getByText('Course 2 - Group 1')).toBeInTheDocument();
    expect(screen.getByText('Course 3 - Group 2')).toBeInTheDocument();

    // Should NOT see the assigned session
    expect(screen.queryByText('Course 1 - Group 1')).not.toBeInTheDocument();
  });
});
