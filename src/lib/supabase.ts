import { createClient } from '@supabase/supabase-js';
import type { Database } from './supabase.types'; // Assuming types are in the same lib folder

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// This is now the single, correctly configured client for the entire application.
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Use localStorage to persist the user's session
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
