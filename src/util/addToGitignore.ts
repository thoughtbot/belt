import fs from 'fs-extra';
import path from 'path';
import getProjectDir from './getProjectDir';
/**
 * lines should be separated by newlines
 */
export default async function addToGitignore(lines: string) {
  return fs.appendFile(
    path.join(await getProjectDir(), '.gitignore'),
    `\n${lines}`,
  );
}
