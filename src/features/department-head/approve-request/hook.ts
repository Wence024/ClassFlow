/**
 * Business logic hook for approving cross-department requests.
 */

import { useState } from 'react';
import { toast } from 'sonner';
import { approveResourceRequest } from './service';

export type UseApproveRequestResult = {
  approveRequest: (requestId: string, reviewerId: string) => Promise<boolean>;
  isApproving: boolean;
  error: string | null;
};

/**
 * Hook for approving cross-department resource requests.
 */
export function useApproveRequest(): UseApproveRequestResult {
  const [isApproving, setIsApproving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const approveRequest = async (requestId: string, reviewerId: string): Promise<boolean> => {
    setIsApproving(true);
    setError(null);

    try {
      await approveResourceRequest(requestId, reviewerId);
      toast.success('Request approved successfully');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to approve request';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsApproving(false);
    }
  };

  return {
    approveRequest,
    isApproving,
    error,
  };
}
