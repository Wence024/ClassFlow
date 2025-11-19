/**
 * Environment indicator badge displayed in non-production builds.
 */
import { useEffect, useState } from 'react';
import { config } from '@/lib/supabase';

export function EnvironmentIndicator() {
  const [env, setEnv] = useState<string | null>(null);

  useEffect(() => {
    // Only show in development and staging
    if (config.APP_ENV === 'development' || config.APP_ENV === 'staging') {
      setEnv(config.APP_ENV);
    }
  }, []);

  if (!env) return null;

  const isDev = env === 'development';
  const bgColor = isDev ? 'bg-green-500' : 'bg-yellow-500';
  const label = isDev ? 'DEV' : 'STAGING';

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`${bgColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}
        title={`Connected to ${env} environment`}
      >
        {label}
      </div>
    </div>
  );
}
