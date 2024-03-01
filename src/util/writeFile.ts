import fs from 'fs-extra';
import formatFile from './formatFile';

type Options = {
  format?: boolean;
};

export default async function writeFile(
  filePath: string,
  contents: string,
  { format = false }: Options = {},
) {
  // outputFile is the same as writeFile, but it creates directories that don't exist
  await fs.outputFile(filePath, contents);

  if (format) {
    await formatFile(filePath);
  }
}
