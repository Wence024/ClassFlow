/**
 * Service layer for approving resource requests.
 */

import { approveResourceRequest as infraApproveResourceRequest } from '@/lib/services/resourceRequestService';
import type { ResourceRequestUpdate } from '@/types/resourceRequest';

/**
 * Approves a resource request.
 */
export async function approveResourceRequest(id: string, approverId: string, updateData: ResourceRequestUpdate): Promise<void> {
  return infraApproveResourceRequest(id, approverId, updateData);
}