import fse from 'fs-extra';
import { fs as memfs } from 'memfs';
import path from 'path';

let DONT_MOCK_PATTERNS = ['templates/'];

// Most of this CLI uses fs-extra for file-system operations
// This mock mocks this module to instead use memfs, while also allowing
// read operations to read from 'templates' so our tests do not need to
// mock templates
export default {
  // allow mocking templates with memfs (normally tests read these from regular FS)
  mockTemplates() {
    DONT_MOCK_PATTERNS = [];
  },
  ...memfs.promises,
  exists(path) {
    if (dontMock(path)) {
      return fse.exists(path);
    } else {
      return new Promise((resolve) => {
        memfs.exists(path, (exists) => resolve(exists));
      });
    }
  },
  isDirectory(src) {
    return memfs.statSync(src).isDirectory(src);
  },
  appendFile: memfs.promises.appendFile,
  // currently having to manually copy the sync methods over, there's prob a better way
  rmSync: memfs.rmSync,
  readFileSync(file, options) {
    if (dontMock(file)) {
      return fse.readFileSync(file, options);
    }

    return memfs.readFileSync(file, options);
  },
  readFile(path, options) {
    return Promise.resolve(this.readFileSync(path, options));
  },
  outputFile: async (file, data, options) => {
    const dirname = path.dirname(file);
    const exists = memfs.existsSync(dirname);
    if (!exists) {
      memfs.mkdirSync(dirname, { recursive: true });
    }

    return Promise.resolve(memfs.writeFileSync(file, data, options));
  },
  writeFileSync: memfs.writeFileSync,
  existsSync: memfs.existsSync,
  appendFileSync: memfs.appendFileSync,
  readdir(path, options) {
    return Promise.resolve(this.readdirSync(path, options));
  },
  readdirSync(path, options) {
    if (dontMock(path)) {
      return fse.readdirSync(path, options);
    }

    return memfs.readdirSync(path, options);
  },
  copy(src, dest) {
    return Promise.resolve(this.copySync(src, dest));
  },
  copySync(src, dest) {
    // read templates from actual fs
    const sourceFS = dontMock(src) ? fse : memfs;

    if (sourceFS.existsSync(src) && sourceFS.statSync(src).isDirectory(src)) {
      memfs.mkdirSync(dest, { recursive: true });
      sourceFS.readdirSync(src).forEach((childItemName) => {
        this.copySync(
          path.join(src, childItemName),
          path.join(dest, childItemName),
        );
      });
    } else {
      memfs.writeFileSync(dest, sourceFS.readFileSync(src, 'utf-8'));
    }
  },
  readFile: (path, ...args) => {
    if (dontMock(path)) {
      return fse.readFile(path, ...args);
    }

    return memfs.promises.readFile(path, ...args);
  },
};

function dontMock(src) {
  return DONT_MOCK_PATTERNS.some((pattern) => src.includes(pattern));
}
