import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ClassSessionsPage from '../ClassSessionsPage';
import { AuthProvider } from '../../../auth/contexts/AuthProvider';
import type { User } from '../../../auth/types/auth';

// Mock the hooks
vi.mock('../../../auth/hooks/useAuth');
vi.mock('../../hooks/useClassSessions');
vi.mock('../../../classSessionComponents/hooks');
vi.mock('../../../programs/hooks/usePrograms');

const mockUser: User = {
  id: 'user1',
  email: 'test@example.com',
  role: 'program_head',
  program_id: 'p1',
  department_id: 'd1',
  first_name: 'Test',
  last_name: 'User',
};

const mockClassSession = {
  id: 'session1',
  course: {
    id: 'course1',
    name: 'Mathematics 101',
    code: 'MATH101',
    created_at: new Date().toISOString(),
    color: '#db2777',
    program_id: 'p1',
    created_by: 'user1',
  },
  group: {
    id: 'group1',
    name: 'CS-1A',
    code: 'CS1A',
    user_id: 'user1',
    created_at: new Date().toISOString(),
    color: '#4f46e5',
    student_count: 25,
    program_id: 'p1',
  },
  instructor: {
    id: 'instructor1',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    created_at: new Date().toISOString(),
    code: 'JD',
    color: '#ca8a04',
    prefix: 'Dr.',
    suffix: null,
    phone: null,
    contract_type: 'Full-time',
    created_by: 'user1',
    department_id: 'd1',
  },
  classroom: {
    id: 'classroom1',
    name: 'Room 101',
    location: 'Building A',
    capacity: 30,
    created_at: new Date().toISOString(),
    code: 'R101',
    color: '#65a30d',
    created_by: 'user1',
    preferred_department_id: null,
  },
  period_count: 1,
  program_id: 'p1',
};

/**
 * Sets up the component with necessary providers and mocked data.
 */
