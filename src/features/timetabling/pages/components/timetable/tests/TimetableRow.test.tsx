import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import TimetableRow from '../TimetableRow';
import TimetableContext from '../TimetableContext';
import { AuthProvider } from '../../../../../auth/contexts/AuthProvider';
import type { ClassGroup, Classroom, Instructor } from '../../../../../classSessionComponents/types';
import type { ClassSession } from '../../../../../classSessions/types/classSession';
import type { Course } from '../../../../../classSessionComponents/types/course';
import type { TimetableViewMode } from '../../../../types/timetable';

const MOCK_USER_ID = 'user1';
const MOCK_CREATED_AT = new Date().toISOString();

const mockCourse: Course = {
  id: 'course1',
  name: 'Mathematics 101',
  code: 'MATH101',
  created_at: MOCK_CREATED_AT,
  color: '#db2777',
  program_id: 'p1',
  created_by: MOCK_USER_ID,
};

const mockClassroom: Classroom = {
  id: 'classroom1',
  name: 'Room 101',
  location: 'Building A',
  capacity: 30,
  created_at: MOCK_CREATED_AT,
  code: 'R101',
  color: '#65a30d',
  created_by: MOCK_USER_ID,
  preferred_department_id: null,
};

const mockInstructor: Instructor = {
  id: 'instructor1',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  created_at: MOCK_CREATED_AT,
  code: 'JD',
  color: '#ca8a04',
  prefix: 'Dr.',
  suffix: null,
  phone: null,
  contract_type: 'Full-time',
  created_by: MOCK_USER_ID,
  department_id: 'd1',
};

const mockGroup: ClassGroup = {
  id: 'group1',
  name: 'CS-1A',
  user_id: MOCK_USER_ID,
  created_at: MOCK_CREATED_AT,
  code: 'CS1A',
  color: '#4f46e5',
  student_count: 25,
  program_id: 'p1',
};

const mockSession: ClassSession = {
  id: 'session1',
  course: mockCourse,
  group: mockGroup,
  instructor: mockInstructor,
  classroom: mockClassroom,
  period_count: 1,
  program_id: 'p1',
};

/**
 * Renders TimetableRow with TimetableContext provider.
 *
 * @param viewMode - The current view mode.
 * @param resource - The resource (group, classroom, or instructor).
 * @param timetable - The timetable data.
 * @param periodsPerDay - The number of periods per day.
 * @param totalPeriods - The total number of periods.
 * @returns The rendered component.
 */
