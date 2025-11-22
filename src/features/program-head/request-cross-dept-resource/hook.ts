/**
 * Hook for managing cross-department resource request workflow.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { isCrossDepartmentInstructor, isCrossDepartmentClassroom } from '@/lib/services/classSessionService';
import type { CrossDeptCheckResult, CrossDeptRequestPayload } from './types';

/**
 * Hook for managing cross-department resource request workflow.
 *
 * @returns An object containing the state and functions for handling cross-department resource requests.
 */
export function useRequestCrossDeptResource() {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);
  const [pendingRequest, setPendingRequest] = useState<CrossDeptRequestPayload | null>(null);

  /**
   * Checks if the given resources require cross-department approval.
   *
   * @param programId - The ID of the program.
   * @param instructorId - Optional instructor ID to check.
   * @param classroomId - Optional classroom ID to check.
   * @returns A promise that resolves to the cross-department check result.
   */
  const checkResources = async (
    programId: string,
    instructorId?: string,
    classroomId?: string
  ): Promise<CrossDeptCheckResult> => {
    setIsChecking(true);
    try {
      // Check instructor first if provided
      if (instructorId) {
        const isInstructorCrossDept = await isCrossDepartmentInstructor(programId, instructorId);
        if (isInstructorCrossDept) {
          return {
            isCrossDept: true,
            resourceType: 'instructor',
            resourceId: instructorId,
            departmentId: null, // Would need additional query to get dept ID
          };
        }
      }
      
      // Check classroom if provided
      if (classroomId) {
        const isClassroomCrossDept = await isCrossDepartmentClassroom(programId, classroomId);
        if (isClassroomCrossDept) {
          return {
            isCrossDept: true,
            resourceType: 'classroom',
            resourceId: classroomId,
            departmentId: null, // Would need additional query to get dept ID
          };
        }
      }
      
      return {
        isCrossDept: false,
        resourceType: null,
        resourceId: null,
        departmentId: null,
      };
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
   *
   * @param payload - The payload containing the cross-department request information.
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
