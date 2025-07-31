import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // Optional if using `vitest/globals`
    environment: 'node'
  }
});
