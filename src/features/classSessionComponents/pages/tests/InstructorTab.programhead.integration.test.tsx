/**
 * Integration tests for InstructorTab component with Program Head user.
 * 
 * Tests the read-only browsing behavior for program heads viewing instructors.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import InstructorTab from '../InstructorTab';
import { AuthContext } from '../../../auth/contexts/AuthContext';
import type { AuthContextType } from '../../../auth/types/auth';
import type { Instructor } from '../../types/instructor';
import * as useInstructorsUnifiedHook from '../../hooks/useInstructorsUnified';

// Mock the unified hook
vi.mock('../../hooks/useInstructorsUnified');

const mockedUseInstructorsUnified = vi.mocked(useInstructorsUnifiedHook, true);

describe('InstructorTab - Program Head Integration', () => {
  let queryClient: QueryClient;

  const mockProgramHeadUser = {
    id: 'user-ph',
    name: 'Program Head',
    email: 'ph@test.com',
    role: 'program_head' as const,
    department_id: null, // Program heads don't have department_id
    program_id: 'prog-cs',
  };

  const mockInstructors: Instructor[] = [
    {
      id: 'inst1',
      first_name: 'John',
      last_name: 'Doe',
      code: 'JD001',
      department_id: 'dept1',
      created_by: 'admin',
      created_at: new Date().toISOString(),
      color: '#ff0000',
      contract_type: null,
      email: null,
      phone: null,
      prefix: null,
      suffix: null,
    },
    {
      id: 'inst2',
      first_name: 'Jane',
      last_name: 'Smith',
      code: 'JS002',
      department_id: 'dept1',
      created_by: 'admin',
      created_at: new Date().toISOString(),
      color: '#00ff00',
      contract_type: null,
      email: null,
      phone: null,
      prefix: null,
      suffix: null,
    },
    {
      id: 'inst3',
      first_name: 'Cross',
      last_name: 'Department',
      code: 'CD003',
      department_id: 'dept2', // Different department
      created_by: 'admin',
      created_at: new Date().toISOString(),
      color: '#0000ff',
      contract_type: null,
      email: null,
      phone: null,
      prefix: null,
      suffix: null,
    },
  ];

  const mockAuthContext = (user: typeof mockProgramHeadUser): AuthContextType => ({
    user,
    role: user.role,
    departmentId: user.department_id,
    login: vi.fn(),
    logout: vi.fn(),
    updateMyProfile: vi.fn(),
    loading: false,
    error: null,
    clearError: vi.fn(),
    isAdmin: () => false,
    isDepartmentHead: () => false,
    isProgramHead: () => true,
    canManageInstructors: () => false,
    canManageClassrooms: () => false,
    canReviewRequestsForDepartment: vi.fn().mockReturnValue(false),
    canManageInstructorRow: vi.fn().mockReturnValue(false),
    canManageAssignmentsForProgram: vi.fn().mockReturnValue(true),
  });

  beforeEach(() => {
    vi.resetAllMocks();
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });

    // Mock unified hook to return read-only data for program heads
    mockedUseInstructorsUnified.useInstructorsUnified.mockReturnValue({
      instructors: mockInstructors,
      isLoading: false,
      error: null,
      addInstructor: vi.fn(),
      updateInstructor: vi.fn(),
      removeInstructor: vi.fn(),
      isSubmitting: false,
      isRemoving: false,
      canManage: false,
    } as unknown as ReturnType<typeof useInstructorsUnifiedHook.useInstructorsUnified>);
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthContext.Provider value={mockAuthContext(mockProgramHeadUser)}>
            <InstructorTab />
          </AuthContext.Provider>
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  it('should display instructors in read-only mode for program heads', async () => {
    renderComponent();

    // Wait for instructors to load
    await waitFor(() => {
      expect(screen.getByText('Browse Instructors')).toBeInTheDocument();
    });

    // Should show the info alert about browsing
    expect(
      screen.getByText(/You can browse instructors from all departments/i)
    ).toBeInTheDocument();

    // Should display instructors
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('should NOT show the create/edit form for program heads', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Browse Instructors')).toBeInTheDocument();
    });

    // Form should not be visible
    expect(screen.queryByText('Create Instructor')).not.toBeInTheDocument();
    expect(screen.queryByText('Edit Instructor')).not.toBeInTheDocument();
  });

  it('should NOT show edit/delete buttons on instructor cards for program heads', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Edit/Delete buttons should not be present (isOwner = false)
    const editButtons = screen.queryAllByRole('button', { name: /edit/i });
    const deleteButtons = screen.queryAllByRole('button', { name: /delete/i });

    expect(editButtons).toHaveLength(0);
    expect(deleteButtons).toHaveLength(0);
  });

  it('should allow program heads to search instructors', async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    // Find and use the search input
    const searchInput = screen.getByPlaceholderText(/search by name or code/i);
    
    // Type in search query using userEvent
    await user.type(searchInput, 'John');

    // Should only show matching instructor
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
  });

  it('should fetch instructors using unified hook for program heads', async () => {
    renderComponent();

    // Program head should see instructors from ALL departments
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Cross Department')).toBeInTheDocument();
    });

    // Verify that the unified hook was called with canManage: false
    expect(mockedUseInstructorsUnified.useInstructorsUnified).toHaveBeenCalled();
  });
});
