import { log } from 'console';
import { defineConfig } from 'tsup';

const isDev = process.env.npm_lifecycle_event === 'dev';
log('event', process.env.npm_lifecycle_event);

export default defineConfig({
  clean: true,
  entry: ['src/index.ts'],
  format: ['esm'],
  minify: false,
  target: 'esnext',
  outDir: 'dist',
  splitting: true,
});
