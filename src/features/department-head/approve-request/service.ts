/**
 * Service layer for approving cross-department resource requests.
 * Thin wrapper over infrastructure services.
 */

import { approveRequest } from '@/lib/services/resourceRequestService';

/**
 * Approves a resource request.
 */
export async function approveResourceRequest(
  requestId: string,
  reviewerId: string
): Promise<void> {
  await approveRequest(requestId, reviewerId);
}
