import fs from 'fs-extra';
import path from 'path';
import getProjectDir from './getProjectDir';

/**
 * lines should be separated by newlines
 */
export default async function prependToFile(filename: string, lines: string) {
  const fullFilename = path.join(await getProjectDir(), filename);
  const contents = await fs.readFile(fullFilename, 'utf8');
  return fs.writeFile(fullFilename, `${lines}\n${contents}`);
}
