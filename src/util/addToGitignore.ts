import fs from 'fs-extra';
import path from 'path';
import getProjectDir from './getProjectDir';
/**
 * lines should be separated by newlines
 */
export default async function addToGitignore(lines: string) {
  fs.appendFileSync(
    path.join(await getProjectDir(), '.gitignore'),
    `\n${lines}`,
  );
}
