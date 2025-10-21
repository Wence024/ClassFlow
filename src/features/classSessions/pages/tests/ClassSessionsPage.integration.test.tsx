import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import ClassSessionsPage from '../ClassSessionsPage';
import { AuthProvider } from '../../../auth/contexts/AuthProvider';
import type { User } from '../../../auth/types/auth';


// --- Mocks ---
vi.mock('../../../auth/hooks/useAuth');
vi.mock('../../hooks/useClassSessions');
vi.mock('../../../classSessionComponents/hooks');
vi.mock('../../../programs/hooks/usePrograms');
vi.mock('../../../auth/services/authService');

// --- Mock Data ---
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
  course: { id: 'course1', name: 'Mathematics 101', code: 'MATH101' },
  group: { id: 'group1', name: 'CS-1A', code: 'CS1A' },
  instructor: { id: 'instructor1', first_name: 'John', last_name: 'Doe' },
  classroom: { id: 'classroom1', name: 'Room 101' },
  period_count: 1,
  program_id: 'p1',
};

// --- Test Setup ---
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, staleTime: Infinity },
  },
});

/**
 * Sets up the component with necessary providers and mocked data.
 *
 * @param classSessions - The class sessions to be returned by useClassSessions mock.
 * @param isLoading - The loading state to be returned by useClassSessions mock.
 * @param error - The error message to be returned by useClassSessions mock.
 * @returns The rendered component.
 */
const setupComponent = async (
  classSessions = [mockClassSession],
  isLoading = false,
  error: string | null = null
) => {
  const mockAuthService = await import('../../../auth/services/authService');
  (mockAuthService.getStoredUser as vi.Mock).mockResolvedValue(mockUser);

  const mockUseAuth = vi.mocked(await import('../../../auth/hooks/useAuth')).useAuth;
  mockUseAuth.mockReturnValue({
    user: mockUser,
    loading: false,
    isAdmin: () => false,
    isDepartmentHead: () => false,
    isProgramHead: () => true, // The mock user is a program head
    canManageInstructors: () => false,
    canManageClassrooms: () => false,
    canReviewRequestsForDepartment: () => false,
    canManageInstructorRow: () => false,
    canManageAssignmentsForProgram: () => true, // program head can manage assignments
    login: vi.fn(),
    logout: vi.fn(),
    clearError: vi.fn(),
    updateMyProfile: vi.fn(),
    role: 'program_head',
    departmentId: 'd1',
    error: null,
  });

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
      <MemoryRouter>
        <AuthProvider>
          <ClassSessionsPage />
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('ClassSessionsPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the page title', async () => {
    await setupComponent();
    const title = await screen.findByText('Classes');
    expect(title).toBeInTheDocument();
  });

  it('should display loading spinner when data is loading', async () => {
    await setupComponent([], true);

    await waitFor(() => {
      expect(screen.getByText(/loading classes/i)).toBeInTheDocument();
    });
  });

  it('should display error message when fetching fails', async () => {
    const errorMessage = 'Failed to load class sessions';
    await setupComponent([], false, errorMessage);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('should display "No classes created yet" message when no sessions exist', async () => {
    await setupComponent([]);

    await waitFor(() => {
      expect(screen.getByText('No classes created yet.')).toBeInTheDocument();
    });
  });

  it('should display class session cards when sessions exist', async () => {
    await setupComponent();

    await waitFor(async () => {
      expect(await screen.findByText(/MATH101/i, { selector: 'p' })).toBeInTheDocument();
      expect(await screen.findByText(/Mathematics 101 - CS-1A/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('should render the class session form', async () => {
    await setupComponent();

    await waitFor(() => {
      expect(screen.getByText(/course/i, { selector: 'label' })).toBeInTheDocument();
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

    await setupComponent(sessions);

    await waitFor(async () => {
      expect(await screen.findByText(/MATH101/i, { selector: 'p' })).toBeInTheDocument();
      expect(await screen.findByText(/PHYS101/i, { selector: 'p' })).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search by course or class group/i);
    await user.type(searchInput, 'Math');

    await waitFor(async () => {
      expect(await screen.findByText(/MATH101/i, { selector: 'p' })).toBeInTheDocument();
      expect(screen.queryByText(/PHYS101/i, { selector: 'p' })).not.toBeInTheDocument();
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

    await setupComponent(sessions);

    const searchInput = screen.getByPlaceholderText(/search by course or class group/i);
    await user.type(searchInput, 'Math');

    await waitFor(() => {
      expect(screen.queryByText(/PHYS101/i, { selector: 'p' })).not.toBeInTheDocument();
    });

    await user.clear(searchInput);

    await waitFor(async () => {
      expect(await screen.findByText(/MATH101/i, { selector: 'p' })).toBeInTheDocument();
      expect(await screen.findByText(/PHYS101/i, { selector: 'p' })).toBeInTheDocument();
    });
  });

  it('should handle edit button click', async () => {
    const user = userEvent.setup();
    await setupComponent();

    await waitFor(async () => {
      expect(await screen.findByText(/MATH101/i, { selector: 'p' })).toBeInTheDocument();
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