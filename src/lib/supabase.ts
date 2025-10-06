import { createClient } from '@supabase/supabase-js';
import type { Database } from './supabase.types'; // Assuming types are in the same lib folder

const supabaseUrl = "https://rjdznnrzeiqajuaqathd.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqZHpubnJ6ZWlxYWp1YXFhdGhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxNDY3MjIsImV4cCI6MjA2NDcyMjcyMn0.3EzTJ1CA3q0Cp_HOhuXiRDpL2uzsmq8_B0SKTFFbv0o";

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
