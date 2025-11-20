/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PendingRequestsPanel from '../PendingRequestsPanel';
import * as resourceRequestsService from '@/lib/services/resourceRequestService';

// Mock the resource requests service
vi.mock('@/lib/services/resourceRequestService');

// Mock the auth context
vi.mock('@/features/shared/auth/context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'user-123',
      program_id: 'program-456',
      department_id: 'dept-789',
    },
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

      vi.mocked(resourceRequestsService.fetchResourceRequestsByProgram)
        .mockResolvedValue(mockRequests);

      renderWithQuery(<PendingRequestsPanel />);

      await waitFor(() => {
        expect(screen.getByText('2')).toBeInTheDocument();
      });
    });

    it('should show zero when no pending requests', async () => {
      vi.mocked(resourceRequestsService.fetchResourceRequestsByProgram)
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

      vi.mocked(resourceRequestsService.fetchResourceRequestsByProgram)
        .mockResolvedValue(mockRequests);

      renderWithQuery(<PendingRequestsPanel />);

      await waitFor(() => {
        // Should only count the 2 pending requests
        expect(screen.getByText('2')).toBeInTheDocument();
      });
    });
  });

  describe('Loading and Error States', () => {
    it('should show loading state initially', () => {
      vi.mocked(resourceRequestsService.fetchResourceRequestsByProgram)
        .mockImplementation(() => new Promise(() => {})); // Never resolves

      renderWithQuery(<PendingRequestsPanel />);

      expect(screen.getByTestId('pending-requests-loading')).toBeInTheDocument();
    });

    it('should handle fetch errors gracefully', async () => {
      vi.mocked(resourceRequestsService.fetchResourceRequestsByProgram)
        .mockRejectedValue(new Error('Failed to fetch requests'));

      renderWithQuery(<PendingRequestsPanel />);

      await waitFor(() => {
        // Should show 0 or error state
        expect(screen.getByText('0')).toBeInTheDocument();
      });
    });
  });

  describe('Navigation', () => {
    it('should link to pending requests page', async () => {
      const mockRequests = [
        { id: 'req-1', status: 'pending', resource_type: 'instructor' },
      ];

      vi.mocked(resourceRequestsService.fetchResourceRequestsByProgram)
        .mockResolvedValue(mockRequests);

      renderWithQuery(<PendingRequestsPanel />);

      await waitFor(() => {
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/pending-requests');
      });
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

      const fetchMock = vi.mocked(resourceRequestsService.fetchResourceRequestsByProgram);
      fetchMock.mockResolvedValueOnce(mockRequests1);

      renderWithQuery(<PendingRequestsPanel />);

      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument();
      });

      // Simulate a new request being created
      fetchMock.mockResolvedValueOnce(mockRequests2);
      await queryClient.invalidateQueries({ queryKey: ['resourceRequests'] });

      await waitFor(() => {
        expect(screen.getByText('2')).toBeInTheDocument();
      });
    });
  });

  describe('User Context Integration', () => {
    it('should fetch requests for the current user program', async () => {
      const fetchMock = vi.mocked(resourceRequestsService.fetchResourceRequestsByProgram);
      fetchMock.mockResolvedValue([]);

      renderWithQuery(<PendingRequestsPanel />);

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith('program-456');
      });
    });
  });
});
