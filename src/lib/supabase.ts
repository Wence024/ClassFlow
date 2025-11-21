/**
 * Primary Supabase client for the entire application.
 *
 * Configuration Sources:
 * - Production (Hostinger): Build-time VITE_* env variables
 * - Staging (Vercel): Build-time VITE_* env variables
 * - Development (Local): Build-time VITE_* env variables
 */
import { createClient } from '@supabase/supabase-js';
import type { Database } from './supabase.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

// This is now the single, correctly configured client for the entire application.
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Use localStorage to persist the user's session (only in browser environment)
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  },
});
