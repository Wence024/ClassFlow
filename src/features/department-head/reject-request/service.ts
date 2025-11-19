/**
 * Service layer for rejecting cross-department resource requests.
 * Thin wrapper over infrastructure services.
 */

import { rejectRequest } from '@/lib/services/resourceRequestService';

/**
 * Rejects a resource request with a message.
 */
export async function rejectResourceRequest(
  requestId: string,
  reviewerId: string,
  rejectionMessage: string
): Promise<void> {
  await rejectRequest(requestId, reviewerId, rejectionMessage);
}
