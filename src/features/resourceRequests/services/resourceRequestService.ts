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

export async function listMyRequests(): Promise<ResourceRequest[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('requested_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

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
  }
  return created;
}

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