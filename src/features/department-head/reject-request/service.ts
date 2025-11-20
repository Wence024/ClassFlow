/**
 * Service layer for rejecting cross-department resource requests.
 * Thin wrapper over infrastructure services.
 */

import { rejectRequest } from '@/lib/services/resourceRequestService';

/**
 * Rejects a resource request with a message.
 *
 * @param requestId The ID of the resource request to reject.
 * @param reviewerId The ID of the reviewer rejecting the request.
 * @param rejectionMessage The message explaining why the request was rejected.
 */
export async function rejectResourceRequest(
  requestId: string,
  reviewerId: string,
  rejectionMessage: string
): Promise<void> {
  await rejectRequest(requestId, reviewerId, rejectionMessage);
}