const renderWithContext = (
  viewMode: TimetableViewMode,
  resource: ClassGroup | Classroom | Instructor,
  timetable: Map<string, (ClassSession[] | null)[]>,
  periodsPerDay = 4,
  totalPeriods = 16
) => {
  const mockContextValue = {
    dragOverCell: null,
    activeDraggedSession: null,
    isSlotAvailable: vi.fn(() => true),
    handleDragStart: vi.fn(),
    handleDropToGrid: vi.fn(),
    handleDragEnter: vi.fn(),
    handleDragLeave: vi.fn(),
    handleDragOver: vi.fn(),
    onShowTooltip: vi.fn(),
    onHideTooltip: vi.fn(),
  };

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AuthProvider>
          <TimetableContext.Provider value={mockContextValue}>
            <table>
              <tbody>
                <TimetableRow
                  viewMode={viewMode}
                  resource={resource}
                  timetable={timetable}
                  periodsPerDay={periodsPerDay}
                  totalPeriods={totalPeriods}
                />
              </tbody>
            </table>
          </TimetableContext.Provider>
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('TimetableRow', () => {
  const totalPeriods = 16;
  const periodsPerDay = 4;

  describe('Class-Group View', () => {
    it('should render group name as row label', () => {
      const timetable = new Map<string, (ClassSession[] | null)[]>();
      timetable.set('group1', Array(totalPeriods).fill(null));

      renderWithContext('class-group', mockGroup, timetable, periodsPerDay, totalPeriods);

      expect(screen.getByText('CS-1A')).toBeInTheDocument();
    });

    it('should render empty cells when no sessions are assigned', () => {
      const timetable = new Map<string, (ClassSession[] | null)[]>();
      timetable.set('group1', Array(totalPeriods).fill(null));

      const { container } = renderWithContext('class-group', mockGroup, timetable, periodsPerDay, totalPeriods);

      const row = container.querySelector('tr');
      const cells = row?.querySelectorAll('td');
      
      // First cell is the label, rest are empty cells
      expect(cells?.length).toBe(totalPeriods + 1);
    });

    it('should render session cells when sessions are assigned', () => {
      const timetable = new Map<string, (ClassSession[] | null)[]>();
      const rowData = Array(totalPeriods).fill(null);
      rowData[0] = [mockSession];
      timetable.set('group1', rowData);

      renderWithContext('class-group', mockGroup, timetable, periodsPerDay, totalPeriods);

      expect(screen.getByText('MATH101')).toBeInTheDocument();
    });

    it('should handle multi-period sessions correctly', () => {
      const multiPeriodSession: ClassSession = {
        ...mockSession,
        period_count: 3,
      };

      const timetable = new Map<string, (ClassSession[] | null)[]>();
      const rowData = Array(totalPeriods).fill(null);
      rowData[0] = [multiPeriodSession];
      rowData[1] = [multiPeriodSession];
      rowData[2] = [multiPeriodSession];
      timetable.set('group1', rowData);

      const { container } = renderWithContext('class-group', mockGroup, timetable, periodsPerDay, totalPeriods);

      // Should only render once despite spanning 3 periods
      const sessionCells = container.querySelectorAll('[data-testid*="session-cell"]');
      expect(sessionCells.length).toBeLessThanOrEqual(1);
    });
  });

  describe('Classroom View', () => {
    it('should render classroom name with capacity as row label', () => {
      const timetable = new Map<string, (ClassSession[] | null)[]>();
      timetable.set('classroom1', Array(totalPeriods).fill(null));

      renderWithContext('classroom', mockClassroom, timetable, periodsPerDay, totalPeriods);

      expect(screen.getByText('Room 101 (30)')).toBeInTheDocument();
    });

    it('should render sessions in classroom row', () => {
      const timetable = new Map<string, (ClassSession[] | null)[]>();
      const rowData = Array(totalPeriods).fill(null);
      rowData[5] = [mockSession];
      timetable.set('classroom1', rowData);

      renderWithContext('classroom', mockClassroom, timetable, periodsPerDay, totalPeriods);

      expect(screen.getByText('MATH101')).toBeInTheDocument();
    });
  });

  describe('Instructor View', () => {
    it('should render instructor full name with prefix and contract type as row label', () => {
      const timetable = new Map<string, (ClassSession[] | null)[]>();
      timetable.set('instructor1', Array(totalPeriods).fill(null));

      renderWithContext('instructor', mockInstructor, timetable, periodsPerDay, totalPeriods);

      expect(screen.getByText('Dr. John Doe (Full-time)')).toBeInTheDocument();
    });

    it('should render instructor name without contract type if not provided', () => {
      const instructorNoContract: Instructor = {
        ...mockInstructor,
        contract_type: null,
      };

      const timetable = new Map<string, (ClassSession[] | null)[]>();
      timetable.set('instructor1', Array(totalPeriods).fill(null));

      renderWithContext('instructor', instructorNoContract, timetable, periodsPerDay, totalPeriods);

      expect(screen.getByText('Dr. John Doe')).toBeInTheDocument();
    });

    it('should render sessions in instructor row', () => {
      const timetable = new Map<string, (ClassSession[] | null)[]>();
      const rowData = Array(totalPeriods).fill(null);
      rowData[10] = [mockSession];
      timetable.set('instructor1', rowData);

      renderWithContext('instructor', mockInstructor, timetable, periodsPerDay, totalPeriods);

      expect(screen.getByText('MATH101')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty timetable data gracefully', () => {
      const timetable = new Map<string, (ClassSession[] | null)[]>();

      const { container } = renderWithContext('class-group', mockGroup, timetable, periodsPerDay, totalPeriods);

      const row = container.querySelector('tr');
      expect(row).toBeInTheDocument();
    });

    it('should render correctly when row data is missing from timetable map', () => {
      const timetable = new Map<string, (ClassSession[] | null)[]>();
      // Not adding mockGroup.id to the map

      const { container } = renderWithContext('class-group', mockGroup, timetable, periodsPerDay, totalPeriods);

      const row = container.querySelector('tr');
      const cells = row?.querySelectorAll('td');
      
      // Should still render with empty cells
      expect(cells?.length).toBe(totalPeriods + 1);
    });
  });
});
