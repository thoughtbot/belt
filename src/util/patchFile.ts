import fs from 'fs-extra';
import writeFile from './writeFile';

export default async function patchFile(
  filePath: string,
  search: string,
  replacement: string,
): Promise<boolean> {
  if (!(await fs.pathExists(filePath))) return false;
  const contents = (await fs.readFile(filePath)).toString();
  const updated = contents.replace(search, replacement);
  if (updated === contents) return false;
  await writeFile(filePath, updated, { format: true });
  return true;
}
