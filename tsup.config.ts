import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  entry: ['src/index.ts'],
  format: ['cjs'],
  minify: false,
  target: 'esnext',
  outDir: 'dist',
});
