/**
 * Centralized service for all notification database operations.
 * Consolidates operations from features/resourceRequests/services/notificationsService.ts.
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
 *
 * @returns Array of unread notifications.
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
 *
 * @param id - The ID of the notification to mark as read.
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
 *
 * @param id - The ID of the notification to delete.
 */
export async function deleteNotification(id: string): Promise<void> {
  const { error } = await supabase.from('request_notifications').delete().eq('id', id);
  if (error) throw error;
}

/**
 * Gets all notifications for a department (read and unread).
 *
 * @returns Array of all notifications for the department.
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

/**
 * Creates a notification for a resource request.
 * Internal helper used by the resourceRequestService.
 *
 * @param requestId - The ID of the resource request.
 * @param targetDepartmentId - The ID of the target department.
 * @param message - The notification message.
 */
export async function createNotification(
  requestId: string,
  targetDepartmentId: string,
  message: string
): Promise<void> {
  const { error } = await supabase.from('request_notifications').insert([
    {
      request_id: requestId,
      target_department_id: targetDepartmentId,
      message,
    },
  ]);
  if (error) throw error;
}
