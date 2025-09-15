import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import SessionCell from '../SessionCell';
import { AuthContext } from '../../../../../auth/contexts/AuthContext';
import TimetableContext from '../TimetableContext';
import { HydratedClassSession } from '../../../../types/timetable';

const queryClient = new QueryClient();

const renderWithProviders = (ui, authContextValue, timetableContextValue) => {
  return render(
    <DndProvider backend={HTML5Backend}>
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={authContextValue}>
          <TimetableContext.Provider value={timetableContextValue}>
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

  const mockSession: HydratedClassSession = {
    id: '1',
    course_id: 'c1',
    class_group_id: 'g1',
    classroom_id: 'r1',
    instructor_id: 'i1',
    period_count: 1,
    user_id: 'u1',
    program_id: mockProgramId,
    course: { id: 'c1', name: 'Course 1', color: '#ff0000', program_id: 'p1' },
    class_group: { id: 'g1', name: 'Group 1', capacity: 30, program_id: 'p1' },
    classroom: { id: 'r1', name: 'Room 1', capacity: 30, program_id: 'p1' },
    instructor: { id: 'i1', name: 'Instructor 1', program_id: 'p1' },
  };

  const ownedSession = { ...mockSession, program_id: mockProgramId };
  const otherSession = { ...mockSession, id: '2', program_id: mockOtherProgramId };

  const authOwnerContext = {
    user: { id: 'u1', program_id: mockProgramId, role: 'program_head' },
    loading: false,
  };
  const timetableDefaultContext = {
    moveSession: vi.fn(),
    removeSession: vi.fn(),
    isLoading: false,
    isSlotAvailable: vi.fn(() => true),
    dragOverCell: null,
    currentDraggedSession: null,
    onDragStart: vi.fn(),
    onDropToGrid: vi.fn(),
    onShowTooltip: vi.fn(),
    onHideTooltip: vi.fn(),
    onDragEnter: vi.fn(),
    onDragLeave: vi.fn(),
    onDragOver: vi.fn(),
  };

  it('should render owned sessions with normal styling', () => {
    renderWithProviders(
      <SessionCell
        session={ownedSession}
        groupId="g1"
        periodIndex={0}
        isLastInDay={false}
        isNotLastInTable={false}
      />,
      authOwnerContext,
      timetableDefaultContext
    );
    const cellContent = screen.getByTestId(`session-card-${ownedSession.id}`).firstChild;
    expect(cellContent).not.toHaveStyle('opacity: 0.8');
    expect(cellContent).not.toHaveStyle('background-color: rgb(229, 231, 235)');
  });

  it('should render non-owned sessions with "washed out" styling', () => {
    renderWithProviders(
      <SessionCell
        session={otherSession}
        groupId="g1"
        periodIndex={0}
        isLastInDay={false}
        isNotLastInTable={false}
      />,
      authOwnerContext,
      timetableDefaultContext
    );
    const cellContent = screen.getByTestId(`session-card-${otherSession.id}`).firstChild;
    expect(cellContent).toHaveStyle('opacity: 0.8');
    expect(cellContent).toHaveStyle('background-color: rgb(229, 231, 235)');
    expect(cellContent.querySelector('p')).toHaveStyle('color: rgb(75, 85, 99)');
  });
});
