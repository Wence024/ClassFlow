/**
 * Service layer for viewing pending requests.
 */

import {
  getMyRequests as infraGetMyRequests,
  updateRequest as infraUpdateRequest,
  cancelRequest as infraCancelRequest,
} from '@/lib/services/resourceRequestService';
import type { ResourceRequest } from '@/types/resourceRequest';

/**
 * Fetches my resource requests.
 *
 * @returns A promise that resolves to an array of resource requests.
 */
export async function fetchMyRequests(): Promise<ResourceRequest[]> {
  return infraGetMyRequests();
}

/**
 * Dismisses a resource request.
 *
 * @param requestId - The ID of the request to dismiss.
 */
export async function dismissRequest(requestId: string): Promise<void> {
  await infraUpdateRequest(requestId, { dismissed: true });
}

/**
 * Cancels a resource request.
 *
 * @param requestId - The ID of the request to cancel.
 * @param requesterId - The ID of the user requesting the cancellation.
 */
export async function cancelMyRequest(requestId: string, requesterId: string): Promise<void> {
  await infraCancelRequest(requestId, requesterId);
}