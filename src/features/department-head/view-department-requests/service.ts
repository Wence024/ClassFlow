/**
 * Service layer for viewing department requests.
 * Thin wrapper over infrastructure services.
 */

import { getRequestsForDepartment } from '@/lib/services/resourceRequestService';
import type { ResourceRequest } from '@/types/resourceRequest';

/**
 * Fetches all requests for a specific department.
 *
 * @param departmentId
 */
export async function fetchDepartmentRequests(departmentId: string): Promise<ResourceRequest[]> {
  return getRequestsForDepartment(departmentId);
}
