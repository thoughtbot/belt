import fs from 'fs-extra';
import path from 'path';
import getProjectDir from './getProjectDir';
import { PackageManager } from './getUserPackageManager';

export default async function getPackageManager(): Promise<PackageManager> {
  const projectDir = await getProjectDir();

  async function fileExists(name: string) {
    return fs.exists(path.join(projectDir, name));
  }

  return (await fileExists('yarn.lock')) || (await fileExists('.yarn'))
    ? 'yarn'
    : (await fileExists('package-lock.json'))
    ? 'npm'
    : (await fileExists('pnpm-lock.yaml'))
    ? 'pnpm'
    : (await fileExists('bun.lockb'))
    ? 'bun'
    : throwError('Unable to determine package manager.');
}

function throwError(msg: string): never {
  throw new Error(msg);
}
