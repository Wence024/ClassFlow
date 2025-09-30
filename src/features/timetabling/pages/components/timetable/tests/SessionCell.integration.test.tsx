import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import SessionCell from '../SessionCell';
import { AuthContext } from '../../../../../auth/contexts/AuthContext';
import type { AuthContextType } from '../../../../../auth/types/auth';
import TimetableContext, { type TimetableContextType } from '../TimetableContext';
import type { ClassSession } from '../../../../../classSessions/types/classSession';
import type { ReactElement } from 'react';

const queryClient = new QueryClient();

const renderWithProviders = (
  ui: ReactElement,
  authContextValue: Partial<AuthContextType>,
  timetableContextValue: Partial<TimetableContextType>
) => {
  return render(
    <DndProvider backend={HTML5Backend}>
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={authContextValue as AuthContextType}>
          <TimetableContext.Provider value={timetableContextValue as TimetableContextType}>
            <table>
              <tbody>
                <tr>{ui}</tr>
              </tbody>
            </table>
          </TimetableContext.Provider>
        </AuthContext.Provider>
      </QueryClientProvider>
    </DndProvider>
  );
};

describe('SessionCell - Ownership Styling', () => {
  const mockProgramId = 'prog-owner-123';
  const mockOtherProgramId = 'prog-other-456';

  const mockSession: ClassSession = {
    id: '1',
    course: {
      id: 'c1',
      name: 'Course 1',
      code: 'C1',
      user_id: 'u1',
      created_at: '2023-01-01T00:00:00Z',
      color: '#ff0000',
      program_id: 'p1',
    },
    group: {
      id: 'g1',
      name: 'Group 1',
      code: 'G1',
      user_id: 'u1',
      created_at: '2023-01-01T00:00:00Z',
      color: '#00ff00',
      student_count: 30,
      program_id: 'p1',
    },
    classroom: {
      id: 'r1',
      name: 'Room 1',
      code: 'R1',
      user_id: 'u1',
      created_at: '2023-01-01T00:00:00Z',
      color: '#0000ff',
      location: 'Building A',
      capacity: 30,
      program_id: 'p1',
    },
    instructor: {
      id: 'i1',
      first_name: 'Instructor',
      last_name: '1',
      code: 'I1',
      user_id: 'u1',
      created_at: '2023-01-01T00:00:00Z',
      color: '#ffff00',
      email: 'instructor@example.com',
      phone: '123-456-7890',
      prefix: 'Dr.',
      suffix: 'PhD',
      contract_type: 'Full-time',
      program_id: 'p1',
    },
    period_count: 1,
    program_id: mockProgramId,
  };

  const ownedSession = { ...mockSession, program_id: mockProgramId };
  const otherSession = { ...mockSession, id: '2', program_id: mockOtherProgramId };

  const authOwnerContext: Partial<AuthContextType> = {
    user: {
      id: 'u1',
      program_id: mockProgramId,
      role: 'program_head',
      name: 'test',
      email: 'test@test.com',
    },
    loading: false,
  };
  const timetableDefaultContext: Partial<TimetableContextType> = {
    dragOverCell: null,
    activeDraggedSession: null,
    isSlotAvailable: vi.fn(() => true),
    handleDragStart: vi.fn(),
    handleDropToGrid: vi.fn(),
    onShowTooltip: vi.fn(),
    onHideTooltip: vi.fn(),
    handleDragEnter: vi.fn(),
    handleDragLeave: vi.fn(),
    handleDragOver: vi.fn(),
  };

  it('should render owned sessions with normal styling', () => {
    renderWithProviders(
      <SessionCell
        sessions={[ownedSession]}
        groupId="g1"
        periodIndex={0}
        isLastInDay={false}
        isNotLastInTable={false}
      />,
      authOwnerContext,
      timetableDefaultContext
    );
    const cellContent = screen.getByTestId(`session-card-${ownedSession.id}`).firstChild;
    if (cellContent) {
      expect(cellContent).not.toHaveStyle('opacity: 0.8');
      expect(cellContent).not.toHaveStyle('background-color: rgb(229, 231, 235)');
    }
  });

  it('should render non-owned sessions with "washed out" styling', () => {
    renderWithProviders(
      <SessionCell
        sessions={[otherSession]}
        groupId="g1"
        periodIndex={0}
        isLastInDay={false}
        isNotLastInTable={false}
      />,
      authOwnerContext,
      timetableDefaultContext
    );
    const cellContent = screen.getByTestId(`session-card-${otherSession.id}`).firstChild;
    if (cellContent && cellContent instanceof HTMLElement) {
      expect(cellContent).toHaveStyle('opacity: 0.8');
      expect(cellContent).toHaveStyle('background-color: rgb(229, 231, 235)');
      const p = cellContent.querySelector('p');
      if (p) {
        expect(p).toHaveStyle('color: rgb(75, 85, 99)');
      }
    }
  });
});
