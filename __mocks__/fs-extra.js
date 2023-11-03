import actualfs from 'fs-extra';
import { fs } from 'memfs';
import { vi } from 'vitest';

const DONT_MOCK_PATTERNS = ['templates/'];

export default {
  ...fs.promises,
  // todo: build actual mock
  copySync: vi.fn(),
  exists(path) {
    return new Promise((resolve) => {
      fs.exists(path, (exists) => resolve(exists));
    });
  },
  readFile: (...args) => {
    const path = args[0];
    const useActual = DONT_MOCK_PATTERNS.some((pattern) =>
      path.includes(pattern),
    );

    if (useActual) {
      return actualfs.readFile(...args);
    }

    return fs.promises.readFile(...args);
  },
};
