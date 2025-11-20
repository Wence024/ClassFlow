/**
 * Integration tests for Manage Class Sessions component.
 * Tests the class session management UI for program heads.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import ManageClassSessionsComponent from '../component';
import { AuthContext } from '../../../shared/auth/contexts/AuthContext';
import type { User, AuthContextType } from '../../../shared/auth/types/auth';

// --- Mocks ---
vi.mock('../hook');
vi.mock('../../../shared/components/hooks');

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
 */
const setupComponent = async (
  classSessions = [mockClassSession],
  isLoading = false,
  error: string | null = null
) => {
  const mockUseManageClassSessions = vi.mocked(await import('../hook')).useManageClassSessions;
  mockUseManageClassSessions.mockReturnValue({
    classSessions,
    isLoading,
    isSubmitting: false,
    isRemoving: false,
    error,
    addClassSession: vi.fn(),
    updateClassSession: vi.fn(),
    removeClassSession: vi.fn(),
  });

  const mockAuthContext: AuthContextType = {
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
  };

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={mockAuthContext}>
        <MemoryRouter>
          <ManageClassSessionsComponent />
        </MemoryRouter>
      </AuthContext.Provider>
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

  it('should open add session dialog', async () => {
    const user = userEvent.setup();
    await setupComponent();

    const addButton = screen.getByRole('button', { name: /add.*session/i });
    await user.click(addButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should handle session deletion', async () => {
    const mockRemove = vi.fn();
    const mockUseManageClassSessions = vi.mocked(await import('../hook')).useManageClassSessions;
    mockUseManageClassSessions.mockReturnValue({
      classSessions: [mockClassSession],
      isLoading: false,
      isSubmitting: false,
      isRemoving: false,
      error: null,
      addClassSession: vi.fn(),
      updateClassSession: vi.fn(),
      removeClassSession: mockRemove,
    });

    const user = userEvent.setup();
    await setupComponent();

    const deleteButton = screen.getByRole('button', { name: /delete.*session1/i });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(mockRemove).toHaveBeenCalledWith('session1');
    });
  });
});
