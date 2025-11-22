/**
 * Integration tests for Manage Class Sessions component.
 * Tests the class session management UI for program heads.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { ManageClassSessionsPage } from '../component';
import { AuthContext } from '../../../shared/auth/contexts/AuthContext';
import type { User, AuthContextType } from '../../../shared/auth/types/auth';

// --- Mocks ---
vi.mock('../hook');
vi.mock('../../../shared/components/hooks');
vi.mock('../../manage-components/hooks');
vi.mock('../../../admin/manage-programs/hooks/usePrograms');
vi.mock('../../../admin/manage-departments/hooks/useDepartments');
vi.mock('../../../shared/auth/hooks/useAuth');

// --- Mock Data ---
const mockUser: User = {
  id: 'user1',
  email: 'test@example.com',
  role: 'program_head',
  program_id: 'p1',
  department_id: 'd1',
  name: 'Test User',
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
 * @param classSessions
 * @param isLoading
 * @param error
 * @param deleteSessionMock - Optional mock for deleteSession function
 */
const setupComponent = async (
  classSessions = [mockClassSession],
  isLoading = false,
  error: string | null = null,
  deleteSessionMock?: any
) => {
  // Mock the useAuth hook used by the component
  const { useAuth } = await import('../../../shared/auth/hooks/useAuth');
  vi.mocked(useAuth).mockReturnValue({
    user: mockUser,
    loading: false,
    error: null,
    role: 'program_head',
    departmentId: 'd1',
    login: vi.fn(),
    logout: vi.fn(),
    clearError: vi.fn(),
    updateMyProfile: vi.fn(),
    isAdmin: () => false,
    isDepartmentHead: () => false,
    isProgramHead: () => true,
    canManageInstructors: () => false,
    canManageClassrooms: () => false,
    canReviewRequestsForDepartment: () => false,
    canManageInstructorRow: () => false,
    canManageAssignmentsForProgram: () => true,
  });

  // Mock all hooks used by the component
  const mockUseManageClassSessions = vi.mocked(await import('../hook')).useManageClassSessions;
  mockUseManageClassSessions.mockReturnValue({
    sessions: classSessions,
    isLoading,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    error,
    createSession: vi.fn(),
    updateSession: vi.fn(),
    deleteSession: deleteSessionMock || vi.fn(),
    checkCrossDepartment: vi.fn(),
  });

  // Mock the manage-components hooks
  const { useAllCourses, useClassGroups, useAllClassrooms, useAllInstructors } = await import('../../manage-components/hooks');
  vi.mocked(useAllCourses).mockReturnValue({
    courses: [{ id: 'course1', name: 'Mathematics 101', code: 'MATH101' }],
    isLoading: false,
  });

  vi.mocked(useClassGroups).mockReturnValue({
    classGroups: [{ id: 'group1', name: 'CS-1A', code: 'CS1A' }],
    isLoading: false,
  });

  vi.mocked(useAllClassrooms).mockReturnValue({
    classrooms: [{ id: 'classroom1', name: 'Room 101' }],
    isLoading: false,
  });

  vi.mocked(useAllInstructors).mockReturnValue({
    instructors: [{ id: 'instructor1', first_name: 'John', last_name: 'Doe' }],
    isLoading: false,
  });

  // Mock the programs and departments hooks
  const { usePrograms } = await import('../../../admin/manage-programs/hooks/usePrograms');
  vi.mocked(usePrograms).mockReturnValue({
    listQuery: {
      data: [{ id: 'p1', name: 'Program 1', department_id: 'd1' }],
      isLoading: false
    },
  });

  const { useDepartments } = await import('../../../admin/manage-departments/hooks/useDepartments');
  vi.mocked(useDepartments).mockReturnValue({
    listQuery: {
      data: [{ id: 'd1', name: 'Department 1' }],
      isLoading: false
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ManageClassSessionsPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('ManageClassSessions Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('should render class sessions list', async () => {
    await setupComponent();
    await waitFor(() => {
      expect(screen.getByText('MATH101')).toBeInTheDocument();
    });
  });

  it('should display loading state', async () => {
    await setupComponent([], true);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should display error state', async () => {
    await setupComponent([], false, 'Failed to load sessions');
    expect(screen.getByText(/failed to load sessions/i)).toBeInTheDocument();
  });

  it('should filter sessions by search query', async () => {
    const user = userEvent.setup();
    await setupComponent([
      mockClassSession,
      { ...mockClassSession, id: 'session2', course: { ...mockClassSession.course, code: 'ENG101' } },
    ]);

    const searchInput = screen.getByPlaceholderText(/search/i);
    await user.type(searchInput, 'MATH');

    await waitFor(() => {
      expect(screen.getByText('MATH101')).toBeInTheDocument();
      expect(screen.queryByText('ENG101')).not.toBeInTheDocument();
    });
  });

  it('should show add session form', async () => {
    const user = userEvent.setup();
    await setupComponent();

    // The component always shows the form, so we just need to verify the form elements exist
    expect(screen.getByLabelText(/course/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/class group/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add class session/i })).toBeInTheDocument();
  });

  it('should handle session deletion', async () => {
    const mockRemove = vi.fn();

    const user = userEvent.setup();
    await setupComponent([mockClassSession], false, null, mockRemove);

    // Wait for the session to render and then attempt to find and click the delete button
    await waitFor(() => {
      expect(screen.getByText('MATH101')).toBeInTheDocument();
    });

    // Find a button that might be the delete button - likely has trash or delete icon
    const allButtons = screen.getAllByRole('button');
    // Try to find the delete button by text or aria-label containing delete
    let deleteButton;
    for (const button of allButtons) {
      if (button.textContent?.toLowerCase().includes('delete') ||
          button.textContent?.toLowerCase().includes('remove') ||
          button.textContent?.toLowerCase().includes('trash')) {
        deleteButton = button;
        break;
      }
    }

    if (deleteButton) {
      await user.click(deleteButton);
      await waitFor(() => {
        expect(mockRemove).toHaveBeenCalledWith('session1');
      });
    } else {
      // If we can't find a specific delete button, try clicking the last button which might be an action button
      const lastButton = allButtons[allButtons.length - 1];
      await user.click(lastButton);
      await waitFor(() => {
        expect(mockRemove).toHaveBeenCalledWith('session1');
      });
    }
  });
});
