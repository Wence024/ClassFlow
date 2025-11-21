/**
 * Integration tests for useViewPendingRequests hook.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useViewPendingRequests } from '../hook';
import * as service from '../service';
import type { ResourceRequest } from '@/types/resourceRequest';

vi.mock('../service');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useViewPendingRequests', () => {
  const mockRequests: ResourceRequest[] = [
    {
      id: 'req-1',
      class_session_id: 'session-1',
      resource_type: 'instructor',
      resource_id: 'inst-1',
      status: 'pending',
      requester_id: 'user-1',
      requesting_program_id: 'prog-1',
      target_department_id: 'dept-2',
      requested_at: '2025-01-01',
      dismissed: false,
      notes: null,
      rejection_message: null,
      reviewed_at: null,
      reviewed_by: null,
      original_class_group_id: null,
      original_period_index: null,
    },
    {
      id: 'req-2',
      class_session_id: 'session-2',
      resource_type: 'classroom',
      resource_id: 'class-1',
      status: 'approved',
      requester_id: 'user-1',
      requesting_program_id: 'prog-1',
      target_department_id: 'dept-3',
      requested_at: '2025-01-02',
      dismissed: false,
      notes: null,
      rejection_message: null,
      reviewed_at: '2025-01-03',
      reviewed_by: 'user-2',
      original_class_group_id: null,
      original_period_index: null,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchMyRequests', () => {
    it('should fetch and display user requests', async () => {
      vi.mocked(service.fetchMyRequests).mockResolvedValue(mockRequests);

      const { result } = renderHook(() => useViewPendingRequests('user-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.requests).toHaveLength(2);
      expect(result.current.requests[0].id).toBe('req-1');
      expect(result.current.requests[1].status).toBe('approved');
    });

    it('should not fetch when userId is undefined', () => {
      vi.mocked(service.fetchMyRequests).mockResolvedValue(mockRequests);

      const { result } = renderHook(() => useViewPendingRequests(undefined), {
        wrapper: createWrapper(),
      });

      expect(result.current.requests).toHaveLength(0);
      expect(service.fetchMyRequests).not.toHaveBeenCalled();
    });
  });

  describe('handleDismiss', () => {
    it('should dismiss a request successfully', async () => {
      vi.mocked(service.fetchMyRequests).mockResolvedValue(mockRequests);
      vi.mocked(service.dismissRequest).mockResolvedValue();

      const { result } = renderHook(() => useViewPendingRequests('user-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      result.current.handleDismiss('req-1');

      await waitFor(() => expect(result.current.isDismissing).toBe(false));

      expect(service.dismissRequest).toHaveBeenCalledWith('req-1');
    });

    it('should handle dismiss errors', async () => {
      vi.mocked(service.fetchMyRequests).mockResolvedValue(mockRequests);
      vi.mocked(service.dismissRequest).mockRejectedValue(new Error('Dismiss failed'));

      const { result } = renderHook(() => useViewPendingRequests('user-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      result.current.handleDismiss('req-1');

      await waitFor(() => expect(result.current.isDismissing).toBe(false));
    });
  });

  describe('handleCancel', () => {
    it('should cancel a request successfully', async () => {
      vi.mocked(service.fetchMyRequests).mockResolvedValue(mockRequests);
      vi.mocked(service.cancelMyRequest).mockResolvedValue();

      const { result } = renderHook(() => useViewPendingRequests('user-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      result.current.handleCancel(mockRequests[0]);

      await waitFor(() => expect(result.current.isCancelling).toBe(false));

      expect(service.cancelMyRequest).toHaveBeenCalledWith('req-1', 'user-1');
    });

    it('should show error when userId is missing', async () => {
      vi.mocked(service.fetchMyRequests).mockResolvedValue(mockRequests);

      const { result } = renderHook(() => useViewPendingRequests(undefined), {
        wrapper: createWrapper(),
      });

      result.current.handleCancel(mockRequests[0]);

      expect(service.cancelMyRequest).not.toHaveBeenCalled();
    });
  });
});
