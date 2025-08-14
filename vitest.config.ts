import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      //
      // THIS IS THE FIX:
      //
      globals: true, // Optional: makes expect, describe, etc. available globally
      environment: 'jsdom', // Use a simulated DOM environment
      setupFiles: './src/setupTests.ts', // Your existing setup file
    },
  })
);