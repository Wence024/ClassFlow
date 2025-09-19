import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import type {
  Course,
  Instructor,
  ClassGroup,
  Classroom,
} from '../../../../classSessionComponents/types';
import type { ClassSession } from '../../../types/classSession';
import { ClassSessionCard } from '..';

const MOCK_PROGRAM_ID = 'p1';

// --- Mock Data ---
const mockCourse: Course = {
  id: 'c1',
  name: 'Test Course',
  code: 'T101',
  user_id: 'u1',
  created_at: '',
  color: '#fff',
  program_id: MOCK_PROGRAM_ID,
};
const mockInstructor: Instructor = {
  id: 'i1',
  first_name: 'Test',
  last_name: 'Instructor',
  email: 't@t.com',
  user_id: 'u1',
  created_at: '',
  code: 'TI',
  color: '#fff',
  contract_type: null,
  phone: null,
  prefix: null,
  suffix: null,
  program_id: MOCK_PROGRAM_ID,
};
const mockGroup: ClassGroup = {
  id: 'g1',
  name: 'Test Group',
  student_count: 25,
  user_id: 'u1',
  created_at: '',
  code: 'G1',
  color: '#fff',
  program_id: MOCK_PROGRAM_ID,
};
const mockClassroom: Classroom = {
  id: 'r1',
  name: 'Room 101',
  capacity: 30,
  user_id: 'u1',
  created_at: '',
  code: 'R1',
  color: '#fff',
  location: 'A',
  program_id: MOCK_PROGRAM_ID,
};

const mockSession: ClassSession = {
  id: 's1',
  course: mockCourse,
  group: mockGroup,
  instructor: mockInstructor,
  classroom: mockClassroom,
  period_count: 1,
  program_id: MOCK_PROGRAM_ID,
};

// Mock session WITH capacity conflict
const mockSessionWithConflict: ClassSession = {
  ...mockSession,
  id: 's2',
  group: { ...mockGroup, name: 'Oversized Group', student_count: 35 },
  program_id: MOCK_PROGRAM_ID,
};

describe('ClassSessionCard', () => {
  it('should render correctly without a conflict badge when there are no soft conflicts', () => {
    render(<ClassSessionCard classSession={mockSession} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.queryByTitle(/Capacity conflict/)).not.toBeInTheDocument();
    expect(screen.queryByText('1')).not.toBeInTheDocument();
  });

  it('should render with a conflict badge when there is a capacity conflict', () => {
    render(
      <ClassSessionCard
        classSession={mockSessionWithConflict}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    const badgeContainer = screen.getByTitle(
      'Capacity conflict: The group "Oversized Group" (35 students) exceeds the capacity of classroom "Room 101" (30 seats).'
    );
    expect(badgeContainer).toBeInTheDocument();
    expect(badgeContainer).toHaveTextContent('1');
  });
});
