/**
 * Service layer for rejecting resource requests.
 */

import { rejectResourceRequest as infraRejectResourceRequest } from '@/lib/services/resourceRequestService';
import type { ResourceRequestUpdate } from '@/types/resourceRequest';

/**
 * Rejects a resource request.
 */
export async function rejectResourceRequest(id: string, approverId: string, updateData: ResourceRequestUpdate): Promise<void> {
  return infraRejectResourceRequest(id, approverId, updateData);
}