/**
 * Business logic hook for viewing department requests.
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchDepartmentRequests } from './service';
import type { RequestWithDetails, RequestFilters } from './types';

export type UseViewDepartmentRequestsResult = {
  requests: RequestWithDetails[];
  filteredRequests: RequestWithDetails[];
  isLoading: boolean;
  error: string | null;
  filters: RequestFilters;
  setFilters: (filters: RequestFilters) => void;
  refetch: () => Promise<void>;
};

/**
 * Hook for viewing and filtering department requests.
 *
 * @param departmentId The ID of the department to fetch requests for.
 * @returns Object containing department requests, filtering capabilities, loading state, and error information.
 */
export function useViewDepartmentRequests(
  departmentId: string | null
): UseViewDepartmentRequestsResult {
  const [requests, setRequests] = useState<RequestWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<RequestFilters>({});

  const fetchRequests = async () => {
    if (!departmentId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchDepartmentRequests(departmentId);
      setRequests(data as RequestWithDetails[]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load requests';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const memoizedFetchRequests = useCallback(() => {
    fetchRequests();
  }, [fetchRequests]);

  useEffect(() => {
    memoizedFetchRequests();
  }, [memoizedFetchRequests]);

  const filteredRequests = requests.filter((request) => {
    if (filters.status && request.status !== filters.status) {
      return false;
    }
    if (filters.resourceType && request.resource_type !== filters.resourceType) {
      return false;
    }
    return true;
  });

  return {
    requests,
    filteredRequests,
    isLoading,
    error,
    filters,
    setFilters,
    refetch: fetchRequests,
  };
}
