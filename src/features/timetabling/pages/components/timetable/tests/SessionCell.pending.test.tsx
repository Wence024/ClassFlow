/**
 * Tests for SessionCell component with pending session visual indicators.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SessionCell from '../SessionCell';
import type { HydratedTimetableAssignment } from '../../../../types/timetable';
import TimetableContext from '../TimetableContext';
import type { TimetableContextType } from '../TimetableContext';
import { AuthContext } from '../../../../../auth/contexts/AuthContext';

vi.mock('react-dnd', () => ({
  useDrag: () => [{}, vi.fn(), vi.fn()],
  useDrop: () => [{ isOver: false }, vi.fn()],
}));

const mockTimetableContext: TimetableContextType = {
  dragOverCell: null,
  activeDraggedSession: null,
  isSlotAvailable: () => true,
  handleDragStart: vi.fn(),
  handleDropToGrid: vi.fn(),
  handleDragEnter: vi.fn(),
  handleDragLeave: vi.fn(),
  handleDragOver: vi.fn(),
  onShowTooltip: vi.fn(),
  onHideTooltip: vi.fn(),
  pendingSessionIds: new Set(),
  pendingPlacementSessionId: undefined,
  highlightPeriod: undefined,
  highlightGroup: undefined,
};

const mockAuthContext = {
  user: { id: 'user-1', name: 'Test User', email: 'test@example.com', program_id: 'program-1', role: 'program_head' },
  role: 'program_head',
  loading: false,
  login: vi.fn(),
  logout: vi.fn(),
  error: null,
  clearError: vi.fn(),
};

const TestWrapper = ({ children, context = mockTimetableContext }) => (
  <AuthContext.Provider value={mockAuthContext}>
    <TimetableContext.Provider value={context}>
      <table>
        <tbody>
          <tr>{children}</tr>
        </tbody>
      </table>
    </TimetableContext.Provider>
  </AuthContext.Provider>
);

describe('SessionCell - Pending State Visual Indicators', () => {
  const mockPendingSession: HydratedTimetableAssignment = {
    id: 'assignment-1',
    class_session_id: 'session-1',
    class_group_id: 'group-1',
    period_index: 5,
    semester_id: 'semester-1',
    user_id: 'user-1',
    status: 'pending',
    created_at: new Date().toISOString(),
    class_session: {
      id: 'session-1',
      course_id: 'course-1',
      class_group_id: 'group-1',
      instructor_id: 'instructor-1',
      classroom_id: 'classroom-1',
      period_count: 1,
      user_id: 'user-1',
      program_id: 'program-1',
      created_at: new Date().toISOString(),
      course: {
        id: 'course-1',
        name: 'Mathematics',
        code: 'MATH101',
        color: '#3b82f6',
        program_id: 'program-1',
        created_by: 'user-1',
        created_at: new Date().toISOString(),
      },
      group: {
        id: 'group-1',
        name: 'Group A',
        code: 'GA',
        color: '#3b82f6',
        student_count: 30,
        user_id: 'user-1',
        program_id: 'program-1',
        created_at: new Date().toISOString(),
      },
      instructor: {
        id: 'instructor-1',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@test.com',
        code: 'JD',
        color: '#3b82f6',
        department_id: 'dept-1',
        created_by: 'user-1',
        created_at: new Date().toISOString(),
      },
      classroom: {
        id: 'classroom-1',
        name: 'Room 101',
        code: 'R101',
        color: '#3b82f6',
        capacity: 40,
        location: 'Building A',
        preferred_department_id: 'dept-1',
        created_by: 'user-1',
        created_at: new Date().toISOString(),
      },
    },
  };

  const mockConfirmedSession: HydratedTimetableAssignment = {
    ...mockPendingSession,
    status: 'confirmed',
  };

  it('should render with dashed orange border when session is pending', () => {
    const mockSession = mockPendingSession.class_session;
    const pendingContext = {
      ...mockTimetableContext,
      pendingSessionIds: new Set([mockSession.id]),
    };

    const { container } = render(
      <SessionCell
        sessions={[mockSession]}
        groupId={mockSession.class_group_id}
        periodIndex={5}
        isLastInDay={false}
        isNotLastInTable={true}
        viewMode="class-group"
      />,
      {
        wrapper: ({ children }) => <TestWrapper context={pendingContext}>{children}</TestWrapper>,
      }
    );

    const cell = container.querySelector('[data-testid="session-card-session-1"] > div') as HTMLElement;
    expect(cell.style.border).toContain('2px dashed');
  });

  it('should show clock icon for pending sessions', () => {
    const mockSession = mockPendingSession.class_session;
    const pendingContext = {
      ...mockTimetableContext,
      pendingSessionIds: new Set([mockSession.id]),
    };

    const { container } = render(
      <SessionCell
        sessions={[mockSession]}
        groupId={mockSession.class_group_id}
        periodIndex={5}
        isLastInDay={false}
        isNotLastInTable={true}
        viewMode="class-group"
      />,
      {
        wrapper: ({ children }) => <TestWrapper context={pendingContext}>{children}</TestWrapper>,
      }
    );

    const clockIcon = container.querySelector('svg');
    expect(clockIcon).toBeInTheDocument();
  });

  it('should have reduced opacity (0.7) for pending sessions', () => {
    const mockSession = mockPendingSession.class_session;
    const pendingContext = {
      ...mockTimetableContext,
      pendingSessionIds: new Set([mockSession.id]),
    };

    const { container } = render(
      <SessionCell
        sessions={[mockSession]}
        groupId={mockSession.class_group_id}
        periodIndex={5}
        isLastInDay={false}
        isNotLastInTable={true}
        viewMode="class-group"
      />,
      {
        wrapper: ({ children }) => <TestWrapper context={pendingContext}>{children}</TestWrapper>,
      }
    );

    const cell = container.querySelector('[data-testid="session-card-session-1"] > div') as HTMLElement;
    expect(cell.style.opacity).toBe('0.7');
  });

  it('should not be draggable when pending', () => {
    const mockSession = mockPendingSession.class_session;
    const pendingContext = {
      ...mockTimetableContext,
      pendingSessionIds: new Set([mockSession.id]),
    };

    const { container } = render(
      <SessionCell
        sessions={[mockSession]}
        groupId={mockSession.class_group_id}
        periodIndex={5}
        isLastInDay={false}
        isNotLastInTable={true}
        viewMode="class-group"
      />,
      {
        wrapper: ({ children }) => <TestWrapper context={pendingContext}>{children}</TestWrapper>,
      }
    );

    const cell = container.querySelector('[draggable="false"]');
    expect(cell).toBeTruthy();
  });

  it('should render normal styling when confirmed', () => {
    const mockSession = mockConfirmedSession.class_session;

    const { container } = render(
      <SessionCell
        sessions={[mockSession]}
        groupId={mockSession.class_group_id}
        periodIndex={5}
        isLastInDay={false}
        isNotLastInTable={true}
        viewMode="class-group"
      />,
      { wrapper: TestWrapper }
    );

    const cell = container.querySelector('[data-testid="session-card-session-1"] > div') as HTMLElement;
    expect(cell.style.border).not.toContain('2px dashed');
    expect(cell.style.opacity).not.toBe('0.7');
  });
});
