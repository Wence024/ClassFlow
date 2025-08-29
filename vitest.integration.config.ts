import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from './vitest.base.config'; // Import the new base

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      // This config ONLY includes integration tests.
      include: ['src/**/*.integration.test.{ts,tsx}'],
    },
  })
);
