import fs from 'fs-extra';
import path from 'path';
import getProjectDir from './getProjectDir';

export type PackageManager = 'yarn' | 'npm' | 'pnpm';
export default async function getPackageManager(): Promise<PackageManager> {
  const projectDir = await getProjectDir();

  function fileExists(name: string) {
    return fs.existsSync(path.join(projectDir, name));
  }

  return fileExists('yarn.lock')
    ? 'yarn'
    : fileExists('package-lock.json')
    ? 'npm'
    : fileExists('pnpm-lock.yaml')
    ? 'pnpm'
    : throwError('Unable to determine package manager.');
}

function throwError(msg: string): never {
  throw new Error(msg);
}
