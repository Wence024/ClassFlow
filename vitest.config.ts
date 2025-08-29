import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from './vitest.base.config'; // Import the new base

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      // This config includes ALL test files.
      include: ['src/**/*.{test,integration.test}.{ts,tsx}'],
    },
  })
);
