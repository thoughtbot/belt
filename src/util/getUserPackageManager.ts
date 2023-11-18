export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

/**
 * attempts to detect the runtime / package manager that was used to
 * run the current process
 */
export default function getUserPackageManager(): PackageManager {
  // This environment variable is set by npm and yarn but pnpm seems less consistent
  const userAgent = process.env.npm_config_user_agent;

  if (userAgent?.startsWith('yarn')) {
    return 'yarn';
  }
  if (userAgent?.startsWith('pnpm')) {
    return 'pnpm';
  }
  // bun sets Bun.env if running in Bun process. userAgent bit doesn't seem to work
  if (userAgent?.startsWith('bun') || typeof Bun !== 'undefined') {
    return 'bun';
  }

  // If no user agent is set, assume npm
  return 'npm';
}
