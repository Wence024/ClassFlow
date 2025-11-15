import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Timetable from '../index';
import { AuthContext } from '../../../../../auth/contexts/AuthContext';
import TimetableContext from '../TimetableContext';
import type { AuthContextType } from '../../../../../auth/types/auth';
import type { TimetableContextType } from '../TimetableContext';
import type {
  ClassGroup,
  Classroom,
  Instructor,
} from '../../../../../classSessionComponents/types';
import type { TimetableViewMode } from '../../../../types/timetable';
import * as useScheduleConfigHook from '../../../../../scheduleConfig/hooks/useScheduleConfig';
import * as useDepartmentIdHook from '../../../../../auth/hooks/useDepartmentId';

vi.mock('../../../../../scheduleConfig/hooks/useScheduleConfig');
vi.mock('../../../../../auth/hooks/useDepartmentId');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const mockScheduleSettings = {
  class_days_per_week: 5,
  periods_per_day: 8,
  start_time: '08:00',
  period_duration_minutes: 60,
  break_duration_minutes: 10,
};

/**
 * Renders the Timetable component with required providers.
 *
 * @param rwp The component props.
 * @param rwp.viewMode The current view mode of the timetable.
 * @param rwp.groups The list of class groups.
 * @param rwp.resources The list of resources to display.
 * @param rwp.timetable The timetable data.
 * @param rwp.isLoading Whether the timetable is loading.
 * @param authValue Auth context value.
 * @param timetableValue Timetable context value.
 * @returns The rendered component.
 */
function renderWithProviders(
  rwp: {
    viewMode: TimetableViewMode;
    groups: ClassGroup[];
    resources: (ClassGroup | Classroom | Instructor)[];
    timetable: Map<string, (null | unknown[])[]>;
    isLoading: boolean;
  },
  authValue: Partial<AuthContextType>,
  timetableValue: Partial<TimetableContextType>
) {
  return render(
    <DndProvider backend={HTML5Backend}>
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={authValue as AuthContextType}>
          <TimetableContext.Provider value={timetableValue as TimetableContextType}>
            <Timetable {...rwp} />
          </TimetableContext.Provider>
        </AuthContext.Provider>
      </QueryClientProvider>
    </DndProvider>
  );
}

