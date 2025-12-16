import { select } from '@inquirer/prompts';

const PACKAGE_MANAGER_CHOICES = ['npm', 'pnpm', 'yarn', 'bun'] as const;

export type PackageManager = (typeof PACKAGE_MANAGER_CHOICES)[number];

/**
 * requests the user to select their preferred package manager from the
 * provided list
 */
export default async function getUserPackageManager(): Promise<PackageManager> {
  return select({
    message: 'What package manager would you like Belt to use?',
    choices: PACKAGE_MANAGER_CHOICES.map((packageManager) => ({
      value: packageManager,
    })),
  });
}
