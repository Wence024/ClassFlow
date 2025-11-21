/**
 * Business logic hook for rejecting cross-department requests.
 */

import { useState } from 'react';
import { toast } from 'sonner';
import { rejectResourceRequest } from './service';

export type UseRejectRequestResult = {
  rejectRequest: (requestId: string, reviewerId: string, rejectionMessage: string) => Promise<boolean>;
  isRejecting: boolean;
  error: string | null;
};

/**
 * Hook for rejecting cross-department resource requests.
 */
export function useRejectRequest(): UseRejectRequestResult {
  const [isRejecting, setIsRejecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rejectRequest = async (
    requestId: string,
    reviewerId: string,
    rejectionMessage: string
  ): Promise<boolean> => {
    if (!rejectionMessage.trim()) {
      toast.error('Rejection message is required');
      return false;
    }

    setIsRejecting(true);
    setError(null);

    try {
      await rejectResourceRequest(requestId, reviewerId, rejectionMessage);
      toast.success('Request rejected');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reject request';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsRejecting(false);
    }
  };

  return {
    rejectRequest,
    isRejecting,
    error,
  };
}