const setupComponent = (
  classSessions = [mockClassSession],
  isLoading = false,
  error: string | null = null
) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  const mockUseAuth = vi.mocked(await import('../../../auth/hooks/useAuth')).useAuth;
  mockUseAuth.mockReturnValue({ user: mockUser, loading: false });

  const mockUseClassSessions = vi.mocked(await import('../../hooks/useClassSessions')).useClassSessions;
  mockUseClassSessions.mockReturnValue({
    classSessions,
    isLoading,
    isSubmitting: false,
    isRemoving: false,
    error,
    addClassSession: vi.fn(),
    updateClassSession: vi.fn(),
    removeClassSession: vi.fn(),
  });

  const mockUseCourses = vi.mocked(await import('../../../classSessionComponents/hooks')).useCourses;
  mockUseCourses.mockReturnValue({
    courses: [mockClassSession.course],
    isLoading: false,
    isSubmitting: false,
    isRemoving: false,
    error: null,
    addCourse: vi.fn(),
    updateCourse: vi.fn(),
    removeCourse: vi.fn(),
  });

  const mockUseClassGroups = vi.mocked(await import('../../../classSessionComponents/hooks')).useClassGroups;
  mockUseClassGroups.mockReturnValue({
    classGroups: [mockClassSession.group],
    isLoading: false,
    isSubmitting: false,
    isRemoving: false,
    error: null,
    addClassGroup: vi.fn(),
    updateClassGroup: vi.fn(),
    removeClassGroup: vi.fn(),
  });

  const mockUseClassrooms = vi.mocked(await import('../../../classSessionComponents/hooks')).useClassrooms;
  mockUseClassrooms.mockReturnValue({
    classrooms: [mockClassSession.classroom],
    isLoading: false,
    isSubmitting: false,
    isRemoving: false,
    error: null,
    addClassroom: vi.fn(),
    updateClassroom: vi.fn(),
    removeClassroom: vi.fn(),
  });

  const mockUseInstructors = vi.mocked(await import('../../../classSessionComponents/hooks')).useInstructors;
  mockUseInstructors.mockReturnValue({
    instructors: [mockClassSession.instructor],
    isLoading: false,
    isSubmitting: false,
    isRemoving: false,
    error: null,
    addInstructor: vi.fn(),
    updateInstructor: vi.fn(),
    removeInstructor: vi.fn(),
  });

  const mockUsePrograms = vi.mocked(await import('../../../programs/hooks/usePrograms')).usePrograms;
  mockUsePrograms.mockReturnValue({
    listQuery: {
      data: [],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    },
    createMutation: {
      mutateAsync: vi.fn(),
      isPending: false,
    },
    updateMutation: {
      mutateAsync: vi.fn(),
      isPending: false,
    },
    deleteMutation: {
      mutateAsync: vi.fn(),
      isPending: false,
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ClassSessionsPage />
      </AuthProvider>
    </QueryClientProvider>
  );
};

describe('ClassSessionsPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the page title', async () => {
    setupComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Classes')).toBeInTheDocument();
    });
  });

  it('should display loading spinner when data is loading', async () => {
    setupComponent([], true);

    await waitFor(() => {
      expect(screen.getByText(/loading classes/i)).toBeInTheDocument();
    });
  });

  it('should display error message when there is an error', async () => {
    const errorMessage = 'Failed to load class sessions';
    setupComponent([], false, errorMessage);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('should display "No classes created yet" message when no sessions exist', async () => {
    setupComponent([]);

    await waitFor(() => {
      expect(screen.getByText('No classes created yet.')).toBeInTheDocument();
    });
  });

  it('should display class session cards when sessions exist', async () => {
    setupComponent();

    await waitFor(() => {
      expect(screen.getByText('MATH101')).toBeInTheDocument();
      expect(screen.getByText('Mathematics 101')).toBeInTheDocument();
    });
  });

  it('should render the class session form', async () => {
    setupComponent();

    await waitFor(() => {
      expect(screen.getByText(/course/i)).toBeInTheDocument();
    });
  });

  it('should filter class sessions based on search term', async () => {
    const user = userEvent.setup();
    const sessions = [
      mockClassSession,
      {
        ...mockClassSession,
        id: 'session2',
        course: {
          ...mockClassSession.course,
          id: 'course2',
          name: 'Physics 101',
          code: 'PHYS101',
        },
      },
    ];

    setupComponent(sessions);

    await waitFor(() => {
      expect(screen.getByText('MATH101')).toBeInTheDocument();
      expect(screen.getByText('PHYS101')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search by course or class group/i);
    await user.type(searchInput, 'Math');

    await waitFor(() => {
      expect(screen.getByText('MATH101')).toBeInTheDocument();
      expect(screen.queryByText('PHYS101')).not.toBeInTheDocument();
    });
  });

  it('should clear search results when search term is cleared', async () => {
    const user = userEvent.setup();
    const sessions = [
      mockClassSession,
      {
        ...mockClassSession,
        id: 'session2',
        course: {
          ...mockClassSession.course,
          id: 'course2',
          name: 'Physics 101',
          code: 'PHYS101',
        },
      },
    ];

    setupComponent(sessions);

    const searchInput = screen.getByPlaceholderText(/search by course or class group/i);
    await user.type(searchInput, 'Math');

    await waitFor(() => {
      expect(screen.queryByText('PHYS101')).not.toBeInTheDocument();
    });

    await user.clear(searchInput);

    await waitFor(() => {
      expect(screen.getByText('MATH101')).toBeInTheDocument();
      expect(screen.getByText('PHYS101')).toBeInTheDocument();
    });
  });

  it('should handle edit button click', async () => {
    const user = userEvent.setup();
    setupComponent();

    await waitFor(() => {
      expect(screen.getByText('MATH101')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    await user.click(editButtons[0]);

    // Form should populate with session data
    await waitFor(() => {
      // The form fields should be populated (tested in form component tests)
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });
  });
});
