/**
 * Service layer for viewing department requests.
 */

import { getRequestsForDepartment as infraGetRequestsForDepartment } from '@/lib/services/resourceRequestService';
import type { RequestWithDetails } from './types';

/**
 * Fetches requests for a specific department.
 */
export async function fetchDepartmentRequests(departmentId: string): Promise<RequestWithDetails[]> {
  return infraGetRequestsForDepartment(departmentId);
}