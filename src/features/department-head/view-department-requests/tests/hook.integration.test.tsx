/**
 * Integration tests for useViewDepartmentRequests hook.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useViewDepartmentRequests } from '../hook';
import * as service from '../service';
import type { RequestWithDetails } from '../types';

vi.mock('../service');

describe('useViewDepartmentRequests', () => {
  const mockRequests: RequestWithDetails[] = [
    {
      id: 'req-1',
      status: 'pending',
      resource_type: 'instructor',
      requester_name: 'Program Head 1',
      resource_name: 'John Doe',
      created_at: '2025-01-01',
    } as RequestWithDetails,
    {
      id: 'req-2',
      status: 'approved',
      resource_type: 'classroom',
      requester_name: 'Program Head 2',
      resource_name: 'Room 101',
      created_at: '2025-01-02',
    } as RequestWithDetails,
    {
      id: 'req-3',
      status: 'pending',
      resource_type: 'classroom',
      requester_name: 'Program Head 3',
      resource_name: 'Room 102',
      created_at: '2025-01-03',
    } as RequestWithDetails,
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(service.fetchDepartmentRequests).mockResolvedValue(mockRequests as any);
  });

  describe('Initial Load', () => {
    it('should fetch requests for valid department ID', async () => {
      const { result } = renderHook(() => useViewDepartmentRequests('dept-1'));

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(service.fetchDepartmentRequests).toHaveBeenCalledWith('dept-1');
      expect(result.current.requests).toEqual(mockRequests);
      expect(result.current.error).toBe(null);
    });

    it('should not fetch if department ID is null', async () => {
      const { result } = renderHook(() => useViewDepartmentRequests(null));

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(service.fetchDepartmentRequests).not.toHaveBeenCalled();
      expect(result.current.requests).toEqual([]);
    });

    it('should handle fetch errors', async () => {
      vi.mocked(service.fetchDepartmentRequests).mockRejectedValue(
        new Error('Failed to load requests')
      );

      const { result } = renderHook(() => useViewDepartmentRequests('dept-1'));

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.error).toBe('Failed to load requests');
      expect(result.current.requests).toEqual([]);
    });
  });

  describe('Filtering', () => {
    it('should filter by status', async () => {
      const { result } = renderHook(() => useViewDepartmentRequests('dept-1'));

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      act(() => {
        result.current.setFilters({ status: 'pending' });
      });

      expect(result.current.filteredRequests).toHaveLength(2);
      expect(result.current.filteredRequests.every(r => r.status === 'pending')).toBe(true);
    });

    it('should filter by resource type', async () => {
      const { result } = renderHook(() => useViewDepartmentRequests('dept-1'));

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      act(() => {
        result.current.setFilters({ resourceType: 'classroom' });
      });

      expect(result.current.filteredRequests).toHaveLength(2);
      expect(result.current.filteredRequests.every(r => r.resource_type === 'classroom')).toBe(
        true
      );
    });

    it('should filter by both status and resource type', async () => {
      const { result } = renderHook(() => useViewDepartmentRequests('dept-1'));

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      act(() => {
        result.current.setFilters({ status: 'pending', resourceType: 'classroom' });
      });

      expect(result.current.filteredRequests).toHaveLength(1);
      expect(result.current.filteredRequests[0].id).toBe('req-3');
    });

    it('should return all requests when no filters applied', async () => {
      const { result } = renderHook(() => useViewDepartmentRequests('dept-1'));

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.filteredRequests).toEqual(mockRequests);
    });

    it('should clear filters', async () => {
      const { result } = renderHook(() => useViewDepartmentRequests('dept-1'));

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      act(() => {
        result.current.setFilters({ status: 'pending' });
      });

      expect(result.current.filteredRequests).toHaveLength(2);

      act(() => {
        result.current.setFilters({});
      });

      expect(result.current.filteredRequests).toEqual(mockRequests);
    });
  });

  describe('Refetch', () => {
    it('should refetch requests', async () => {
      const { result } = renderHook(() => useViewDepartmentRequests('dept-1'));

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(service.fetchDepartmentRequests).toHaveBeenCalledTimes(1);

      await act(async () => {
        await result.current.refetch();
      });

      expect(service.fetchDepartmentRequests).toHaveBeenCalledTimes(2);
    });

    it('should update loading state during refetch', async () => {
      const { result } = renderHook(() => useViewDepartmentRequests('dept-1'));

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const refetchPromise = act(async () => {
        await result.current.refetch();
      });

      await refetchPromise;

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Department ID Changes', () => {
    it('should refetch when department ID changes', async () => {
      const { result, rerender } = renderHook(
        ({ deptId }) => useViewDepartmentRequests(deptId),
        { initialProps: { deptId: 'dept-1' } }
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(service.fetchDepartmentRequests).toHaveBeenCalledWith('dept-1');

      rerender({ deptId: 'dept-2' });

      await waitFor(() => expect(service.fetchDepartmentRequests).toHaveBeenCalledWith('dept-2'));
    });
  });
});
