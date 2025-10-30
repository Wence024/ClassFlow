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
 * **Edge Case Handling:**
 * - Checks for existing pending/approved requests to prevent duplicates
 * - Returns existing request if one already exists for this session
 *
 * @param payload - The data for the new resource request.
 * @returns A promise resolving to the created resource request.
 */
export async function createRequest(payload: ResourceRequestInsert): Promise<ResourceRequest> {
  // Check for existing pending/approved requests to prevent duplicates
  const { data: existingRequests } = await supabase
    .from(TABLE)
    .select('*')
    .eq('class_session_id', payload.class_session_id)
    .in('status', ['pending', 'approved']);
  
  if (existingRequests && existingRequests.length > 0) {
    console.warn('Request already exists for this class session:', existingRequests[0]);
    return existingRequests[0] as ResourceRequest;
  }
  
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
 * Cancels all active resource requests for a class session and notifies department heads.
 * Used when a program head drops a session back to the drawer.
 *
 * @param classSessionId - The ID of the class session.
 * @returns A promise resolving when all requests are cancelled and notifications sent.
 */
export async function cancelActiveRequestsForClassSession(classSessionId: string): Promise<void> {
  // Fetch all pending/approved requests for this session
  const { data: requests, error: fetchError } = await supabase
    .from(TABLE)
    .select('*')
    .eq('class_session_id', classSessionId)
    .in('status', ['pending', 'approved']);
  
  if (fetchError) throw fetchError;
  
  if (!requests || requests.length === 0) return;
  
  // For each request, insert a cancellation notification
  for (const request of requests) {
    try {
      await supabase
        .from(NOTIF_TABLE)
        .insert([
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
  
  // Delete all the requests (trigger will cleanup notifications)
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
 * @param requestId - The ID of the resource request.
 * @returns A promise resolving to the enriched resource request with additional metadata.
 */
export async function getRequestWithDetails(requestId: string): Promise<ResourceRequest & { 
  resource_name?: string;
  requester_name?: string;
  program_name?: string;
  period_index?: number;
  class_group_id?: string;
}> {
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
  
  // Fetch resource name
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
  
  // Fetch requester profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', request.requester_id)
    .single();
  
  if (profile?.full_name) {
    requesterName = profile.full_name;
  }
  
  // Fetch program name
  const { data: program } = await supabase
    .from('programs')
    .select('name')
    .eq('id', request.requesting_program_id)
    .single();
  
  if (program?.name) {
    programName = program.name;
  }
  
  // Fetch timetable assignment position
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
 * @param resourceType - The type of resource ('instructor' or 'classroom').
 * @param resourceId - The ID of the resource.
 * @returns A promise resolving when all requests are cancelled and notifications sent.
 */
export async function cancelActiveRequestsForResource(
  resourceType: 'instructor' | 'classroom',
  resourceId: string
): Promise<void> {
  // Fetch all pending/approved requests for this resource
  const { data: requests, error: fetchError } = await supabase
    .from(TABLE)
    .select('*')
    .eq('resource_type', resourceType)
    .eq('resource_id', resourceId)
    .in('status', ['pending', 'approved']);
  
  if (fetchError) throw fetchError;
  
  if (!requests || requests.length === 0) return;
  
  // For each request, insert a cancellation notification
  for (const request of requests) {
    try {
      await supabase
        .from(NOTIF_TABLE)
        .insert([
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
  
  // Delete all the requests (trigger will cleanup notifications)
  const { error: deleteError } = await supabase
    .from(TABLE)
    .delete()
    .eq('resource_type', resourceType)
    .eq('resource_id', resourceId)
    .in('status', ['pending', 'approved']);
  
  if (deleteError) throw deleteError;
}
