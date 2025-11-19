/**
 * Hook for managing cross-department resource request workflow.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { checkCrossDepartmentResource } from './service';
import type { CrossDeptCheckResult, CrossDeptRequestPayload } from './types';

export function useRequestCrossDeptResource() {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);
  const [pendingRequest, setPendingRequest] = useState<CrossDeptRequestPayload | null>(null);

  /**
   * Checks if the given resources require cross-department approval.
   */
  const checkResources = async (
    programId: string,
    instructorId?: string,
    classroomId?: string
  ): Promise<CrossDeptCheckResult> => {
    setIsChecking(true);
    try {
      const result = await checkCrossDepartmentResource(programId, instructorId, classroomId);
      return result;
    } catch (error) {
      console.error('Error checking cross-department resource:', error);
      toast.error('Failed to check resource availability');
      return {
        isCrossDept: false,
        resourceType: null,
        resourceId: null,
        departmentId: null,
      };
    } finally {
      setIsChecking(false);
    }
  };

  /**
   * Initiates the cross-department request workflow.
   */
  const initiateCrossDeptRequest = (payload: CrossDeptRequestPayload) => {
    setPendingRequest(payload);
  };

  /**
   * Confirms and navigates to the scheduler to complete the request.
   */
  const confirmAndNavigate = () => {
    if (!pendingRequest) return;

    const params = new URLSearchParams({
      pendingSessionId: pendingRequest.classSessionId,
      resourceType: pendingRequest.resourceType,
      resourceId: pendingRequest.resourceId,
      departmentId: pendingRequest.departmentId,
    });

    setPendingRequest(null);
    toast.success('Session created! Drag it to the timetable to submit your request.');
    navigate(`/scheduler?${params.toString()}`, { replace: false });
  };

  /**
   * Cancels the pending cross-department request.
   */
  const cancelRequest = () => {
    setPendingRequest(null);
  };

  return {
    isChecking,
    pendingRequest,
    checkResources,
    initiateCrossDeptRequest,
    confirmAndNavigate,
    cancelRequest,
  };
}
