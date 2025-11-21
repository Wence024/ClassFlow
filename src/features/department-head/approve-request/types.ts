/**
 * Types for the approve cross-department request use case.
 */

export type ApproveRequestInput = {
  requestId: string;
  reviewerId: string;
};

export type ApproveRequestResult = {
  success: boolean;
  error?: string;
};
