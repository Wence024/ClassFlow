import { createClient } from '@supabase/supabase-js';
import type { Database } from './supabase.types'; // Assuming types are in the same lib folder

const supabaseUrl = "https://dqsegqxnnhowqjxifhej.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxc2VncXhubmhvd3FqeGlmaGVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMzc1MzIsImV4cCI6MjA3NzgxMzUzMn0.hJKw731wyZHI8Py4LU0AgT2JKI5shenczB83jo4paT0";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
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
