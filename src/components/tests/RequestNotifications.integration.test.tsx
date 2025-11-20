import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import RequestNotifications from '../RequestNotifications';
import { AuthContext } from '../../features/shared/auth/contexts/AuthContext';
import * as useDepartmentIdHook from '../../features/shared/auth/hooks/useDepartmentId';
import * as useDepartmentRequestsHook from '../../features/resourceRequests/hooks/useResourceRequests';
import * as resourceRequestService from '../../features/resourceRequests/services/resourceRequestService';
import type { ReactNode } from 'react';
import type { AuthContextType } from '../../features/shared/auth/types/auth';
import type { ResourceRequest } from '@/features/resourceRequests/types/resourceRequest';
import type { EnrichedRequest } from '../RequestNotifications';

// Mocks
vi.mock('../../features/shared/auth/hooks/useDepartmentId');
vi.mock('../../features/resourceRequests/hooks/useResourceRequests');
vi.mock('../../features/resourceRequests/services/resourceRequestService', async () => {
  const actual = await vi.importActual(
    '../../features/resourceRequests/services/resourceRequestService'
  );
  return {
    ...actual,
    approveRequest: vi.fn(),
  };
});

const mockedUseDepartmentId = vi.mocked(useDepartmentIdHook, true);
const mockedUseDepartmentRequests = vi.mocked(useDepartmentRequestsHook, true);
const mockedResourceRequestService = vi.mocked(resourceRequestService, true);

const queryClient = new QueryClient();

