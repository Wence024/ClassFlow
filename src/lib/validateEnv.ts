import { getConfig, validateConfig } from './runtimeConfig';

/**
 * Validates configuration at application startup.
 * Now uses runtime config system instead of import.meta.env directly.
 */
export function validateEnvironment(): void {
  try {
    const config = getConfig();
    validateConfig(config);
    
    // Log environment info for debugging (only in non-production)
    if (config.APP_ENV !== 'production') {
      console.log('[ENV] Environment:', config.APP_ENV);
      console.log('[ENV] Supabase URL:', config.SUPABASE_URL);
      console.log('[ENV] Project ID:', config.SUPABASE_PROJECT_ID);
      console.log('[ENV] Config Source:', window.APP_CONFIG ? 'Runtime (config.js)' : 'Build-time or hardcoded');
    }
  } catch (error) {
    console.error('[ENV] Configuration validation failed:', error);
    throw error;
  }
}
