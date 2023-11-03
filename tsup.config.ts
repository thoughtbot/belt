import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  entry: ['src/index.ts'],
  format: ['esm'],
  minify: false,
  target: 'esnext',
  outDir: 'dist',
});
