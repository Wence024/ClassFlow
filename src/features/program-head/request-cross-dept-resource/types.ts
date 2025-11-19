/**
 * Types for the cross-department resource request use case.
 */

export type CrossDeptResourceType = 'instructor' | 'classroom';

export type CrossDeptCheckResult = {
  isCrossDept: boolean;
  resourceType: CrossDeptResourceType | null;
  resourceId: string | null;
  departmentId: string | null;
};

export type CrossDeptRequestPayload = {
  classSessionId: string;
  resourceType: CrossDeptResourceType;
  resourceId: string;
  departmentId: string;
  resourceName: string;
};