const TestWrapper = ({
  children,
  user,
}: {
  children: ReactNode;
  user: AuthContextType['user'];
}) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter>
      <AuthContext.Provider
        value={
          {
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
              user?.role === 'admin' ||
              (user?.role === 'department_head' && user.department_id === departmentId),
            canManageInstructorRow: () => false,
            canManageCourses: () => false,
            canManageAssignmentsForProgram: () => false,
          } as AuthContextType
        }
      >
        {children}
      </AuthContext.Provider>
    </MemoryRouter>
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

    const { container } = render(<RequestNotifications />, {
      wrapper: ({ children }) => <TestWrapper user={programHeadUser}>{children}</TestWrapper>,
    });

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
      {
        id: 'req1',
        resource_id: 'res1',
        resource_type: 'instructor',
        status: 'pending',
        requested_at: new Date().toISOString(),
      },
      {
        id: 'req2',
        resource_id: 'res2',
        resource_type: 'classroom',
        status: 'approved',
        requested_at: new Date().toISOString(),
      },
    ];

    mockedUseDepartmentId.useDepartmentId.mockReturnValue('dept1');
    mockedUseDepartmentRequests.useDepartmentRequests.mockReturnValue({
      requests: mockRequests,
      updateRequest: vi.fn(),
    } as unknown as ReturnType<typeof useDepartmentRequestsHook.useDepartmentRequests>);

    render(<RequestNotifications />, {
      wrapper: ({ children }) => <TestWrapper user={deptHeadUser}>{children}</TestWrapper>,
    });

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
      {
        id: 'req1',
        resource_id: 'res1',
        resource_type: 'instructor',
        status: 'pending',
        requested_at: new Date().toISOString(),
        target_department_id: 'dept1',
      } as ResourceRequest,
    ];

    mockedUseDepartmentId.useDepartmentId.mockReturnValue('dept1');
    mockedUseDepartmentRequests.useDepartmentRequests.mockReturnValue({
      requests: mockRequests,
      updateRequest: vi.fn(),
    } as unknown as ReturnType<typeof useDepartmentRequestsHook.useDepartmentRequests>);

    // Mock enrichment to return displayable item
    mockedResourceRequestService.getRequestWithDetails = vi.fn().mockResolvedValue({
      id: 'req1',
      resource_type: 'instructor',
      resource_name: 'Dr. Test',
      requester_name: 'PH User',
      program_name: 'CS',
      requested_at: new Date().toISOString(),
      class_session_id: 'session1',
    } as EnrichedRequest);

    render(<RequestNotifications />, {
      wrapper: ({ children }) => <TestWrapper user={deptHeadUser}>{children}</TestWrapper>,
    });

    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText(/Instructor Request/i)).toBeInTheDocument();
      expect(screen.getByText('Dr. Test')).toBeInTheDocument();
    });
  });

  it('should call approveRequest on approve click', async () => {
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
      {
        id: 'req1',
        resource_id: 'res1',
        resource_type: 'instructor',
        status: 'pending',
        requested_at: new Date().toISOString(),
        class_session_id: 'session1',
        target_department_id: 'dept1',
      } as ResourceRequest,
    ];

    mockedUseDepartmentId.useDepartmentId.mockReturnValue('dept1');
    mockedUseDepartmentRequests.useDepartmentRequests.mockReturnValue({
      requests: mockRequests,
      updateRequest: vi.fn(),
    } as unknown as ReturnType<typeof useDepartmentRequestsHook.useDepartmentRequests>);

    // Mock the approveRequest function to resolve successfully
    mockedResourceRequestService.approveRequest.mockResolvedValue({
      id: 'req1',
      status: 'approved',
      resource_id: 'res1',
      resource_type: 'instructor',
    } as ResourceRequest);

    mockedResourceRequestService.getRequestWithDetails = vi.fn().mockResolvedValue({
      id: 'req1',
      resource_type: 'instructor',
      resource_name: 'Dr. Test',
      requester_name: 'PH User',
      program_name: 'CS',
      requested_at: new Date().toISOString(),
      class_session_id: 'session1',
    } as EnrichedRequest);

    render(<RequestNotifications />, {
      wrapper: ({ children }) => <TestWrapper user={deptHeadUser}>{children}</TestWrapper>,
    });

    await user.click(screen.getByRole('button'));
    await user.click(await screen.findByRole('button', { name: /Approve/i }));

    // Verify the new approveRequest function was called with correct parameters
    await waitFor(() => {
      expect(mockedResourceRequestService.approveRequest).toHaveBeenCalledWith('req1', 'user-dh');
    });
  });

  it('should call rejectRequest with message on reject click', async () => {
    const user = userEvent.setup();
    const rejectRequest = vi.fn().mockResolvedValue({ id: 'req1', status: 'rejected' });
    const deptHeadUser = {
      id: 'user-dh',
      name: 'Department Head',
      email: 'dh@test.com',
      role: 'department_head' as const,
      department_id: 'dept1',
      program_id: null,
    };
    const mockRequests: ResourceRequest[] = [
      {
        id: 'req1',
        resource_id: 'res1',
        resource_type: 'instructor',
        status: 'pending',
        requested_at: new Date().toISOString(),
      },
    ];

    mockedUseDepartmentId.useDepartmentId.mockReturnValue('dept1');
    mockedUseDepartmentRequests.useDepartmentRequests.mockReturnValue({
      requests: mockRequests,
      updateRequest: vi.fn(),
      dismissRequest: vi.fn(),
    } as unknown as ReturnType<typeof useDepartmentRequestsHook.useDepartmentRequests>);

    mockedResourceRequestService.rejectRequest =
      rejectRequest as unknown as typeof resourceRequestService.rejectRequest;
    mockedResourceRequestService.getRequestWithDetails = vi.fn().mockResolvedValue({
      id: 'req1',
      resource_type: 'instructor',
      resource_name: 'Dr. Test',
      requester_name: 'PH User',
      program_name: 'CS',
      requested_at: new Date().toISOString(),
      class_session_id: 'session1',
    } as EnrichedRequest);

    render(<RequestNotifications />, {
      wrapper: ({ children }) => <TestWrapper user={deptHeadUser}>{children}</TestWrapper>,
    });

    await user.click(screen.getByRole('button'));
    await user.click(await screen.findByRole('button', { name: /Reject/i }));
    // Fill rejection dialog message and confirm
    const input = await screen.findByLabelText(/Rejection Reason \*/i);
    await user.type(input, 'Not available');
    await user.click(screen.getByRole('button', { name: /Reject Request/i }));

    await waitFor(() => {
      expect(rejectRequest).toHaveBeenCalledWith('req1', 'user-dh', 'Not available');
    });
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

    render(<RequestNotifications />, {
      wrapper: ({ children }) => <TestWrapper user={deptHeadUser}>{children}</TestWrapper>,
    });

    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('No pending requests')).toBeInTheDocument();
    });
  });
});
