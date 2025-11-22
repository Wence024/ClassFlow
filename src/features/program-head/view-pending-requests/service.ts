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
 */
export async function fetchMyRequests(): Promise<ResourceRequest[]> {
  return infraGetMyRequests();
}

/**
 * Dismisses a resource request.
 */
export async function dismissRequest(requestId: string): Promise<void> {
  await infraUpdateRequest(requestId, { dismissed: true });
}

/**
 * Cancels a resource request.
 */
export async function cancelMyRequest(requestId: string, requesterId: string): Promise<void> {
  await infraCancelRequest(requestId, requesterId);
}