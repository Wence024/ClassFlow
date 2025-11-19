/**
 * Primary Supabase client for the entire application.
 * 
 * Configuration Sources:
 * - Production (Hostinger): Runtime config from public/config.js
 * - Staging (Vercel): Build-time VITE_* env variables
 * - Development (Local): Hardcoded credentials in runtimeConfig.ts
 */
import { createClient } from '@supabase/supabase-js';
import type { Database } from './supabase.types';
import { getConfig, validateConfig } from './runtimeConfig';

// Get and validate configuration
const config = getConfig();
validateConfig(config);

// Log environment info in non-production builds for debugging
if (config.APP_ENV !== 'production') {
  console.log(`[Supabase Client] Environment: ${config.APP_ENV}`);
  console.log(`[Supabase Client] Project URL: ${config.SUPABASE_URL}`);
  console.log(`[Supabase Client] Project ID: ${config.SUPABASE_PROJECT_ID}`);
}

/**
 * Single, environment-aware Supabase client instance.
 */
export const supabase = createClient<Database>(
  config.SUPABASE_URL,
  config.SUPABASE_ANON_KEY,
  {
    auth: {
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// Export config for use in other parts of the app
export { config };
export type { AppConfig } from './runtimeConfig';
