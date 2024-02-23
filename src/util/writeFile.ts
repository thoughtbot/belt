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
  await fs.writeFile(filePath, contents);

  if (format) {
    await formatFile(filePath);
  }
}
