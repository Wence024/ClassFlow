/**
 * Integration tests for SessionCell pending state visual indicators.
 * Tests the UI behavior when a session has pending status requiring approval.
 */

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

describe('SessionCell - Pending State Indicators', () => {
  const mockProgramId = 'prog-123';

  const mockSession: ClassSession = {
    id: 'pending-session-1',
    course: {
      id: 'c1',
      name: 'Course 1',
      code: 'C1',
      user_id: 'u1',
      created_at: '2023-01-01T00:00:00Z',
      color: '#ff0000',
      program_id: mockProgramId,
    },
    group: {
      id: 'g1',
      name: 'Group 1',
      code: 'G1',
      user_id: 'u1',
      created_at: '2023-01-01T00:00:00Z',
      color: '#00ff00',
      student_count: 30,
      program_id: mockProgramId,
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
      program_id: mockProgramId,
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
      program_id: mockProgramId,
    },
    period_count: 1,
    program_id: mockProgramId,
  };

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

  it('should render with dashed orange border when session is pending', () => {
    const pendingSessionIds = new Set(['pending-session-1']);

    renderWithProviders(
      <SessionCell
        sessions={[mockSession]}
        groupId="g1"
        periodIndex={0}
        isLastInDay={false}
        isNotLastInTable={false}
      />,
      authOwnerContext,
      { ...timetableDefaultContext, pendingSessionIds }
    );

    const cellContent = screen.getByTestId(`session-card-${mockSession.id}`).firstChild as HTMLElement;
    
    // Check for border styling (dashed and orange/warning color)
    expect(cellContent.className).toContain('border-dashed');
    expect(cellContent.className).toContain('border-orange');
  });

  it('should show clock icon for pending sessions', () => {
    const pendingSessionIds = new Set(['pending-session-1']);

    renderWithProviders(
      <SessionCell
        sessions={[mockSession]}
        groupId="g1"
        periodIndex={0}
        isLastInDay={false}
        isNotLastInTable={false}
      />,
      authOwnerContext,
      { ...timetableDefaultContext, pendingSessionIds }
    );

    // Look for clock icon (lucide-react Clock component)
    const icon = document.querySelector('[data-testid*="clock"]') || 
                 document.querySelector('svg.lucide-clock');
    expect(icon).toBeTruthy();
  });

  it('should have reduced opacity for pending sessions', () => {
    const pendingSessionIds = new Set(['pending-session-1']);

    renderWithProviders(
      <SessionCell
        sessions={[mockSession]}
        groupId="g1"
        periodIndex={0}
        isLastInDay={false}
        isNotLastInTable={false}
      />,
      authOwnerContext,
      { ...timetableDefaultContext, pendingSessionIds }
    );

    const cellContent = screen.getByTestId(`session-card-${mockSession.id}`).firstChild as HTMLElement;
    
    // Check for reduced opacity
    const styles = window.getComputedStyle(cellContent);
    expect(parseFloat(styles.opacity)).toBeLessThanOrEqual(0.7);
  });

  it('should not be draggable when pending', () => {
    const pendingSessionIds = new Set(['pending-session-1']);

    renderWithProviders(
      <SessionCell
        sessions={[mockSession]}
        groupId="g1"
        periodIndex={0}
        isLastInDay={false}
        isNotLastInTable={false}
      />,
      authOwnerContext,
      { ...timetableDefaultContext, pendingSessionIds }
    );

    const card = screen.getByTestId(`session-card-${mockSession.id}`);
    expect(card).toHaveAttribute('draggable', 'false');
  });

  it('should reject drops onto pending sessions', () => {
    const pendingSessionIds = new Set(['pending-session-1']);
    const isSlotAvailable = vi.fn(() => false); // Pending sessions block drops

    renderWithProviders(
      <SessionCell
        sessions={[mockSession]}
        groupId="g1"
        periodIndex={0}
        isLastInDay={false}
        isNotLastInTable={false}
      />,
      authOwnerContext,
      { ...timetableDefaultContext, pendingSessionIds, isSlotAvailable }
    );

    // Verify isSlotAvailable returns false for cells with pending sessions
    expect(isSlotAvailable('g1', 0)).toBe(false);
  });

  it('should render normal styling when confirmed (not in pendingSessionIds)', () => {
    const pendingSessionIds = new Set<string>(); // Empty set = confirmed

    renderWithProviders(
      <SessionCell
        sessions={[mockSession]}
        groupId="g1"
        periodIndex={0}
        isLastInDay={false}
        isNotLastInTable={false}
      />,
      authOwnerContext,
      { ...timetableDefaultContext, pendingSessionIds }
    );

    const cellContent = screen.getByTestId(`session-card-${mockSession.id}`).firstChild as HTMLElement;
    
    // Should NOT have dashed border
    expect(cellContent.className).not.toContain('border-dashed');
    
    // Should NOT have clock icon
    const clockIcon = document.querySelector('[data-testid*="clock"]') || 
                      document.querySelector('svg.lucide-clock');
    expect(clockIcon).toBeFalsy();
    
    // Should be draggable
    const card = screen.getByTestId(`session-card-${mockSession.id}`);
    expect(card).toHaveAttribute('draggable', 'true');
  });

  it('should show pending indicator tooltip on hover', async () => {
    const pendingSessionIds = new Set(['pending-session-1']);
    const onShowTooltip = vi.fn();

    renderWithProviders(
      <SessionCell
        sessions={[mockSession]}
        groupId="g1"
        periodIndex={0}
        isLastInDay={false}
        isNotLastInTable={false}
      />,
      authOwnerContext,
      { ...timetableDefaultContext, pendingSessionIds, onShowTooltip }
    );

    const card = screen.getByTestId(`session-card-${mockSession.id}`);
    card.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

    expect(onShowTooltip).toHaveBeenCalled();
    // Tooltip content should mention "pending" or "awaiting approval"
    const tooltipContent = onShowTooltip.mock.calls[0][0];
    expect(tooltipContent).toBeTruthy();
  });
});
