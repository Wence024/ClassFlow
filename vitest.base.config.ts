import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// This is our shared configuration for all test environments
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    // Notice that `include` is NOT defined here.
  },
});
