/**
 * Centralized service for all resource request database operations.
 * Consolidates operations from features/resourceRequests/services/.
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
 *
 * @param departmentId
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
 *
 * @param payload
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
 *
 * @param id
 * @param reviewerId
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
 * Rejects a resource request with a message and either restores the session to its original
 * position (if previously approved) or deletes it (if pending).
 *
 * @param id The ID of the resource request to reject.
 * @param reviewerId The ID of the user rejecting the request.
 * @param rejectionMessage The rejection message from the department head.
 */
export async function rejectRequest(
  id: string,
  reviewerId: string,
  rejectionMessage: string
): Promise<{
  success: boolean;
  action: 'removed_from_timetable' | 'restored';
  class_session_id?: string;
  restored_to_period?: number;
}> {
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

  const result = data as {
    success: boolean;
    action: 'removed_from_timetable' | 'restored';
    class_session_id?: string;
    restored_to_period?: number;
    error?: string;
  };

  if (!result.success) {
    throw new Error(result.error || 'Rejection failed for unknown reason');
  }

  console.log('Request rejected successfully:', result);
  return result;
}

/**
 * Cancels a resource request initiated by the program head.
 * Restores session to original position if approved, or removes from timetable if pending.
 *
 * @param id The ID of the resource request to cancel.
 * @param requesterId The ID of the user canceling the request (for permission check).
 */
export async function cancelRequest(
  id: string,
  requesterId: string
): Promise<{
  success: boolean;
  action: 'removed_from_timetable' | 'restored';
  class_session_id?: string;
  restored_to_period?: number;
  error?: string;
}> {
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

  const result = data as {
    success: boolean;
    action: 'removed_from_timetable' | 'restored';
    class_session_id?: string;
    restored_to_period?: number;
    error?: string;
  };

  if (!result.success) {
    throw new Error(result.error || 'Cancellation failed for unknown reason');
  }

  console.log('Request cancelled successfully:', result);
  return result;
}

/**
 * Dismisses a resource request notification without taking action.
 * Can only be called by the requester on approved/rejected requests.
 *
 * @param id The ID of the resource request to dismiss.
 */
export async function dismissRequest(id: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .update({ dismissed: true } as ResourceRequestUpdate)
    .eq('id', id);

  if (error) {
    if (error.code === '42501') {
      throw new Error(
        'Permission denied: You can only dismiss your own reviewed requests (approved/rejected). ' +
          'If this is your request, please contact an administrator.'
      );
    }
    throw error;
  }
}

/**
 * Updates a resource request (for non-dismissal updates).
 *
 * @param id The ID of the resource request to update.
 * @param update The update payload.
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
 *
 * @param id
 */
export async function deleteRequest(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}

/**
 * Gets all active (pending/approved) requests for a class session.
 *
 * @param sessionId
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

/**
 * Cancels all active resource requests for a class session and notifies department heads.
 * Used when a program head drops a session back to the drawer.
 *
 * @param classSessionId
 */
export async function cancelActiveRequestsForClassSession(classSessionId: string): Promise<void> {
  const { data: requests, error: fetchError } = await supabase
    .from(TABLE)
    .select('*')
    .eq('class_session_id', classSessionId)
    .in('status', ['pending', 'approved']);

  if (fetchError) throw fetchError;
  if (!requests || requests.length === 0) return;

  for (const request of requests) {
    try {
      await supabase.from(NOTIF_TABLE).insert([
        {
          request_id: request.id,
          target_department_id: request.target_department_id,
          message: 'Request cancelled by program head',
        },
      ]);
    } catch (e) {
      console.error('Failed to create cancellation notification', e);
    }
  }

  const { error: deleteError } = await supabase
    .from(TABLE)
    .delete()
    .eq('class_session_id', classSessionId)
    .in('status', ['pending', 'approved']);

  if (deleteError) throw deleteError;
}

/**
 * Fetches a resource request with enriched details including requester info and timetable position.
 *
 * @param requestId
 */
export async function getRequestWithDetails(requestId: string): Promise<
  ResourceRequest & {
    resource_name?: string;
    requester_name?: string;
    program_name?: string;
    period_index?: number;
    class_group_id?: string;
  }
> {
  const { data: request, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', requestId)
    .single();

  if (error) throw error;

  let resourceName = 'Unknown Resource';
  let requesterName = 'Unknown User';
  let programName = 'Unknown Program';
  let periodIndex: number | undefined;
  let classGroupId: string | undefined;

  if (request.resource_type === 'instructor') {
    const { data: instructor } = await supabase
      .from('instructors')
      .select('first_name, last_name')
      .eq('id', request.resource_id)
      .single();

    if (instructor) {
      resourceName = `${instructor.first_name} ${instructor.last_name}`;
    }
  } else if (request.resource_type === 'classroom') {
    const { data: classroom } = await supabase
      .from('classrooms')
      .select('name')
      .eq('id', request.resource_id)
      .single();

    if (classroom) {
      resourceName = classroom.name;
    }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', request.requester_id)
    .single();

  if (profile?.full_name) {
    requesterName = profile.full_name;
  }

  const { data: program } = await supabase
    .from('programs')
    .select('name')
    .eq('id', request.requesting_program_id)
    .single();

  if (program?.name) {
    programName = program.name;
  }

  const { data: assignment } = await supabase
    .from('timetable_assignments')
    .select('period_index, class_group_id')
    .eq('class_session_id', request.class_session_id)
    .single();

  if (assignment) {
    periodIndex = assignment.period_index;
    classGroupId = assignment.class_group_id;
  }

  return {
    ...request,
    resource_name: resourceName,
    requester_name: requesterName,
    program_name: programName,
    period_index: periodIndex,
    class_group_id: classGroupId,
  } as ResourceRequest & {
    resource_name: string;
    requester_name: string;
    program_name: string;
    period_index?: number;
    class_group_id?: string;
  };
}

/**
 * Cancels all active resource requests for a specific resource (instructor or classroom).
 * Used as an edge case handler when resources are deleted.
 *
 * @param resourceType
 * @param resourceId
 */
export async function cancelActiveRequestsForResource(
  resourceType: 'instructor' | 'classroom',
  resourceId: string
): Promise<void> {
  const { data: requests, error: fetchError } = await supabase
    .from(TABLE)
    .select('*')
    .eq('resource_type', resourceType)
    .eq('resource_id', resourceId)
    .in('status', ['pending', 'approved']);

  if (fetchError) throw fetchError;
  if (!requests || requests.length === 0) return;

  for (const request of requests) {
    try {
      await supabase.from(NOTIF_TABLE).insert([
        {
          request_id: request.id,
          target_department_id: request.target_department_id,
          message: `Request cancelled - ${resourceType} was deleted`,
        },
      ]);
    } catch (e) {
      console.error('Failed to create cancellation notification', e);
    }
  }

  const { error: deleteError } = await supabase
    .from(TABLE)
    .delete()
    .eq('resource_type', resourceType)
    .eq('resource_id', resourceId)
    .in('status', ['pending', 'approved']);

  if (deleteError) throw deleteError;
}
