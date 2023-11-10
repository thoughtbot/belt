import actualfs from 'fs-extra';
import { fs } from 'memfs';
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
  ...fs.promises,
  exists(path) {
    return new Promise((resolve) => {
      fs.exists(path, (exists) => resolve(exists));
    });
  },
  isDirectory(src) {
    return fs.statSync(src).isDirectory(src);
  },
  // currently having to manually copy the sync methods over, there's prob a better way
  rmSync: fs.rmSync,
  readFileSync(file, options) {
    if (dontMock(file)) {
      return actualfs.readFileSync(file, options);
    }

    return fs.readFileSync(file, options);
  },
  writeFileSync: fs.writeFileSync,
  existsSync: fs.existsSync,
  appendFileSync: fs.appendFileSync,
  readdirSync(path, options) {
    if (dontMock(path)) {
      return actualfs.readdirSync(path, options);
    }

    return fs.readdirSync(path, options);
  },
  copySync(src, dest) {
    const sourceFS = dontMock(src) ? actualfs : fs;

    if (sourceFS.existsSync(src) && sourceFS.statSync(src).isDirectory(src)) {
      fs.mkdirSync(dest, { recursive: true });
      sourceFS.readdirSync(src).forEach((childItemName) => {
        this.copySync(
          path.join(src, childItemName),
          path.join(dest, childItemName),
        );
      });
    } else {
      fs.writeFileSync(dest, sourceFS.readFileSync(src, 'utf-8'));
    }
  },
  readFile: (path, ...args) => {
    if (dontMock(path)) {
      return actualfs.readFile(path, ...args);
    }

    return fs.promises.readFile(path, ...args);
  },
};

function dontMock(src) {
  return DONT_MOCK_PATTERNS.some((pattern) => src.includes(pattern));
}
