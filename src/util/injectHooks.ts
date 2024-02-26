import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import getProjectDir from './getProjectDir';

export default async function injectHooks(hooks: string, imports: string) {
  const rootDir = await getProjectDir();
  const filePath = path.join(rootDir, 'App.tsx');
  const data = await readFile(filePath, 'utf8');
  const lines = data.split('\n');

  const targetLineIndex = lines.findIndex(
    (line) => line.trim() === '// CODEGEN:BELT:HOOKS - do not remove',
  );

  if (targetLineIndex === -1) {
    throw new Error('Target line not found in file');
  }

  // Inject the text after the target line
  lines.splice(targetLineIndex + 1, 0, hooks);
  lines.splice(0, 0, imports);

  const updatedData = lines.join('\n');

  await writeFile(filePath, updatedData, 'utf8');
}
