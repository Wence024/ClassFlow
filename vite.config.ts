import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '::',
    port: 8080,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // For staging (Vercel), define env vars from their dashboard
  define: {
    'import.meta.env.VITE_APP_ENV': JSON.stringify(process.env.VITE_APP_ENV),
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY),
    'import.meta.env.VITE_SUPABASE_PROJECT_ID': JSON.stringify(process.env.VITE_SUPABASE_PROJECT_ID),
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
});
