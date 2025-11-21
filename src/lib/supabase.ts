/**
 * Primary Supabase client for the entire application.
 * 
 * Configuration Sources:
 * - Production (Hostinger): Runtime config from public/config.js
 * - Staging (Vercel): Build-time VITE_* env variables
 * - Development (Local): Hardcoded credentials in runtimeConfig.ts.
 */
import { createClient } from '@supabase/supabase-js';
import type { Database } from './supabase.types'; // Assuming types are in the same lib folder

const supabaseUrl = 'https://wkfgcroybuuefaulqsru.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZmdjcm95YnV1ZWZhdWxxc3J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MjgxNzEsImV4cCI6MjA3OTAwNDE3MX0.OmmXnxzeGspJJgPr8r0yiYXXbwEtaIBmkT-KIZdE4Mg';

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
