import { supabase } from '../../../lib/supabase';
import type { ResourceRequest, ResourceRequestInsert, ResourceRequestUpdate } from '../types/resourceRequest';

const TABLE = 'resource_requests';

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
  return data as ResourceRequest;
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