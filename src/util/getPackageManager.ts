import fs from 'fs-extra';
import path from 'path';
import getProjectDir from './getProjectDir';
import { PackageManager } from './getUserPackageManager';

const lockFiles: Record<string, PackageManager> = {
  'yarn.lock': 'yarn',
  '.yarn': 'yarn',
  'package-lock.json': 'npm',
  'pnpm-lock.yaml': 'pnpm',
  'bun.lockb': 'bun',
};

export const lockFileNames = Object.keys(lockFiles);

export default async function getPackageManager(): Promise<PackageManager> {
  const projectDir = await getProjectDir();

  async function fileExists(name: string) {
    return fs.exists(path.join(projectDir, name));
  }

  // eslint-disable-next-line no-restricted-syntax
  for await (const [lockFile, packageManager] of Object.entries(lockFiles)) {
    if (await fileExists(lockFile)) {
      return packageManager;
    }
  }

  throw new Error('Unable to determine package manager.');
}
