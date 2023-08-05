import chalk from 'chalk';
import fs from 'fs-extra';
import formatFile from './formatFile';
import print from './print';

type Options = {
  format?: boolean;
};

export default async function writeFile(
  filePath: string,
  contents: string,
  { format = false }: Options = {},
) {
  print(chalk.bold(`🔨 Creating ${filePath}`));
  await fs.writeFile(filePath, contents);

  if (format) {
    await formatFile(filePath);
  }
}
