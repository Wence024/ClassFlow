/**
 * Service layer for viewing pending resource requests.
 * Thin wrapper over infrastructure services.
 */

import {
  getMyRequests,
  updateRequest,
  cancelRequest as cancelResourceRequest,
} from '@/lib/services/resourceRequestService';
import type { ResourceRequest } from '@/types/resourceRequest';

/**
 * Fetches all requests initiated by the current user.
 */
export async function fetchMyRequests(): Promise<ResourceRequest[]> {
  return getMyRequests();
}

/**
 * Dismisses a reviewed request (approved or rejected).
 */
export async function dismissRequest(requestId: string): Promise<void> {
  await updateRequest(requestId, { dismissed: true });
}

/**
 * Cancels a pending or approved request.
 */
export async function cancelMyRequest(requestId: string, requesterId: string): Promise<void> {
  await cancelResourceRequest(requestId, requesterId);
}
