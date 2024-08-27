import * as eta from 'eta';
import fs from 'fs-extra';
import ignore from 'ignore';
import path from 'path';
import { PACKAGE_ROOT } from '../constants';
import writeFile from './writeFile';

const UNSUPPORTED_EXTENSIONS = [
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.pdf',
];

type Substitutions = {
  [fileNamePattern: string]: Record<string, string>;
};

type Params = {
  /** relative to templates/, eg "boilerplate" */
  templateDir: string;
  /** relative to project root, eg ".", "src". Default "." */
  destinationDir?: string;
  /** variables to use when rendering .eta template files */
  variables?: object;
  /**
   * strings to replace in copied files, specific to files that match the
   * supplied filename. Filename and replacement strings are regex patterns.
   * eg: {
   *   'package\.json': { 'REPLACE_ME': 'NEW CONTENT' }
   *   'components/*.tsx': { 'My.*Component': 'YourComponent' }
   * }
   * */
  stringSubstitutions?: Substitutions;
  /**
   * string representation of a gitignore file, notating files to ignore in src
   * directory, eg:
   *   "package-lock.json
   *   node_modules"
   */
  gitignore?: string;
};

/**
 * copies the template directory to the destination directory, optionally performing
 * string substitutions and rendering .eta template files.
 */
export default async function copyTemplateDirectory({
  templateDir,
  destinationDir = '.',
  gitignore,
  variables = {},
  stringSubstitutions = {},
}: Params) {
  const srcDir = path.join(PACKAGE_ROOT, `templates`, templateDir);
  const filenames = await getFiles(srcDir, gitignore);
  await Promise.all(
    filenames.map(async (filename) => {
      const relativeFilename = path.relative(srcDir, filename);
      const destinationFilename = path.join(destinationDir, relativeFilename);

      if (substitutionsSupported(filename)) {
        const contents = await makeFileSubstitutions(
          filename,
          stringSubstitutions,
          variables,
        );

        return writeFile(destinationFilename.replace(/\.eta$/, ''), contents);
      }

      try {
        // file is binary or otherwise doesn't support substitutions, just copy
        // it over instead of reading it to a string
        return await fs.copy(filename, destinationFilename);
      } catch (e) {
        if (e instanceof Error) {
          throw new Error(
            `An error occurred copying file ${relativeFilename} to ${destinationFilename}: ${e.message}`,
          );
        }
      }

      return null;
    }),
  );
}

async function makeFileSubstitutions(
  filename: string,
  stringSubstitutions: Substitutions,
  variables: object,
): Promise<string> {
  let contents = (await fs.readFile(filename)).toString();
  const substitutions = substitutionsForFile(filename, stringSubstitutions);
  if (Object.keys(substitutions).length > 0) {
    contents = Object.entries(substitutions).reduce((acc, [key, value]) => {
      return acc.replaceAll(new RegExp(key, 'g'), value);
    }, contents);
  }

  if (filename.endsWith('.eta')) {
    contents = eta.render(contents, variables);
  }

  return contents;
}

function substitutionsSupported(filename: string) {
  const extension = path.extname(filename).toLocaleLowerCase();
  return !extension || !UNSUPPORTED_EXTENSIONS.includes(extension);
}

function substitutionsForFile(
  filename: string,
  stringSubstitutions: Substitutions,
): Record<string, string> {
  if (!substitutionsSupported(filename)) return {};

  return Object.entries(stringSubstitutions).reduce((acc, [pattern, value]) => {
    if (filename.match(pattern)) {
      return { ...acc, ...value };
    }
    return acc;
  }, {});
}

/**
 * returns array of all filenames within 'dir', recursively
 * respecting .gitignore
 */
async function getFiles(
  dir: string,
  gitignore: string | undefined,
): Promise<string[]> {
  const ig = ignore().add(gitignore || '');
  const shouldIgnore = (fullPath: string) =>
    ig.ignores(path.relative(dir, fullPath));

  return getFilesInternal(dir, shouldIgnore);
}

// get all files inside dir, recursively
// filtering out any from gitignore
async function getFilesInternal(
  dir: string,
  shouldIgnore: (path: string) => boolean,
): Promise<string[]> {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents
      .filter((dirent) => !shouldIgnore(path.join(dir, dirent.name)))
      .map((dirent) => {
        const fullPath = path.resolve(dir, dirent.name);
        return dirent.isDirectory()
          ? getFilesInternal(fullPath, shouldIgnore)
          : fullPath;
      }),
  );

  return files.flat();
}
