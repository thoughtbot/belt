import fs from 'fs-extra';
import path from 'path';
import getProjectDir from './getProjectDir';

export type PackageManager = 'yarn' | 'npm' | 'pnpm';
export default async function getPackageManager(): Promise<PackageManager> {
  const projectDir = await getProjectDir();

  async function fileExists(name: string) {
    return fs.exists(path.join(projectDir, name));
  }

  return (await fileExists('yarn.lock'))
    ? 'yarn'
    : (await fileExists('package-lock.json'))
    ? 'npm'
    : (await fileExists('pnpm-lock.yaml'))
    ? 'pnpm'
    : throwError('Unable to determine package manager.');
}

function throwError(msg: string): never {
  throw new Error(msg);
}
