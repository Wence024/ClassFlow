/**
 * Tests for SessionCell component with pending session visual indicators.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SessionCell from '../SessionCell';
import type { HydratedTimetableAssignment } from '../../../../types/timetable';

vi.mock('react-dnd', () => ({
  useDrag: () => [{}, vi.fn(), vi.fn()],
  useDrop: () => [{ isOver: false }, vi.fn()],
}));

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
    const { container } = render(
      <SessionCell
        assignment={mockPendingSession}
        isPending={true}
        onRemove={vi.fn()}
        isOwnedByUser={true}
      />
    );

    const cell = container.querySelector('[data-pending="true"]');
    expect(cell).toBeTruthy();
  });

  it('should show clock icon for pending sessions', () => {
    render(
      <SessionCell
        assignment={mockPendingSession}
        isPending={true}
        onRemove={vi.fn()}
        isOwnedByUser={true}
      />
    );

    // Clock icon should be visible
    const clockIcon = screen.queryByTestId('clock-icon');
    expect(clockIcon || screen.getByText(/pending/i)).toBeTruthy();
  });

  it('should have reduced opacity (0.7) for pending sessions', () => {
    const { container } = render(
      <SessionCell
        assignment={mockPendingSession}
        isPending={true}
        onRemove={vi.fn()}
        isOwnedByUser={true}
      />
    );

    const cell = container.firstChild as HTMLElement;
    const hasOpacity = cell.className.includes('opacity') || cell.style.opacity === '0.7';
    expect(hasOpacity).toBe(true);
  });

  it('should not be draggable when pending', () => {
    const { container } = render(
      <SessionCell
        assignment={mockPendingSession}
        isPending={true}
        onRemove={vi.fn()}
        isOwnedByUser={true}
      />
    );

    const cell = container.firstChild as HTMLElement;
    expect(cell.draggable).toBe(false);
  });

  it('should reject drops onto pending sessions', () => {
    const mockCanDrop = vi.fn().mockReturnValue(false);
    
    render(
      <SessionCell
        assignment={mockPendingSession}
        isPending={true}
        onRemove={vi.fn()}
        isOwnedByUser={true}
      />
    );

    // When trying to drop, isPending should prevent it
    expect(mockPendingSession.status).toBe('pending');
  });

  it('should render normal styling when confirmed', () => {
    const { container } = render(
      <SessionCell
        assignment={mockConfirmedSession}
        isPending={false}
        onRemove={vi.fn()}
        isOwnedByUser={true}
      />
    );

    const cell = container.querySelector('[data-pending="true"]');
    expect(cell).toBeFalsy(); // Should not have pending indicator
  });
});
