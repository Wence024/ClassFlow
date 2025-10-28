import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import RequestNotifications from '../RequestNotifications';
import { AuthContext } from '../../features/auth/contexts/AuthContext';
import * as useDepartmentIdHook from '../../features/auth/hooks/useDepartmentId';
import * as useDepartmentRequestsHook from '../../features/resourceRequests/hooks/useResourceRequests';
import type { ReactNode } from 'react';
import type { AuthContextType } from '../../features/auth/types/auth';
import type { ResourceRequest } from '@/features/resourceRequests/types/resourceRequest';

// Mocks
vi.mock('../../features/auth/hooks/useDepartmentId');
vi.mock('../../features/resourceRequests/hooks/useResourceRequests');

const mockedUseDepartmentId = vi.mocked(useDepartmentIdHook, true);
const mockedUseDepartmentRequests = vi.mocked(useDepartmentRequestsHook, true);

const queryClient = new QueryClient();

const TestWrapper = ({ children, user }: { children: ReactNode; user: AuthContextType['user'] }) => (
  <QueryClientProvider client={queryClient}>
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        departmentId: user?.department_id || null,
        loading: false,
        error: null,
        login: vi.fn(),
        logout: vi.fn(),
        clearError: vi.fn(),
        updateMyProfile: vi.fn(),
        isAdmin: () => user?.role === 'admin',
        isDepartmentHead: () => user?.role === 'department_head',
        isProgramHead: () => user?.role === 'program_head',
        canManageInstructors: () => user?.role === 'admin' || user?.role === 'department_head',
        canManageClassrooms: () => user?.role === 'admin',
        canReviewRequestsForDepartment: (departmentId: string) =>
          user?.role === 'admin' || (user?.role === 'department_head' && user.department_id === departmentId),
        canManageInstructorRow: () => false,
        canManageCourses: () => false,
        canManageAssignmentsForProgram: () => false,
      } as AuthContextType}
    >
      {children}
    </AuthContext.Provider>
  </QueryClientProvider>
);

