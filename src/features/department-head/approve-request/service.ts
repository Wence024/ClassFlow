/**
 * Service layer for approving cross-department resource requests.
 * Thin wrapper over infrastructure services.
 */

import { approveRequest } from '@/lib/services/resourceRequestService';

/**
 * Approves a resource request.
 *
 * @param requestId The ID of the resource request to approve.
 * @param reviewerId The ID of the reviewer approving the request.
 */
export async function approveResourceRequest(
  requestId: string,
  reviewerId: string
): Promise<void> {
  await approveRequest(requestId, reviewerId);
}
