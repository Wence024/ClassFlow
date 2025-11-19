/**
 * Centralized service for all resource request database operations.
 * Consolidates operations from features/resourceRequests/services/
 */

import { supabase } from '../supabase';
import type {
  ResourceRequest,
  ResourceRequestInsert,
  ResourceRequestUpdate,
} from '../../types/resourceRequest';

const TABLE = 'resource_requests';
const NOTIF_TABLE = 'request_notifications';

async function createNotificationForRequest(request: ResourceRequest): Promise<void> {
  const message = `New ${request.resource_type} request awaiting review.`;
  const { error } = await supabase.from(NOTIF_TABLE).insert([
    {
      request_id: request.id,
      target_department_id: request.target_department_id,
      message,
    },
  ]);
  if (error) throw error;
}

/**
 * Fetches all resource requests initiated by the current user.
 */
export async function getMyRequests(): Promise<ResourceRequest[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('requested_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

/**
 * Fetches all resource requests targeted at a specific department.
 */
export async function getRequestsForDepartment(departmentId: string): Promise<ResourceRequest[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('target_department_id', departmentId)
    .order('requested_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

/**
 * Creates a new resource request and a corresponding notification.
 * Checks for existing pending/approved requests to prevent duplicates.
 */
export async function createRequest(payload: ResourceRequestInsert): Promise<ResourceRequest> {
  // Check for existing pending/approved requests
  const { data: existingRequests } = await supabase
    .from(TABLE)
    .select('*')
    .eq('class_session_id', payload.class_session_id)
    .in('status', ['pending', 'approved']);

  if (existingRequests && existingRequests.length > 0) {
    console.warn('Request already exists for this class session:', existingRequests[0]);
    return existingRequests[0] as ResourceRequest;
  }

  const { data, error } = await supabase.from(TABLE).insert([payload]).select().single();
  if (error) throw error;
  const created = data as ResourceRequest;
  
  try {
    await createNotificationForRequest(created);
  } catch (e) {
    console.error('Failed to create request notification', e);
    const { toast } = await import('sonner');
    toast.warning('Request created, but notification may not be visible to department head.');
  }
  return created;
}

/**
 * Approves a resource request and updates timetable assignments atomically.
 * Uses a database function to ensure atomic operation.
 */
export async function approveRequest(id: string, reviewerId: string): Promise<ResourceRequest> {
  const { data, error } = await supabase.rpc(
    'approve_resource_request' as never,
    {
      _request_id: id,
      _reviewer_id: reviewerId,
    } as never
  );

  if (error) {
    console.error('approve_resource_request failed:', error);
    throw new Error(`Approval failed: ${error.message}`);
  }

  const result = data as { success: boolean; error?: string };
  if (!result.success) {
    throw new Error(result.error || 'Approval failed for unknown reason');
  }

  // Fetch and return updated request
  const { data: updated, error: fetchError } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();
  if (fetchError) throw fetchError;
  return updated as ResourceRequest;
}

/**
 * Rejects a resource request with a rejection message.
 * Uses a database function to handle the rejection workflow.
 */
export async function rejectRequest(
  id: string,
  reviewerId: string,
  rejectionMessage: string
): Promise<ResourceRequest> {
  const { data, error } = await supabase.rpc(
    'reject_resource_request' as never,
    {
      _request_id: id,
      _reviewer_id: reviewerId,
      _rejection_message: rejectionMessage,
    } as never
  );

  if (error) {
    console.error('reject_resource_request failed:', error);
    throw new Error(`Rejection failed: ${error.message}`);
  }

  const result = data as { success: boolean; error?: string };
  if (!result.success) {
    throw new Error(result.error || 'Rejection failed for unknown reason');
  }

  // Fetch and return updated request
  const { data: updated, error: fetchError } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();
  if (fetchError) throw fetchError;
  return updated as ResourceRequest;
}

/**
 * Cancels a resource request (requester only).
 * Uses a database function to handle the cancellation workflow.
 */
export async function cancelRequest(id: string, requesterId: string): Promise<void> {
  const { data, error } = await supabase.rpc(
    'cancel_resource_request' as never,
    {
      _request_id: id,
      _requester_id: requesterId,
    } as never
  );

  if (error) {
    console.error('cancel_resource_request failed:', error);
    throw new Error(`Cancellation failed: ${error.message}`);
  }

  const result = data as { success: boolean; error?: string };
  if (!result.success) {
    throw new Error(result.error || 'Cancellation failed for unknown reason');
  }
}

/**
 * Updates a resource request (for dismissal).
 */
export async function updateRequest(
  id: string,
  update: ResourceRequestUpdate
): Promise<ResourceRequest> {
  const { data, error } = await supabase.from(TABLE).update(update).eq('id', id).select().single();
  if (error) throw error;
  return data as ResourceRequest;
}

/**
 * Deletes a resource request (admin only, or cleanup).
 */
export async function deleteRequest(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}

/**
 * Gets all active (pending/approved) requests for a class session.
 */
export async function getActiveRequestsForSession(sessionId: string): Promise<ResourceRequest[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('class_session_id', sessionId)
    .in('status', ['pending', 'approved']);
  if (error) throw error;
  return data || [];
}
