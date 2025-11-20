/**
 * Integration tests for useRequestCrossDeptResource hook.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useRequestCrossDeptResource } from '../hook';
import * as service from '../service';

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock('../service');

// Helper function moved outside the test to avoid nesting
const createDelayedResponse = () => {
  const resolveWithTimeout = (resolve: (value: {isCrossDept: boolean; resourceType: null; resourceId: null; departmentId: null;}) => void) => {
    setTimeout(resolve, 100);
  };

  return () => new Promise<{
    isCrossDept: boolean;
    resourceType: null;
    resourceId: null;
    departmentId: null;
  }>(resolveWithTimeout);
};

describe('useRequestCrossDeptResource', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('checkResources', () => {
    it('should return cross-department result when instructor is from different dept', async () => {
      const mockResult = {
        isCrossDept: true,
        resourceType: 'instructor' as const,
        resourceId: 'inst-1',
        departmentId: 'dept-2',
      };

      vi.mocked(service.checkCrossDepartmentResource).mockResolvedValue(mockResult);

      const { result } = renderHook(() => useRequestCrossDeptResource());

      const checkResult = await result.current.checkResources('prog-1', 'inst-1');

      expect(checkResult).toEqual(mockResult);
      expect(service.checkCrossDepartmentResource).toHaveBeenCalledWith(
        'prog-1',
        'inst-1',
        undefined
      );
    });

    it('should return false when resources are same department', async () => {
      const mockResult = {
        isCrossDept: false,
        resourceType: null,
        resourceId: null,
        departmentId: null,
      };

      vi.mocked(service.checkCrossDepartmentResource).mockResolvedValue(mockResult);

      const { result } = renderHook(() => useRequestCrossDeptResource());

      const checkResult = await result.current.checkResources('prog-1', 'inst-1', 'class-1');

      expect(checkResult.isCrossDept).toBe(false);
    });

    it('should handle errors gracefully', async () => {
      vi.mocked(service.checkCrossDepartmentResource).mockRejectedValue(
        new Error('Network error')
      );

      const { result } = renderHook(() => useRequestCrossDeptResource());

      const checkResult = await result.current.checkResources('prog-1', 'inst-1');

      expect(checkResult.isCrossDept).toBe(false);
    });

    it('should set isChecking state correctly', async () => {
      const delayedResolve = createDelayedResponse();

      vi.mocked(service.checkCrossDepartmentResource).mockImplementation(delayedResolve);

      const { result } = renderHook(() => useRequestCrossDeptResource());

      expect(result.current.isChecking).toBe(false);

      result.current.checkResources('prog-1', 'inst-1');

      await waitFor(() => expect(result.current.isChecking).toBe(true));
      await waitFor(() => expect(result.current.isChecking).toBe(false));
    });
  });

  describe('initiateCrossDeptRequest', () => {
    it('should set pending request', async () => {
      const { result } = renderHook(() => useRequestCrossDeptResource());

      const payload = {
        classSessionId: 'session-1',
        resourceType: 'instructor' as const,
        resourceId: 'inst-1',
        departmentId: 'dept-2',
      };

      result.current.initiateCrossDeptRequest(payload);

      // Wait for state update to complete
      await waitFor(() => {
        expect(result.current.pendingRequest).toEqual(payload);
      });
    });
  });

  describe('cancelRequest', () => {
    it('should clear pending request', async () => {
      const { result } = renderHook(() => useRequestCrossDeptResource());

      const payload = {
        classSessionId: 'session-1',
        resourceType: 'instructor' as const,
        resourceId: 'inst-1',
        departmentId: 'dept-2',
      };

      result.current.initiateCrossDeptRequest(payload);

      // Wait for state update to complete
      await waitFor(() => {
        expect(result.current.pendingRequest).not.toBeNull();
      });

      result.current.cancelRequest();

      // Wait for state update to complete after cancel
      await waitFor(() => {
        expect(result.current.pendingRequest).toBeNull();
      });
    });
  });
});
