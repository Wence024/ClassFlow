/**
 * Types for the view pending requests use case.
 */

import type { ResourceRequest } from '@/types/resourceRequest';

export type RequestWithDetails = ResourceRequest & {
  resourceName?: string;
  departmentName?: string;
};

export type RequestFilters = {
  status?: 'pending' | 'approved' | 'rejected';
  resourceType?: 'instructor' | 'classroom';
};
