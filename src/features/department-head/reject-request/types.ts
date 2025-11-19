/**
 * Types for the reject cross-department request use case.
 */

export type RejectRequestInput = {
  requestId: string;
  reviewerId: string;
  rejectionMessage: string;
};

export type RejectRequestResult = {
  success: boolean;
  error?: string;
};
