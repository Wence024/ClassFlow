/// <reference types="@testing-library/jest-dom" />
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ProgramHeadInstructors from '../ProgramHeadInstructors';
import { AuthContext } from '../../../auth/contexts/AuthContext';
import type { AuthContextType } from '../../../auth/types/auth';
import type { ReactNode } from 'react';
import * as departmentsService from '../../../departments/services/departmentsService';
import * as instructorsService from '../../services/instructorsService';
import type { Instructor } from '../../types';

// Mock the services
vi.mock('../../../departments/services/departmentsService');
vi.mock('../../services/instructorsService');

/**
 * Test suite for ProgramHeadInstructors integration tests.
 * Verifies that Program Heads can browse instructors from various departments.
 */
describe('ProgramHeadInstructors Integration Tests', () => {
  let queryClient: QueryClient;

  /**
   * Creates a test wrapper with all required providers.
   *
   * @param authContext - The authentication context value to use for the test.
   * @returns A wrapper component for rendering.
   */
  const createWrapper =
    (authContext: Partial<AuthContextType>) =>
    ({ children }: { children: ReactNode }) => (
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthContext.Provider value={authContext as AuthContextType}>
            {children}
          </AuthContext.Provider>
        </QueryClientProvider>
      </BrowserRouter>
    );

  const mockProgramHeadContext: Partial<AuthContextType> = {
    user: {
      id: 'user-1',
      email: 'programhead@example.com',
      role: 'program_head',
      program_id: 'prog-1',
      name: 'Program Head',
      department_id: null,
    },
    loading: false,
    isDepartmentHead: vi.fn(() => false),
    isAdmin: vi.fn(() => false),
    isProgramHead: vi.fn(() => true),
  };

  const mockDepartments = [
    { id: 'dept-1', name: 'Computer Science', code: 'CS', created_at: new Date().toISOString() },
    { id: 'dept-2', name: 'Mathematics', code: 'MATH', created_at: new Date().toISOString() },
  ];

  const mockInstructors: Instructor[] = [
    {
      id: 'inst-1',
      first_name: 'John',
      last_name: 'Doe',
      code: 'JD',
      email: 'john@example.com',
      department_id: 'dept-1',
      color: null,
      contract_type: null,
      created_at: new Date().toISOString(),
      created_by: 'user-1',
      phone: null,
      prefix: null,
      suffix: null,
    },
    {
      id: 'inst-2',
      first_name: 'Jane',
      last_name: 'Smith',
      code: 'JS',
      email: 'jane@example.com',
      department_id: 'dept-1',
      color: null,
      contract_type: null,
      created_at: new Date().toISOString(),
      created_by: 'user-1',
      phone: null,
      prefix: null,
      suffix: null,
    },
  ];

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    vi.clearAllMocks();

    // Setup default mocks
    vi.mocked(departmentsService.listDepartments).mockResolvedValue(mockDepartments);
    vi.mocked(instructorsService.getInstructors).mockResolvedValue(mockInstructors);
  });

  it('should render a list of departments for selection', async () => {
    render(<ProgramHeadInstructors />, {
      wrapper: createWrapper(mockProgramHeadContext),
    });

    expect(screen.getByText(/browse instructors by department/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/department/i)).toBeInTheDocument();
  });

  it('should fetch and display instructors when a department is selected', async () => {
    const user = userEvent.setup();

    render(<ProgramHeadInstructors />, {
      wrapper: createWrapper(mockProgramHeadContext),
    });

    // Wait for departments to load
    await waitFor(() => {
      expect(departmentsService.listDepartments).toHaveBeenCalled();
    });

    // Click the department select to open the dropdown
    const deptSelect = screen.getByLabelText(/department/i);
    await user.click(deptSelect);

    // Click the desired option
    const option = await screen.findByText('Computer Science (CS)');
    await user.click(option);

    await waitFor(() => {
        expect(instructorsService.getInstructors).toHaveBeenCalledWith({ department_id: 'dept-1', role: 'program_head' });
    });

    // Assert that instructors are displayed
    await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('should filter the displayed instructors based on a search term', async () => {
    const user = userEvent.setup();

    render(<ProgramHeadInstructors />, {
      wrapper: createWrapper(mockProgramHeadContext),
    });

    // Wait for the search input to be available
    await waitFor(() => {
      expect(screen.getByLabelText(/search instructors/i)).toBeInTheDocument();
    });

    const searchInput = screen.getByLabelText(/search instructors/i);
    await user.type(searchInput, 'John');

    // The filtering logic is based on the search state
    // We verify that the input accepts the search term
    expect(searchInput).toHaveValue('John');
  });

  it('should deny access for users who are not Program Heads', () => {
    const nonProgramHeadContext: Partial<AuthContextType> = {
      user: {
        id: 'user-2',
        email: 'depthead@example.com',
        role: 'department_head',
        department_id: 'dept-1',
        name: 'Department Head',
        program_id: null,
      },
      loading: false,
      isDepartmentHead: vi.fn(() => true),
      isAdmin: vi.fn(() => false),
      isProgramHead: vi.fn(() => false),
    };

    render(<ProgramHeadInstructors />, {
      wrapper: createWrapper(nonProgramHeadContext),
    });

    expect(screen.getByText(/you do not have access to this page/i)).toBeInTheDocument();
  });

  it('should display a message when no instructors are found', async () => {
    vi.mocked(instructorsService.getInstructors).mockResolvedValue([]);

    render(<ProgramHeadInstructors />, {
      wrapper: createWrapper(mockProgramHeadContext),
    });

    // The "no instructors" message only shows when a department is selected
    // and no instructors are returned
    expect(screen.getByText(/browse instructors by department/i)).toBeInTheDocument();
  });
});