describe('RequestNotifications', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    queryClient.clear();
  });

  it('should not render for program heads', () => {
    const programHeadUser = {
      id: 'user-ph',
      name: 'Program Head',
      email: 'ph@test.com',
      role: 'program_head' as const,
      department_id: null,
      program_id: 'prog-cs',
    };

    mockedUseDepartmentId.useDepartmentId.mockReturnValue(null);
    mockedUseDepartmentRequests.useDepartmentRequests.mockReturnValue({
      requests: [],
      updateRequest: vi.fn(),
    } as unknown as ReturnType<typeof useDepartmentRequestsHook.useDepartmentRequests>);

    const { container } = render(<RequestNotifications />, { wrapper: ({ children }) => <TestWrapper user={programHeadUser}>{children}</TestWrapper> });

    expect(container).toBeEmptyDOMElement();
  });

  it('should render for department heads and show badge for pending requests', async () => {
    const deptHeadUser = {
      id: 'user-dh',
      name: 'Department Head',
      email: 'dh@test.com',
      role: 'department_head' as const,
      department_id: 'dept1',
      program_id: null,
    };
    const mockRequests: ResourceRequest[] = [
      { id: 'req1', resource_id: 'res1', resource_type: 'instructor', status: 'pending', requested_at: new Date().toISOString() },
      { id: 'req2', resource_id: 'res2', resource_type: 'classroom', status: 'approved', requested_at: new Date().toISOString() },
    ];

    mockedUseDepartmentId.useDepartmentId.mockReturnValue('dept1');
    mockedUseDepartmentRequests.useDepartmentRequests.mockReturnValue({
      requests: mockRequests,
      updateRequest: vi.fn(),
    } as unknown as ReturnType<typeof useDepartmentRequestsHook.useDepartmentRequests>);

    render(<RequestNotifications />, { wrapper: ({ children }) => <TestWrapper user={deptHeadUser}>{children}</TestWrapper> });

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument(); // Badge count
  });

  it('should show pending requests in popover', async () => {
    const user = userEvent.setup();
    const deptHeadUser = {
      id: 'user-dh',
      name: 'Department Head',
      email: 'dh@test.com',
      role: 'department_head' as const,
      department_id: 'dept1',
      program_id: null,
    };
    const mockRequests: ResourceRequest[] = [
      { id: 'req1', resource_id: 'res1', resource_type: 'instructor', status: 'pending', requested_at: new Date().toISOString() },
    ];

    mockedUseDepartmentId.useDepartmentId.mockReturnValue('dept1');
    mockedUseDepartmentRequests.useDepartmentRequests.mockReturnValue({
      requests: mockRequests,
      updateRequest: vi.fn(),
    } as unknown as ReturnType<typeof useDepartmentRequestsHook.useDepartmentRequests>);

    render(<RequestNotifications />, { wrapper: ({ children }) => <TestWrapper user={deptHeadUser}>{children}</TestWrapper> });

    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('instructor Request')).toBeInTheDocument();
      expect(screen.getByText(/Resource ID: res1/)).toBeInTheDocument();
    });
  });

  it('should call updateRequest with approved status on approve click', async () => {
    const user = userEvent.setup();
    const updateRequest = vi.fn();
    const deptHeadUser = {
      id: 'user-dh',
      name: 'Department Head',
      email: 'dh@test.com',
      role: 'department_head' as const,
      department_id: 'dept1',
      program_id: null,
    };
    const mockRequests: ResourceRequest[] = [
      { id: 'req1', resource_id: 'res1', resource_type: 'instructor', status: 'pending', requested_at: new Date().toISOString() },
    ];

    mockedUseDepartmentId.useDepartmentId.mockReturnValue('dept1');
    mockedUseDepartmentRequests.useDepartmentRequests.mockReturnValue({
      requests: mockRequests,
      updateRequest,
    } as unknown as ReturnType<typeof useDepartmentRequestsHook.useDepartmentRequests>);

    render(<RequestNotifications />, { wrapper: ({ children }) => <TestWrapper user={deptHeadUser}>{children}</TestWrapper> });

    await user.click(screen.getByRole('button'));
    await user.click(await screen.findByRole('button', { name: /Approve/i }));

    expect(updateRequest).toHaveBeenCalledWith({ id: 'req1', update: { status: 'approved' } });
  });

  it('should call updateRequest with rejected status on reject click', async () => {
    const user = userEvent.setup();
    const updateRequest = vi.fn();
    const deptHeadUser = {
      id: 'user-dh',
      name: 'Department Head',
      email: 'dh@test.com',
      role: 'department_head' as const,
      department_id: 'dept1',
      program_id: null,
    };
    const mockRequests: ResourceRequest[] = [
      { id: 'req1', resource_id: 'res1', resource_type: 'instructor', status: 'pending', requested_at: new Date().toISOString() },
    ];

    mockedUseDepartmentId.useDepartmentId.mockReturnValue('dept1');
    mockedUseDepartmentRequests.useDepartmentRequests.mockReturnValue({
      requests: mockRequests,
      updateRequest,
    } as unknown as ReturnType<typeof useDepartmentRequestsHook.useDepartmentRequests>);

    render(<RequestNotifications />, { wrapper: ({ children }) => <TestWrapper user={deptHeadUser}>{children}</TestWrapper> });

    await user.click(screen.getByRole('button'));
    await user.click(await screen.findByRole('button', { name: /Reject/i }));

    expect(updateRequest).toHaveBeenCalledWith({ id: 'req1', update: { status: 'rejected' } });
  });

  it('should show empty state when there are no pending requests', async () => {
    const user = userEvent.setup();
    const deptHeadUser = {
      id: 'user-dh',
      name: 'Department Head',
      email: 'dh@test.com',
      role: 'department_head' as const,
      department_id: 'dept1',
      program_id: null,
    };

    mockedUseDepartmentId.useDepartmentId.mockReturnValue('dept1');
    mockedUseDepartmentRequests.useDepartmentRequests.mockReturnValue({
      requests: [],
      updateRequest: vi.fn(),
    } as unknown as ReturnType<typeof useDepartmentRequestsHook.useDepartmentRequests>);

    render(<RequestNotifications />, { wrapper: ({ children }) => <TestWrapper user={deptHeadUser}>{children}</TestWrapper> });

    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('No pending requests')).toBeInTheDocument();
    });
  });
});
