/**
 * Types for the resource requests feature.
 * If Database types are available, prefer importing from `supabase.types`.
 */

import type { Database } from '@/lib/supabase.types';

export type ResourceRequestStatus = 'pending' | 'approved' | 'rejected';
export type ResourceType = 'instructor' | 'classroom';

// Extend the base type to include fields that exist in DB
export type ResourceRequest = Database['public']['Tables']['resource_requests']['Row'] & {
  class_session_id: string;
  dismissed?: boolean;
};

export type ResourceRequestInsert = Database['public']['Tables']['resource_requests']['Insert'];
export type ResourceRequestUpdate = Database['public']['Tables']['resource_requests']['Update'];
