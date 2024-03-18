import path from 'path';
import { fileURLToPath } from 'url';

export const globals = {
  interactive: true,
  addBottomTabs: false,
};

// TSUP builds files without hierarchy to dist/, so the path is ultimately
// in relation to the dist/ directory. NPM package structure is:
// <root>
//   dist/
//     index.js // file executed here
//   templates/
const filename = fileURLToPath(import.meta.url);
const distPath = path.dirname(filename);
// eslint-disable-next-line import/prefer-default-export
export const PACKAGE_ROOT = path.join(distPath, '../');
