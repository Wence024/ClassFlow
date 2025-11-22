/**
 * Service layer for rejecting resource requests.
 */

import { rejectResourceRequest as infraRejectResourceRequest } from '@/lib/services/resourceRequestService';
import type { ResourceRequestUpdate } from '@/types/resourceRequest';

/**
 * Rejects a resource request.
 *
 * @param id - The ID of the resource request to reject.
 * @param approverId - The ID of the user rejecting the request.
 * @param updateData - The update data for the resource request.
 */
export async function rejectResourceRequest(id: string, approverId: string, updateData: ResourceRequestUpdate): Promise<void> {
  return infraRejectResourceRequest(id, approverId, updateData);
}