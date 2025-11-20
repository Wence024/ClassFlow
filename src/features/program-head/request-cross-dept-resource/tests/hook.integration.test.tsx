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
      // Helper to avoid nested Promise callback
      const delayedResolve = () => new Promise<{
        isCrossDept: boolean;
        resourceType: null;
        resourceId: null;
        departmentId: null;
      }>((resolve) => {
        setTimeout(() => {
          resolve({
            isCrossDept: false,
            resourceType: null,
            resourceId: null,
            departmentId: null,
          });
        }, 100);
      });

      vi.mocked(service.checkCrossDepartmentResource).mockImplementation(delayedResolve);

      const { result } = renderHook(() => useRequestCrossDeptResource());

      expect(result.current.isChecking).toBe(false);

      result.current.checkResources('prog-1', 'inst-1');

      await waitFor(() => expect(result.current.isChecking).toBe(true));
      await waitFor(() => expect(result.current.isChecking).toBe(false));
    });
  });

  describe('initiateCrossDeptRequest', () => {
    it('should set pending request', () => {
      const { result } = renderHook(() => useRequestCrossDeptResource());

      const payload = {
        classSessionId: 'session-1',
        resourceType: 'instructor' as const,
        resourceId: 'inst-1',
        departmentId: 'dept-2',
      };

      result.current.initiateCrossDeptRequest(payload);

      expect(result.current.pendingRequest).toEqual(payload);
    });
  });

  describe('cancelRequest', () => {
    it('should clear pending request', () => {
      const { result } = renderHook(() => useRequestCrossDeptResource());

      const payload = {
        classSessionId: 'session-1',
        resourceType: 'instructor' as const,
        resourceId: 'inst-1',
        departmentId: 'dept-2',
      };

      result.current.initiateCrossDeptRequest(payload);
      expect(result.current.pendingRequest).not.toBeNull();

      result.current.cancelRequest();
      expect(result.current.pendingRequest).toBeNull();
    });
  });
});
