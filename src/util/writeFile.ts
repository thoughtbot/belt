import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import formatFile from './formatFile';
import getProjectDir from './getProjectDir';
import print from './print';

type Options = {
  format?: boolean;
};

export default async function writeFile(
  filePath: string,
  contents: string,
  { format = false }: Options = {},
) {
  print(chalk.bold(`🔨 Writing ${filePath}`));

  const isAbsolute = filePath.startsWith('/') || filePath.startsWith('\\');
  const fullPath = isAbsolute
    ? filePath
    : path.join(await getProjectDir(), filePath);

  await fs.writeFile(fullPath, contents);

  if (format) {
    await formatFile(fullPath);
  }
}
