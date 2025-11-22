/**
 * Service layer for viewing department requests.
 */

import { getRequestsForDepartment as infraGetRequestsForDepartment } from '@/lib/services/resourceRequestService';
import type { RequestWithDetails } from './types';

/**
 * Fetches requests for a specific department.
 *
 * @param departmentId - The ID of the department to fetch requests for.
 * @returns A promise that resolves to an array of requests with details.
 */
export async function fetchDepartmentRequests(departmentId: string): Promise<RequestWithDetails[]> {
  return infraGetRequestsForDepartment(departmentId);
}