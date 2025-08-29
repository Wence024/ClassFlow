import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from './vitest.base.config'; // Import the new base

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      // This config ONLY includes unit tests.
      include: ['src/**/*.test.{ts,tsx}'],
    },
  })
);
