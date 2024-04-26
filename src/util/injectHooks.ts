import fs from 'fs-extra';
import path from 'path';
import getProjectDir from './getProjectDir';
import exec from './exec';
import writeFile from './writeFile';

export default async function injectHooks(
  filepath: string, // Path to the file to inject the hooks into, relative to the project root
  hooks: string, // The hooks to inject under the target line
  imports: string, // The import lines to the injected roots
) {
  const rootDir = await getProjectDir();
  const filePath = path.join(rootDir, filepath);
  const data = await fs.readFile(filePath, 'utf8');
  const lines = data.split('\n');

  const targetLineIndex = lines.findIndex((line) =>
    line.includes('CODEGEN:BELT:HOOKS'),
  );

  if (targetLineIndex === -1) {
    throw new Error('Target line not found in file');
  }

  lines.splice(targetLineIndex + 1, 0, hooks);
  lines.splice(0, 0, imports);

  const updatedData = lines.join('\n');

  await writeFile(filePath, updatedData, { format: true });

  // Format the file to make sure it's consistent
  await exec(`npx eslint --max-warnings=0 --fix ${filepath}`);
  await exec(`npx prettier --write ${filepath}`);
}
