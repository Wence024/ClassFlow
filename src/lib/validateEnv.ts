/**
 * Validates required environment variables at application startup.
 * Throws an error if critical variables are missing.
 */
export function validateEnvironment(): void {
  const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY', 'VITE_APP_ENV'];

  const missing = required.filter((key) => !import.meta.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
        `Current mode: ${import.meta.env.MODE}\n` +
        `Expected environment: ${import.meta.env.VITE_APP_ENV || 'undefined'}`
    );
  }

  // Log environment info for debugging (only in non-production)
  if (import.meta.env.VITE_APP_ENV !== 'production') {
    console.log('[ENV] Mode:', import.meta.env.MODE);
    console.log('[ENV] VITE_APP_ENV:', import.meta.env.VITE_APP_ENV);
    console.log('[ENV] Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
  }
}