describe('Timetable - Resource Filtering', () => {
  const mockTimetableContext: Partial<TimetableContextType> = {
    handleDragLeave: vi.fn(),
    handleDragOver: vi.fn(),
    dragOverCell: null,
    activeDraggedSession: null,
    isSlotAvailable: vi.fn(),
    handleDragStart: vi.fn(),
    handleDropToGrid: vi.fn(),
    onShowTooltip: vi.fn(),
    onHideTooltip: vi.fn(),
    handleDragEnter: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(useScheduleConfigHook, 'useScheduleConfig').mockReturnValue({
      settings: mockScheduleSettings,
      isLoading: false,
      error: null,
      updateScheduleConfig: vi.fn(),
    });
  });

  describe('Classroom View Filtering', () => {
    const deptId1 = 'dept-1';
    const deptId2 = 'dept-2';

    const myClassroom: Classroom = {
      id: 'c1',
      name: 'My Classroom',
      code: 'C1',
      created_by: 'u1',
      created_at: '2023-01-01T00:00:00Z',
      preferred_department_id: deptId1,
      preferred_department_name: 'Dept 1',
      location: 'Building A',
      capacity: 30,
      color: '#4f46e5',
    };

    const unassignedClassroom: Classroom = {
      id: 'c2',
      name: 'Unassigned Classroom',
      code: 'C2',
      created_by: 'u1',
      created_at: '2023-01-01T00:00:00Z',
      preferred_department_id: null,
      preferred_department_name: null,
      location: 'Building B',
      capacity: 25,
      color: '#10b981',
    };

    const otherClassroom: Classroom = {
      id: 'c3',
      name: 'Other Classroom',
      code: 'C3',
      created_by: 'u2',
      created_at: '2023-01-01T00:00:00Z',
      preferred_department_id: deptId2,
      preferred_department_name: 'Dept 2',
      location: 'Building C',
      capacity: 40,
      color: '#f59e0b',
    };

    it('should separate classrooms by department for program head', async () => {
      vi.spyOn(useDepartmentIdHook, 'useDepartmentId').mockReturnValue(deptId1);

      const authContext: Partial<AuthContextType> = {
        user: {
          id: 'u1',
          email: 'user@example.com',
          role: 'program_head',
          program_id: 'prog-1',
          department_id: null,
          name: 'Test User',
        },
        loading: false,
      };

      renderWithProviders(
        {
          viewMode: 'classroom',
          groups: [],
          resources: [myClassroom, unassignedClassroom, otherClassroom],
          timetable: new Map(),
          isLoading: false,
        },
        authContext,
        mockTimetableContext
      );

      await waitFor(() => {
        expect(screen.getByText('My Classroom (30)')).toBeInTheDocument();
      });

      // Should see all three sections
      expect(screen.getByText('Unassigned Classrooms')).toBeInTheDocument();
      expect(screen.getByText('Classrooms from Other Departments')).toBeInTheDocument();
      expect(screen.getByText('Unassigned Classroom (25)')).toBeInTheDocument();
      expect(screen.getByText('Other Classroom (40)')).toBeInTheDocument();
    });

    it('should show all classrooms without separation for admin', async () => {
      vi.spyOn(useDepartmentIdHook, 'useDepartmentId').mockReturnValue(null);

      const authContext: Partial<AuthContextType> = {
        user: {
          id: 'u1',
          email: 'admin@example.com',
          role: 'admin',
          program_id: null,
          department_id: null,
          name: 'Admin User',
        },
        loading: false,
      };

      renderWithProviders(
        {
          viewMode: 'classroom',
          groups: [],
          resources: [myClassroom, unassignedClassroom, otherClassroom],
          timetable: new Map(),
          isLoading: false,
        },
        authContext,
        mockTimetableContext
      );

      await waitFor(() => {
        expect(screen.getByText('My Classroom (30)')).toBeInTheDocument();
      });

      // Should NOT see separation labels for admin
      expect(screen.queryByText('Unassigned Classrooms')).not.toBeInTheDocument();
      expect(screen.queryByText('Classrooms from Other Departments')).not.toBeInTheDocument();

      // But should see all classrooms
      expect(screen.getByText('My Classroom (30)')).toBeInTheDocument();
      expect(screen.getByText('Unassigned Classroom (25)')).toBeInTheDocument();
      expect(screen.getByText('Other Classroom (40)')).toBeInTheDocument();
    });
  });

  describe('Instructor View Filtering', () => {
    const deptId1 = 'dept-1';
    const deptId2 = 'dept-2';

    const myInstructor: Instructor = {
      id: 'i1',
      first_name: 'John',
      last_name: 'Doe',
      code: 'JD',
      created_by: 'u1',
      created_at: '2023-01-01T00:00:00Z',
      department_id: deptId1,
      department_name: 'Dept 1',
      email: 'john@example.com',
      color: '#4f46e5',
      contract_type: 'full_time',
      phone: null,
      prefix: null,
      suffix: null,
    };

    const unassignedInstructor: Instructor = {
      id: 'i2',
      first_name: 'Jane',
      last_name: 'Smith',
      code: 'JS',
      created_by: 'u1',
      created_at: '2023-01-01T00:00:00Z',
      department_id: null,
      department_name: null,
      email: 'jane@example.com',
      color: '#10b981',
      contract_type: 'part_time',
      phone: null,
      prefix: null,
      suffix: null,
    };

    const otherInstructor: Instructor = {
      id: 'i3',
      first_name: 'Bob',
      last_name: 'Johnson',
      code: 'BJ',
      created_by: 'u2',
      created_at: '2023-01-01T00:00:00Z',
      department_id: deptId2,
      department_name: 'Dept 2',
      email: 'bob@example.com',
      color: '#f59e0b',
      contract_type: 'full_time',
      phone: null,
      prefix: null,
      suffix: null,
    };

    it('should separate instructors by department for program head', async () => {
      vi.spyOn(useDepartmentIdHook, 'useDepartmentId').mockReturnValue(deptId1);

      const authContext: Partial<AuthContextType> = {
        user: {
          id: 'u1',
          email: 'user@example.com',
          role: 'program_head',
          program_id: 'prog-1',
          department_id: null,
          name: 'Test User',
        },
        loading: false,
      };

      renderWithProviders(
        {
          viewMode: 'instructor',
          groups: [],
          resources: [myInstructor, unassignedInstructor, otherInstructor],
          timetable: new Map(),
          isLoading: false,
        },
        authContext,
        mockTimetableContext
      );

      await waitFor(() => {
        expect(screen.getByText(/John Doe/)).toBeInTheDocument();
      });

      // Should see all three sections
      expect(screen.getByText('Unassigned Instructors')).toBeInTheDocument();
      expect(screen.getByText('Instructors from Other Departments')).toBeInTheDocument();
      expect(screen.getByText(/Jane Smith/)).toBeInTheDocument();
      expect(screen.getByText(/Bob Johnson/)).toBeInTheDocument();
    });

    it('should show all instructors without separation for admin', async () => {
      vi.spyOn(useDepartmentIdHook, 'useDepartmentId').mockReturnValue(null);

      const authContext: Partial<AuthContextType> = {
        user: {
          id: 'u1',
          email: 'admin@example.com',
          role: 'admin',
          program_id: null,
          department_id: null,
          name: 'Admin User',
        },
        loading: false,
      };

      renderWithProviders(
        {
          viewMode: 'instructor',
          groups: [],
          resources: [myInstructor, unassignedInstructor, otherInstructor],
          timetable: new Map(),
          isLoading: false,
        },
        authContext,
        mockTimetableContext
      );

      await waitFor(() => {
        expect(screen.getByText(/John Doe/)).toBeInTheDocument();
      });

      // Should NOT see separation labels for admin
      expect(screen.queryByText('Unassigned Instructors')).not.toBeInTheDocument();
      expect(screen.queryByText('Instructors from Other Departments')).not.toBeInTheDocument();

      // But should see all instructors
      expect(screen.getByText(/John Doe/)).toBeInTheDocument();
      expect(screen.getByText(/Jane Smith/)).toBeInTheDocument();
      expect(screen.getByText(/Bob Johnson/)).toBeInTheDocument();
    });
  });

  describe('Class Group View', () => {
    const mockGroup: ClassGroup = {
      id: 'g1',
      name: 'CS-1A',
      code: 'CS1A',
      user_id: 'u1',
      created_at: '2023-01-01T00:00:00Z',
      program_id: 'prog-1',
      student_count: 30,
    };

    it('should render class group view without errors', async () => {
      vi.spyOn(useDepartmentIdHook, 'useDepartmentId').mockReturnValue('dept-1');

      const authContext: Partial<AuthContextType> = {
        user: {
          id: 'u1',
          email: 'user@example.com',
          role: 'program_head',
          program_id: 'prog-1',
          department_id: null,
          name: 'Test User',
        },
        loading: false,
      };

      renderWithProviders(
        {
          viewMode: 'class-group',
          groups: [mockGroup],
          resources: [mockGroup],
          timetable: new Map([['g1', Array(40).fill(null)]]),
          isLoading: false,
        },
        authContext,
        mockTimetableContext
      );

      await waitFor(() => {
        expect(screen.getByText('CS-1A')).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading spinner when config is loading', () => {
      vi.spyOn(useScheduleConfigHook, 'useScheduleConfig').mockReturnValue({
        settings: null,
        isLoading: true,
        error: null,
        updateScheduleConfig: vi.fn(),
      });

      vi.spyOn(useDepartmentIdHook, 'useDepartmentId').mockReturnValue('dept-1');

      const authContext: Partial<AuthContextType> = {
        user: {
          id: 'u1',
          email: 'user@example.com',
          role: 'program_head',
          program_id: 'prog-1',
          department_id: null,
          name: 'Test User',
        },
        loading: false,
      };

      renderWithProviders(
        {
          viewMode: 'class-group',
          groups: [],
          resources: [],
          timetable: new Map(),
          isLoading: false,
        },
        authContext,
        mockTimetableContext
      );

      expect(screen.getByText('Loading configuration...')).toBeInTheDocument();
    });

    it('should render without errors when timetable is loading', async () => {
      vi.spyOn(useDepartmentIdHook, 'useDepartmentId').mockReturnValue('dept-1');

      const authContext: Partial<AuthContextType> = {
        user: {
          id: 'u1',
          email: 'user@example.com',
          role: 'program_head',
          program_id: 'prog-1',
          department_id: null,
          name: 'Test User',
        },
        loading: false,
      };

      renderWithProviders(
        {
          viewMode: 'class-group',
          groups: [],
          resources: [],
          timetable: new Map(),
          isLoading: true,
        },
        authContext,
        mockTimetableContext
      );

      // The sync indicator is now in the Header component, not in Timetable
      // This test just verifies the component renders without errors during loading
      await waitFor(() => {
        expect(screen.queryByRole('table')).toBeInTheDocument();
      });
    });
  });
});
