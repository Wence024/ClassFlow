/**
 * Runtime configuration system for production deployments.
 * 
 * Configuration Priority:
 * 1. Runtime config (window.APP_CONFIG from public/config.js) - Production only
 * 2. Build-time env vars (import.meta.env.VITE_*) - Staging (Vercel)
 * 3. Hardcoded defaults - Development
 */

export interface AppConfig {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_PROJECT_ID: string;
  APP_ENV: 'development' | 'staging' | 'production';
}

declare global {
  interface Window {
    APP_CONFIG?: AppConfig;
  }
}

// Hardcoded development configuration
const DEV_CONFIG: AppConfig = {
  SUPABASE_URL: 'https://wkfgcroybuuefaulqsru.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZmdjcm95YnV1ZWZhdWxxc3J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MjgxNzEsImV4cCI6MjA3OTAwNDE3MX0.OmmXnxzeGspJJgPr8r0yiYXXbwEtaIBmkT-KIZdE4Mg',
  SUPABASE_PROJECT_ID: 'wkfgcroybuuefaulqsru',
  APP_ENV: 'development',
};

/**
 * Get application configuration with fallback chain:
 * 1. Runtime config (production) → 2. Env vars (staging) → 3. Hardcoded (dev)
 */
export function getConfig(): AppConfig {
  // Priority 1: Runtime config from public/config.js (production)
  if (window.APP_CONFIG) {
    console.log('[Config] Using runtime config (production)');
    return window.APP_CONFIG;
  }

  // Priority 2: Build-time env vars (staging - Vercel)
  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_APP_ENV === 'staging') {
    console.log('[Config] Using build-time env vars (staging)');
    return {
      SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
      SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
      SUPABASE_PROJECT_ID: import.meta.env.VITE_SUPABASE_PROJECT_ID,
      APP_ENV: 'staging',
    };
  }

  // Priority 3: Hardcoded development config
  console.log('[Config] Using hardcoded development config');
  return DEV_CONFIG;
}

/**
 * Validate that configuration is complete
 */
export function validateConfig(config: AppConfig): void {
  const missing: string[] = [];

  if (!config.SUPABASE_URL) missing.push('SUPABASE_URL');
  if (!config.SUPABASE_ANON_KEY) missing.push('SUPABASE_ANON_KEY');
  if (!config.SUPABASE_PROJECT_ID) missing.push('SUPABASE_PROJECT_ID');
  if (!config.APP_ENV) missing.push('APP_ENV');

  if (missing.length > 0) {
    throw new Error(
      `Missing configuration values: ${missing.join(', ')}\n\n` +
      `Environment: ${config.APP_ENV || 'unknown'}\n` +
      `Config source: ${window.APP_CONFIG ? 'Runtime (config.js)' : 'Build-time or hardcoded'}\n\n` +
      `For production: Ensure public/config.js exists on server\n` +
      `For staging: Set VITE_* env vars in Vercel dashboard\n` +
      `For development: Using hardcoded values (no action needed)`
    );
  }
}
