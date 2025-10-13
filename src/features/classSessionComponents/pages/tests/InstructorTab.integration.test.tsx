/// <reference types="@testing-library/jest-dom" />
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import InstructorTab from '../InstructorTab';
import { AuthContext } from '../../../auth/contexts/AuthContext';
import * as instructorsService from '../../services/instructorsService';
import * as useClassSessionsHook from '../../../classSessions/hooks/useClassSessions';
import type { ReactNode } from 'react';
import type { AuthContextType } from '../../../auth/types/auth';
import type { Instructor } from '../../types';

// Mock services and hooks
vi.mock('../../services/instructorsService');
vi.mock('../../../classSessions/hooks/useClassSessions');

const mockedInstructorsService = vi.mocked(instructorsService, true);
const mockedUseClassSessions = vi.mocked(useClassSessionsHook, true);

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

// Mock Data
const department1Instructors: Instructor[] = [
  { id: 'inst1', first_name: 'John', last_name: 'Doe', department_id: 'dept1', created_at: '', color: '#fff', code: 'JD', contract_type: null, created_by: null, email: null, phone: null, prefix: null, suffix: null },
];
const allInstructors: Instructor[] = [
  ...department1Instructors,
  { id: 'inst2', first_name: 'Jane', last_name: 'Smith', department_id: 'dept2', created_at: '', color: '#fff', code: 'JS', contract_type: null, created_by: null, email: null, phone: null, prefix: null, suffix: null },
];

const deptHeadUser = {
  id: 'user-dept-head',
  name: 'Dept Head',
  email: 'dh@test.com',
  role: 'department_head',
  department_id: 'dept1',
  program_id: null,
};

const TestWrapper = ({ children, user }: { children: ReactNode; user: AuthContextType['user'] }) => (
  <QueryClientProvider client={queryClient}>
    <AuthContext.Provider value={{ user, canManageInstructors: () => user?.role === 'department_head' || user?.role === 'admin' } as AuthContextType}>
      {children}
    </AuthContext.Provider>
  </QueryClientProvider>
);

describe('InstructorTab Integration Tests (Department Head)', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    queryClient.clear();
    // A dept head will have class sessions from their program, assume none for simplicity
    mockedUseClassSessions.useClassSessions.mockReturnValue({
      classSessions: [],
    } as ReturnType<typeof useClassSessionsHook.useClassSessions>);
  });

  it('should show only department-owned instructors for department heads', async () => {
    // The useInstructors hook internally calls getInstructors with role and dept_id.
    // We mock the service to simulate this filtering.
    mockedInstructorsService.getInstructors.mockResolvedValue(department1Instructors);

    render(<InstructorTab />, { wrapper: ({ children }) => <TestWrapper user={deptHeadUser}>{children}</TestWrapper> });

    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    });

    expect(screen.queryByText(/Jane Smith/i)).not.toBeInTheDocument();
    // Verify the service was called with the correct parameters for scoping
    expect(mockedInstructorsService.getInstructors).toHaveBeenCalledWith({
      role: 'department_head',
      department_id: 'dept1',
    });
  });

  it('should allow department heads to create instructors in their department', async () => {
    const user = userEvent.setup();
    mockedInstructorsService.getInstructors.mockResolvedValue([]);
    mockedInstructorsService.addInstructor.mockImplementation(async (instructor) => ({
      ...instructor,
      id: 'new-inst',
      created_at: new Date().toISOString(),
    }));

    render(<InstructorTab />, { wrapper: ({ children }) => <TestWrapper user={deptHeadUser}>{children}</TestWrapper> });

    await user.type(screen.getByLabelText(/First Name/i), 'New');
    await user.type(screen.getByLabelText(/Last Name/i), 'Professor');
    await user.click(screen.getByRole('button', { name: /Create/i }));

    await waitFor(() => {
      expect(mockedInstructorsService.addInstructor).toHaveBeenCalledWith(
        expect.objectContaining({
          first_name: 'New',
          last_name: 'Professor',
        })
      );
    });
  });

    it('should allow department heads to update an instructor', async () => {
        const user = userEvent.setup();
        mockedInstructorsService.getInstructors.mockResolvedValue(department1Instructors);
        mockedInstructorsService.updateInstructor.mockResolvedValue({ ...department1Instructors[0], first_name: 'Johnathan' });

        render(<InstructorTab />, { wrapper: ({ children }) => <TestWrapper user={deptHeadUser}>{children}</TestWrapper> });

        await waitFor(() => expect(screen.getByText('John Doe')).toBeInTheDocument());
        
        await user.click(screen.getByRole('button', { name: /Edit/i }));

        // Ensure the form is in edit mode and has no validation errors
        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /Edit Instructor/i })).toBeInTheDocument();
        });
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();

        const firstNameInput = screen.getByLabelText(/First Name/i);
        await user.clear(firstNameInput);
        await user.type(firstNameInput, 'Johnathan');
        await user.click(screen.getByRole('button', { name: /Save Changes/i }));

        await waitFor(() => {
            expect(mockedInstructorsService.updateInstructor).toHaveBeenCalledWith('inst1', expect.objectContaining({ first_name: 'Johnathan' }));
        });
    });

    it('should allow department heads to delete an instructor', async () => {
        const user = userEvent.setup();
        mockedInstructorsService.getInstructors.mockResolvedValue(department1Instructors);
        mockedInstructorsService.removeInstructor.mockResolvedValue();

        render(<InstructorTab />, { wrapper: ({ children }) => <TestWrapper user={deptHeadUser}>{children}</TestWrapper> });

        await waitFor(() => expect(screen.getByText('John Doe')).toBeInTheDocument());

        await user.click(screen.getByRole('button', { name: /Delete/i }));

        // Confirm in modal
        await waitFor(() => expect(screen.getByText(/Confirm Deletion/i)).toBeInTheDocument());
        await user.click(screen.getByRole('button', { name: "Delete" }));

        await waitFor(() => {
            expect(mockedInstructorsService.removeInstructor).toHaveBeenCalledWith('inst1', deptHeadUser.id);
        });
    });
});
