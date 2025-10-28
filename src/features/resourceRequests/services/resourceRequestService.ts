import { supabase } from '../../../lib/supabase';
import type { ResourceRequest, ResourceRequestInsert, ResourceRequestUpdate } from '../types/resourceRequest';
import { updateAssignmentStatusBySession } from '../../timetabling/services/timetableService';

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
 * Updates an existing resource request and updates related timetable assignments if approved.
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
  
  const updatedRequest = data as ResourceRequest;
  
  // If the request is approved, update the timetable assignment status to 'confirmed'
  if (update.status === 'approved') {
    const classSessionId = updatedRequest.class_session_id;
    
    if (classSessionId) {
      try {
        // Get the active semester
        const { data: activeSemester, error: semesterError } = await supabase
          .from('semesters')
          .select('id')
          .eq('is_active', true)
          .single();
        
        if (semesterError) {
          console.error('Failed to get active semester:', semesterError);
          throw semesterError;
        }
        
        if (activeSemester) {
          await updateAssignmentStatusBySession(
            classSessionId,
            activeSemester.id,
            'confirmed'
          );
        }
      } catch (e) {
        console.error('Failed to update timetable assignment status', e);
        // Import toast dynamically to avoid circular dependencies
        const { toast } = await import('sonner');
        toast.warning('Request approved, but timetable status update failed. Please check the timetable.');
      }
    }
  }
  
  return updatedRequest;
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
