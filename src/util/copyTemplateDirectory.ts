import * as eta from 'eta';
import fs from 'fs-extra';
import path from 'path';
import { PACKAGE_ROOT } from '../constants';

type Params = {
  /** relative to templates/, eg "scaffold" */
  templateDir: string;
  /** relative to project root, eg ".", "src" */
  destinationDir?: string;
  variables?: object;
};

export default async function copyTemplateDirectory({
  templateDir,
  destinationDir = '.',
  variables,
}: Params) {
  const srcDir = path.join(PACKAGE_ROOT, `templates`, templateDir);
  fs.copySync(srcDir, destinationDir);

  (await getFiles(srcDir)).map((filename) => {
    if (filename.endsWith('.eta')) {
      const destinationFilename = path.join(
        destinationDir,
        path.relative(srcDir, filename),
      );

      const rendered = eta.render(
        fs.readFileSync(filename).toString(),
        variables ?? {},
      );

      fs.writeFileSync(
        path.join(destinationFilename.replace(/\.eta$/, '')),
        rendered,
      );

      // remove .eta file
      fs.rmSync(destinationFilename);
    }
  });
}

async function getFiles(dir: string): Promise<string[]> {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    }),
  );

  return files.flat();
}
