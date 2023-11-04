import actualfs from 'fs-extra';
import { fs } from 'memfs';
import path from 'path';

const DONT_MOCK_PATTERNS = ['templates/'];

export default {
  ...fs.promises,
  isDirectory(src) {
    return fs.statSync(src).isDirectory(src);
  },
  // currently having to manually copy the sync methods over, there's prob a better way
  rmSync: fs.rmSync,
  readFileSync: fs.readFileSync,
  writeFileSync: fs.writeFileSync,
  exists: fs.exists,
  copySync(src, dest) {
    if (fs.existsSync(src) && fs.statSync(src).isDirectory(src)) {
      fs.mkdirSync(dest, { recursive: true });
      fs.readdirSync(src).forEach((childItemName) => {
        this.copySync(
          path.join(src, childItemName),
          path.join(dest, childItemName),
        );
      });
    } else {
      fs.copyFileSync(src, dest);
    }
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
