import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, 'build/**/*', 'templates/**/*'],
    setupFiles: ['./vitest.setup.js'],
  },
});
