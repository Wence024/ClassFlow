import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  QueryClient,
  QueryClientProvider,
  UseMutationResult,
  UseQueryResult,
} from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import UserProfilePage from '../UserProfilePage';
import { AuthContext } from '../../contexts/AuthContext';
import type { AuthContextType } from '../../types/auth';
import * as programHooks from '../../../programs/hooks/usePrograms';
import * as departmentHooks from '../../../departments/hooks/useDepartments';
import { Program, ProgramInsert, ProgramUpdate } from '../../../programs/types/program';
import {
  Department,
  DepartmentInsert,
  DepartmentUpdate,
} from '../../../departments/types/department';

const mockPrograms: Program[] = [
  {
    id: 'p1',
    name: 'Computer Science',
    short_code: 'CS',
    department_id: 'd1',
    created_at: '',
  },
  {
    id: 'p2',
    name: 'Mathematics',
    short_code: 'MATH',
    department_id: 'd2',
    created_at: '',
  },
];

const mockDepartments: Department[] = [
  { id: 'd1', name: 'Engineering', code: 'ENG', created_at: '' },
  { id: 'd2', name: 'Sciences', code: 'SCI', created_at: '' },
];

vi.spyOn(programHooks, 'usePrograms').mockReturnValue({
  listQuery: {
    data: mockPrograms,
    isLoading: false,
    error: null,
  } as UseQueryResult<Program[], Error>,
  createMutation: { mutate: vi.fn() } as unknown as UseMutationResult<
    void,
    Error,
    ProgramInsert,
    unknown
  >,
  updateMutation: { mutate: vi.fn() } as unknown as UseMutationResult<
    void,
    Error,
    { id: string; update: ProgramUpdate },
    unknown
  >,
  deleteMutation: { mutate: vi.fn() } as unknown as UseMutationResult<
    void,
    Error,
    string,
    unknown
  >,
});

vi.spyOn(departmentHooks, 'useDepartments').mockReturnValue({
  listQuery: {
    data: mockDepartments,
    isLoading: false,
    error: null,
  } as UseQueryResult<Department[], Error>,
  createMutation: { mutate: vi.fn() } as unknown as UseMutationResult<
    void,
    Error,
    DepartmentInsert,
    unknown
  >,
  updateMutation: { mutate: vi.fn() } as unknown as UseMutationResult<
    void,
    Error,
    { id: string; update: DepartmentUpdate },
    unknown
  >,
  deleteMutation: { mutate: vi.fn() } as unknown as UseMutationResult<
    void,
    Error,
    string,
    unknown
  >,
});

const queryClient = new QueryClient();

/**
 * Helper to render the component with all necessary providers.
 *
 * @param up - The props for the user profile page wrapper.
 * @param up.authValue - The auth context value to provide.
 * @returns The rendered component.
 */
const renderComponent = ({ authValue }: { authValue: AuthContextType }) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AuthContext.Provider value={authValue}>
          <UserProfilePage />
        </AuthContext.Provider>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('UserProfilePage Integration Tests', () => {
  beforeEach(() => {
    queryClient.clear();
  });

  it('should display user profile information', () => {
    const mockUpdateMyProfile = vi.fn();
    const authValue: AuthContextType = {
      user: {
        id: 'u1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'program_head',
        program_id: 'p1',
        department_id: 'd1',
      },
      loading: false,
      error: null,
      role: 'program_head',
      departmentId: 'd1',
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      resendVerificationEmail: vi.fn(),
      updateMyProfile: mockUpdateMyProfile,
      clearError: vi.fn(),
      isAdmin: () => false,
      isDepartmentHead: () => false,
      isProgramHead: () => true,
      canManageInstructors: () => false,
      canManageClassrooms: () => false,
      canReviewRequestsForDepartment: vi.fn(),
      canManageInstructorRow: vi.fn(),
      canManageAssignmentsForProgram: vi.fn(),
    };

    renderComponent({ authValue });

    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('program_head')).toBeInTheDocument();
    expect(screen.getByText('Computer Science (CS)')).toBeInTheDocument();
    expect(screen.getByText('Engineering (ENG)')).toBeInTheDocument();
  });

  it('should call updateMyProfile when save button is clicked', async () => {
    const mockUpdateMyProfile = vi.fn().mockResolvedValue(undefined);
    const authValue: AuthContextType = {
      user: {
        id: 'u1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
        program_id: null,
        department_id: null,
      },
      loading: false,
      error: null,
      role: 'admin',
      departmentId: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      resendVerificationEmail: vi.fn(),
      updateMyProfile: mockUpdateMyProfile,
      clearError: vi.fn(),
      isAdmin: () => true,
      isDepartmentHead: () => false,
      isProgramHead: () => false,
      canManageInstructors: () => true,
      canManageClassrooms: () => true,
      canReviewRequestsForDepartment: vi.fn(),
      canManageInstructorRow: vi.fn(),
      canManageAssignmentsForProgram: vi.fn(),
    };

    renderComponent({ authValue });

    const nameInput = screen.getByDisplayValue('John Doe');
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateMyProfile).toHaveBeenCalledWith({ name: 'Jane Doe' });
    });
  });

  it('should display dash for missing program and department', () => {
    const authValue: AuthContextType = {
      user: {
        id: 'u1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        program_id: null,
        department_id: null,
      },
      loading: false,
      error: null,
      role: 'admin',
      departmentId: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      resendVerificationEmail: vi.fn(),
      updateMyProfile: vi.fn(),
      clearError: vi.fn(),
      isAdmin: () => true,
      isDepartmentHead: () => false,
      isProgramHead: () => false,
      canManageInstructors: () => true,
      canManageClassrooms: () => true,
      canReviewRequestsForDepartment: vi.fn(),
      canManageInstructorRow: vi.fn(),
      canManageAssignmentsForProgram: vi.fn(),
    };

    renderComponent({ authValue });

    const dashElements = screen.getAllByText('—');
    expect(dashElements).toHaveLength(2); // One for program, one for department
  });
});
