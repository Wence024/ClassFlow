/**
 * Primary Supabase client for the entire application.
 * 
 * This is the SINGLE SOURCE OF TRUTH for Supabase connections.
 * Dynamically selects the correct Supabase project based on environment:
 * - Development: dqsegqxnnhowqjxifhej.supabase.co
 * - Staging: pnmzjmcfeekculqyirpr.supabase.co
 * - Production: wkfgcroybuuefaulqsru.supabase.co
 * 
 * Environment is determined by VITE_APP_ENV variable in:
 * - .env.development (default for `npm run dev`)
 * - .env.staging (used by Vercel)
 * - .env.production (used by Hostinger)
 */
import { createClient } from '@supabase/supabase-js';
import type { Database } from './supabase.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const appEnv = import.meta.env.VITE_APP_ENV || 'development';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    `Missing Supabase environment variables for ${appEnv} environment. ` +
    `Please check your .env.${appEnv} file.`
  );
}

// Log environment info in non-production builds for debugging
if (appEnv !== 'production') {
  console.log(`[Supabase Client] Environment: ${appEnv}`);
  console.log(`[Supabase Client] Project URL: ${supabaseUrl}`);
}

/**
 * Single, environment-aware Supabase client instance.
 * Use this client throughout the application via:
 * `import { supabase } from '@/lib/supabase';`
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  },
});
