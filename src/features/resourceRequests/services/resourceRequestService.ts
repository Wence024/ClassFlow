import { supabase } from '../../../lib/supabase';
import type { ResourceRequest, ResourceRequestInsert, ResourceRequestUpdate } from '../types/resourceRequest';

const TABLE = 'resource_requests';
const NOTIF_TABLE = 'request_notifications';

async function createNotificationForRequest(request: ResourceRequest): Promise<void> {
  const message = `New ${request.resource_type} request awaiting review.`;
  const { error } = await supabase
    .from(NOTIF_TABLE)
    .insert([
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
 *
 * @returns A promise resolving to an array of the user's resource requests.
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
 * @param departmentId - The ID of the target department.
 * @returns A promise resolving to an array of resource requests for the department.
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
 *
 * @param payload - The data for the new resource request.
 * @returns A promise resolving to the created resource request.
 */
export async function createRequest(payload: ResourceRequestInsert): Promise<ResourceRequest> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([payload])
    .select()
    .single();
  if (error) throw error;
  const created = data as ResourceRequest;
  try {
    await createNotificationForRequest(created);
  } catch (e) {
    console.error('Failed to create request notification', e);
    // Import toast dynamically to avoid circular dependencies
    const { toast } = await import('sonner');
    toast.warning('Request created, but notification may not be visible to department head.');
  }
  return created;
}

/**
 * Approves a resource request and updates the related timetable assignments atomically.
 * Uses a database function to ensure both operations succeed or fail together.
 *
 * @param id - The ID of the resource request to approve.
 * @param reviewerId - The ID of the user approving the request.
 * @returns A promise resolving to the updated resource request.
 * @throws Error if the approval fails with detailed error message.
 */
export async function approveRequest(id: string, reviewerId: string): Promise<ResourceRequest> {
  // Call the database function to atomically approve the request and update assignments
  // Note: Using type assertion as the types are auto-generated and may not include new functions yet
  const { data, error } = await supabase.rpc('approve_resource_request' as any, {
    _request_id: id,
    _reviewer_id: reviewerId,
  });

  if (error) {
    console.error('Failed to approve request (RPC error):', error);
    throw new Error(`Failed to approve request: ${error.message}`);
  }

  // Parse the response as JSON
  const result = data as any;
  
  // Check if the function returned a success response
  if (!result || !result.success) {
    const errorMsg = result?.error || 'Unknown error during approval';
    console.error('Approval function returned failure:', errorMsg);
    throw new Error(errorMsg);
  }

  console.log('Request approved successfully:', {
    requestId: id,
    updatedAssignments: result.updated_assignments,
    classSessionId: result.class_session_id,
    semesterId: result.semester_id,
  });

  // Fetch the updated request to return
  const { data: updatedRequest, error: fetchError } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError) throw fetchError;
  return updatedRequest as ResourceRequest;
}

/**
 * Rejects a resource request with a message and either restores the session to its original
 * position (if previously approved) or deletes it (if pending).
 *
 * @param id - The ID of the resource request to reject.
 * @param reviewerId - The ID of the user rejecting the request.
 * @param message - The rejection message from the department head.
 * @returns A promise resolving to the result of the rejection.
 */
export async function rejectRequest(id: string, reviewerId: string, message: string): Promise<any> {
  const { data, error } = await supabase.rpc('reject_resource_request' as any, {
    _request_id: id,
    _reviewer_id: reviewerId,
    _rejection_message: message,
  });

  if (error) {
    console.error('Failed to reject request (RPC error):', error);
    throw new Error(`Failed to reject request: ${error.message}`);
  }

  const result = data as any;
  
  if (!result || !result.success) {
    const errorMsg = result?.error || 'Unknown error during rejection';
    console.error('Rejection function returned failure:', errorMsg);
    throw new Error(errorMsg);
  }

  console.log('Request rejected successfully:', result);
  return result;
}

/**
 * Dismisses a resource request notification without taking action.
 *
 * @param id - The ID of the resource request to dismiss.
 * @returns A promise resolving when the operation is complete.
 */
export async function dismissRequest(id: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .update({ dismissed: true } as any)
    .eq('id', id);
  if (error) throw error;
}

/**
 * Updates an existing resource request (for non-approval updates).
 *
 * @param id - The ID of the resource request to update.
 * @param update - The update payload.
 * @returns A promise resolving to the updated resource request.
 */
export async function updateRequest(id: string, update: ResourceRequestUpdate): Promise<ResourceRequest> {
  const { data, error } = await supabase
    .from(TABLE)
    .update(update)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as ResourceRequest;
}

/**
 * Fetches a resource request with enriched details (instructor or classroom names).
 *
 * @param requestId - The ID of the resource request.
 * @returns A promise resolving to the enriched resource request.
 */
export async function getRequestWithDetails(requestId: string): Promise<ResourceRequest & { resource_name?: string }> {
  const { data: request, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', requestId)
    .single();
  
  if (error) throw error;
  
  let resourceName = 'Unknown Resource';
  
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
  
  return { ...request, resource_name: resourceName } as ResourceRequest & { resource_name: string };
}
