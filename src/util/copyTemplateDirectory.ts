import * as eta from 'eta';
import fs from 'fs-extra';
import path from 'path';
import { PACKAGE_ROOT } from '../constants';
import writeFile from './writeFile';

type Params = {
  /** relative to templates/, eg "scaffold" */
  templateDir: string;
  /** relative to project root, eg ".", "src" */
  destinationDir?: string;
  variables?: object;
};

/**
 * copies the template directory to the destination directory. Any files with
 * .eta extension are rendered using the supplied variables
 */
export default async function copyTemplateDirectory({
  templateDir,
  destinationDir = '.',
  variables = {},
}: Params) {
  const srcDir = path.join(PACKAGE_ROOT, `templates`, templateDir);
  await fs.copy(srcDir, destinationDir);

  await renderTemplates(srcDir, destinationDir, variables);
  await removeKeepFilesIfNotNeeded(destinationDir);
}

async function renderTemplates(
  srcDir: string,
  destinationDir: string,
  variables: object,
) {
  const filenames = await getFiles(srcDir);
  // eslint-disable-next-line no-restricted-syntax
  for await (const filename of filenames) {
    if (!filename.endsWith('.eta')) {
      continue;
    }

    const destinationFilename = path.join(
      destinationDir,
      path.relative(srcDir, filename),
    );

    const rendered = eta.render(
      (await fs.readFile(filename)).toString(),
      variables ?? {},
    );

    await writeFile(
      path.join(destinationFilename.replace(/\.eta$/, '')),
      rendered,
    );

    // remove .eta file
    await fs.rm(destinationFilename);
  }
}

async function removeKeepFilesIfNotNeeded(destinationDir: string) {
  const filenames = await getFiles(destinationDir);
  const promises = filenames.map((filename) => {
    if (filename.endsWith('/.keep')) {
      return fs.rm(filename);
    }
    return Promise.resolve();
  });

  return Promise.all(promises);
}

/**
 * returns array of all filenames within 'dir', recursively
 */
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
