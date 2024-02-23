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
  stringSubstitutions?: Record<string, string>;
};

/**
 * copies the template directory to the destination directory. Any files with
 * .eta extension are rendered using the supplied variables
 */
export default async function copyTemplateDirectory({
  templateDir,
  destinationDir = '.',
  variables = {},
  stringSubstitutions = {},
}: Params) {
  const srcDir = path.join(PACKAGE_ROOT, `templates`, templateDir);
  await fs.copy(srcDir, destinationDir);

  await performFileModifications(
    srcDir,
    destinationDir,
    stringSubstitutions,
    variables,
  );
}

/**
 * Iterate through all newly copied files in the destination directory. For each
 * file, perform string substitutions and render any .eta template files
 */
async function performFileModifications(
  srcDir: string,
  destinationDir: string,
  substitutions: Record<string, string>,
  variables: object,
) {
  const filenames = await getFiles(srcDir);
  // eslint-disable-next-line no-restricted-syntax
  for await (const filename of filenames) {
    const destinationFilename = path.join(
      destinationDir,
      path.relative(srcDir, filename),
    );

    let contents = (await fs.readFile(filename)).toString();
    contents = Object.entries(substitutions).reduce((acc, [key, value]) => {
      return acc.replaceAll(key, value);
    }, contents);

    if (filename.endsWith('.eta')) {
      contents = eta.render(contents, variables);
      await fs.rm(path.join(destinationFilename)); // remove .eta file
    }

    await writeFile(
      path.join(destinationFilename.replace(/\.eta$/, '')),
      contents,
    );
  }
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
