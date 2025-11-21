/**
 * Types for the view department requests use case.
 */

import type { ResourceRequest } from '@/types/resourceRequest';

export type RequestWithDetails = ResourceRequest & {
  resourceName?: string;
  programName?: string;
  requesterName?: string;
};

export type RequestFilters = {
  status?: 'pending' | 'approved' | 'rejected';
  resourceType?: 'instructor' | 'classroom';
};
