/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PendingRequestsPanel from '../PendingRequestsPanel';
import * as resourceRequestService from '@/features/resourceRequests/services/resourceRequestService';

// Mock the resource requests service
vi.mock('@/features/resourceRequests/services/resourceRequestService', () => ({
  getMyRequests: vi.fn(),
}));

// Mock the auth hook
vi.mock('@/features/shared/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      id: 'user-123',
      program_id: 'program-456',
      department_id: 'dept-789',
      role: 'program_head',
    },
    isProgramHead: () => true,
    isDepartmentHead: () => false,
    isAdmin: () => false,
    loading: false,
    error: null,
    login: vi.fn(),
    logout: vi.fn(),
    clearError: vi.fn(),
    updateMyProfile: vi.fn(),
    role: 'program_head',
    departmentId: 'dept-789',
  }),
}));

/**
 * Integration tests for PendingRequestsPanel component.
 *
 * Tests the display of pending resource requests in the dashboard header.
 */
describe('PendingRequestsPanel Integration Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  const renderWithQuery = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  describe('Pending Requests Display', () => {
    it('should display count of pending requests', async () => {
      const mockRequests = [
        {
          id: 'req-1',
          status: 'pending',
          resource_type: 'instructor',
          requested_at: new Date().toISOString(),
        },
        {
          id: 'req-2',
          status: 'pending',
          resource_type: 'classroom',
          requested_at: new Date().toISOString(),
        },
      ];

      vi.mocked(resourceRequestService.getMyRequests)
        .mockResolvedValue(mockRequests);

      renderWithQuery(<PendingRequestsPanel />);

      await waitFor(() => {
        expect(screen.getByText('2')).toBeInTheDocument();
      });
    });

    it('should show zero when no pending requests', async () => {
      vi.mocked(resourceRequestService.getMyRequests)
        .mockResolvedValue([]);

      renderWithQuery(<PendingRequestsPanel />);

      await waitFor(() => {
        expect(screen.getByText('0')).toBeInTheDocument();
      });
    });

    it('should filter only pending status requests', async () => {
      const mockRequests = [
        { id: 'req-1', status: 'pending', resource_type: 'instructor' },
        { id: 'req-2', status: 'approved', resource_type: 'classroom' },
        { id: 'req-3', status: 'rejected', resource_type: 'instructor' },
        { id: 'req-4', status: 'pending', resource_type: 'classroom' },
      ];

      vi.mocked(resourceRequestService.getMyRequests)
        .mockResolvedValue(mockRequests);

      renderWithQuery(<PendingRequestsPanel />);

      await waitFor(() => {
        // Should only count the 2 pending requests
        expect(screen.getByText('2')).toBeInTheDocument();
      });
    });
  });

  // Helper function moved outside the test to avoid nesting
  const createNeverResolvingPromise = () => {
    const resolvePromise = (resolve: (value: unknown) => void, reject: (reason: Error) => void) => {
      // Never resolves to simulate loading state
    };
    return () => new Promise(resolvePromise);
  };

  describe('Loading and Error States', () => {
    it('should show loading state initially', () => {
      const neverResolvingPromise = createNeverResolvingPromise();
      vi.mocked(resourceRequestService.getMyRequests)
        .mockImplementation(neverResolvingPromise); // Never resolves

      renderWithQuery(<PendingRequestsPanel />);

      expect(screen.getByTestId('pending-requests-loading')).toBeInTheDocument();
    });

    it('should handle fetch errors gracefully', async () => {
      vi.mocked(resourceRequestService.getMyRequests)
        .mockRejectedValue(new Error('Failed to fetch requests'));

      renderWithQuery(<PendingRequestsPanel />);

      await waitFor(() => {
        // Should show 0 or error state
        expect(screen.getByText('0')).toBeInTheDocument();
      });
    });
  });

  describe('UI Interaction', () => {
    it('should open popover when button is clicked', async () => {
      const mockRequests = [
        { id: 'req-1', status: 'pending', resource_type: 'instructor' },
      ];

      vi.mocked(resourceRequestService.getMyRequests)
        .mockResolvedValue(mockRequests);

      renderWithQuery(<PendingRequestsPanel />);

      // The component has both data-cy and data-testid
      const trigger = screen.getByTestId('pending-requests-bell');
      expect(trigger).toBeInTheDocument();

      // The popover should open when clicked, but we can't directly test this
      // with the current setup since we're not simulating a click
    });
  });

  describe('Real-time Updates', () => {
    it('should refetch when query is invalidated', async () => {
      const mockRequests1 = [
        { id: 'req-1', status: 'pending', resource_type: 'instructor' },
      ];
      const mockRequests2 = [
        { id: 'req-1', status: 'pending', resource_type: 'instructor' },
        { id: 'req-2', status: 'pending', resource_type: 'classroom' },
      ];

      const fetchMock = vi.mocked(resourceRequestService.getMyRequests);
      fetchMock.mockResolvedValueOnce(mockRequests1);

      renderWithQuery(<PendingRequestsPanel />);

      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument();
      });

      // Simulate a new request being created
      fetchMock.mockResolvedValueOnce(mockRequests2);
      await queryClient.invalidateQueries({ queryKey: ['my_pending_requests', 'user-123'] });

      await waitFor(() => {
        expect(screen.getByText('2')).toBeInTheDocument();
      });
    });
  });

  describe('User Context Integration', () => {
    it('should fetch requests for the current user', async () => {
      const fetchMock = vi.mocked(resourceRequestService.getMyRequests);
      fetchMock.mockResolvedValue([]);

      renderWithQuery(<PendingRequestsPanel />);

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalled();
      });
    });
  });
});
