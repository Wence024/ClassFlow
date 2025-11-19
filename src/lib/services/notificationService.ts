/**
 * Centralized service for all notification database operations.
 * Consolidates operations from features/resourceRequests/services/notificationsService.ts
 */

import { supabase } from '../supabase';

export type RequestNotification = {
  id: string;
  request_id: string;
  target_department_id: string;
  message: string;
  created_at: string;
  read_at: string | null;
};

/**
 * Returns unread notifications for the current user's department.
 */
export async function getUnreadForDepartment(): Promise<RequestNotification[]> {
  const { data, error } = await supabase
    .from('request_notifications')
    .select('*')
    .is('read_at', null)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map((d) => ({
    ...d,
    created_at: d.created_at || new Date().toISOString(),
  }));
}

/**
 * Marks a notification as read.
 */
export async function markRead(id: string): Promise<void> {
  const { error } = await supabase
    .from('request_notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

/**
 * Deletes a notification.
 */
export async function deleteNotification(id: string): Promise<void> {
  const { error } = await supabase.from('request_notifications').delete().eq('id', id);
  if (error) throw error;
}

/**
 * Gets all notifications for a department (read and unread).
 */
export async function getAllForDepartment(): Promise<RequestNotification[]> {
  const { data, error } = await supabase
    .from('request_notifications')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map((d) => ({
    ...d,
    created_at: d.created_at || new Date().toISOString(),
  }));
}
