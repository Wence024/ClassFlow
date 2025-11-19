import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { writeFileSync } from 'fs';

/**
 * Vite plugin to generate build-info.json for production verification
 */
function buildInfoPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'build-info-generator',
    closeBundle() {
      const buildInfo = {
        env: env.VITE_APP_ENV || 'unknown',
        supabaseProjectId: env.VITE_SUPABASE_PROJECT_ID || 'unknown',
        buildTime: new Date().toISOString(),
      };
      
      const distPath = path.resolve(__dirname, 'dist', 'build-info.json');
      writeFileSync(distPath, JSON.stringify(buildInfo, null, 2));
      console.log(`✅ Generated build-info.json: ${buildInfo.env} (${buildInfo.supabaseProjectId})`);
    },
  };
}

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Only load variables prefixed with VITE_
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  // Debug logging to verify correct environment is loaded during build
  console.log(`[Vite Build] Mode: ${mode}`);
  console.log(`[Vite Build] VITE_APP_ENV: ${env.VITE_APP_ENV}`);
  console.log(`[Vite Build] VITE_SUPABASE_URL: ${env.VITE_SUPABASE_URL?.substring(0, 40)}...`);

  return {
    plugins: [react(), buildInfoPlugin(env)],
    server: {
      host: '::',
      port: 8080,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      'import.meta.env.VITE_APP_ENV': JSON.stringify(env.VITE_APP_ENV),
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
      'import.meta.env.VITE_SUPABASE_PROJECT_ID': JSON.stringify(env.VITE_SUPABASE_PROJECT_ID),
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
      coverage: {
        reporter: ['text', 'json', 'html'],
      },
      include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    },
  };
});
